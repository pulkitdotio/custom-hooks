import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from '../src/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());

  it('returns the initial generic value immediately', () => {
    const initial = { query: 'react' };
    expect(renderHook(() => useDebounce(initial)).result.current).toBe(initial);
  });

  it('waits for the final update and restarts the timer', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: 'a' } },
    );
    rerender({ value: 'ab' });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('a');
    rerender({ value: 'abc' });
    act(() => vi.advanceTimersByTime(399));
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('abc');
  });

  it('uses a default 300ms delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 1 },
    });
    rerender({ value: 2 });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe(1);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe(2);
  });

  it.each([0, -1, NaN, Infinity])(
    'treats delay %s as an asynchronous zero delay',
    (delay) => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, delay),
        { initialProps: { value: 1 } },
      );
      rerender({ value: 2 });
      expect(result.current).toBe(1);
      act(() => vi.advanceTimersByTime(0));
      expect(result.current).toBe(2);
    },
  );

  it('reschedules when the delay changes and clears timers on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 1, delay: 1000 },
      },
    );
    rerender({ value: 2, delay: 50 });
    act(() => vi.advanceTimersByTime(50));
    expect(result.current).toBe(2);
    rerender({ value: 3, delay: 50 });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
