import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';

const s = stylex.create({
  root: { minWidth: 0 },
  // Tabs sit on a hairline; the active tab is ink with a 2px signal mark, like the active graduation on a scale.
  list: { display: 'flex', flexWrap: 'wrap', gap: 'var(--sr-space-5)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--sr-color-line)' },
  tab: { minHeight: 48, padding: '10px 2px', marginBottom: -1, backgroundColor: 'transparent', color: { default: 'var(--sr-color-ink-muted)', ':hover': 'var(--sr-color-ink)' }, borderWidth: 0, borderStyle: 'solid', borderBottomWidth: 2, borderColor: 'transparent', borderRadius: 0, fontFamily: 'inherit', fontSize:15, lineHeight:'20px', fontWeight:500, cursor: 'pointer', ':focus-visible': { outline: '2px solid var(--sr-color-focus)', outlineOffset:'var(--sr-size-focus-offset)' } },
  active: { color: 'var(--sr-color-ink)', borderBottomColor: 'var(--sr-color-signal)' },
  disabled: { opacity: .5, cursor: 'not-allowed' },
  panel: { padding: '24px 4px', color: 'var(--sr-color-ink)', fontSize:15, lineHeight:'22px' },
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
