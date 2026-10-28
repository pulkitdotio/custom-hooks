import { useCallback, useEffect, useRef, useState } from 'react';

export interface ClipboardResult {
  copy: (text: string) => Promise<boolean>;
  copied: boolean;
  error: string | null;
  isCopying: boolean;
}

/** Copy with the Clipboard API. Only the latest pending request may update mounted state. */
export function useCopyToClipboard(): ClipboardResult {
  const [state, setState] = useState({
    copied: false,
    error: null as string | null,
    isCopying: false,
  });
  const mounted = useRef(false);
  const request = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      request.current += 1;
    };
  }, []);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!mounted.current) return false;
    const id = ++request.current;
    setState({ copied: false, error: null, isCopying: true });
    try {
      if (
        typeof navigator === 'undefined' ||
        typeof navigator.clipboard?.writeText !== 'function'
      ) {
        throw new Error(
          'Clipboard access is unavailable. Use HTTPS or copy the text manually.',
        );
      }
      await navigator.clipboard.writeText(text);
      if (mounted.current && request.current === id)
        setState({ copied: true, error: null, isCopying: false });
      return true;
    } catch (cause) {
      const error =
        cause instanceof Error &&
        cause.message.startsWith('Clipboard access is unavailable')
          ? cause.message
          : 'Could not copy. Allow clipboard access in your browser, then try again.';
      if (mounted.current && request.current === id)
        setState({ copied: false, error, isCopying: false });
      return false;
    }
  }, []);

  return { copy, ...state };
}
