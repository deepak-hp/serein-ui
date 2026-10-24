import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';

const s = stylex.create({
  root: { minWidth: 0 },
  list: { display: 'flex', flexWrap: 'wrap', gap: 4, padding: 4, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--dp-divider)' },
  tab: { minHeight: 48, padding: '10px 16px', backgroundColor: 'transparent', color: 'var(--dp-muted)', borderWidth: 0, borderStyle: 'solid', borderBottomWidth: 2, borderColor: 'transparent', borderRadius: 'var(--dp-radius-control)', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', ':hover': { backgroundColor: 'var(--dp-surface)' }, ':focus-visible': { outline: '2px solid var(--dp-focus)', outlineOffset: 3 } },
  active: { color: 'var(--dp-text)', backgroundColor: 'var(--dp-selected)', borderBottomColor: 'var(--dp-orange-text)' },
  disabled: { opacity: .5, cursor: 'not-allowed' },
  panel: { padding: '24px 4px', color: 'var(--dp-text)', fontSize: 14, lineHeight: 1.7 },
});

export type TabsProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: { value: string; label: string; content: ReactNode; disabled?: boolean }[];
};

/** Controlled tabs. Hidden panels stay mounted to preserve form state. */
export function Tabs({ label, value, onValueChange, items }: TabsProps) {
  return <BaseTabs.Root value={value} onValueChange={next => { if (typeof next === 'string') onValueChange(next); }} {...stylex.props(s.root)}>
    <BaseTabs.List aria-label={label} activateOnFocus {...stylex.props(s.list)}>
      {items.map(item => <BaseTabs.Tab key={item.value} value={item.value} disabled={item.disabled}
        className={state => stylex.props(s.tab, state.active && s.active, state.disabled && s.disabled).className}>
        {item.label}
      </BaseTabs.Tab>)}
    </BaseTabs.List>
    {items.map(item => <BaseTabs.Panel key={item.value} value={item.value} keepMounted {...stylex.props(s.panel)}>
      {item.content}
    </BaseTabs.Panel>)}
  </BaseTabs.Root>;
}
