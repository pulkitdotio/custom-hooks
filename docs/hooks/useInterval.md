# useInterval

Run the current callback repeatedly, with a declarative pause control.

## Signature

```ts
function useInterval(callback: () => void, delay: number | null): void;
```

## Parameters and returns

- `callback`: function to run on every tick.
- `delay`: interval in milliseconds; `null` pauses.
- Returns nothing.

## Usage

```tsx
import { useState } from 'react';
import { useInterval } from './hooks/useInterval';

export function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  useInterval(() => setSeconds((s) => s + 1), running ? 1000 : null);
  return (
    <button onClick={() => setRunning((v) => !v)}>
      {seconds}s — {running ? 'Pause' : 'Start'}
    </button>
  );
}
```

## Behavior and limitations

The latest committed callback is used without restarting the interval when only the callback changes. Changing the delay clears the old interval and starts a fresh schedule. There is no immediate first tick. Pausing discards partial elapsed time; resuming starts a full new interval. Unmounting clears the interval. Effects do not run during server rendering.

Negative, `NaN`, and infinite delays pause. Zero is allowed and follows native timer clamping. Finite delays are capped at `2,147,483,647` milliseconds. Browser throttling and busy event loops affect timing; this is not a precision clock. Async callbacks are not awaited, so long-running work can overlap. The hook does not catch errors thrown by your callback.

[Source](../../src/hooks/useInterval.ts) · [Example](../../src/examples/IntervalExample.tsx) · [Tests](../../tests/useInterval.test.ts)
