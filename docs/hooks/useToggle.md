# useToggle

Manage boolean state with stable actions for toggling and setting explicit values.

## Signature

```ts
function useToggle(initialValue?: boolean): {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
};
```

## Parameters and returns

`initialValue` defaults to `false` and is read on mount. The result contains the current `value`, `toggle` to invert it, and `setTrue` / `setFalse` to set it explicitly.

## Usage

```tsx
import { useToggle } from './hooks/useToggle';

export function Details() {
  const { value, toggle, setTrue, setFalse } = useToggle(false);
  return (
    <section>
      <button aria-expanded={value} onClick={toggle}>
        Details
      </button>
      <button onClick={setTrue}>Expand</button>
      <button onClick={setFalse}>Collapse</button>
      {value && <p>The details are here.</p>}
    </section>
  );
}
```

## Behavior and limitations

All three actions retain their identity across rerenders. Toggling uses a functional state update, so batched calls do not lose updates. Changing `initialValue` later does not reset existing state. The hook has no browser dependency and can render on the server.

[Source](../../src/hooks/useToggle.ts) · [Interactive example](../../src/examples/ToggleExample.tsx) · [Tests](../../tests/useToggle.test.ts)
