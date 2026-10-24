import { useId, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { Calendar, CalendarRange, parseISODate, type CalendarProps, type DateRangeValue } from './calendar';
export type { DateRangeValue } from './calendar';

const s = stylex.create({ field: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }, label: { fontSize: 14, fontWeight: 600, color: 'var(--dp-text)' }, trigger: { width: '100%', minHeight: 48, padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, backgroundColor: 'var(--dp-field)', color: 'var(--dp-text)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-border)', borderRadius: 'var(--dp-radius-control)', fontFamily: 'inherit', fontSize: 16, textAlign: 'left', cursor: 'pointer' }, invalid: { borderColor: 'var(--dp-error)' }, disabled: { opacity: 0.5, cursor: 'not-allowed' }, popup: { maxHeight:'var(--available-height)', overflowY:'auto', width: 'min(320px, calc(100vw - 24px))', padding: 16, backgroundColor: 'var(--dp-raised)', color: 'var(--dp-text)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-divider)', borderRadius: 'var(--dp-radius-popup)', boxShadow: 'var(--dp-shadow-popup)', zIndex: 80 }, positioner: { zIndex: 80 }, help: { margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--dp-muted)' }, error: { color: 'var(--dp-error)' }, clear: { marginTop:12, minHeight: 44, padding: '8px 12px', backgroundColor: 'transparent', color: 'var(--dp-text)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-border)', borderRadius: 'var(--dp-radius-control)', fontFamily: 'inherit', cursor: 'pointer' } });

type PickerMessages = { description?: string; error?: string; name?: string; placeholder?: string; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; id?: string };
export type DatePickerProps = CalendarProps & PickerMessages;
export type DateRangePickerProps = Omit<CalendarProps, 'value' | 'onValueChange'> & Omit<PickerMessages, 'name'> & { value: DateRangeValue; onValueChange: (value: DateRangeValue) => void; startName?: string; endName?: string };
function display(value: string | null, placeholder: string) { return value === null ? placeholder : new Intl.DateTimeFormat('en-GB', { day:'numeric', month:'short', year:'numeric', timeZone:'UTC' }).format(parseISODate(value)); }
function rangeDisplay(value: DateRangeValue, placeholder: string) {
  parseISODate(value.from); parseISODate(value.to);
  if (!value.from) return placeholder;
  const from = display(value.from, placeholder);
  if (!value.to) return `${from} — choose an end date`;
  const to = display(value.to, placeholder);
  return value.from.slice(0,7) === value.to.slice(0,7) ? `${Number(value.from.slice(8))}–${to}` : `${from} – ${to}`;
}
function useOpen(open: boolean | undefined, defaultOpen: boolean | undefined, onOpenChange: ((open: boolean) => void) | undefined) { const [internal, setInternal] = useState(defaultOpen ?? false); const value = open ?? internal; return [value, (next: boolean) => { if (open === undefined) setInternal(next); onOpenChange?.(next); }] as const; }
export function DatePicker({ label, value, onValueChange, description, error, name, placeholder = 'Choose a date', open, defaultOpen, onOpenChange, id: suppliedId, disabled, ...calendar }: DatePickerProps) {
  const generatedId = useId(); const id = suppliedId ?? generatedId;
  const popupRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useOpen(open, defaultOpen, onOpenChange);
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const dateText = display(value, placeholder);
  return <div {...stylex.props(s.field)}>
    <label id={`${id}-label`} htmlFor={id} {...stylex.props(s.label)}>{label}</label>
    <BasePopover.Root open={isOpen} onOpenChange={setOpen}>
      <BasePopover.Trigger render={<button id={id} type="button" disabled={disabled} {...stylex.props(s.trigger, !!error && s.invalid, disabled && s.disabled)} aria-labelledby={`${id}-label ${id}-value`} aria-invalid={error ? true : undefined} aria-describedby={describedBy} aria-errormessage={errorId} />}>
        <span id={`${id}-value`}>{dateText}</span><CalendarIcon />
      </BasePopover.Trigger>
      <BasePopover.Portal><BasePopover.Positioner sideOffset={6} align="start" {...stylex.props(s.positioner)}>
        <BasePopover.Popup ref={popupRef} initialFocus={() => popupRef.current?.querySelector<HTMLElement>('.rdp-day_button[tabindex="0"]') ?? true} role="dialog" aria-label={`${label} calendar`} {...stylex.props(s.popup)}>
          <Calendar {...calendar} label={label} value={value} disabled={disabled} onValueChange={next => { onValueChange(next); setOpen(false); }} />
          <button type="button" disabled={disabled || !value} onClick={() => onValueChange(null)} {...stylex.props(s.clear, disabled && s.disabled)}>Clear date</button>
        </BasePopover.Popup>
      </BasePopover.Positioner></BasePopover.Portal>
    </BasePopover.Root>
    {name && value && <input type="hidden" name={name} value={value} disabled={disabled} />}
    {description && <p id={descriptionId} {...stylex.props(s.help)}>{description}</p>}
    {error && <p id={errorId} role="alert" {...stylex.props(s.help, s.error)}>{error}</p>}
  </div>;
}

export function DateRangePicker({ label, value, onValueChange, description, error, startName, endName, placeholder = 'Choose dates', open, defaultOpen, onOpenChange, id: suppliedId, disabled, ...calendar }: DateRangePickerProps) {
  const generatedId = useId(); const id = suppliedId ?? generatedId;
  const popupRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useOpen(open, defaultOpen, onOpenChange);
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  if (value.to && (!value.from || value.to < value.from)) throw new RangeError('A range end must follow its start');
  const dateText = rangeDisplay(value, placeholder);
  return <div {...stylex.props(s.field)}>
    <label id={`${id}-label`} htmlFor={id} {...stylex.props(s.label)}>{label}</label>
    <BasePopover.Root open={isOpen} onOpenChange={setOpen}>
      <BasePopover.Trigger render={<button id={id} type="button" disabled={disabled} {...stylex.props(s.trigger, !!error && s.invalid, disabled && s.disabled)} aria-labelledby={`${id}-label ${id}-value`} aria-invalid={error ? true : undefined} aria-describedby={describedBy} aria-errormessage={errorId} />}>
        <span id={`${id}-value`}>{dateText}</span><CalendarIcon />
      </BasePopover.Trigger>
      <BasePopover.Portal><BasePopover.Positioner sideOffset={6} align="start" {...stylex.props(s.positioner)}>
        <BasePopover.Popup ref={popupRef} initialFocus={() => popupRef.current?.querySelector<HTMLElement>('.rdp-day_button[tabindex="0"]') ?? true} role="dialog" aria-label={`${label} calendar`} {...stylex.props(s.popup)}>
          <CalendarRange {...calendar} label={label} value={value} disabled={disabled} onValueChange={next => { onValueChange(next); if (next.from && next.to) setOpen(false); }} />
          <p role="status" {...stylex.props(s.help)}>{value.from && !value.to ? 'Choose an end date to complete the range.' : 'Choose a start date, then an end date.'}</p>
          <button type="button" disabled={disabled || !value.from} onClick={() => onValueChange({ from: null, to: null })} {...stylex.props(s.clear, disabled && s.disabled)}>Clear dates</button>
        </BasePopover.Popup>
      </BasePopover.Positioner></BasePopover.Portal>
    </BasePopover.Root>
    {startName && value.from && <input type="hidden" name={startName} value={value.from} disabled={disabled} />}
    {endName && value.to && <input type="hidden" name={endName} value={value.to} disabled={disabled} />}
    {description && <p id={descriptionId} {...stylex.props(s.help)}>{description}</p>}
    {error && <p id={errorId} role="alert" {...stylex.props(s.help, s.error)}>{error}</p>}
  </div>;
}

function CalendarIcon() {
  return <svg aria-hidden="true" width="18" height="18" style={{flexShrink:0}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>;
}
