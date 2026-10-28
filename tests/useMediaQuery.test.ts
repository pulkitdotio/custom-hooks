import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useMediaQuery } from '../src/hooks/useMediaQuery';

function mockMedia(initial = false) {
  const listeners = new Set<() => void>();
  const media = {
    matches: initial,
    media: '(min-width: 768px)',
    addEventListener: vi.fn((_event: string, fn: () => void) =>
      listeners.add(fn),
    ),
    removeEventListener: vi.fn((_event: string, fn: () => void) =>
      listeners.delete(fn),
    ),
  };
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => media),
  );
  return {
    media,
    change: (matches: boolean) => {
      media.matches = matches;
      listeners.forEach((fn) => fn());
    },
  };
}

describe('useMediaQuery', () => {
  it('reads and updates the matching state', () => {
    const { change } = mockMedia(true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
    act(() => change(false));
    expect(result.current).toBe(false);
  });

  it('unsubscribes when the query changes and on unmount', () => {
    const { media } = mockMedia();
    const { rerender, unmount } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: '(min-width: 768px)' } },
    );
    const nextMedia = { ...media, removeEventListener: vi.fn() };
    vi.mocked(window.matchMedia).mockReturnValue(
      nextMedia as unknown as MediaQueryList,
    );
    rerender({ query: '(max-width: 500px)' });
    expect(window.matchMedia).toHaveBeenLastCalledWith('(max-width: 500px)');
    expect(media.removeEventListener).toHaveBeenCalledTimes(1);
    unmount();
    expect(nextMedia.removeEventListener).toHaveBeenCalledOnce();
  });

  it('returns false without matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(
      renderHook(() => useMediaQuery('(min-width: 768px)')).result.current,
    ).toBe(false);
  });

  it('handles a browser rejecting a query', () => {
    vi.stubGlobal('matchMedia', () => {
      throw new Error('invalid');
    });
    expect(renderHook(() => useMediaQuery('invalid')).result.current).toBe(
      false,
    );
  });
});
