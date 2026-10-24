import { useCallback, useId, useMemo, type ChangeEvent, type ComponentProps } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';

const s = stylex.create({
  field: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
  label: { fontSize: 14, fontWeight: 600, color: 'var(--dp-text)' },
  input: { width: '100%', minHeight: 48, padding: '11px 14px', backgroundColor: 'var(--dp-field)', color: 'var(--dp-text)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-border)', borderRadius: 'var(--dp-radius-control)', fontFamily: 'inherit', fontSize: 16, lineHeight: 1.5 },
  textarea: { minHeight: 120, resize: 'vertical' },
  invalid: { borderColor: 'var(--dp-error)' },
  disabled: { opacity: 0.5, cursor: 'not-allowed' },
  help: { margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--dp-muted)' },
  error: { color: 'var(--dp-error)' },
  numberGroup: { display: 'flex', alignItems: 'stretch' },
  numberInput: { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
  numberActions: { display: 'flex', flexDirection: 'column' },
  stepper: { width: 48, minHeight: 24, flex: 1, backgroundColor: 'var(--dp-field)', color: 'var(--dp-text)', borderWidth: 1, borderLeftWidth: 0, borderStyle: 'solid', borderColor: 'var(--dp-border)', fontFamily: 'inherit', cursor: 'pointer' },
  increment: { borderTopRightRadius: 'var(--dp-radius-control)', borderBottomWidth: 0 },
  decrement: { borderBottomRightRadius: 'var(--dp-radius-control)' },
  sliderControl: { position: 'relative', display: 'flex', alignItems: 'center', minHeight: 48, cursor: 'pointer' },
  sliderTrack: { width: '100%', height: 6, backgroundColor: 'var(--dp-surface)', borderRadius: 999, borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-border)' },
  sliderIndicator: { height: '100%', backgroundColor: 'var(--dp-orange)', borderRadius: 999 },
  sliderThumb: { width: 20, height: 20, borderRadius: 999, backgroundColor: 'var(--dp-orange)', borderWidth: 2, borderStyle: 'solid', borderColor: 'var(--dp-orange-border)', ':focus-visible': { outline: '2px solid var(--dp-focus)', outlineOffset: 3 } },
  popup: { minWidth: 'var(--anchor-width)', maxHeight: 'min(320px, var(--available-height))', overflowY: 'auto', padding: 6, backgroundColor: 'var(--dp-raised)', color: 'var(--dp-text)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-divider)', borderRadius: 'var(--dp-radius-popup)', boxShadow: 'var(--dp-shadow-popup)', zIndex: 80 },
  positioner: { zIndex: 80 },
  option: { minHeight: 44, padding: '10px 12px', display: 'flex', alignItems: 'center', borderRadius: 'var(--dp-radius-small)', fontSize: 14, cursor: 'default', outline: 'none' },
  empty: { padding: '12px', fontSize: 14, color: 'var(--dp-muted)' },
  highlighted: { backgroundColor: 'var(--dp-selected)' },
  selected: { fontWeight: 650 },
  toggleGroup: { display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', minHeight: 48 },
  toggleGroupVertical: { flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'stretch' },
  toggle: { minHeight: 48, padding: '11px 16px', backgroundColor: 'var(--dp-field)', color: 'var(--dp-text)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-border)', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  firstToggle: { borderTopLeftRadius: 'var(--dp-radius-control)', borderBottomLeftRadius: 'var(--dp-radius-control)' },
  joinedToggle: { borderLeftWidth: 0 },
  lastToggle: { borderTopRightRadius: 'var(--dp-radius-control)', borderBottomRightRadius: 'var(--dp-radius-control)' },
  firstToggleVertical: { borderTopLeftRadius: 'var(--dp-radius-control)', borderTopRightRadius: 'var(--dp-radius-control)' },
  joinedToggleVertical: { borderTopWidth: 0 },
  lastToggleVertical: { borderBottomLeftRadius: 'var(--dp-radius-control)', borderBottomRightRadius: 'var(--dp-radius-control)' },
  pressed: { backgroundColor: 'var(--dp-orange)', color: 'var(--dp-on-orange)', borderColor: 'var(--dp-orange-border)' },
  fileInput: { padding: '10px 14px' },
});

type FieldMessagesProps = { description?: string; error?: string };

function FieldMessages({ description, error, descriptionId, errorId }: FieldMessagesProps & { descriptionId?: string; errorId?: string }) {
  return <>{description && <p id={descriptionId} {...stylex.props(s.help)}>{description}</p>}{error && <p id={errorId} role="alert" {...stylex.props(s.help, s.error)}>{error}</p>}</>;
}

function describedBy(existing: string | undefined, descriptionId?: string, errorId?: string) {
  return [existing, descriptionId, errorId].filter(Boolean).join(' ') || undefined;
}

export type TextareaProps = Omit<ComponentProps<'textarea'>, 'size'> & FieldMessagesProps & { label: string };

export function Textarea({ label, description, error, id: suppliedId, className, ...props }: TextareaProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const generated = stylex.props(s.input, s.textarea, !!error && s.invalid, props.disabled && s.disabled);
  return <div {...stylex.props(s.field)}>
    <label htmlFor={id} {...stylex.props(s.label)}>{label}</label>
    <textarea {...props} id={id} {...generated} className={[generated.className, className].filter(Boolean).join(' ')} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy(props['aria-describedby'], descriptionId, errorId)} aria-errormessage={errorId || props['aria-errormessage']} />
    <FieldMessages description={description} error={error} descriptionId={descriptionId} errorId={errorId} />
  </div>;
}

export type NumberFieldProps = FieldMessagesProps & { label: string; value: number | null; onValueChange: (value: number | null) => void; min?: number; max?: number; step?: number | 'any'; disabled?: boolean; required?: boolean; name?: string; id?: string };

export function NumberField({ label, value, onValueChange, description, error, id: suppliedId, disabled, ...props }: NumberFieldProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return <div {...stylex.props(s.field)}>
    <label htmlFor={id} {...stylex.props(s.label)}>{label}</label>
    <BaseNumberField.Root {...props} id={id} value={value} disabled={disabled} onValueChange={next => onValueChange(next)}>
      <BaseNumberField.Group {...stylex.props(s.numberGroup)}>
        <BaseNumberField.Input {...stylex.props(s.input, s.numberInput, !!error && s.invalid, disabled && s.disabled)} aria-invalid={error ? true : undefined} aria-describedby={describedBy(undefined, descriptionId, errorId)} aria-errormessage={errorId} />
        <div {...stylex.props(s.numberActions)}>
          <BaseNumberField.Increment aria-label={`Increase ${label}`} {...stylex.props(s.stepper, s.increment, disabled && s.disabled)}>+</BaseNumberField.Increment>
          <BaseNumberField.Decrement aria-label={`Decrease ${label}`} {...stylex.props(s.stepper, s.decrement, disabled && s.disabled)}>−</BaseNumberField.Decrement>
        </div>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
    <FieldMessages description={description} error={error} descriptionId={descriptionId} errorId={errorId} />
  </div>;
}

export type SliderProps = FieldMessagesProps & { label: string; value: number; onValueChange: (value: number) => void; min?: number; max?: number; step?: number; disabled?: boolean; name?: string; id?: string };

export function Slider({ label, value, onValueChange, description, error, disabled, ...props }: SliderProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const setInputValidation = useCallback((input: HTMLInputElement | null) => {
    if (!input) return;
    if (error) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-errormessage', errorId!);
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-errormessage');
    }
  }, [error, errorId]);
  return <div {...stylex.props(s.field)}>
    <BaseSlider.Root {...props} value={value} disabled={disabled} onValueChange={next => onValueChange(next)}>
      <BaseSlider.Label {...stylex.props(s.label)}>{label}</BaseSlider.Label>
      <BaseSlider.Control {...stylex.props(s.sliderControl, disabled && s.disabled)}>
        <BaseSlider.Track {...stylex.props(s.sliderTrack)}><BaseSlider.Indicator {...stylex.props(s.sliderIndicator)} /></BaseSlider.Track>
        <BaseSlider.Thumb {...stylex.props(s.sliderThumb)} inputRef={setInputValidation} aria-describedby={describedBy(undefined, descriptionId, errorId)} />
      </BaseSlider.Control>
    </BaseSlider.Root>
    <FieldMessages description={description} error={error} descriptionId={descriptionId} errorId={errorId} />
  </div>;
}

export type ComboboxOption = { value: string; label: string; disabled?: boolean };
export type ComboboxProps = FieldMessagesProps & { label: string; value: string | null; onValueChange: (value: string | null) => void; options: ComboboxOption[]; disabled?: boolean; name?: string; id?: string; placeholder?: string };

export function Combobox({ label, value, onValueChange, options, description, error, disabled, id: suppliedId, placeholder, ...props }: ComboboxProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const items = useMemo(() => BaseCombobox.createItems(options, { getValue: option => option.value, getLabel: option => option.label }), [options]);
  return <div {...stylex.props(s.field)}>
    <BaseCombobox.Root<string, false, ComboboxOption> {...props} id={id} value={value} disabled={disabled} modal={false} items={items} onValueChange={next => onValueChange(next)}>
      <label htmlFor={id} {...stylex.props(s.label)}>{label}</label>
      <BaseCombobox.Input aria-label={label} placeholder={placeholder} {...stylex.props(s.input, !!error && s.invalid, disabled && s.disabled)} aria-invalid={error ? true : undefined} aria-describedby={describedBy(undefined, descriptionId, errorId)} aria-errormessage={errorId} />
      <BaseCombobox.Portal><BaseCombobox.Positioner sideOffset={6} {...stylex.props(s.positioner)}><BaseCombobox.Popup {...stylex.props(s.popup)}><BaseCombobox.List aria-label={label}>
        {(option: ComboboxOption) => <BaseCombobox.Item key={option.value} value={option.value} disabled={option.disabled} className={state => stylex.props(s.option, state.highlighted && s.highlighted, state.selected && s.selected).className}>{option.label}</BaseCombobox.Item>}
      </BaseCombobox.List><BaseCombobox.Empty {...stylex.props(s.empty)}>No matching options.</BaseCombobox.Empty></BaseCombobox.Popup></BaseCombobox.Positioner></BaseCombobox.Portal>
    </BaseCombobox.Root>
    <FieldMessages description={description} error={error} descriptionId={descriptionId} errorId={errorId} />
  </div>;
}

export type ToggleGroupOption = { value: string; label: string; disabled?: boolean };
export type ToggleGroupProps = FieldMessagesProps & { label: string; value: string[]; onValueChange: (value: string[]) => void; options: ToggleGroupOption[]; disabled?: boolean; multiple?: boolean; orientation?: 'horizontal' | 'vertical'; id?: string };

export function ToggleGroup({ label, value, onValueChange, options, description, error, disabled, multiple = false, orientation = 'horizontal', id: suppliedId }: ToggleGroupProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return <div {...stylex.props(s.field)}>
    <span id={`${id}-label`} {...stylex.props(s.label)}>{label}</span>
    <BaseToggleGroup value={value} onValueChange={next => onValueChange([...next])} disabled={disabled} multiple={multiple} orientation={orientation} aria-labelledby={`${id}-label`} aria-describedby={describedBy(undefined, descriptionId, errorId)} aria-invalid={error ? true : undefined} {...stylex.props(s.toggleGroup, orientation === 'vertical' && s.toggleGroupVertical, disabled && s.disabled)}>
      {options.map((option, index) => <Toggle key={option.value} value={option.value} disabled={option.disabled} className={state => stylex.props(s.toggle, orientation === 'horizontal' && index === 0 && s.firstToggle, orientation === 'horizontal' && index > 0 && s.joinedToggle, orientation === 'horizontal' && index === options.length - 1 && s.lastToggle, orientation === 'vertical' && index === 0 && s.firstToggleVertical, orientation === 'vertical' && index > 0 && s.joinedToggleVertical, orientation === 'vertical' && index === options.length - 1 && s.lastToggleVertical, state.pressed && s.pressed, option.disabled && s.disabled).className}>{option.label}</Toggle>)}
    </BaseToggleGroup>
    <FieldMessages description={description} error={error} descriptionId={descriptionId} errorId={errorId} />
  </div>;
}

export type DateFieldProps = Omit<ComponentProps<'input'>, 'type' | 'size' | 'value' | 'onChange'> & FieldMessagesProps & { label: string; value: string; onValueChange: (value: string) => void };

export function DateField({ label, value, onValueChange, description, error, id: suppliedId, className, ...props }: DateFieldProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const onChange = (event: ChangeEvent<HTMLInputElement>) => onValueChange(event.target.value);
  const generated = stylex.props(s.input, !!error && s.invalid, props.disabled && s.disabled);
  return <div {...stylex.props(s.field)}>
    <label htmlFor={id} {...stylex.props(s.label)}>{label}</label>
    <input {...props} id={id} type="date" value={value} onChange={onChange} {...generated} className={[generated.className, className].filter(Boolean).join(' ')} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy(props['aria-describedby'], descriptionId, errorId)} aria-errormessage={errorId || props['aria-errormessage']} />
    <FieldMessages description={description} error={error} descriptionId={descriptionId} errorId={errorId} />
  </div>;
}

export type FileUploadProps = Omit<ComponentProps<'input'>, 'type' | 'size' | 'onChange' | 'value' | 'defaultValue'> & FieldMessagesProps & { label: string; onFilesChange?: (files: FileList | null) => void };

export function FileUpload({ label, onFilesChange, description, error, id: suppliedId, className, ...props }: FileUploadProps) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const onChange = (event: ChangeEvent<HTMLInputElement>) => onFilesChange?.(event.target.files);
  const generated = stylex.props(s.input, s.fileInput, !!error && s.invalid, props.disabled && s.disabled);
  return <div {...stylex.props(s.field)}>
    <label htmlFor={id} {...stylex.props(s.label)}>{label}</label>
    <input {...props} id={id} type="file" onChange={onChange} {...generated} className={[generated.className, className].filter(Boolean).join(' ')} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy(props['aria-describedby'], descriptionId, errorId)} aria-errormessage={errorId || props['aria-errormessage']} />
    <FieldMessages description={description} error={error} descriptionId={descriptionId} errorId={errorId} />
  </div>;
}
