# useEventListener

Attach a typed DOM listener with automatic cleanup and an up-to-date callback.

## Signature

```ts
type SupportedTarget = Window | Document | HTMLElement;
type EventMap<T> = T extends Window
  ? WindowEventMap
  : T extends Document
    ? DocumentEventMap
    : HTMLElementEventMap;

function useEventListener<
  T extends SupportedTarget = Window,
  K extends keyof EventMap<T> = keyof EventMap<T>,
>(
  eventName: K,
  handler: (event: EventMap<T>[K]) => void,
  target?: T | null,
  options?: boolean | AddEventListenerOptions,
): void;
```

## Parameters and returns

- `eventName`: a standard DOM event name for the selected target.
- `handler`: callback with inferred event type, for example `KeyboardEvent` for `keydown`.
- `target`: window, document, or an HTML element. Omitted/undefined uses window inside a browser-safe effect. `null` disables listening.
- `options`: boolean capture flag or `{ capture, passive, once, signal }`.
- Returns nothing.

## Usage

```tsx
import { useState } from 'react';
import { useEventListener } from './hooks/useEventListener';

export function LastKey() {
  const [key, setKey] = useState('');
  useEventListener('keydown', (event) => setKey(event.key));
  return <output>{key || 'Press a key'}</output>;
}
```

For an element target, a callback ref can place the actual element in state:

```tsx
const [element, setElement] = useState<HTMLDivElement | null>(null);
useEventListener('scroll', (event) => console.log(event.type), element, {
  passive: true,
});
// Attach with: <div ref={setElement}>...</div>
```

## Behavior and limitations

The handler ref updates after commits without resetting the subscription. Changing the event, target, or individual option values removes the old listener and attaches a new one. An inline options object alone does not cause resubscription. Cleanup uses the original capture flag. Browser-native `once` and `AbortSignal` behavior apply; an already-aborted signal attaches no active listener.

The hook is safe on the server, but your own arguments must also be safe. Use `typeof window === 'undefined' ? null : window` when passing window explicitly, or omit the target. Pass an element, not a ref object: changing only `ref.current` does not trigger React rendering. Custom event maps, SVG targets, workers, and other EventTarget implementations are not included in this focused API.

[Source](../../src/hooks/useEventListener.ts) · [Example](../../src/examples/EventListenerExample.tsx) · [Tests](../../tests/useEventListener.test.ts)
