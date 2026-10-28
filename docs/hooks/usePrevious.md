# usePrevious

Read a value from the previous committed render without scheduling an extra render.

## Signature

```ts
function usePrevious<T>(value: T): T | undefined;
```

## Parameters and returns

`value` can be any type. Returns `undefined` on the first render, then the value saved by an effect after the preceding commit.

## Usage

```tsx
import { useState } from 'react';
import { usePrevious } from './hooks/usePrevious';

export function Comparison() {
  const [count, setCount] = useState(0);
  const previous = usePrevious(count);
  return (
    <button onClick={() => setCount((n) => n + 1)}>
      Current: {count}, previous: {previous ?? 'none'}
    </button>
  );
}
```

## Behavior and limitations

The ref is updated in an effect, never during rendering. An abandoned or suspended render does not overwrite the stored value. The hook remembers the previous **commit**, not the previous distinct value. A rerender with the same input can therefore return that same value.

Objects are saved by reference without cloning. Treat values as immutable. `undefined` may mean either the first render or a previous input that itself was undefined. The hook does not trigger updates; your component must render for you to observe the saved value. Server rendering returns undefined because effects do not run there.

[Source](../../src/hooks/usePrevious.ts) · [Example](../../src/examples/PreviousExample.tsx) · [Tests](../../tests/usePrevious.test.tsx)
