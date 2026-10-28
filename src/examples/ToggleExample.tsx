import { Bell, Check } from 'lucide-react';
import { useToggle } from '../hooks/useToggle';

export function ToggleExample() {
  const { value, toggle, setTrue, setFalse } = useToggle(true);
  return (
    <div className="demo-stack">
      <div className="setting-preview">
        <span className="preview-icon">
          <Bell size={21} />
        </span>
        <div className="grow">
          <h3>Workspace notifications</h3>
          <p>A little less noise. A little more focus.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={value}
          aria-label="Workspace notifications"
          className="switch"
          onClick={toggle}
        >
          <span>{value && <Check size={12} />}</span>
        </button>
      </div>
      <div className="state-readout">
        <span>Current state</span>
        <code>
          value: <b className={value ? 'text-accent' : ''}>{String(value)}</b>
        </code>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="button button-primary"
          onClick={toggle}
        >
          Toggle value
        </button>
        <button type="button" className="button" onClick={setTrue}>
          Set true
        </button>
        <button type="button" className="button" onClick={setFalse}>
          Set false
        </button>
      </div>
    </div>
  );
}
