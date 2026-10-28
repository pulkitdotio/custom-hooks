import { useState } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

export function DebounceExample() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 400);
  const pending = search !== debounced;
  return (
    <div className="demo-stack">
      <label className="field-label" htmlFor="debounce-search">
        Your search
      </label>
      <div className="input-with-icon">
        <Search size={16} />
        <input
          id="debounce-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Try typing React hooks…"
          autoComplete="off"
        />
      </div>
      <div className="state-readout">
        <span>Live value</span>
        <output aria-label="Live value">{search || '—'}</output>
      </div>
      <div className="state-readout">
        <span>Debounced value</span>
        <output className="text-accent" aria-label="Debounced value">
          {debounced || '—'}
        </output>
      </div>
      <p className="demo-note" role="status">
        <span className={`status-dot ${pending ? 'pending' : ''}`} />
        {pending ? 'Waiting for you to finish…' : 'All caught up'}
        <span className="ml-auto font-mono">400 ms delay</span>
      </p>
    </div>
  );
}
