import { useId, useMemo } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';

const s = stylex.create({
  field: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
  label: { fontSize: 14, fontWeight: 600, color: 'var(--dp-text)' },
  inputGroup: { width: '100%', minHeight: 48, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, padding: 4, backgroundColor: 'var(--dp-field)', color: 'var(--dp-text)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-border)', borderRadius: 'var(--dp-radius-control)' },
  invalid: { borderColor: 'var(--dp-error)' },
  disabled: { opacity: 0.5, cursor: 'not-allowed' },
  chips: { width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, minWidth: 0 },
  chip: { minHeight: 44, maxWidth: '100%', display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 10, backgroundColor: 'var(--dp-selected)', color: 'var(--dp-text)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-divider)', borderRadius: 'var(--dp-radius-small)', fontSize: 14, overflow: 'hidden' },
  chipLabel: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  remove: { width: 44, minWidth: 44, minHeight: 44, padding: 0, display: 'grid', placeItems: 'center', flexShrink: 0, backgroundColor: 'transparent', color: 'inherit', borderWidth: 0, fontFamily: 'inherit', cursor: 'pointer', ':focus-visible': { outline: '2px solid var(--dp-focus)', outlineOffset: -3 } },
  input: { minWidth: 0, maxWidth: '100%', flexGrow: 1, flexBasis: 120, minHeight: 40, padding: '6px 8px', backgroundColor: 'transparent', color: 'var(--dp-text)', borderWidth: 0, fontFamily: 'inherit', fontSize: 16, lineHeight: 1.5, outline: 'none' },
  popup: { minWidth: 'var(--anchor-width)', maxWidth: 'var(--available-width)', maxHeight: 'min(320px, var(--available-height))', overflowY: 'auto', padding: 6, backgroundColor: 'var(--dp-raised)', color: 'var(--dp-text)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-divider)', borderRadius: 'var(--dp-radius-popup)', boxShadow: 'var(--dp-shadow-popup)', zIndex: 80 },
  positioner: { zIndex: 80 },
  option: { minHeight: 44, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 'var(--dp-radius-small)', fontSize: 14, cursor: 'default', outline: 'none', overflowWrap: 'anywhere' },
  highlighted: { backgroundColor: 'var(--dp-selected)' },
  selected: { fontWeight: 650 },
  optionDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  indicator: { marginLeft: 'auto', flexShrink: 0, color: 'var(--dp-orange-text)' },
  empty: { padding: '12px', fontSize: 14, color: 'var(--dp-muted)' },
  help: { margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--dp-muted)' },
  error: { color: 'var(--dp-error)' },
});

export type MultiSelectOption = { value: string; label: string; disabled?: boolean };
export type MultiSelectProps = {
  label: string;
  value: string[];
  onValueChange: (value: string[]) => void;
  options: MultiSelectOption[];
  description?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  placeholder?: string;
  emptyMessage?: string;
};

function describedBy(descriptionId?: string, errorId?: string) {
  return [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
}

export function MultiSelect({ label, value, onValueChange, options, description, error, disabled, name, id: suppliedId, placeholder = 'Search options', emptyMessage = 'No matching options.' }: MultiSelectProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const items = useMemo(() => BaseCombobox.createItems(options, { getValue: option => option.value, getLabel: option => option.label }), [options]);
  const labels = useMemo(() => new Map(options.map(option => [option.value, option.label])), [options]);

  return <div {...stylex.props(s.field)}>
    <label htmlFor={id} {...stylex.props(s.label)}>{label}</label>
    <BaseCombobox.Root<string, true, MultiSelectOption> id={id} name={name} value={value} multiple disabled={disabled} modal={false} items={items} onValueChange={next => onValueChange([...next])}>
      <BaseCombobox.InputGroup {...stylex.props(s.inputGroup, !!error && s.invalid, disabled && s.disabled)}>
        <BaseCombobox.Value>{(selected: string[]) => <BaseCombobox.Chips aria-label={selected.length ? `Selected ${label}` : undefined} {...stylex.props(s.chips)}>
          {selected.map(item => <BaseCombobox.Chip key={item} aria-label={labels.get(item) ?? item} aria-description="Press Backspace or Delete to remove" {...stylex.props(s.chip)}>
            <span {...stylex.props(s.chipLabel)}>{labels.get(item) ?? item}</span>
            <BaseCombobox.ChipRemove type="button" disabled={disabled} aria-label={`Remove ${labels.get(item) ?? item}`} {...stylex.props(s.remove, disabled && s.disabled)}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 6 12 12M18 6 6 18" /></svg></BaseCombobox.ChipRemove>
          </BaseCombobox.Chip>)}
          <BaseCombobox.Input aria-label={label} aria-description={selected.length ? `${selected.length} selected. Use Left Arrow to reach selected items.` : undefined} placeholder={placeholder} disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={describedBy(descriptionId, errorId)} aria-errormessage={errorId} {...stylex.props(s.input)} />
        </BaseCombobox.Chips>}</BaseCombobox.Value>
      </BaseCombobox.InputGroup>
      <BaseCombobox.Portal><BaseCombobox.Positioner sideOffset={6} {...stylex.props(s.positioner)}><BaseCombobox.Popup {...stylex.props(s.popup)}><BaseCombobox.List aria-label={label}>
        {(option: MultiSelectOption) => <BaseCombobox.Item key={option.value} value={option.value} disabled={option.disabled} className={state => stylex.props(s.option, state.highlighted && s.highlighted, state.selected && s.selected, state.disabled && s.optionDisabled).className}>{option.label}<BaseCombobox.ItemIndicator><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...stylex.props(s.indicator)}><path d="m5 12 4 4L19 6" /></svg></BaseCombobox.ItemIndicator></BaseCombobox.Item>}
      </BaseCombobox.List><BaseCombobox.Empty {...stylex.props(s.empty)}>{emptyMessage}</BaseCombobox.Empty></BaseCombobox.Popup></BaseCombobox.Positioner></BaseCombobox.Portal>
    </BaseCombobox.Root>
    {description && <p id={descriptionId} {...stylex.props(s.help)}>{description}</p>}
    {error && <p id={errorId} role="alert" {...stylex.props(s.help, s.error)}>{error}</p>}
  </div>;
}
