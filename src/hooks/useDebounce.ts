import { useEffect, useState } from 'react';

/** Delay a value until updates settle. Negative or non-finite delays become zero. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const milliseconds = Number.isFinite(delay)
    ? Math.min(Math.max(0, delay), 2_147_483_647)
    : 0;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), milliseconds);
    return () => clearTimeout(timer);
  }, [value, milliseconds]);

  return debouncedValue;
}
