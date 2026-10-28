import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

function highlight(line: string) {
  return line
    .split(
      /('[^']*'|"[^"]*"|\/\/.*$|\b(?:import|from|export|function|const|return|void|false|true|null|undefined)\b|\buse[A-Z]\w*\b|\b\d+\b)/g,
    )
    .map((token, index) => {
      const className = token.startsWith('//')
        ? 'syntax-comment'
        : /^['"]/.test(token)
          ? 'syntax-string'
          : /^(import|from|export|function|const|return|void)$/.test(token)
            ? 'syntax-keyword'
            : /^(use[A-Z]|\d|true|false|null|undefined)/.test(token)
              ? 'syntax-value'
              : '';
      return (
        <span className={className} key={index}>
          {token}
        </span>
      );
    });
}

export function CodeBlock({ code }: { code: string }) {
  const { copy, copied, error, isCopying } = useCopyToClipboard();
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>
          <span className="ts-mark">TSX</span>example.tsx
        </span>
        <button
          type="button"
          className="copy-button"
          disabled={isCopying}
          onClick={() => {
            void copy(code);
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <pre aria-label="Usage example" tabIndex={0}>
        <code>
          {code.split('\n').map((line, index) => (
            <span className="code-line" key={index}>
              <span className="line-number" aria-hidden="true">
                {index + 1}
              </span>
              <span>{highlight(line)}</span>
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
      <span role="status" className={error ? 'code-error' : 'sr-only'}>
        {error ?? (copied ? 'Code copied to clipboard.' : '')}
      </span>
    </div>
  );
}
