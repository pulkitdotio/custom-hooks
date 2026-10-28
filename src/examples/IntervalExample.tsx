import { useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useInterval } from '../hooks/useInterval';

export function IntervalExample() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  useInterval(() => setSeconds((value) => value + 1), running ? 1000 : null);
  return (
    <div className="demo-stack">
      <div className="timer-preview">
        <output className="big-number" aria-label="Elapsed seconds">
          {String(Math.floor(seconds / 60)).padStart(2, '0')}
          <span className="muted">:</span>
          {String(seconds % 60).padStart(2, '0')}
        </output>
        <span className="small-label">MINUTES / SECONDS</span>
      </div>
      <div className="state-readout">
        <span>Interval delay</span>
        <code className="text-accent">
          {running ? '1000 ms' : 'null (paused)'}
        </code>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="button button-primary"
          onClick={() => setRunning((value) => !value)}
        >
          {running ? <Pause size={14} /> : <Play size={14} />}
          {running ? 'Pause timer' : 'Start timer'}
        </button>
        <button
          type="button"
          className="button"
          onClick={() => {
            setRunning(false);
            setSeconds(0);
          }}
        >
          <RotateCcw size={14} />
          Reset timer
        </button>
      </div>
    </div>
  );
}
