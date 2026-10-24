import * as library from '@serein-ui/react';
import { Button, Dialog, IconButton, StatusIcon, DataTable, Slider, MultiSelect, CommandPalette, Calendar, DatePicker, DateRangePicker } from '@serein-ui/react';
import type { StatusIconProps, AsyncVisualState, StatusIconKind, AsyncActionController, RadioOption, DataTableColumn, MultiSelectOption, CommandItem } from '@serein-ui/react';
import '@serein-ui/react/styles.css';

const state: AsyncVisualState = 'pending';
const kind: StatusIconKind = 'send';
const status: StatusIconProps = { state, kind };
const option: RadioOption = { label: 'Personal', value: 'personal' };
const teams: MultiSelectOption[] = [{ value: 'design', label: 'Design' }];
const commands: CommandItem[] = [{ id: 'save', label: 'Save settings', onSelect: () => {} }];
type Invoice = { id: string; amount: number };
const columns: DataTableColumn<Invoice>[] = [{ key: 'amount', header: 'Amount', cell: row => row.amount, sortValue: row => row.amount }];
export function Consumer() {
  return <><Button type="submit" aria-label="Save account">Save</Button>
    <IconButton label="Send"><StatusIcon {...status} /></IconButton>
    <Dialog triggerLabel="Open" title="Settings" description="Account settings" open={false} onOpenChange={() => {}}><p>Settings</p></Dialog>
    <DataTable caption="Invoices" rows={[{ id: '1', amount: 12 }]} columns={columns} rowKey={row => row.id} />
    <MultiSelect label="Teams" options={teams} value={['design']} onValueChange={() => {}} />
    <CommandPalette items={commands} />
    <Calendar label="Schedule" value="2026-09-20" onValueChange={() => {}} />
    <DatePicker label="Start date" value={null} onValueChange={() => {}} name="start" />
    <DateRangePicker label="Reporting period" value={{from:null,to:null}} onValueChange={() => {}} startName="from" endName="to" />
  </>;
}
// These contracts deliberately reject invalid consumer usage.
// @ts-expect-error Icon-only actions require an accessible name.
const unnamedAction = <IconButton><span>+</span></IconButton>;
// @ts-expect-error The current slider supports a single numeric value.
const invalidSlider = <Slider label="Volume" value="loud" onValueChange={() => {}} />;
const reset = (controller: AsyncActionController) => controller.reset();
console.log(library, option, reset, unnamedAction, invalidSlider);
