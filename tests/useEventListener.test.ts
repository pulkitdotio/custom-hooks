import { fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { useEventListener } from '../src/hooks/useEventListener';

describe('useEventListener', () => {
  it('defaults to window and infers keyboard events', () => {
    const callback = vi.fn();
    renderHook(() =>
      useEventListener('keydown', (event) => {
        expectTypeOf(event).toEqualTypeOf<KeyboardEvent>();
        callback(event.key);
      }),
    );
    fireEvent.keyDown(window, { key: 'k' });
    expect(callback).toHaveBeenCalledWith('k');
  });

  it('supports document and HTML elements with inferred events', () => {
    const doc = vi.fn();
    const button = document.createElement('button');
    const clicked = vi.fn();
    renderHook(() => {
      useEventListener('visibilitychange', doc, document);
      useEventListener(
        'click',
        (event) => {
          expectTypeOf(event).toEqualTypeOf<PointerEvent>();
          clicked();
        },
        button,
      );
    });
    fireEvent(document, new Event('visibilitychange'));
    fireEvent.click(button);
    expect(doc).toHaveBeenCalledOnce();
    expect(clicked).toHaveBeenCalledOnce();
  });

  it('changes callbacks without resubscribing and cleans up on unmount', () => {
    const add = vi.spyOn(window, 'addEventListener');
    const first = vi.fn();
    const next = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ handler }) => useEventListener('keydown', handler),
      { initialProps: { handler: first } },
    );
    const initialCount = add.mock.calls.filter(
      ([name]) => name === 'keydown',
    ).length;
    rerender({ handler: next });
    expect(add.mock.calls.filter(([name]) => name === 'keydown')).toHaveLength(
      initialCount,
    );
    fireEvent.keyDown(window);
    expect(first).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
    unmount();
    fireEvent.keyDown(window);
    expect(next).toHaveBeenCalledOnce();
  });

  it('switches targets and supports null to disable', () => {
    const a = document.createElement('button');
    const b = document.createElement('button');
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ target }: { target: HTMLButtonElement | null }) =>
        useEventListener('click', callback, target),
      {
        initialProps: { target: a as HTMLButtonElement | null },
      },
    );
    rerender({ target: b });
    fireEvent.click(a);
    fireEvent.click(b);
    expect(callback).toHaveBeenCalledOnce();
    rerender({ target: null });
    fireEvent.click(b);
    expect(callback).toHaveBeenCalledOnce();
  });

  it('supports once, abort signals, capture, and changed options', () => {
    const callback = vi.fn();
    const controller = new AbortController();
    const { rerender } = renderHook(
      ({ once }) =>
        useEventListener('keydown', callback, window, {
          capture: true,
          once,
          passive: true,
          signal: controller.signal,
        }),
      { initialProps: { once: true } },
    );
    fireEvent.keyDown(window);
    fireEvent.keyDown(window);
    expect(callback).toHaveBeenCalledOnce();
    rerender({ once: false });
    fireEvent.keyDown(window);
    expect(callback).toHaveBeenCalledTimes(2);
    controller.abort();
    fireEvent.keyDown(window);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
