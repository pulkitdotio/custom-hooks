import { useMemo, useState, useSyncExternalStore } from 'react';
import type { Dispatch, SetStateAction } from 'react';

const storageEvent = 'custom-hooks:local-storage';

/** A per-instance snapshot cache; unchanged JSON must retain its object identity. */
function createStorageStore<T>(key: string, initialValue: T) {
  let value = initialValue;
  let lastRaw: string | null | undefined;
  let storageAvailable = true;
  const listeners = new Set<() => void>();

  const read = (): T => {
    if (typeof window === 'undefined' || !storageAvailable) return value;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== lastRaw) {
        lastRaw = raw;
        try {
          value = raw === null ? initialValue : (JSON.parse(raw) as T);
        } catch {
          value = initialValue;
        }
      }
    } catch {
      storageAvailable = false;
    }
    return value;
  };

  const notify = () => listeners.forEach((listener) => listener());
  const persist = (next: T, remove = false) => {
    value = next;
    if (typeof window !== 'undefined' && storageAvailable) {
      try {
        if (remove) {
          window.localStorage.removeItem(key);
          lastRaw = null;
        } else {
          const raw = JSON.stringify(next);
          if (raw === undefined)
            throw new TypeError('Value is not JSON serializable.');
          window.localStorage.setItem(key, raw);
          lastRaw = raw;
        }
      } catch {
        // Keep usable in-memory state if storage or serialization fails.
        storageAvailable = false;
      }
    }
    notify();
    if (typeof window !== 'undefined' && storageAvailable) {
      window.dispatchEvent(new CustomEvent(storageEvent, { detail: key }));
    }
  };

  return {
    read,
    serverSnapshot: () => initialValue,
    set: (next: SetStateAction<T>) => {
      const current = read();
      persist(
        typeof next === 'function'
          ? (next as (previous: T) => T)(current)
          : next,
      );
    },
    remove: () => persist(initialValue, true),
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      if (typeof window === 'undefined')
        return () => {
          listeners.delete(listener);
        };
      const onStorage = (event: StorageEvent) => {
        if (event.key !== null && event.key !== key) return;
        try {
          if (event.storageArea && event.storageArea !== window.localStorage)
            return;
        } catch {
          return;
        }
        notify();
      };
      const onLocalChange = (event: Event) => {
        if ((event as CustomEvent<string>).detail === key) notify();
      };
      window.addEventListener('storage', onStorage);
      window.addEventListener(storageEvent, onLocalChange);
      return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', onStorage);
        window.removeEventListener(storageEvent, onLocalChange);
      };
    },
  };
}

/**
 * Persist JSON-compatible state. Returns [value, React-style setter, remove/reset].
 * The fallback is captured on mount. A changed key reads its own stored value.
 * Storage failures fall back to memory until this instance changes key or remounts.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): readonly [T, Dispatch<SetStateAction<T>>, () => void] {
  const [fallback] = useState(() => initialValue);
  const store = useMemo(
    () => createStorageStore(key, fallback),
    [key, fallback],
  );
  const value = useSyncExternalStore(
    store.subscribe,
    store.read,
    store.serverSnapshot,
  );
  return [value, store.set, store.remove] as const;
}
