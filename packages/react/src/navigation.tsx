import type { ComponentProps, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Button, type ButtonProps } from './components';

const s = stylex.create({
  link: { color: 'var(--sr-color-signal-ink)', textDecoration: 'underline', textUnderlineOffset: 3, lineHeight: 1.6, ':hover': { textDecorationThickness: 2 } },
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontSize:13, lineHeight:'18px' },
  crumb: { display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 32, overflowWrap: 'anywhere' },
  current: { color: 'var(--sr-color-ink)', fontWeight: 500 },
  muted: { color: 'var(--sr-color-ink-muted)' },
  // Ancestor crumbs are quiet; one strip should not carry several signal-coloured links.
  crumbLink: { color: { default: 'var(--sr-color-ink-muted)', ':hover': 'var(--sr-color-ink)' }, textDecoration: 'underline', textDecorationColor: 'var(--sr-color-line-strong)', textUnderlineOffset: 3 },
  pages: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  page: { padding: 10, minWidth: 44, minHeight: 44 },
  // "You are here": an ink key, the same mark as a checked selection.
  // Styled in full (not layered on a Button variant) so no two atomic classes compete for the fill.
  selected: { minWidth: 44, minHeight: 44, padding: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--sr-color-ink)', color: 'var(--sr-color-surface-raised)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--sr-color-ink)', borderRadius: 'var(--sr-radius-control)', fontFamily: 'inherit', fontSize: 15, lineHeight: '20px', fontWeight: 600, cursor: 'default', ':disabled': { opacity: 0.5 }, ':focus-visible': { outline: '2px solid var(--sr-color-focus)', outlineOffset: 'var(--sr-size-focus-offset)' } },
  icon: { width: 48, height: 48, padding: 12, flexShrink: 0 },
  iconContent: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
});

export type LinkProps = ComponentProps<'a'> & { href: string };
/** Uses a native anchor so routing, modifier clicks and downloads retain browser behaviour. */
export function Link({ className = '', target, rel, ...props }: LinkProps) {
  return <a {...props} target={target} rel={target === '_blank' ? `${rel ?? ''} noopener noreferrer`.trim() : rel} className={`${stylex.props(s.link).className} ${className}`} />;
}

export type IconButtonProps = Omit<ButtonProps, 'children' | 'aria-label' | 'aria-labelledby'> & { label: string; children: ReactNode };
export function IconButton({ label, children, className = '', variant = 'quiet', ...props }: IconButtonProps) {
  return <Button {...props} variant={variant} aria-label={label} className={`${stylex.props(s.icon).className} ${className}`}><span aria-hidden="true" {...stylex.props(s.iconContent)}>{children}</span></Button>;
}

export type BreadcrumbsProps = { label?: string; items: { label: string; href?: string }[] };
export function Breadcrumbs({ label = 'Breadcrumbs', items }: BreadcrumbsProps) {
  return <nav aria-label={label}><ol {...stylex.props(s.list)}>{items.map((item, index) => <li key={`${index}-${item.label}`} {...stylex.props(s.crumb)}>
    {index > 0 && <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...stylex.props(s.muted)}><path d="m9 5 7 7-7 7" /></svg>}
    {index === items.length - 1 ? <span aria-current="page" {...stylex.props(s.current)}>{item.label}</span> : item.href ? <a href={item.href} {...stylex.props(s.crumbLink)}>{item.label}</a> : <span {...stylex.props(s.muted)}>{item.label}</span>}
  </li>)}</ol></nav>;
}

export type PaginationProps = { page: number; pageCount: number; onPageChange: (page: number) => void; label?: string; disabled?: boolean };
export function Pagination({ page, pageCount, onPageChange, label = 'Pagination', disabled = false }: PaginationProps) {
  const count = Number.isFinite(pageCount) ? Math.max(1, Math.trunc(pageCount)) : 1;
  const current = Number.isFinite(page) ? Math.min(count, Math.max(1, Math.trunc(page))) : 1;
  const pages = [...new Set([1, current - 1, current, current + 1, count].filter(value => value >= 1 && value <= count))].sort((a, b) => a - b);
  return <nav aria-label={label} {...stylex.props(s.pages)}>
    <Button variant="secondary" disabled={disabled || current === 1} aria-label="Previous page" onClick={() => onPageChange(current - 1)}>Previous</Button>
    {pages.map((number, index) => <span key={number} {...stylex.props(s.pages)}>
      {index > 0 && number - pages[index - 1] > 1 && <span aria-hidden="true" {...stylex.props(s.muted)}>…</span>}
      {number === current
        ? <button type="button" disabled={disabled} aria-label={`Page ${number}`} aria-current="page" {...stylex.props(s.selected)}>{number}</button>
        : <Button variant="secondary" disabled={disabled} aria-label={`Page ${number}`} className={stylex.props(s.page).className} onClick={() => onPageChange(number)}>{number}</Button>}
    </span>)}
    <Button variant="secondary" disabled={disabled || current === count} aria-label="Next page" onClick={() => onPageChange(current + 1)}>Next</Button>
  </nav>;
}
