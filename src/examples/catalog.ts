import type { ComponentType } from 'react';
import { ToggleExample } from './ToggleExample';
import { CounterExample } from './CounterExample';
import { DebounceExample } from './DebounceExample';
import { LocalStorageExample } from './LocalStorageExample';
import { MediaQueryExample } from './MediaQueryExample';
import { PreviousExample } from './PreviousExample';
import { ClickOutsideExample } from './ClickOutsideExample';
import { EventListenerExample } from './EventListenerExample';
import { IntervalExample } from './IntervalExample';
import { ClipboardExample } from './ClipboardExample';

export interface HookExample {
  name: string;
  category: 'State' | 'Values & timing' | 'Browser';
  description: string;
  hint: string;
  detail: string;
  parameters: string;
  returns: string;
  Demo: ComponentType;
  code: string;
}

export const hooks: HookExample[] = [
  {
    name: 'useToggle',
    category: 'State',
    Demo: ToggleExample,
    description:
      'Boolean state, without the boilerplate. Toggle a value or set it explicitly with stable, predictable actions.',
    hint: 'Go ahead. Flip the switch.',
    detail:
      'Each action updates the same boolean. Try toggling, then setting an explicit value.',
    parameters: 'initialValue: boolean = false',
    returns: '{ value, toggle, setTrue, setFalse }',
    code: `import { useToggle } from './hooks/useToggle';

export function Notifications() {
  const { value, toggle, setTrue, setFalse } = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>Notifications: {String(value)}</button>
      <button onClick={setTrue}>Enable</button>
      <button onClick={setFalse}>Disable</button>
    </div>
  );
}`,
  },
  {
    name: 'useCounter',
    category: 'State',
    Demo: CounterExample,
    description:
      'A number with somewhere to go. Increment, decrement, and reset with configurable steps and safe state updates.',
    hint: 'One step at a time. Or five.',
    detail:
      'Change the step amount and keep counting. Reset takes you back to the initial value.',
    parameters: 'initialValue: number = 0, step: number = 1',
    returns: '{ count, increment, decrement, reset }',
    code: `import { useCounter } from './hooks/useCounter';

export function Counter() {
  const { count, increment, decrement, reset } = useCounter(0, 1);

  return (
    <div>
      <output>{count}</output>
      <button onClick={() => decrement()}>Decrease</button>
      <button onClick={() => increment()}>Increase</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`,
  },
  {
    name: 'useDebounce',
    category: 'Values & timing',
    Demo: DebounceExample,
    description:
      'Give fast-changing values a moment to settle. Only update after the input has stopped changing for a little while.',
    hint: 'Type a little. Then take a breath.',
    detail:
      'The live value follows every keystroke. The debounced value waits for 400ms of quiet.',
    parameters: 'value: T, delay: number = 300',
    returns: 'debouncedValue: T',
    code: `import { useState } from 'react';
import { useDebounce } from './hooks/useDebounce';

export function Search() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  return (
    <label>
      Search <input value={search} onChange={e => setSearch(e.target.value)} />
      <output>Settled: {debouncedSearch}</output>
    </label>
  );
}`,
  },
  {
    name: 'useLocalStorage',
    category: 'State',
    Demo: LocalStorageExample,
    description:
      'State that remembers. Persist JSON values across refreshes and stay in sync with other tabs.',
    hint: 'Leave yourself a little note.',
    detail:
      'Changes are saved in localStorage when available. Reset removes the key and restores the original fallback.',
    parameters: 'key: string, initialValue: T',
    returns: '[value, setValue, removeValue] as const',
    code: `import { useLocalStorage } from './hooks/useLocalStorage';

export function SavedNote() {
  const [note, setNote, removeNote] = useLocalStorage('note', 'Hello!');

  return (
    <label>
      Note <input value={note} onChange={e => setNote(e.target.value)} />
      <button onClick={removeNote}>Reset note</button>
    </label>
  );
}`,
  },
  {
    name: 'useMediaQuery',
    category: 'Browser',
    Demo: MediaQueryExample,
    description:
      'Let your logic respond to the viewport. Subscribe to a CSS media query and get a boolean that stays up to date.',
    hint: 'Make a little room.',
    detail:
      'Resize the viewport across 768px. The result comes directly from the browser’s matchMedia API.',
    parameters: 'query: string',
    returns: 'matches: boolean',
    code: `import { useMediaQuery } from './hooks/useMediaQuery';

export function ResponsiveHint() {
  const isWide = useMediaQuery('(min-width: 768px)');

  return <p>{isWide ? 'Wide viewport' : 'Narrow viewport'}</p>;
}`,
  },
  {
    name: 'usePrevious',
    category: 'Values & timing',
    Demo: PreviousExample,
    description:
      'Keep a little perspective. Read the value from the previous committed render without adding extra state.',
    hint: 'A look at where you just were.',
    detail:
      'Update the count and compare both values. The first render has no previous value, so it returns undefined.',
    parameters: 'value: T',
    returns: 'previous: T | undefined',
    code: `import { useState } from 'react';
import { usePrevious } from './hooks/usePrevious';

export function PreviousCount() {
  const [count, setCount] = useState(0);
  const previous = usePrevious(count);

  return (
    <button onClick={() => setCount(n => n + 1)}>
      Current: {count}, previous: {previous ?? 'none'}
    </button>
  );
}`,
  },
  {
    name: 'useOnClickOutside',
    category: 'Browser',
    Demo: ClickOutsideExample,
    description:
      'Know when to step out of the way. Detect pointer interactions outside an element, for menus, popovers, and more.',
    hint: 'Open it. Then step outside.',
    detail:
      'Interactions inside the referenced element are ignored. An outside pointerdown closes the dropdown.',
    parameters: 'ref: RefObject<T | null>, onOutside: (event) => void',
    returns: 'void',
    code: `import { useRef, useState } from 'react';
import { useOnClickOutside } from './hooks/useOnClickOutside';

export function Popover() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref}>
      <button aria-expanded={open} onClick={() => setOpen(v => !v)}>Open</button>
      {open && <p>Click outside to close.</p>}
    </div>
  );
}`,
  },
  {
    name: 'useEventListener',
    category: 'Browser',
    Demo: EventListenerExample,
    description:
      'Listen once, stay current. Add a typed DOM event listener with the latest callback and automatic cleanup.',
    hint: 'Your keyboard has the floor.',
    detail:
      'Press a key to inspect the event. The listener always uses the current handler, without resubscribing on each render.',
    parameters: 'eventName, handler, target?, options?',
    returns: 'void',
    code: `import { useState } from 'react';
import { useEventListener } from './hooks/useEventListener';

export function LastKey() {
  const [key, setKey] = useState('');
  // The target defaults to window; safe during server rendering.
  useEventListener('keydown', event => setKey(event.key));

  return <p>Last key: {key || 'Press a key'}</p>;
}`,
  },
  {
    name: 'useInterval',
    category: 'Values & timing',
    Demo: IntervalExample,
    description:
      'A steady rhythm, with a pause button. Run a current callback on an interval and pass null to take a break.',
    hint: 'Start the clock. Stay in control.',
    detail:
      'The callback runs every second. Pausing clears the interval; resuming starts a fresh one.',
    parameters: 'callback: () => void, delay: number | null',
    returns: 'void',
    code: `import { useState } from 'react';
import { useInterval } from './hooks/useInterval';

export function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  useInterval(() => setSeconds(s => s + 1), running ? 1000 : null);

  return (
    <button onClick={() => setRunning(v => !v)}>
      {seconds}s — {running ? 'Pause' : 'Start'}
    </button>
  );
}`,
  },
  {
    name: 'useCopyToClipboard',
    category: 'Browser',
    Demo: ClipboardExample,
    description:
      'Make the useful bits easy to take with you. Copy text and show honest feedback when the browser says yes or no.',
    hint: 'A good idea deserves a copy.',
    detail:
      'Edit the text, then copy it. Success is shown only after the Clipboard API resolves; failures include a helpful message.',
    parameters: 'copy(text: string): Promise<boolean>',
    returns: '{ copy, copied, error, isCopying }',
    code: `import { useCopyToClipboard } from './hooks/useCopyToClipboard';

export function CopyButton() {
  const { copy, copied, error, isCopying } = useCopyToClipboard();

  return (
    <div>
      <button disabled={isCopying} onClick={() => { void copy('Hello!'); }}>
        {copied ? 'Copied!' : 'Copy text'}
      </button>
      <p role="status">{error}</p>
    </div>
  );
}`,
  },
];

export const repository = 'https://github.com/pulkitdotio/custom-hooks';
