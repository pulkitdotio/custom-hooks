import { useCallback, useState } from 'react';

export interface CounterResult {
  count: number;
  increment: (amount?: number) => void;
  decrement: (amount?: number) => void;
  reset: () => void;
}

/** Count by a default step or a per-action amount. Reset uses the latest initial value. */
export function useCounter(initialValue = 0, step = 1): CounterResult {
  const [count, setCount] = useState(initialValue);
  const increment = useCallback(
    (amount = step) => setCount((current) => current + amount),
    [step],
  );
  const decrement = useCallback(
    (amount = step) => setCount((current) => current - amount),
    [step],
  );
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  return { count, increment, decrement, reset };
}
