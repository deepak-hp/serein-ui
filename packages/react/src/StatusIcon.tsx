import type { SVGProps } from 'react';

export type AsyncVisualState = 'idle' | 'pending' | 'success' | 'error';
export type StatusIconKind = 'send' | 'payment' | 'loading';

export interface StatusIconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  state: AsyncVisualState;
  kind?: StatusIconKind;
  size?: number;
}

export function StatusIcon({
  state,
  kind = 'send',
  size = 18,
  className,
  ...props
}: StatusIconProps) {
  const classes = ['dp-status-icon', `dp-status-icon--${state}`, `dp-status-icon--${kind}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      aria-hidden="true"
      className={classes}
      fill="none"
      focusable="false"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {kind === 'send' && <SendGlyph state={state} />}
      {kind === 'payment' && <PaymentGlyph state={state} />}
      {kind === 'loading' && <LoadingGlyph state={state} />}
    </svg>
  );
}

function SendGlyph({ state }: Pick<StatusIconProps, 'state'>) {
  if (state === 'success') return <path d="m5 12 4.2 4.2L19 6.5" />;
  if (state === 'error') return <path d="M7 7l10 10M17 7 7 17" />;
  return <>
    <path d="m21 3-6.5 18-4-7.5L3 9.5 21 3Zm0 0L10.5 13.5" />
    {state === 'pending' && <path d="M2.5 15.5h3M4 19h3" />}
  </>;
}

function PaymentGlyph({ state }: Pick<StatusIconProps, 'state'>) {
  if (state === 'success') return <path d="m5 12 4.2 4.2L19 6.5" />;
  if (state === 'error') return <path d="M7 7l10 10M17 7 7 17" />;
  return <>
    <rect x="3.5" y="6" width="17" height="12" rx="2" />
    <path d="M3.5 10h17M7 14h3" />
  </>;
}

function LoadingGlyph({ state }: Pick<StatusIconProps, 'state'>) {
  if (state === 'success') return <path d="m5 12 4.2 4.2L19 6.5" />;
  if (state === 'error') return <path d="M7 7l10 10M17 7 7 17" />;
  return <>
    <circle cx="12" cy="12" r="7.5" opacity=".25" />
    <path d="M12 4.5a7.5 7.5 0 0 1 7.5 7.5" />
  </>;
}
