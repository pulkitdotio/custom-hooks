# useCounter

Manage a number with increment, decrement, and reset actions.

## Signature

```ts
function useCounter(
  initialValue?: number,
  step?: number,
): {
  count: number;
  increment: (amount?: number) => void;
  decrement: (amount?: number) => void;
  reset: () => void;
};
```

## Parameters and returns

- `initialValue`: starting count, default `0`.
- `step`: default increment/decrement amount, default `1`.
- `count`: current number.
- `increment(amount?)` / `decrement(amount?)`: add/subtract the provided amount, or the configured step.
- `reset()`: restore the **latest supplied** `initialValue`.

## Usage

```tsx
import { useCounter } from './hooks/useCounter';

export function Quantity() {
  const { count, increment, decrement, reset } = useCounter(0, 2);
  return (
    <div>
      <output>{count}</output>
      <button onClick={() => decrement()}>Subtract 2</button>
      <button onClick={() => increment()}>Add 2</button>
      <button onClick={() => increment(10)}>Add 10</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## Behavior and limitations

Updates are functional and safe to batch. Changing the configuration preserves the count; subsequent actions use the new configuration. Action identities are stable while their relevant configuration is unchanged. Wrap increment/decrement in an arrow function in event handlers, so a DOM event is not passed as the numeric amount.

There are no bounds or numeric validation. Negative and fractional steps work with normal JavaScript arithmetic; supply finite numbers and implement domain-specific limits in your application. Server rendering is supported.

[Source](../../src/hooks/useCounter.ts) · [Example](../../src/examples/CounterExample.tsx) · [Tests](../../tests/useCounter.test.ts)
