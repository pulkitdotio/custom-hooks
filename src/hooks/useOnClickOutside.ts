import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/** Listen for pointerdown outside an element, including composed paths through shadow DOM. */
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutside: (event: PointerEvent) => void,
): void {
  const callback = useRef(onOutside);
  useEffect(() => {
    callback.current = onOutside;
  }, [onOutside]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const ownerDocument = ref.current?.ownerDocument ?? document;
    const handlePointer = (event: PointerEvent) => {
      const element = ref.current;
      if (!element || !(event.target instanceof Node)) return;
      if (
        !element.contains(event.target) &&
        !event.composedPath().includes(element)
      ) {
        callback.current(event);
      }
    };
    // Capture also detects interactions that stop propagation in a child.
    ownerDocument.addEventListener('pointerdown', handlePointer, true);
    return () =>
      ownerDocument.removeEventListener('pointerdown', handlePointer, true);
  }, [ref]);
}
