import { useEffect, useState, type ComponentProps } from 'react';
import { Button, StatusIcon } from '../src/index';

type Props = ComponentProps<typeof StatusIcon> & { motion: string; onMotionChange: (motion: string) => void };

export function StatusIconExample({ motion, onMotionChange, ...icon }: Props) {
  const [reduced, setReduced] = useState(false);
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const noun = icon.kind === 'payment' ? 'Payment' : icon.kind === 'loading' ? 'Operation' : 'Message';
  const labels = { idle: `${noun} ready`, pending: `${noun} in progress`, success: `${noun} complete`, error: `${noun} failed` };
  const still = motion !== 'full' && reduced;
  const colour = icon.state === 'pending' ? 'var(--dp-orange-text)' : icon.state === 'success' ? 'var(--dp-success)' : icon.state === 'error' ? 'var(--dp-error)' : 'var(--dp-text)';
  return <section aria-label="Status icon example" style={{ maxWidth: 460 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, minHeight: 80, padding: 20, background: 'var(--dp-surface)', borderRadius: 2 }}>
      <span style={{ color: colour, display: 'flex', alignItems: 'center' }}><StatusIcon key={`${icon.state}-${replay}`} {...icon} /></span>
      <span style={{ fontSize: 16, fontWeight: 600 }}>{labels[icon.state]}</span>
    </div>
    <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--dp-muted)' }}>
      {icon.state === 'idle' ? 'Idle is intentionally still. The action has not started.' : icon.state === 'pending' ? 'Pending continues until the operation resolves. The icon and text identify the state even without animation.' : 'The result is shown once the operation finishes. The animation plays once.'}
    </p>
    {icon.state !== 'idle' && <>
      <p style={{ fontSize: 13, color: 'var(--dp-muted)' }}>
        {still ? 'Reduced motion is enabled on your system. This preview is still.' : motion === 'full' ? 'Animation preview is enabled. This is a Storybook-only override.' : 'Animation follows your system preference.'}
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={() => onMotionChange(motion === 'full' ? 'system' : 'full')}>{motion === 'full' ? 'Use system preference' : 'Preview animation'}</Button>
        {(icon.state === 'success' || icon.state === 'error') && <Button variant="quiet" onClick={() => setReplay(replay + 1)}>Replay</Button>}
      </div>
    </>}
  </section>;
}
