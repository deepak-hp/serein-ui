import { DayPicker, TZDate, type DateRange } from '@daypicker/react';
import * as stylex from '@stylexjs/stylex';

const s = stylex.create({ field: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }, label: { fontSize: 14, fontWeight: 600, color: 'var(--dp-text)' } });

export type CalendarProps = { label: string; value: string | null; onValueChange: (value: string | null) => void; defaultMonth?: string; min?: string; max?: string; disabledDates?: string[]; disabled?: boolean; today?: string; autoFocus?: boolean };
export type CalendarRangeProps = Omit<CalendarProps, 'value' | 'onValueChange'> & { value: DateRangeValue; onValueChange: (value: DateRangeValue) => void };
export type DateRangeValue = { from: string | null; to: string | null };

export function parseISODate(value: string | null | undefined) {
  if (value === null || value === undefined) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError(`Invalid ISO date: ${value}`);
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1) throw new RangeError(`Invalid ISO date: ${value}`);
  const date = new TZDate(year, month - 1, day, 'UTC');
  if (year < 100) date.setUTCFullYear(year);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new RangeError(`Invalid ISO date: ${value}`);
  return date;
}
export function formatISODate(date: Date | undefined) {
  if (!date) return null;
  return `${date.getUTCFullYear().toString().padStart(4, '0')}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
}
function bounds(props: Pick<CalendarProps, 'min' | 'max' | 'disabledDates'>) {
  const min = parseISODate(props.min); const max = parseISODate(props.max);
  if (min && max && min > max) throw new RangeError('min must not be later than max');
  return [...(min ? [{ before: min }] : []), ...(max ? [{ after: max }] : []), ...(props.disabledDates ?? []).map(parseISODate).filter((date): date is TZDate => !!date)];
}
function month(props: Pick<CalendarProps, 'value' | 'defaultMonth' | 'today'>) { return parseISODate(props.value) ?? parseISODate(props.defaultMonth) ?? parseISODate(props.today) ?? new TZDate(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1, 'UTC'); }
function validateRange(value: DateRangeValue) { const from = parseISODate(value.from); const to = parseISODate(value.to); if (to && !from) throw new RangeError('A range end requires a range start'); if (from && to && from > to) throw new RangeError('A range end must not be before its start'); return { from, to }; }
export function Calendar({ label, value, onValueChange, defaultMonth, min, max, disabledDates, disabled, today, autoFocus = false }: CalendarProps) {
  const selected = parseISODate(value);
  return <div {...stylex.props(s.field)}><span {...stylex.props(s.label)}>{label}</span><DayPicker mode="single" selected={selected} onSelect={day => onValueChange(formatISODate(day))} defaultMonth={month({ value, defaultMonth, today })} startMonth={parseISODate(min)} endMonth={parseISODate(max)} disabled={disabled || bounds({ min, max, disabledDates })} today={parseISODate(today)} timeZone="UTC" autoFocus={autoFocus} aria-label={label} className="dp-calendar" /></div>;
}
export function CalendarRange({ label, value, onValueChange, defaultMonth, min, max, disabledDates, disabled, today, autoFocus = false }: CalendarRangeProps) {
  const validated = validateRange(value); const selected: DateRange | undefined = validated.from ? { from: validated.from, to: validated.to } : undefined;
  return <div {...stylex.props(s.field)}><span {...stylex.props(s.label)}>{label}</span><DayPicker mode="range" selected={selected} onSelect={(range, triggerDate) => { const from = formatISODate(range?.from); const to = formatISODate(range?.to); if (!value.from || value.to) onValueChange({ from: formatISODate(triggerDate), to: null }); else onValueChange({ from, to }); }} excludeDisabled defaultMonth={validated.from ?? parseISODate(defaultMonth) ?? parseISODate(today) ?? new TZDate(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1, 'UTC')} startMonth={parseISODate(min)} endMonth={parseISODate(max)} disabled={disabled || bounds({ min, max, disabledDates })} today={parseISODate(today)} timeZone="UTC" autoFocus={autoFocus} aria-label={label} className="dp-calendar" /></div>;
}
