import { ArrowRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { usePrevious } from '../hooks/usePrevious';

export function PreviousExample() {
  const [count, setCount] = useState(0);
  const previous = usePrevious(count);
  return (
    <div className="demo-stack">
      <div className="previous-preview">
        <div>
          <span>Previous</span>
          <output aria-label="Previous count">{previous ?? '—'}</output>
        </div>
        <ArrowRight size={22} className="muted" />
        <div>
          <span>Current</span>
          <output aria-label="Current count" className="text-accent">
            {count}
          </output>
        </div>
      </div>
      <div className="state-readout">
        <span>From the previous commit</span>
        <code>{previous === undefined ? 'undefined' : previous}</code>
      </div>
      <button
        type="button"
        className="button button-primary self-start"
        onClick={() => setCount((value) => value + 1)}
      >
        <Plus size={15} />
        Update value
      </button>
    </div>
  );
}
