# useLocalStorage

Persist JSON state in localStorage while supporting React-style functional setters, removal, and synchronization.

## Signature

```ts
function useLocalStorage<T>(
  key: string,
  initialValue: T,
): readonly [T, React.Dispatch<React.SetStateAction<T>>, () => void];
```

## Parameters and returns

- `key`: browser storage key. Changing it reads that key without copying the old value into it.
- `initialValue`: fallback captured once on mount; also used for reset and server rendering. It is a value, not a lazy initializer.
- Returns `[value, setValue, removeValue]`. The setter accepts a value or `(previous) => next`. `removeValue` deletes the key and restores the captured fallback.

## Usage

```tsx
import { useLocalStorage } from './hooks/useLocalStorage';

export function SavedCounter() {
  const [count, setCount, removeCount] = useLocalStorage('count', 0);
  return (
    <div>
      <button onClick={() => setCount((n) => n + 1)}>{count}</button>
      <button onClick={removeCount}>Remove and reset</button>
    </div>
  );
}
```

## Important behavior

Mounting does not write a fallback to storage. Missing or malformed JSON returns the fallback without deleting the stored data. Writes are synchronous. Consecutive functional updates read the current snapshot, including updates in the same batch. Snapshots retain object identity until the serialized storage value changes.

`useSyncExternalStore` provides subscriptions and a deterministic server snapshot. The server and first hydration render use the fallback; after hydration the browser reads storage. Provide the same fallback on server and client. Setters and removal actions remain stable for a given key.

Native `storage` events synchronize changes, removals, and `clear()` from other tabs on the same origin. A custom event also synchronizes other instances of this hook in the current window. Unmounting removes subscriptions.

## Edge cases and limitations

- Storage access, quota, removal, and serialization failures retain usable **per-instance memory state**. Persistence and synchronization stay disabled for that instance until a key change or remount. Other instances may still see the last persisted value.
- Values must round-trip through JSON for persistence. Dates become strings after reload. BigInt, cycles, functions, `undefined`, and other non-JSON data are unsupported for persistence. There is no custom serializer or runtime schema validation; a parsed value is assumed to match `T`.
- Treat objects as immutable. Use the same type and fallback for every instance sharing a key. A later `initialValue` prop does not change the captured fallback.
- Direct same-tab `localStorage.setItem` calls do not trigger native storage events. Use the hook setter for same-tab synchronization.
- Cross-tab updates are asynchronous and last-write-wins, without transactions or conflict resolution. External scripts or windows can overwrite values.
- Storage is synchronous, limited in size, origin-specific, and readable by scripts on that origin. Use it for small, non-sensitive data.

[Source](../../src/hooks/useLocalStorage.ts) · [Example](../../src/examples/LocalStorageExample.tsx) · [Tests](../../tests/useLocalStorage.test.ts)
