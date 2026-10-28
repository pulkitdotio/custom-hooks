import { useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useCounter } from '../hooks/useCounter';

export function CounterExample() {
  const [step, setStep] = useState(1);
  const { count, increment, decrement, reset } = useCounter(0, step);
  return (
    <div className="demo-stack">
      <div className="counter-preview">
        <button
          type="button"
          className="button icon-button"
          aria-label="Decrease count"
          onClick={() => decrement()}
        >
          <Minus size={20} />
        </button>
        <output className="big-number" aria-label="Counter value">
          {count}
        </output>
        <button
          type="button"
          className="button icon-button"
          aria-label="Increase count"
          onClick={() => increment()}
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="state-readout">
        <span>Current state</span>
        <code>
          count: <b className="text-accent">{count}</b>
        </code>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-label">
          Step amount{' '}
          <select
            aria-label="Step amount"
            value={step}
            onChange={(event) => setStep(Number(event.target.value))}
          >
            {[1, 5, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="button" onClick={reset}>
          <RotateCcw size={14} />
          Reset counter
        </button>
      </div>
    </div>
  );
}
