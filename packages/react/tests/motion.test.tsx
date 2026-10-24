import { act, render, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StatusIcon } from '../src/StatusIcon';
import { useAsyncAction } from '../src/useAsyncAction';

function deferred() {
  let resolve!: () => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, reject, resolve };
}

describe('StatusIcon', () => {
  it('keeps idle and pending send glyphs visually distinct without animation', () => {
    const { container, rerender } = render(<StatusIcon state="idle" kind="send" />);
    const idle = container.querySelector('svg')!.innerHTML;
    rerender(<StatusIcon state="pending" kind="send" />);
    expect(container.querySelector('svg')!.innerHTML).not.toBe(idle);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('renders a decorative state and kind-specific SVG icon', () => {
    const { container } = render(<StatusIcon state="pending" kind="payment" size={20} />);
    const icon = container.querySelector('svg');

    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('width', '20');
    expect(icon).toHaveClass('dp-status-icon', 'dp-status-icon--pending', 'dp-status-icon--payment');
    expect(icon?.querySelector('rect')).not.toBeNull();
  });

  it('renders a partial-circle loader for generic pending work', () => {
    const { container } = render(<StatusIcon state="pending" kind="loading" />);
    const icon = container.querySelector('svg');

    expect(icon).toHaveClass('dp-status-icon--loading');
    expect(icon?.querySelector('circle')).not.toBeNull();
    expect(icon?.querySelector('path')).not.toBeNull();
  });
});

describe('useAsyncAction', () => {
  it('moves from idle to pending to success once its action resolves', async () => {
    const work = deferred();
    const action = vi.fn(() => work.promise);
    const { result } = renderHook(() => useAsyncAction(action));

    expect(result.current.state).toBe('idle');
    act(() => result.current.run());
    expect(result.current.state).toBe('pending');

    await act(async () => work.resolve());
    expect(result.current.state).toBe('success');
  });

  it('does not start another action while one is pending', () => {
    const work = deferred();
    const action = vi.fn(() => work.promise);
    const { result } = renderHook(() => useAsyncAction(action));

    act(() => {
      result.current.run();
      result.current.run();
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(result.current.state).toBe('pending');
  });

  it('moves to error when its action rejects', async () => {
    const work = deferred();
    const { result } = renderHook(() => useAsyncAction(() => work.promise));

    act(() => result.current.run());
    await act(async () => work.reject(new Error('payment declined')));

    expect(result.current.state).toBe('error');
  });

  it('moves to error when its action throws before returning a promise', () => {
    const { result } = renderHook(() => useAsyncAction(() => {
      throw new Error('connection unavailable');
    }));

    act(() => result.current.run());

    expect(result.current.state).toBe('error');
  });

  it('aborts cancellation and ignores the cancelled action resolving later', async () => {
    const work = deferred();
    let signal!: AbortSignal;
    const { result } = renderHook(() => useAsyncAction((nextSignal) => {
      signal = nextSignal;
      return work.promise;
    }));

    act(() => result.current.run());
    act(() => result.current.cancel());
    expect(signal.aborted).toBe(true);
    expect(result.current.state).toBe('idle');

    await act(async () => work.resolve());
    expect(result.current.state).toBe('idle');
  });

  it('aborts a pending action when unmounted and ignores its late resolution', async () => {
    const work = deferred();
    let signal!: AbortSignal;
    const { result, unmount } = renderHook(() => useAsyncAction((nextSignal) => {
      signal = nextSignal;
      return work.promise;
    }));

    act(() => result.current.run());
    unmount();
    expect(signal.aborted).toBe(true);

    await act(async () => work.resolve());
  });
});
