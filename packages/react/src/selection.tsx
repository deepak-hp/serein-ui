import { useId } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';

const s = stylex.create({
  field: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
  label: { fontSize: 14, fontWeight: 600, color: 'var(--dp-text)' },
  row: { display: 'flex', alignItems: 'center', gap: 12, minHeight: 48, color: 'var(--dp-text)', cursor: 'pointer' },
  checkboxOnlyRow: { position: 'relative', width: 48, height: 48, minHeight: 48, flexShrink: 0, justifyContent: 'center', gap: 0 },
  rowDisabled: { color: 'var(--dp-muted)', cursor: 'not-allowed', opacity: 0.5 },
  rowLabel: { fontSize: 14, fontWeight: 600, lineHeight: 1.4 },
  visuallyHidden: { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', clipPath: 'inset(50%)', whiteSpace: 'nowrap', borderWidth: 0 },
  description: { margin: '2px 0 0 32px', color: 'var(--dp-muted)', fontSize: 13, lineHeight: 1.5 },
  switchDescription: { marginLeft: 54 },
  checkbox: { flexShrink: 0, width: 20, height: 20, display: 'grid', placeItems: 'center', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-border)', borderRadius: 'var(--dp-radius-small)', backgroundColor: 'var(--dp-field)', color: 'var(--dp-on-orange)', cursor: 'inherit', transition: { default: 'background-color var(--dp-duration-fast) var(--dp-ease-out), border-color var(--dp-duration-fast) var(--dp-ease-out)', '@media (prefers-reduced-motion: reduce)': 'none' }, ':focus-visible': { outline: '2px solid var(--dp-focus)', outlineOffset: 3 } },
  checkboxChecked: { backgroundColor: 'var(--dp-orange)', borderColor: 'var(--dp-orange-border)' },
  checkboxIndicator: { display: 'grid', placeItems: 'center' },
  switch: { flexShrink: 0, width: 42, height: 24, padding: 2, display: 'flex', alignItems: 'center', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-border)', borderRadius: 999, backgroundColor: 'var(--dp-field)', cursor: 'inherit', transition: { default: 'background-color var(--dp-duration-fast) var(--dp-ease-out), border-color var(--dp-duration-fast) var(--dp-ease-out)', '@media (prefers-reduced-motion: reduce)': 'none' }, ':focus-visible': { outline: '2px solid var(--dp-focus)', outlineOffset: 3 } },
  switchChecked: { backgroundColor: 'var(--dp-orange)', borderColor: 'var(--dp-orange-border)' },
  thumb: { width: 18, height: 18, borderRadius: 999, backgroundColor: 'var(--dp-muted)', transform: 'translateX(0)', transition: { default: 'transform var(--dp-duration-fast) var(--dp-ease-out), background-color var(--dp-duration-fast) var(--dp-ease-out)', '@media (prefers-reduced-motion: reduce)': 'none' } },
  thumbChecked: { backgroundColor: 'var(--dp-on-orange)', transform: 'translateX(18px)' },
  group: { display: 'flex', flexDirection: 'column', gap: 2 },
  radio: { flexShrink: 0, width: 20, height: 20, display: 'grid', placeItems: 'center', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-border)', borderRadius: 999, backgroundColor: 'var(--dp-field)', cursor: 'inherit', transition: { default: 'border-color var(--dp-duration-fast) var(--dp-ease-out), background-color var(--dp-duration-fast) var(--dp-ease-out)', '@media (prefers-reduced-motion: reduce)': 'none' }, ':focus-visible': { outline: '2px solid var(--dp-focus)', outlineOffset: 3 } },
  radioChecked: { borderColor: 'var(--dp-orange-border)', backgroundColor: 'var(--dp-orange)' },
  radioIndicator: { width: 8, height: 8, borderRadius: 999, backgroundColor: 'var(--dp-on-orange)' },
});

type SelectionProps = {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
};

export type CheckboxProps = SelectionProps & { indeterminate?: boolean; hideLabel?: boolean };

export function Checkbox({ label, description, checked, onCheckedChange, disabled, name, indeterminate = false, hideLabel = false }: CheckboxProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  return <div>
    <label {...stylex.props(s.row, hideLabel && s.checkboxOnlyRow, disabled && s.rowDisabled)}>
    <BaseCheckbox.Root name={name} checked={checked} indeterminate={indeterminate} disabled={disabled} onCheckedChange={onCheckedChange} aria-describedby={descriptionId} className={state => stylex.props(s.checkbox, (state.checked || state.indeterminate) && s.checkboxChecked).className}>
      <BaseCheckbox.Indicator {...stylex.props(s.checkboxIndicator)}>
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          {indeterminate ? <path d="M5 12h14" /> : <path d="m5 12 4 4L19 6" />}
        </svg>
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
    <span {...stylex.props(s.rowLabel, hideLabel && s.visuallyHidden)}>{label}</span>
    </label>
    {description && <p id={descriptionId} {...stylex.props(s.description)}>{description}</p>}
  </div>;
}

export type SwitchProps = SelectionProps;

export function Switch({ label, description, checked, onCheckedChange, disabled, name }: SwitchProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  return <div>
    <label {...stylex.props(s.row, disabled && s.rowDisabled)}>
    <BaseSwitch.Root name={name} checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} aria-describedby={descriptionId} className={state => stylex.props(s.switch, state.checked && s.switchChecked).className}>
      <BaseSwitch.Thumb className={state => stylex.props(s.thumb, state.checked && s.thumbChecked).className} />
    </BaseSwitch.Root>
    <span {...stylex.props(s.rowLabel)}>{label}</span>
    </label>
    {description && <p id={descriptionId} {...stylex.props(s.description, s.switchDescription)}>{description}</p>}
  </div>;
}

export type RadioOption = { value: string; label: string; description?: string; disabled?: boolean };
export type RadioGroupProps = { label: string; value: string; onValueChange: (value: string) => void; options: RadioOption[]; disabled?: boolean; name?: string };

export function RadioGroup({ label, value, onValueChange, options, disabled, name }: RadioGroupProps) {
  const id = useId();
  return <div {...stylex.props(s.field)}>
    <span id={`${id}-label`} {...stylex.props(s.label)}>{label}</span>
    <BaseRadioGroup value={value} onValueChange={onValueChange} disabled={disabled} name={name} aria-labelledby={`${id}-label`} {...stylex.props(s.group)}>
      {options.map((option, index) => {
        const optionId = `${id}-option-${index}`;
        const descriptionId = option.description ? `${optionId}-description` : undefined;
        const optionDisabled = disabled || option.disabled;
        return <div key={option.value}>
          <label {...stylex.props(s.row, optionDisabled && s.rowDisabled)}>
          <BaseRadio.Root value={option.value} disabled={optionDisabled} aria-describedby={descriptionId} className={state => stylex.props(s.radio, state.checked && s.radioChecked).className}>
            <BaseRadio.Indicator {...stylex.props(s.radioIndicator)} />
          </BaseRadio.Root>
          <span {...stylex.props(s.rowLabel)}>{option.label}</span>
          </label>
          {option.description && <p id={descriptionId} {...stylex.props(s.description)}>{option.description}</p>}
        </div>;
      })}
    </BaseRadioGroup>
  </div>;
}
