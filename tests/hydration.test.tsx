import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { useLocalStorage } from '../src/hooks/useLocalStorage';
import { useMediaQuery } from '../src/hooks/useMediaQuery';

it('hydrates storage and media fallbacks before applying browser state without mismatches', async () => {
  localStorage.setItem('hydrate-theme', '"light"');
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
  function Probe() {
    const [theme] = useLocalStorage('hydrate-theme', 'dark');
    const wide = useMediaQuery('(min-width: 768px)');
    return (
      <p>
        {theme}:{String(wide)}
      </p>
    );
  }
  const container = document.createElement('div');
  container.innerHTML = renderToString(<Probe />);
  expect(container).toHaveTextContent('dark:false');
  const errors = vi.fn();
  let root!: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, <Probe />, { onRecoverableError: errors });
  });
  expect(container).toHaveTextContent('light:true');
  expect(errors).not.toHaveBeenCalled();
  await act(async () => root.unmount());
});
