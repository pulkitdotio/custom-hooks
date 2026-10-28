import { useEffect, useRef } from 'react';

/** Return the value from the previous commit, or undefined on the first render. */
export function usePrevious<T>(value: T): T | undefined {
  const previous = useRef<T | undefined>(undefined);
  useEffect(() => {
    previous.current = value;
  }, [value]);
  return previous.current;
}
