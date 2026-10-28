import { useEffect, useRef } from 'react';

type SupportedTarget = Window | Document | HTMLElement;
type EventMap<T> = T extends Window
  ? WindowEventMap
  : T extends Document
    ? DocumentEventMap
    : HTMLElementEventMap;

/**
 * Attach a typed DOM listener, using the latest committed handler.
 * Omit target for window, or pass null to disable. Access browser globals safely at the call site.
 */
export function useEventListener<
  T extends SupportedTarget = Window,
  K extends keyof EventMap<T> = keyof EventMap<T>,
>(
  eventName: K,
  handler: (event: EventMap<T>[K]) => void,
  target?: T | null,
  options?: boolean | AddEventListenerOptions,
): void {
  const callback = useRef(handler);
  useEffect(() => {
    callback.current = handler;
  }, [handler]);

  const capture =
    typeof options === 'boolean' ? options : (options?.capture ?? false);
  const passive = typeof options === 'object' ? options.passive : undefined;
  const once = typeof options === 'object' ? options.once : undefined;
  const signal = typeof options === 'object' ? options.signal : undefined;

  useEffect(() => {
    const resolvedTarget =
      target === undefined
        ? typeof window === 'undefined'
          ? null
          : window
        : target;
    if (!resolvedTarget) return;
    const listener = (event: Event) =>
      callback.current(event as EventMap<T>[K]);
    const listenerOptions = { capture, passive, once, signal };
    resolvedTarget.addEventListener(
      String(eventName),
      listener,
      listenerOptions,
    );
    return () =>
      resolvedTarget.removeEventListener(String(eventName), listener, capture);
  }, [eventName, target, capture, passive, once, signal]);
}
