import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInterval } from '../src/hooks/useInterval';

describe('useInterval', () => {
  beforeEach(() => vi.useFakeTimers());

  it('runs repeatedly and cleans up on unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useInterval(callback, 1000));
    act(() => vi.advanceTimersByTime(3000));
    expect(callback).toHaveBeenCalledTimes(3);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('pauses with null and restarts with a changed delay', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ delay }: { delay: number | null }) => useInterval(callback, delay),
      {
        initialProps: { delay: 1000 as number | null },
      },
    );
    act(() => vi.advanceTimersByTime(500));
    rerender({ delay: 200 });
    act(() => vi.advanceTimersByTime(200));
    expect(callback).toHaveBeenCalledOnce();
    rerender({ delay: null });
    act(() => vi.advanceTimersByTime(2000));
    expect(callback).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
    rerender({ delay: 100 });
    act(() => vi.advanceTimersByTime(100));
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('uses the latest callback without restarting the schedule', () => {
    const values: number[] = [];
    const { rerender } = renderHook(
      ({ value }) => useInterval(() => values.push(value), 1000),
      { initialProps: { value: 1 } },
    );
    act(() => vi.advanceTimersByTime(500));
    rerender({ value: 2 });
    act(() => vi.advanceTimersByTime(500));
    expect(values).toEqual([2]);
  });

  it.each([-1, NaN, Infinity])('pauses on invalid delay %s', (delay) => {
    renderHook(() => useInterval(vi.fn(), delay));
    expect(vi.getTimerCount()).toBe(0);
  });

  it('allows a zero delay', async () => {
    vi.useRealTimers();
    const callback = vi.fn();
    const { unmount } = renderHook(() => useInterval(callback, 0));
    await waitFor(() => expect(callback).toHaveBeenCalled());
    unmount();
  });
});
