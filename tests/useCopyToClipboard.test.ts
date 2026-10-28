import { StrictMode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCopyToClipboard } from '../src/hooks/useCopyToClipboard';

function clipboard(writeText: (text: string) => Promise<void>) {
  vi.stubGlobal('navigator', { clipboard: { writeText } });
}

describe('useCopyToClipboard', () => {
  it('reports initial status and copies actual text', async () => {
    const write = vi.fn().mockResolvedValue(undefined);
    clipboard(write);
    const { result } = renderHook(() => useCopyToClipboard(), {
      wrapper: StrictMode,
    });
    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isCopying).toBe(false);
    await act(async () => {
      expect(await result.current.copy('hello')).toBe(true);
    });
    expect(write).toHaveBeenCalledWith('hello');
    expect(result.current.copied).toBe(true);
  });

  it('reports permission rejection instead of pretending success', async () => {
    clipboard(
      vi.fn().mockRejectedValue(new DOMException('Denied', 'NotAllowedError')),
    );
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      expect(await result.current.copy('hello')).toBe(false);
    });
    expect(result.current.copied).toBe(false);
    expect(result.current.error).toContain('Allow clipboard access');
    expect(result.current.isCopying).toBe(false);
  });

  it('reports unsupported environments', async () => {
    vi.stubGlobal('navigator', {});
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      expect(await result.current.copy('hello')).toBe(false);
    });
    expect(result.current.error).toContain('HTTPS');
  });

  it('clears a previous success when a new request fails', async () => {
    const write = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('Denied'));
    clipboard(write);
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy('first');
    });
    expect(result.current.copied).toBe(true);
    await act(async () => {
      await result.current.copy('second');
    });
    expect(result.current.copied).toBe(false);
    expect(result.current.error).not.toBeNull();
  });

  it('ignores completion from an older concurrent request', async () => {
    let finish!: () => void;
    const first = new Promise<void>((resolve) => {
      finish = resolve;
    });
    clipboard(
      vi
        .fn()
        .mockReturnValueOnce(first)
        .mockRejectedValueOnce(new Error('Denied')),
    );
    const { result } = renderHook(() => useCopyToClipboard());
    let pending!: Promise<boolean>;
    act(() => {
      pending = result.current.copy('first');
    });
    expect(result.current.isCopying).toBe(true);
    await act(async () => {
      await result.current.copy('second');
    });
    await act(async () => {
      finish();
      await pending;
    });
    expect(result.current.copied).toBe(false);
    expect(result.current.error).not.toBeNull();
  });

  it('ignores pending results and retained actions after unmount', async () => {
    let finish!: () => void;
    const write = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    clipboard(write);
    const { result, unmount } = renderHook(() => useCopyToClipboard());
    const copy = result.current.copy;
    let pending!: Promise<boolean>;
    act(() => {
      pending = copy('hello');
    });
    const lastState = result.current;
    unmount();
    await act(async () => {
      finish();
      await pending;
    });
    expect(result.current).toBe(lastState);
    expect(await copy('later')).toBe(false);
    expect(write).toHaveBeenCalledOnce();
  });
});
