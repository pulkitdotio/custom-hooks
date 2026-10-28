// @vitest-environment node
import { useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  useCopyToClipboard,
  useCounter,
  useDebounce,
  useEventListener,
  useInterval,
  useLocalStorage,
  useMediaQuery,
  useOnClickOutside,
  usePrevious,
  useToggle,
} from '../src/hooks';

describe('server rendering', () => {
  it('renders every hook without window, document, or navigator', () => {
    expect(typeof window).toBe('undefined');
    function Probe() {
      const { value } = useToggle();
      const { count } = useCounter();
      const debounced = useDebounce('ready');
      const [stored] = useLocalStorage('theme', 'dark');
      const matches = useMediaQuery('(min-width: 768px)');
      const previous = usePrevious(1);
      const ref = useRef<HTMLDivElement>(null);
      useOnClickOutside(ref, () => {});
      useEventListener('keydown', () => {});
      useInterval(() => {}, 1000);
      const { copied } = useCopyToClipboard();
      return (
        <div>
          {JSON.stringify({
            value,
            count,
            debounced,
            stored,
            matches,
            previous,
            copied,
          })}
        </div>
      );
    }
    const html = renderToString(<Probe />);
    expect(html).toContain('&quot;stored&quot;:&quot;dark&quot;');
    expect(html).toContain('&quot;matches&quot;:false');
    expect(html).toContain('&quot;copied&quot;:false');
  });
});
