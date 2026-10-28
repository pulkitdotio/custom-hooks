import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

export function ClipboardExample() {
  const [text, setText] = useState('Small hooks. Less repetition.');
  const { copy, copied, error, isCopying } = useCopyToClipboard();
  return (
    <div className="demo-stack">
      <label className="field-label" htmlFor="clipboard-text">
        Something worth copying
      </label>
      <input
        id="clipboard-text"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <div className="state-readout">
        <span>Last copy status</span>
        <output
          aria-label="Copy status"
          className={error ? 'text-error' : 'text-accent'}
        >
          {isCopying
            ? 'copying…'
            : error
              ? 'failed'
              : copied
                ? 'copied'
                : 'ready'}
        </output>
      </div>
      <button
        type="button"
        className="button button-primary self-start"
        disabled={isCopying}
        onClick={() => {
          void copy(text);
        }}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {isCopying ? 'Copying…' : 'Copy text'}
      </button>
      <p className={error ? 'demo-note text-error' : 'demo-note'} role="status">
        {error ??
          (copied
            ? 'Copied to your clipboard. Paste it anywhere.'
            : 'Uses your browser’s Clipboard API. HTTPS or localhost required.')}
      </p>
    </div>
  );
}
