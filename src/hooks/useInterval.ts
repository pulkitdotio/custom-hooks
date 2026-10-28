import { useEffect, useRef } from 'react';

/** Run a current callback repeatedly. Null pauses; negative/non-finite delays also pause. */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null || !Number.isFinite(delay) || delay < 0) return;
    const timer = setInterval(
      () => savedCallback.current(),
      Math.min(delay, 2_147_483_647),
    );
    return () => clearInterval(timer);
  }, [delay]);
}
