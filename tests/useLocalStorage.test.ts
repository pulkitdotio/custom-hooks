import { StrictMode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useLocalStorage } from '../src/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  it('uses the fallback without writing during mount', () => {
    const { result } = renderHook(() => useLocalStorage('theme', 'dark'));
    expect(result.current[0]).toBe('dark');
    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('reads JSON and persists generic objects', () => {
    localStorage.setItem('settings', '{"count":4}');
    const { result } = renderHook(() =>
      useLocalStorage('settings', { count: 0 }),
    );
    expect(result.current[0]).toEqual({ count: 4 });
    act(() => result.current[1]({ count: 5 }));
    expect(JSON.parse(localStorage.getItem('settings')!)).toEqual({ count: 5 });
  });

  it('supports consecutive functional updates without stale state', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    act(() => {
      result.current[1]((n) => n + 1);
      result.current[1]((n) => n + 1);
    });
    expect(result.current[0]).toBe(2);
    expect(localStorage.getItem('count')).toBe('2');
  });

  it('removes the key and resets to the original fallback', () => {
    const { result, rerender } = renderHook(
      ({ initial }) => useLocalStorage('note', initial),
      {
        initialProps: { initial: 'first' },
      },
    );
    act(() => result.current[1]('saved'));
    rerender({ initial: 'changed' });
    act(() => result.current[2]());
    expect(result.current[0]).toBe('first');
    expect(localStorage.getItem('note')).toBeNull();
  });

  it('recovers from malformed JSON without destroying the stored data', () => {
    localStorage.setItem('note', '{broken');
    const { result } = renderHook(() => useLocalStorage('note', 'fallback'));
    expect(result.current[0]).toBe('fallback');
    expect(localStorage.getItem('note')).toBe('{broken');
    act(() => result.current[1]('repaired'));
    expect(localStorage.getItem('note')).toBe('"repaired"');
  });

  it('keeps state usable when the storage getter is unavailable', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { result } = renderHook(() => useLocalStorage('count', 1));
    act(() => result.current[1]((n) => n + 1));
    expect(result.current[0]).toBe(2);
    act(() => result.current[2]());
    expect(result.current[0]).toBe(1);
  });

  it('falls back to memory on quota errors without restoring the old stored value', () => {
    localStorage.setItem('count', '5');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const { result, rerender } = renderHook(() => useLocalStorage('count', 0));
    act(() => result.current[1]((n) => n + 1));
    rerender();
    expect(result.current[0]).toBe(6);
    act(() => result.current[1]((n) => n + 1));
    expect(result.current[0]).toBe(7);
  });

  it('retains nonserializable values in memory', () => {
    const { result } = renderHook(() => useLocalStorage('bigint', 1n));
    act(() => result.current[1](2n));
    expect(result.current[0]).toBe(2n);
    expect(localStorage.getItem('bigint')).toBeNull();
  });

  it('responds to another tab changing, removing, and clearing storage', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    act(() => {
      localStorage.setItem('count', '9');
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'count',
          storageArea: localStorage,
        }),
      );
    });
    expect(result.current[0]).toBe(9);
    act(() => {
      localStorage.removeItem('count');
      window.dispatchEvent(new StorageEvent('storage', { key: 'count' }));
    });
    expect(result.current[0]).toBe(0);
    act(() => result.current[1](4));
    act(() => {
      localStorage.clear();
      window.dispatchEvent(new StorageEvent('storage', { key: null }));
    });
    expect(result.current[0]).toBe(0);
  });

  it('ignores unrelated keys and sessionStorage events', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'other' }));
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'count',
          storageArea: sessionStorage,
        }),
      );
    });
    expect(result.current[0]).toBe(0);
  });

  it('synchronizes hook instances in the same tab', () => {
    const first = renderHook(() => useLocalStorage('count', 0));
    const second = renderHook(() => useLocalStorage('count', 0));
    act(() => first.result.current[1](8));
    expect(second.result.current[0]).toBe(8);
    act(() => second.result.current[2]());
    expect(first.result.current[0]).toBe(0);
  });

  it('reads a changed key without writing the previous key value into it', () => {
    localStorage.setItem('a', '1');
    localStorage.setItem('b', '2');
    const { result, rerender } = renderHook(
      ({ storageKey }) => useLocalStorage(storageKey, 0),
      {
        initialProps: { storageKey: 'a' },
      },
    );
    expect(result.current[0]).toBe(1);
    rerender({ storageKey: 'b' });
    expect(result.current[0]).toBe(2);
    act(() => result.current[1](3));
    expect(localStorage.getItem('a')).toBe('1');
    expect(localStorage.getItem('b')).toBe('3');
  });

  it('keeps snapshots and actions stable with inline object fallbacks in Strict Mode', () => {
    const { result, rerender } = renderHook(
      () => useLocalStorage('object', { count: 0 }),
      { wrapper: StrictMode },
    );
    const previous = result.current;
    rerender();
    expect(result.current[0]).toBe(previous[0]);
    expect(result.current[1]).toBe(previous[1]);
    expect(result.current[2]).toBe(previous[2]);
  });

  it('cleans up subscriptions on unmount', () => {
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useLocalStorage('count', 0));
    unmount();
    expect(remove).toHaveBeenCalledWith('storage', expect.any(Function));
    expect(remove).toHaveBeenCalledWith(
      'custom-hooks:local-storage',
      expect.any(Function),
    );
  });
});
