import { useRef, type ReactElement, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';

const s = stylex.create({
  trigger: { minHeight: 48, padding: '11px 16px', backgroundColor: { default:'var(--dp-surface)', ':hover':'var(--dp-hover)', ':active':'var(--dp-active)' }, color: 'var(--dp-text)', borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-divider)', borderRadius: 'var(--dp-radius-control)', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  positioner: { zIndex: 80 },
  tooltip: { maxWidth: 280, padding: '8px 10px', backgroundColor: 'var(--dp-text)', color: 'var(--dp-canvas)', borderRadius: 'var(--dp-radius-small)', fontSize: 13, lineHeight: 1.45, boxShadow: 'var(--dp-shadow-popup)' },
  popup: { minWidth: 240, maxWidth: 'min(360px, calc(100vw - 32px))', padding: 20, backgroundColor: 'var(--dp-raised)', color: 'var(--dp-text)', borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-divider)', borderRadius: 'var(--dp-radius-popup)', boxShadow: 'var(--dp-shadow-popup)' },
  title: { margin: '0 0 8px', color: 'var(--dp-text)', fontSize: 18, fontWeight: 650, lineHeight: 1.35, letterSpacing: '-0.02em' },
  description: { margin: '0 0 16px', color: 'var(--dp-muted)', fontSize: 14, lineHeight: 1.6 },
  menu: { minWidth: 'min(200px, var(--available-width))', maxWidth: 'min(360px, var(--available-width))', maxHeight:'min(320px, var(--available-height))', overflowY:'auto', padding: 6, backgroundColor: 'var(--dp-raised)', color: 'var(--dp-text)', borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-divider)', borderRadius: 'var(--dp-radius-popup)', boxShadow: 'var(--dp-shadow-popup)' },
  menuTrigger: { display:'inline-flex', alignItems:'center', justifyContent:'space-between', gap:12, maxWidth:'100%', overflowWrap:'anywhere' },
  menuIcon: { flexShrink:0 },
  menuItem: { width: '100%', minHeight: 44, padding: '10px 12px', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', color: 'var(--dp-text)', borderWidth: 0, borderStyle: 'solid', borderRadius: 'var(--dp-radius-small)', fontFamily: 'inherit', fontSize: 14, lineHeight:1.5, textAlign: 'left', cursor: 'pointer', overflowWrap:'anywhere', outline:'none', ':focus-visible': { outline:'2px solid var(--dp-focus)', outlineOffset:3 } },
  highlighted: { backgroundColor: 'var(--dp-hover)' },
  disabled: { color: 'var(--dp-muted)', cursor: 'not-allowed' },
  backdrop: { position: 'fixed', inset: 0, backgroundColor: '#00000085', zIndex: 70 },
  dialog: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(480px, calc(100vw - 32px))', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto', padding: 28, backgroundColor: 'var(--dp-raised)', color: 'var(--dp-text)', borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-divider)', borderRadius: 'var(--dp-radius-dialog)', zIndex: 71, boxShadow: 'var(--dp-shadow-dialog)' },
  actions: { display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 10, marginTop: 24 },
  danger: { backgroundColor: { default:'var(--dp-error)', ':hover':'var(--dp-error)', ':active':'var(--dp-error)' }, color: 'var(--dp-canvas)', borderColor: 'var(--dp-error)' },
  drawer: { position: 'fixed', top: 0, bottom: 0, width: 'min(420px, calc(100vw - 24px))', padding: 28, overflowY: 'auto', backgroundColor: 'var(--dp-raised)', color: 'var(--dp-text)', borderTopWidth: 0, borderBottomWidth: 0, borderStyle: 'solid', borderColor: 'var(--dp-divider)', zIndex: 71, boxShadow: 'var(--dp-shadow-dialog)' },
  drawerLeft: { left: 0, borderRightWidth: 1, borderLeftWidth: 0 },
  drawerRight: { right: 0, borderLeftWidth: 1, borderRightWidth: 0 },
  drawerHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 },
  close: { minWidth: 44, minHeight: 44, padding: 8, display: 'inline-grid', placeItems: 'center' },
  accordion: { borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-divider)', borderRadius: 'var(--dp-radius-panel)', backgroundColor: 'var(--dp-raised)', boxShadow: 'var(--dp-shadow-surface)' },
  accordionItem: { borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--dp-divider)' },
  accordionLastItem: { borderBottomWidth: 0 },
  accordionHeader: { margin: 0 },
  accordionTrigger: { width: '100%', minHeight: 52, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, backgroundColor: { default:'transparent', ':hover':'var(--dp-hover)', ':active':'var(--dp-active)' }, color: 'var(--dp-text)', borderWidth: 0, borderStyle: 'solid', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textAlign: 'left', cursor: 'pointer' },
  accordionFirstTrigger: { borderTopLeftRadius: 'calc(var(--dp-radius-panel) - 1px)', borderTopRightRadius: 'calc(var(--dp-radius-panel) - 1px)' },
  accordionLastTrigger: { borderBottomLeftRadius: 'calc(var(--dp-radius-panel) - 1px)', borderBottomRightRadius: 'calc(var(--dp-radius-panel) - 1px)' },
  accordionPanel: { padding: '0 16px 16px', color: 'var(--dp-muted)', fontSize: 14, lineHeight: 1.6 },
});

export type TooltipProps = { content: ReactNode; children: ReactElement; disabled?: boolean };
export function Tooltip({ content, children, disabled }: TooltipProps) {
  return <BaseTooltip.Root disabled={disabled}><BaseTooltip.Trigger render={children} />
    <BaseTooltip.Portal><BaseTooltip.Positioner sideOffset={8} {...stylex.props(s.positioner)}><BaseTooltip.Popup role="tooltip" {...stylex.props(s.tooltip)}>{content}</BaseTooltip.Popup></BaseTooltip.Positioner></BaseTooltip.Portal>
  </BaseTooltip.Root>;
}

export type OverlayOpenProps = { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void };
export type PopoverProps = { triggerLabel: string; title: string; children: ReactNode; } & OverlayOpenProps;
export function Popover({ triggerLabel, title, children, open, defaultOpen, onOpenChange }: PopoverProps) {
  return <BasePopover.Root open={open} defaultOpen={defaultOpen} onOpenChange={next => onOpenChange?.(next)}><BasePopover.Trigger {...stylex.props(s.trigger)}>{triggerLabel}</BasePopover.Trigger>
    <BasePopover.Portal><BasePopover.Positioner sideOffset={8} {...stylex.props(s.positioner)}><BasePopover.Popup role="dialog" aria-label={title} {...stylex.props(s.popup)}>
      <h2 {...stylex.props(s.title)}>{title}</h2>{children}
    </BasePopover.Popup></BasePopover.Positioner></BasePopover.Portal>
  </BasePopover.Root>;
}

export type DropdownMenuItem = { label: string; onSelect?: () => void; disabled?: boolean };
export type DropdownMenuProps = { triggerLabel: string; items: DropdownMenuItem[]; } & OverlayOpenProps;
export function DropdownMenu({ triggerLabel, items, open, defaultOpen, onOpenChange }: DropdownMenuProps) {
  return <BaseMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={next => onOpenChange?.(next)}><BaseMenu.Trigger type="button" {...stylex.props(s.trigger,s.menuTrigger)}>{triggerLabel}<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...stylex.props(s.menuIcon)}><path d="m6 9 6 6 6-6" /></svg></BaseMenu.Trigger>
    <BaseMenu.Portal><BaseMenu.Positioner sideOffset={6} align="start" {...stylex.props(s.positioner)}><BaseMenu.Popup {...stylex.props(s.menu)}>
      {items.map(item => <BaseMenu.Item key={item.label} disabled={item.disabled} onClick={item.onSelect} className={state => stylex.props(s.menuItem, state.highlighted && s.highlighted, state.disabled && s.disabled).className}>{item.label}</BaseMenu.Item>)}
      {items.length===0&&<BaseMenu.Item disabled {...stylex.props(s.menuItem,s.disabled)}>No actions available.</BaseMenu.Item>}
    </BaseMenu.Popup></BaseMenu.Positioner></BaseMenu.Portal>
  </BaseMenu.Root>;
}

export type AlertDialogProps = { triggerLabel: string; title: string; description: string; confirmLabel: string; cancelLabel?: string; onConfirm: () => void; children?: ReactNode; } & OverlayOpenProps;
export function AlertDialog({ triggerLabel, title, description, confirmLabel, cancelLabel = 'Cancel', onConfirm, children, open, defaultOpen, onOpenChange }: AlertDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return <BaseAlertDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={(next, details) => { if (!next && details.reason !== 'escape-key' && details.reason !== 'close-press') { details.cancel(); return; } onOpenChange?.(next); }}><BaseAlertDialog.Trigger {...stylex.props(s.trigger)}>{triggerLabel}</BaseAlertDialog.Trigger>
    <BaseAlertDialog.Portal><BaseAlertDialog.Backdrop {...stylex.props(s.backdrop)} /><BaseAlertDialog.Popup initialFocus={() => cancelRef.current} {...stylex.props(s.dialog)}>
      <BaseAlertDialog.Title {...stylex.props(s.title)}>{title}</BaseAlertDialog.Title><BaseAlertDialog.Description {...stylex.props(s.description)}>{description}</BaseAlertDialog.Description>{children}
      <div {...stylex.props(s.actions)}><BaseAlertDialog.Close ref={cancelRef} {...stylex.props(s.trigger)}>{cancelLabel}</BaseAlertDialog.Close><BaseAlertDialog.Close onClick={onConfirm} {...stylex.props(s.trigger, s.danger)}>{confirmLabel}</BaseAlertDialog.Close></div>
    </BaseAlertDialog.Popup></BaseAlertDialog.Portal>
  </BaseAlertDialog.Root>;
}

export type DrawerProps = { triggerLabel: string; title: string; description?: string; children: ReactNode; side?: 'left' | 'right' } & OverlayOpenProps;
export function Drawer({ triggerLabel, title, description, children, side = 'right', open, defaultOpen, onOpenChange }: DrawerProps) {
  return <BaseDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={next => onOpenChange?.(next)}><BaseDialog.Trigger {...stylex.props(s.trigger)}>{triggerLabel}</BaseDialog.Trigger>
    <BaseDialog.Portal><BaseDialog.Backdrop {...stylex.props(s.backdrop)} /><BaseDialog.Popup {...stylex.props(s.drawer, side === 'left' ? s.drawerLeft : s.drawerRight)}>
      <div {...stylex.props(s.drawerHeader)}><div><BaseDialog.Title {...stylex.props(s.title)}>{title}</BaseDialog.Title>{description && <BaseDialog.Description {...stylex.props(s.description)}>{description}</BaseDialog.Description>}</div><BaseDialog.Close aria-label={`Close ${title}`} {...stylex.props(s.trigger, s.close)}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg></BaseDialog.Close></div>{children}
    </BaseDialog.Popup></BaseDialog.Portal>
  </BaseDialog.Root>;
}

export type AccordionItem = { value: string; label: string; content: ReactNode; disabled?: boolean };
export type AccordionProps = { label: string; items: AccordionItem[]; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void; multiple?: boolean; };
export function Accordion({ label, items, value, defaultValue, onValueChange, multiple }: AccordionProps) {
  return <BaseAccordion.Root aria-label={label} value={value} defaultValue={defaultValue} multiple={multiple} onValueChange={next => onValueChange?.(next as string[])} {...stylex.props(s.accordion)}>
    {items.map((item, index) => <AccordionRow key={item.value} item={item} first={index === 0} last={index === items.length - 1} />)}
  </BaseAccordion.Root>;
}

function AccordionRow({ item, first, last }: { item: AccordionItem; first: boolean; last: boolean }) {
  return <BaseAccordion.Item value={item.value} disabled={item.disabled} {...stylex.props(s.accordionItem, last && s.accordionLastItem)}><BaseAccordion.Header {...stylex.props(s.accordionHeader)}><BaseAccordion.Trigger render={(props, state) => <button {...props} {...stylex.props(s.accordionTrigger, first && s.accordionFirstTrigger, last && !state.open && s.accordionLastTrigger)}>{item.label}<svg aria-hidden="true" data-expanded={state.open ? 'true' : 'false'} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: state.open ? 'rotate(180deg)' : 'rotate(0deg)' }}><path d="m6 9 6 6 6-6" /></svg></button>} /></BaseAccordion.Header><BaseAccordion.Panel {...stylex.props(s.accordionPanel)}>{item.content}</BaseAccordion.Panel></BaseAccordion.Item>;
}
