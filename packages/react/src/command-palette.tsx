import { useCallback, useMemo, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';

const s = stylex.create({
  trigger: { minHeight: 48, padding: '11px 16px', backgroundColor: 'var(--dp-field)', color: 'var(--dp-text)', borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-border)', borderRadius: 'var(--dp-radius-control)', fontFamily: 'inherit', fontSize: 14, fontWeight: 650, cursor: 'pointer' },
  disabled: { opacity: .5, cursor: 'not-allowed' },
  backdrop: { position: 'fixed', inset: 0, backgroundColor: '#00000085', zIndex: 70 },
  dialog: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(640px, calc(100vw - 32px))', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto', padding: 24, backgroundColor: 'var(--dp-raised)', color: 'var(--dp-text)', borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-divider)', borderRadius: 'var(--dp-radius-dialog)', zIndex: 71, boxShadow: 'var(--dp-shadow-dialog)' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 },
  title: { margin: 0, color: 'var(--dp-text)', fontSize: 24, fontWeight: 650, lineHeight: 1.3, letterSpacing: '-0.03em', overflowWrap: 'anywhere' },
  description: { margin: '8px 0 0', color: 'var(--dp-muted)', fontSize: 14, lineHeight: 1.6, overflowWrap: 'anywhere' },
  close: { width: 48, minWidth: 48, minHeight: 48, padding: 8, display: 'inline-grid', placeItems: 'center', backgroundColor: 'transparent', color: 'var(--dp-text)', borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-border)', borderRadius: 'var(--dp-radius-control)', cursor: 'pointer' },
  search: { width: '100%', minHeight: 48, padding: '11px 14px', backgroundColor: 'var(--dp-field)', color: 'var(--dp-text)', borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-border)', borderRadius: 'var(--dp-radius-control)', fontFamily: 'inherit', fontSize: 16, lineHeight: 1.5 },
  list: { display: 'flex', flexDirection: 'column', gap: 4, marginTop: 12, maxHeight: 'min(360px, calc(100dvh - 250px))', overflowY: 'auto', outline: 'none' },
  item: { minHeight: 48, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, borderRadius: 'var(--dp-radius-small)', color: 'var(--dp-text)', cursor: 'pointer', outline: 'none' },
  highlighted: { backgroundColor: 'var(--dp-selected)' },
  itemDisabled: { color: 'var(--dp-muted)', cursor: 'not-allowed', opacity: .55 },
  itemLabel: { fontSize: 14, fontWeight: 650, lineHeight: 1.4, overflowWrap: 'anywhere' },
  itemDescription: { color: 'var(--dp-muted)', fontSize: 13, lineHeight: 1.45, overflowWrap: 'anywhere' },
  empty: { padding: '16px 12px', color: 'var(--dp-muted)', fontSize: 14, lineHeight: 1.5 },
});

export type CommandItem = {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect: () => void;
};

export type CommandPaletteProps = {
  triggerLabel?: string;
  title?: string;
  description?: string;
  items: CommandItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
};

function matchesCommand(item: CommandItem, query: string) {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return true;
  return [item.label, item.description, ...(item.keywords ?? [])].some(value => value?.toLocaleLowerCase().includes(needle));
}

export function CommandPalette({
  triggerLabel = 'Search commands',
  title = 'Commands',
  description,
  items,
  open,
  defaultOpen = false,
  onOpenChange,
  placeholder = 'Search commands',
  emptyMessage = 'No commands found.',
  disabled = false,
}: CommandPaletteProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const dialogActionsRef = useRef<BaseDialog.Root.Actions | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const isControlled = open !== undefined;
  const paletteOpen = open ?? uncontrolledOpen;
  const commandItems = useMemo(() => BaseCombobox.createItems(items, { getValue: item => item.id, getLabel: item => item.label }), [items]);
  const requestOpenChange = useCallback((next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);
  const selectCommand = useCallback((id: string | null) => {
    if (id === null) return;
    const item = items.find(command => command.id === id);
    if (!item || item.disabled) return;
    item.onSelect();
    dialogActionsRef.current?.close();
  }, [items]);

  return <BaseCombobox.Root<string, false, CommandItem>
    inline
    open={paletteOpen}
    onOpenChange={next => requestOpenChange(next)}
    items={commandItems}
    filter={matchesCommand}
    autoHighlight
    onValueChange={selectCommand}
  >
    <BaseDialog.Root open={paletteOpen} onOpenChange={next => requestOpenChange(next)} actionsRef={dialogActionsRef}>
      <BaseDialog.Trigger type="button" disabled={disabled} {...stylex.props(s.trigger, disabled && s.disabled)}>{triggerLabel}</BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop {...stylex.props(s.backdrop)} />
        <BaseDialog.Popup initialFocus={searchRef} {...stylex.props(s.dialog)}>
          <div {...stylex.props(s.header)}>
            <div><BaseDialog.Title {...stylex.props(s.title)}>{title}</BaseDialog.Title>{description && <BaseDialog.Description {...stylex.props(s.description)}>{description}</BaseDialog.Description>}</div>
            <BaseDialog.Close type="button" aria-label={`Close ${title}`} {...stylex.props(s.close)}>
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </BaseDialog.Close>
          </div>
          <BaseCombobox.Input ref={searchRef} aria-label="Search commands" placeholder={placeholder} {...stylex.props(s.search)} />
          <BaseCombobox.List aria-label="Command results" {...stylex.props(s.list)}>
            {(item: CommandItem) => <BaseCombobox.Item key={item.id} value={item.id} disabled={item.disabled} className={state => stylex.props(s.item, state.highlighted && s.highlighted, state.disabled && s.itemDisabled).className}>
              <span {...stylex.props(s.itemLabel)}>{item.label}</span>{item.description && <span {...stylex.props(s.itemDescription)}>{item.description}</span>}
            </BaseCombobox.Item>}
          </BaseCombobox.List>
          <BaseCombobox.Empty {...stylex.props(s.empty)}>{emptyMessage}</BaseCombobox.Empty>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  </BaseCombobox.Root>;
}
