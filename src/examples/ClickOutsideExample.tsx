import { useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { useEventListener } from '../hooks/useEventListener';

export function ClickOutsideExample() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('Personal workspace');
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useOnClickOutside(menuRef, () => setOpen(false));
  useEventListener('keydown', (event) => {
    if (open && event.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
    }
  });

  return (
    <div className="demo-stack">
      <div className="popover-preview">
        <div className="popover-anchor" ref={menuRef}>
          <button
            type="button"
            ref={triggerRef}
            className="button workspace-trigger"
            aria-expanded={open}
            aria-controls="workspace-options"
            onClick={() => setOpen((value) => !value)}
          >
            {selected}
            <ChevronDown size={15} />
          </button>
          {open && (
            <div
              className="popover"
              id="workspace-options"
              aria-label="Workspaces"
            >
              {['Personal workspace', 'Side projects', 'The next big idea'].map(
                (workspace) => (
                  <button
                    type="button"
                    key={workspace}
                    onClick={() => {
                      setSelected(workspace);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                  >
                    {workspace}
                    {selected === workspace && <Check size={14} />}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>
      <div className="state-readout">
        <span>Popover state</span>
        <output className="text-accent" aria-label="Popover state">
          {open ? 'open' : 'closed'}
        </output>
      </div>
      <p className="demo-note">
        Open the dropdown, then click or tap anywhere outside it.
      </p>
    </div>
  );
}
