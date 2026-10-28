# useCopyToClipboard

Copy text using the browser Clipboard API and report success or an actionable failure.

## Signature

```ts
function useCopyToClipboard(): {
  copy: (text: string) => Promise<boolean>;
  copied: boolean;
  error: string | null;
  isCopying: boolean;
};
```

## Parameters and returns

The hook takes no arguments. Call `copy(text)` from a user interaction. Its promise resolves `true` when the Clipboard API succeeds and `false` for a failure or a retained action called after unmount.

- `copied`: whether the most recent request completed successfully; initially `false`.
- `error`: a user-friendly failure message, or `null`.
- `isCopying`: whether the latest request is pending.
- `copy`: stable action function.

## Usage

```tsx
import { useCopyToClipboard } from './hooks/useCopyToClipboard';

export function CopyButton() {
  const { copy, copied, error, isCopying } = useCopyToClipboard();
  return (
    <div>
      <button
        disabled={isCopying}
        onClick={() => {
          void copy('Hello!');
        }}
      >
        {copied ? 'Copied!' : 'Copy text'}
      </button>
      <p role="status">{error}</p>
    </div>
  );
}
```

## Behavior and limitations

Starting a request clears the previous success/error. Success is set only after `navigator.clipboard.writeText` resolves. Rejections, including permission failures, return false and set an error. Missing API support returns a message suggesting HTTPS or manual copying. Empty strings are valid.

For overlapping requests, only the newest request updates the UI; each promise still reports its own API result. The hook cannot cancel a write already handed to the browser or guarantee completion order for concurrent writes. Unmounting prevents pending results from updating state, and retained actions after unmount do nothing. Status remains until another copy request or unmount; there is no automatic timeout.

The Clipboard API requires a supported browser and generally a secure context (HTTPS or localhost), user activation, and permission. There is no deprecated `execCommand` fallback. The hook can render on the server, where it starts with false/null/false status and performs no copy.

[Source](../../src/hooks/useCopyToClipboard.ts) · [Example](../../src/examples/ClipboardExample.tsx) · [Tests](../../tests/useCopyToClipboard.test.ts)
