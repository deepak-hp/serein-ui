import { useEffect, useId, useState, type ComponentProps, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { Button } from './components';

const spin = stylex.keyframes({ from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } });
const pulse = stylex.keyframes({ '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.55 } });
const s = stylex.create({
  badge: { whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', borderWidth: 0, borderStyle: 'solid', borderRadius: 'var(--dp-radius-small)', fontSize: 12, fontWeight: 600, lineHeight: 1.5 },
  badgeNeutral: { color: 'var(--dp-text)', backgroundColor: 'var(--dp-surface)' },
  badgeSuccess: { color: 'var(--dp-success)', backgroundColor: 'var(--dp-success-surface)' },
  badgeError: { color: 'var(--dp-error)', backgroundColor: 'var(--dp-error-surface)' },
  badgeWarning: { color: 'var(--dp-warning)', backgroundColor: 'var(--dp-warning-surface)' },
  neutral: { color: 'var(--dp-text)' },
  success: { color: 'var(--dp-success)' },
  error: { color: 'var(--dp-error)' },
  warning: { color: 'var(--dp-warning)' },
  panel: { padding: 20, borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-divider)', borderRadius: 'var(--dp-radius-panel)', color: 'var(--dp-text)', backgroundColor: 'var(--dp-raised)', boxShadow: 'var(--dp-shadow-surface)', minWidth: 0, overflowWrap: 'anywhere' },
  alert: { display: 'flex', gap: 12, alignItems: 'flex-start', backgroundColor: 'var(--dp-surface)' },
  title: { margin: '0 0 6px', fontSize: 16, fontWeight: 650, lineHeight: 1.4 },
  body: { fontSize: 14, lineHeight: 1.7, color: 'var(--dp-muted)', margin: 0 },
  avatar: { width: 40, height: 40, borderRadius: '50%', display: 'inline-grid', placeItems: 'center', flexShrink: 0, overflow: 'hidden', backgroundColor: 'var(--dp-selected)', color: 'var(--dp-text)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-border)', fontSize: 14, fontWeight: 650 },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  separator: { margin: '20px 0', borderWidth: 0, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--dp-divider)' },
  skeleton: { display: 'block', borderRadius: 'var(--dp-radius-small)', backgroundColor: 'var(--dp-divider)', height: 16, animationName: { default: pulse, '@media (prefers-reduced-motion: reduce)': 'none' }, animationDuration: '1.6s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out' },
  sr: { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap', borderWidth: 0 },
  progressField: { display: 'grid', gap: 8, minWidth: 0 },
  progressLabels: { display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14, lineHeight: 1.5, color: 'var(--dp-text)' },
  progress: { width: '100%', height: 12, accentColor: 'var(--dp-orange-text)' },
  spinner: { width: 20, height: 20, display: 'inline-block', flexShrink: 0, color: 'var(--dp-orange-text)', animationName: { default: spin, '@media (prefers-reduced-motion: reduce)': 'none' }, animationDuration: '900ms', animationIterationCount: 'infinite', animationTimingFunction: 'linear' },
  status: { display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--dp-text)', fontSize: 14 },
  empty: { padding: '40px 24px', textAlign: 'center', maxWidth: 560, marginInline: 'auto' },
  action: { marginTop: 20 },
  viewport: { position: 'fixed', bottom: 20, right: 20, width: 'min(380px, calc(100vw - 40px))', maxHeight: 'calc(100dvh - 40px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, zIndex: 120 },
  toast: { position: 'relative', flexShrink: 0, boxShadow: 'var(--dp-shadow-popup)' },
  toastHidden: { display: 'none' },
  toastActions: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 },
});

export type FeedbackTone = 'neutral' | 'success' | 'error' | 'warning';
export type BadgeProps = { children: ReactNode; tone?: FeedbackTone };
const badgeTones = { neutral: s.badgeNeutral, success: s.badgeSuccess, error: s.badgeError, warning: s.badgeWarning };
export function Badge({ children, tone = 'neutral' }: BadgeProps) { return <span {...stylex.props(s.badge, badgeTones[tone])}>{children}</span>; }

export type AlertProps = { title: string; children?: ReactNode; tone?: FeedbackTone; live?: 'off' | 'polite' | 'assertive' };
export function Alert({ title, children, tone = 'neutral', live = 'off' }: AlertProps) {
  return <div role={live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : 'note'} {...stylex.props(s.panel, s.alert)}>
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ flexShrink: 0, marginTop: 2 }} {...stylex.props(s[tone])}><circle cx="12" cy="12" r="9" /><path d={tone === 'success' ? 'm7 12 3 3 7-7' : 'M12 7v6M12 16v1'} /></svg>
    <div><p {...stylex.props(s.title)}>{title}</p>{children && <div {...stylex.props(s.body)}>{children}</div>}</div>
  </div>;
}

export type AvatarProps = { name: string; src?: string; size?: number };
export function Avatar({ name, src, size = 40 }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => [...part][0]).join('').toLocaleUpperCase();
  return <span {...stylex.props(s.avatar)} style={{ width: size, height: size }} role={!src || failed ? 'img' : undefined} aria-label={!src || failed ? name : undefined}>
    {src && !failed ? <img src={src} alt={name} onError={() => setFailed(true)} {...stylex.props(s.image)} /> : <span aria-hidden="true">{initials}</span>}
  </span>;
}

export type CardProps = ComponentProps<'div'>;
/** Noninteractive surface; compose links or buttons inside instead of nesting interactive cards. */
export function Card({ className = '', ...props }: CardProps) { return <div {...props} className={`${stylex.props(s.panel).className} ${className}`} />; }
export type SeparatorProps = ComponentProps<'hr'>;
export function Separator({ className = '', ...props }: SeparatorProps) { return <hr {...props} className={`${stylex.props(s.separator).className} ${className}`} />; }

export type SkeletonProps = { width?: number | string; height?: number; label?: string };
export function Skeleton({ width = '100%', height = 16, label }: SkeletonProps) {
  return <><span aria-hidden="true" {...stylex.props(s.skeleton)} style={{ width, height }} />{label && <span {...stylex.props(s.sr)}>{label}</span>}</>;
}

export type ProgressProps = { label: string; value?: number; max?: number };
export function Progress({ label, value, max = 100 }: ProgressProps) {
  const id = useId();
  const bound = Number.isFinite(max) && max > 0 ? max : 100;
  const bounded = value === undefined || !Number.isFinite(value) ? undefined : Math.min(bound, Math.max(0, value));
  return <div {...stylex.props(s.progressField)}><div {...stylex.props(s.progressLabels)}><label htmlFor={id}>{label}</label><span aria-hidden="true">{bounded === undefined ? 'In progress' : `${Math.round(bounded / bound * 100)}%`}</span></div><progress id={id} max={bound} value={bounded} {...stylex.props(s.progress)} /></div>;
}
export type SpinnerProps = { label: string };
export function Spinner({ label }: SpinnerProps) {
  return <span role="status" {...stylex.props(s.status)}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...stylex.props(s.spinner)}><path d="M12 3a9 9 0 1 1-9 9" strokeLinecap="round" /></svg><span>{label}</span></span>;
}
export type EmptyStateProps = { title: string; description: string; action?: ReactNode };
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return <div {...stylex.props(s.empty)}><p {...stylex.props(s.title)}>{title}</p><p {...stylex.props(s.body)}>{description}</p>{action && <div {...stylex.props(s.action)}>{action}</div>}</div>;
}

export type ToastOptions = { title: string; description?: string; tone?: FeedbackTone; timeout?: number; priority?: 'low' | 'high' };
export type ToastController = { add: (options: ToastOptions) => string; dismiss: (id?: string) => void; update: (id: string, options: Partial<ToastOptions>) => void };
/** Must be called beneath ToastProvider. Use timeout:0 for messages that require user acknowledgement. */
export function useToast(): ToastController {
  const manager = BaseToast.useToastManager();
  return { add: ({ tone, ...options }) => manager.add({ ...options, type: tone }), dismiss: manager.close, update: (id, { tone, ...options }) => manager.update(id, { ...options, ...(tone === undefined ? {} : { type: tone }) }) };
}
function ToastViewport() {
  const { toasts } = BaseToast.useToastManager();
  return <BaseToast.Portal><BaseToast.Viewport aria-label="Notifications" {...stylex.props(s.viewport)}>{toasts.map(toast => <BaseToast.Root key={toast.id} toast={toast} className={state => stylex.props(s.panel, s.toast, (state.limited || state.transitionStatus === 'ending') && s.toastHidden).className}>
    <BaseToast.Content><BaseToast.Title {...stylex.props(s.title, s[(toast.type as FeedbackTone) || 'neutral'])} />{toast.description && <BaseToast.Description {...stylex.props(s.body)} />}
      <div {...stylex.props(s.toastActions)}><BaseToast.Close aria-hidden={false} aria-label="Dismiss notification" render={<Button variant="quiet" />}>Dismiss</BaseToast.Close></div>
    </BaseToast.Content>
  </BaseToast.Root>)}</BaseToast.Viewport></BaseToast.Portal>;
}
export type ToastProviderProps = { children: ReactNode; timeout?: number; limit?: number };
export function ToastProvider({ children, timeout = 5000, limit = 3 }: ToastProviderProps) {
  return <BaseToast.Provider timeout={timeout} limit={limit}>{children}<ToastViewport /></BaseToast.Provider>;
}
