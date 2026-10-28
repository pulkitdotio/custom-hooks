# useOnClickOutside

Call a callback when a pointer interaction happens outside a referenced HTML element.

## Signature

```ts
function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onOutside: (event: PointerEvent) => void,
): void;
```

## Parameters and returns

- `ref`: a React ref attached to the element whose interior should be ignored.
- `onOutside`: callback receiving the outside `PointerEvent`.
- Returns nothing.

## Usage

```tsx
import { useRef, useState } from 'react';
import { useOnClickOutside } from './hooks/useOnClickOutside';

export function Popover() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useOnClickOutside(ref, () => setOpen(false));
  return (
    <div ref={ref}>
      <button aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        Toggle
      </button>
      {open && <p>Click or tap outside to close.</p>}
    </div>
  );
}
```

## Behavior and limitations

Listens to `pointerdown` in the capture phase, covering mouse, touch, and pen even if another element stops bubbling. Interactions within the element, or with a composed event path containing it, are ignored. Null refs are safe. The callback ref is refreshed after commits, so changing callbacks do not require a new listener. Unmounting removes the listener. No browser globals are accessed on the server.

Attach the ref to a wrapper that includes the trigger and popup when both should count as inside. Portals outside that wrapper count as outside. A complete dialog still needs focus management, Escape handling, and appropriate semantics. Cross-frame interactions and programmatic `.click()` calls without a pointerdown are outside this hook's scope. Keep the element in the same document while mounted.

[Source](../../src/hooks/useOnClickOutside.ts) · [Example](../../src/examples/ClickOutsideExample.tsx) · [Tests](../../tests/useOnClickOutside.test.tsx)
