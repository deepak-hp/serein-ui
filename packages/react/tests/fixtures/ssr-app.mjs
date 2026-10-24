import React, { useEffect, useState } from 'react';
import * as UI from '../../dist/index.js';

const h = React.createElement;

function AsyncProbe() {
  const action = UI.useAsyncAction(async () => {});
  return h(UI.Button, { variant: 'quiet', onClick: action.run }, `Async state: ${action.state}`);
}

function ToastProbe() {
  const toast = UI.useToast();
  return h(UI.Button, { variant: 'quiet', onClick: () => toast.add({ title: 'SSR toast', description: 'Hydrated toast action.', timeout: 0 }) }, 'Show SSR toast');
}

function Controls() {
  const [text, setText] = useState('server value');
  const [select, setSelect] = useState('one');
  const [tab, setTab] = useState('one');
  const [checked, setChecked] = useState(false);
  const [date, setDate] = useState('2026-09-19');
  const [number, setNumber] = useState(2);
  const [slider, setSlider] = useState(40);
  const [combo, setCombo] = useState('one');
  const [toggles, setToggles] = useState(['one']);
  const [multiple, setMultiple] = useState(['one']);
  const [page, setPage] = useState(1);
  return h(React.Fragment, null,
    h(UI.Button, null, 'SSR button'),
    h(UI.TextField, { label: 'SSR text field', value: text, onChange: event => setText(event.target.value) }),
    h(UI.Textarea, { label: 'SSR textarea', defaultValue: 'Server text' }),
    h(UI.Select, { label: 'SSR selection', value: select, onValueChange: setSelect, options: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }] }),
    h(UI.NumberField, { label: 'SSR number', value: number, onValueChange: value => setNumber(value ?? 0) }),
    h(UI.Slider, { label: 'SSR slider', value: slider, onValueChange: setSlider }),
    h(UI.Combobox, { label: 'SSR combobox', value: combo, onValueChange: setCombo, options: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }] }),
    h(UI.ToggleGroup, { label: 'SSR toggles', value: toggles, onValueChange: setToggles, options: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }] }),
    h(UI.DateField, { label: 'SSR date', value: date, onValueChange: setDate }),
    h(UI.FileUpload, { label: 'SSR file' }),
    h(UI.Calendar, { label: 'SSR calendar', value: date, onValueChange: setDate, today:'2026-09-20' }),
    h(UI.DatePicker, { label: 'SSR date picker', value: date, onValueChange: setDate, today:'2026-09-20' }),
    h(UI.DateRangePicker, { label: 'SSR date range', value:{from:'2026-09-19',to:'2026-09-22'}, onValueChange:()=>{}, today:'2026-09-20' }),
    h(UI.MultiSelect, { label: 'SSR multiple selection', value: multiple, onValueChange: setMultiple, options: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }] }),
    h(UI.CommandPalette, { triggerLabel: 'Open SSR commands', items: [{ id: 'one', label: 'SSR command', onSelect: () => {} }] }),
    h(UI.Checkbox, { label: 'SSR checkbox', checked, onCheckedChange: setChecked }),
    h(UI.Switch, { label: 'SSR switch', checked, onCheckedChange: setChecked }),
    h(UI.RadioGroup, { label: 'SSR radio', value: select, onValueChange: setSelect, options: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }] }),
    h(UI.Tabs, { label: 'SSR tabs', value: tab, onValueChange: setTab, items: [{ value: 'one', label: 'One', content: 'First panel' }, { value: 'two', label: 'Two', content: 'Second panel' }] }),
    h(UI.Dialog, { triggerLabel: 'Open SSR dialog', title: 'SSR dialog', description: 'Hydration focus check.' }, h('p', null, 'Dialog body')),
    h(UI.Tooltip, { content: 'SSR hint', children: h('button', { type: 'button' }, 'SSR tooltip') }),
    h(UI.Popover, { triggerLabel: 'Open SSR popover', title: 'SSR popover' }, h('p', null, 'Popover body')),
    h(UI.DropdownMenu, { triggerLabel: 'Open SSR menu', items: [{ label: 'SSR item' }] }),
    h(UI.AlertDialog, { triggerLabel: 'Open SSR alert', title: 'SSR alert', description: 'Confirm safely.', confirmLabel: 'Confirm', onConfirm: () => {} }),
    h(UI.Drawer, { triggerLabel: 'Open SSR drawer', title: 'SSR drawer' }, h('p', null, 'Drawer body')),
    h(UI.Accordion, { label: 'SSR accordion', defaultValue: ['one'], items: [{ value: 'one', label: 'SSR section', content: 'Accordion content' }] }),
    h(UI.Badge, { tone: 'success' }, 'SSR badge'),
    h(UI.Alert, { title: 'SSR alert message', tone: 'warning' }, 'Alert description'),
    h(UI.Avatar, { name: 'SSR User' }),
    h(UI.Card, null, 'SSR card'), h(UI.Separator), h(UI.Skeleton, { label: 'SSR loading' }),
    h(UI.Progress, { label: 'SSR progress', value: 40 }), h(UI.Spinner, { label: 'SSR spinner' }),
    h(UI.EmptyState, { title: 'SSR empty', description: 'No data.' }),
    h(UI.StatusIcon, { state: 'pending' }), h(AsyncProbe),
    h(UI.Link, { href: '#ssr' }, 'SSR link'), h(UI.IconButton, { label: 'SSR icon' }, h('svg', { viewBox: '0 0 1 1' })),
    h(UI.Breadcrumbs, { items: [{ label: 'Home', href: '#' }, { label: 'SSR' }] }),
    h(UI.Pagination, { page, pageCount: 3, onPageChange: setPage }),
    h(UI.DataTable, { caption: 'SSR table', rows: [{ id: 'one', amount: 1 }], rowKey: row => row.id, columns: [{ key: 'amount', header: 'Amount', cell: row => row.amount, sortValue: row => row.amount }] }),
  );
}

export function SsrApp() {
  useEffect(() => { window.__ssrHydrated = true; }, []);
  return h(UI.ToastProvider, { timeout: 0 }, h('main', { className: 'dp-theme' }, h('h1', null, 'SSR fixture'), h(Controls), h(ToastProbe)));
}
