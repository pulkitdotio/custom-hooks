# useDebounce

Return a value after it has stopped changing for the requested delay.

## Signature

```ts
function useDebounce<T>(value: T, delay?: number): T;
```

## Parameters and returns

- `value`: any value; its type is inferred and preserved.
- `delay`: milliseconds to wait, default `300`.
- Returns the debounced value. The first render returns `value` immediately.

## Usage

```tsx
import { useState } from 'react';
import { useDebounce } from './hooks/useDebounce';

export function Search() {
  const [search, setSearch] = useState('');
  const settled = useDebounce(search, 400);
  return (
    <label>
      Search{' '}
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <output>Debounced: {settled}</output>
    </label>
  );
}
```

## Behavior and limitations

An input or normalized-delay change cancels the old timer and starts a fresh one. Unmounting clears the pending timer. Zero, negative, `NaN`, and infinite delays use an **asynchronous** zero-delay timeout. Finite delays are capped at `2,147,483,647` milliseconds to avoid timer overflow.

Objects are compared by identity, not deeply. Keep references stable when needed. This debounces values, not functions, and does not flush a pending value on unmount. Server rendering returns the initial input and schedules no effects. Browser scheduling can make a timeout run later than requested.

[Source](../../src/hooks/useDebounce.ts) · [Example](../../src/examples/DebounceExample.tsx) · [Tests](../../tests/useDebounce.test.ts)
