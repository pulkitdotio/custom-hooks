import { RotateCcw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function LocalStorageExample() {
  const [note, setNote, removeNote] = useLocalStorage(
    'custom-hooks:demo:note',
    'Make something useful.',
  );
  return (
    <div className="demo-stack">
      <label className="field-label" htmlFor="saved-note">
        A note for later
      </label>
      <textarea
        id="saved-note"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        rows={3}
      />
      <div className="state-readout">
        <span>Storage key</span>
        <code>custom-hooks:demo:note</code>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="muted text-sm">
          Edit, then refresh to check persistence.
        </p>
        <button type="button" className="button" onClick={removeNote}>
          <RotateCcw size={14} />
          Reset note
        </button>
      </div>
    </div>
  );
}
