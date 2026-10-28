import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCounter } from '../src/hooks/useCounter';

describe('useCounter', () => {
  it('defaults to zero and counts both ways', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
    act(() => result.current.decrement());
    expect(result.current.count).toBe(0);
  });

  it('supports configured and per-call steps with batched updates', () => {
    const { result } = renderHook(() => useCounter(10, 2));
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.decrement(5);
    });
    expect(result.current.count).toBe(9);
    act(() => result.current.reset());
    expect(result.current.count).toBe(10);
  });

  it('uses current configuration without resetting existing state on rerender', () => {
    const { result, rerender } = renderHook(
      ({ initial, step }) => useCounter(initial, step),
      {
        initialProps: { initial: 3, step: 1 },
      },
    );
    const increment = result.current.increment;
    rerender({ initial: 7, step: 1 });
    expect(result.current.increment).toBe(increment);
    expect(result.current.count).toBe(3);
    rerender({ initial: 7, step: 3 });
    act(() => result.current.increment());
    expect(result.current.count).toBe(6);
    act(() => result.current.reset());
    expect(result.current.count).toBe(7);
  });
});
