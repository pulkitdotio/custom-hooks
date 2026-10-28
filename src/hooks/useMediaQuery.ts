import { useCallback, useMemo, useSyncExternalStore } from 'react';

const serverSnapshot = () => false;

/** Subscribe to a CSS media query. Server rendering and unsupported browsers return false. */
export function useMediaQuery(query: string): boolean {
  const media = useMemo(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    )
      return null;
    try {
      return window.matchMedia(query);
    } catch {
      return null;
    }
  }, [query]);

  const subscribe = useCallback(
    (onChange: () => void) => {
      media?.addEventListener('change', onChange);
      return () => media?.removeEventListener('change', onChange);
    },
    [media],
  );
  const getSnapshot = useCallback(() => media?.matches ?? false, [media]);

  return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
}
