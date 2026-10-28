import { Laptop, Smartphone } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

export function MediaQueryExample() {
  const isWide = useMediaQuery('(min-width: 768px)');
  return (
    <div className="demo-stack">
      <div className="media-preview">
        {isWide ? (
          <Laptop size={48} strokeWidth={1.2} />
        ) : (
          <Smartphone size={48} strokeWidth={1.2} />
        )}
        <h3>{isWide ? 'Room to spread out.' : 'A smaller point of view.'}</h3>
        <p>Resize your browser to cross the 768px breakpoint.</p>
      </div>
      <div className="state-readout">
        <code>(min-width: 768px)</code>
        <output className="text-accent" aria-label="Media query matches">
          {String(isWide)}
        </output>
      </div>
    </div>
  );
}
