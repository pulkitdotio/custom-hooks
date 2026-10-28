import { useState } from 'react';
import { Keyboard, RotateCcw } from 'lucide-react';
import { useEventListener } from '../hooks/useEventListener';

export function EventListenerExample() {
  const [key, setKey] = useState<string | null>(null);
  useEventListener('keydown', (event) =>
    setKey(event.key === ' ' ? 'Space' : event.key),
  );
  return (
    <div className="demo-stack">
      <div className="keyboard-preview">
        <Keyboard size={23} className="muted" />
        <kbd aria-label="Last pressed key">{key ?? '?'}</kbd>
        <p>Press any key while this page has focus.</p>
      </div>
      <div className="state-readout">
        <span>Listening on</span>
        <code>window → keydown</code>
      </div>
      <button
        type="button"
        className="button self-start"
        onClick={() => setKey(null)}
      >
        <RotateCcw size={14} />
        Clear key
      </button>
    </div>
  );
}
