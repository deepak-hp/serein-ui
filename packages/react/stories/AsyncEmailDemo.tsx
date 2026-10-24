import { useCallback } from 'react';
import { Button, StatusIcon, useAsyncAction } from '../src/index';

/** Demonstrates state-driven status feedback. No message is sent. */
export function AsyncEmailDemo({ delayMs = 1800 }: { delayMs?: number }) {
  const action = useCallback((signal: AbortSignal) => new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, delayMs);
    signal.addEventListener('abort', () => { window.clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); }, { once: true });
  }), [delayMs]);
  const { state, run, cancel, reset } = useAsyncAction(action);
  const copy = state === 'pending' ? 'Sending your email…' : state === 'success' ? 'Email queued locally.' : state === 'error' ? 'The email simulation failed.' : 'Ready to send a test email.';
  return <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
    <StatusIcon kind="send" state={state} />
    <span aria-live="polite">{copy}</span>
    <Button loading={state === 'pending'} onClick={run}>Send test email</Button>
    {state === 'pending' ? <Button variant="secondary" onClick={cancel}>Cancel</Button> : <Button variant="quiet" onClick={reset}>Reset</Button>}
  </div>;
}
