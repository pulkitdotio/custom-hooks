import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useToggle } from '../src/hooks/useToggle';

describe('useToggle', () => {
  it('defaults to false and accepts an initial value', () => {
    expect(renderHook(() => useToggle()).result.current.value).toBe(false);
    expect(renderHook(() => useToggle(true)).result.current.value).toBe(true);
  });

  it('toggles with functional updates even when batched', () => {
    const { result } = renderHook(() => useToggle());
    act(() => {
      result.current.toggle();
      result.current.toggle();
      result.current.toggle();
    });
    expect(result.current.value).toBe(true);
  });

  it('sets explicit values and keeps actions stable across rerenders', () => {
    const { result, rerender } = renderHook(() => useToggle());
    const actions = result.current;
    act(() => result.current.setTrue());
    expect(result.current.value).toBe(true);
    rerender();
    expect(result.current.toggle).toBe(actions.toggle);
    expect(result.current.setTrue).toBe(actions.setTrue);
    expect(result.current.setFalse).toBe(actions.setFalse);
    act(() => result.current.setFalse());
    expect(result.current.value).toBe(false);
  });
});
