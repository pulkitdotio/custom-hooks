import { StrictMode, Suspense } from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePrevious } from '../src/hooks/usePrevious';

describe('usePrevious', () => {
  it('returns undefined initially, then the previous committed value', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });
    expect(result.current).toBeUndefined();
    rerender({ value: 2 });
    expect(result.current).toBe(1);
    rerender({ value: 3 });
    expect(result.current).toBe(2);
  });

  it('preserves generic references and counts unchanged commits', () => {
    const a = { name: 'a' };
    const b = { name: 'b' };
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: a },
      wrapper: StrictMode,
    });
    rerender({ value: b });
    expect(result.current).toBe(a);
    rerender({ value: b });
    expect(result.current).toBe(b);
  });

  it('does not remember a suspended render that never committed', () => {
    const never = new Promise<void>(() => {});
    function Probe({ value, suspend }: { value: number; suspend?: boolean }) {
      const previous = usePrevious(value);
      if (suspend) throw never;
      return <output aria-label="Previous">{String(previous)}</output>;
    }
    const { rerender } = render(
      <Suspense fallback="Waiting">
        <Probe value={1} />
      </Suspense>,
    );
    rerender(
      <Suspense fallback="Waiting">
        <Probe value={2} suspend />
      </Suspense>,
    );
    rerender(
      <Suspense fallback="Waiting">
        <Probe value={3} />
      </Suspense>,
    );
    expect(screen.getByLabelText('Previous')).toHaveTextContent('1');
  });
});
