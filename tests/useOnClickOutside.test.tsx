import { useRef } from 'react';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useOnClickOutside } from '../src/hooks/useOnClickOutside';

function Fixture({ onOutside }: { onOutside: (event: PointerEvent) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, onOutside);
  return (
    <>
      <div ref={ref}>
        <button>Inside</button>
      </div>
      <button>Outside</button>
    </>
  );
}

describe('useOnClickOutside', () => {
  it('responds only to pointer interactions outside the element', () => {
    const callback = vi.fn();
    render(<Fixture onOutside={callback} />);
    fireEvent.pointerDown(screen.getByText('Inside'));
    expect(callback).not.toHaveBeenCalled();
    fireEvent.pointerDown(screen.getByText('Outside'));
    expect(callback).toHaveBeenCalledOnce();
  });

  it('uses the current callback and removes the listener on unmount', () => {
    const first = vi.fn();
    const next = vi.fn();
    const { rerender, unmount } = render(<Fixture onOutside={first} />);
    rerender(<Fixture onOutside={next} />);
    fireEvent.pointerDown(document.body);
    expect(first).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
    unmount();
    fireEvent.pointerDown(document.body);
    expect(next).toHaveBeenCalledOnce();
  });

  it('handles null refs safely', () => {
    const callback = vi.fn();
    renderHook(() => useOnClickOutside({ current: null }, callback));
    fireEvent.pointerDown(document.body);
    expect(callback).not.toHaveBeenCalled();
  });

  it('respects a composed path containing the element', () => {
    const callback = vi.fn();
    render(<Fixture onOutside={callback} />);
    const element = screen.getByText('Inside').parentElement!;
    const event = new Event('pointerdown', { bubbles: true });
    Object.defineProperty(event, 'composedPath', {
      value: () => [element, document.body],
    });
    fireEvent(document.body, event);
    expect(callback).not.toHaveBeenCalled();
  });
});
