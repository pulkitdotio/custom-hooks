# useMediaQuery

Subscribe to a CSS media query and return its current match state.

## Signature

```ts
function useMediaQuery(query: string): boolean;
```

## Parameters and returns

`query` is a CSS media query such as `(min-width: 768px)` or `(prefers-reduced-motion: reduce)`. The returned boolean tells you whether it currently matches.

## Usage

```tsx
import { useMediaQuery } from './hooks/useMediaQuery';

export function LayoutHint() {
  const wide = useMediaQuery('(min-width: 768px)');
  return <p>{wide ? 'Wide layout' : 'Narrow layout'}</p>;
}
```

## Behavior and limitations

The hook uses `matchMedia` and the modern `change` event API. It removes the old subscription when the query changes and on unmount. There is no resize polling.

The server snapshot and first hydration render return `false`; the browser match is read after hydration. Unsupported environments and a thrown `matchMedia` call return `false`. Invalid CSS queries commonly evaluate to `false` in the browser. Older browsers with only `addListener` are not supported.

Use CSS media queries for purely visual layout. Conditional rendering based on this hook may cause a visible change after hydration.

[Source](../../src/hooks/useMediaQuery.ts) · [Example](../../src/examples/MediaQueryExample.tsx) · [Tests](../../tests/useMediaQuery.test.ts)
