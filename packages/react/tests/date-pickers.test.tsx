import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { DatePicker, type DateRangeValue } from '../src/date-pickers';
import { DateRangePicker } from '../src/date-pickers';

test('range selection cannot cross an unavailable interior day and submits ISO values', async()=>{
 const user=userEvent.setup();
 function Example(){const [value,setValue]=useState<DateRangeValue>({from:null,to:null});return <form><DateRangePicker label="Period" value={value} onValueChange={setValue} defaultMonth="2026-09-01" today="2026-09-19" disabledDates={['2026-09-20']} startName="from" endName="to" /></form>}
 const {container}=render(<Example/>);
 await user.click(screen.getByRole('button',{name:/^Period/}));
 await user.click(screen.getByRole('button',{name:/September 19/}));
 await user.click(screen.getByRole('button',{name:/September 22/}));
 expect(screen.getByRole('dialog')).toBeVisible();
 expect(new FormData(container.querySelector('form')!).get('to')).toBeNull();
 await user.click(screen.getByRole('button',{name:/September 23/}));
 const values=new FormData(container.querySelector('form')!);
 expect(values.get('from')).toBe('2026-09-22'); expect(values.get('to')).toBe('2026-09-23');
});
test('date picker opens, clears, and returns focus on Escape', async () => { const user = userEvent.setup(); function Example(){const [value,setValue]=useState<string|null>('2026-09-19'); return <DatePicker label="Start" value={value} onValueChange={setValue} defaultMonth="2026-09-01" />;} render(<Example/>); const trigger=screen.getByRole('button',{name:/^Start/}); await user.click(trigger); expect(await screen.findByLabelText('Start calendar')).toBeInTheDocument(); await user.keyboard('{Escape}'); expect(trigger).toHaveFocus(); await user.click(trigger); await user.click(screen.getByRole('button',{name:'Clear date'})); expect(screen.getByRole('button',{name:/^Start/})).toHaveTextContent('Choose a date'); });
test('range picker keeps its first selection open and accepts same-day completion', async () => { const user = userEvent.setup(); function Example(){const [value,setValue]=useState<DateRangeValue>({from:null,to:null}); return <DateRangePicker label="Trip" value={value} onValueChange={setValue} defaultMonth="2026-09-01" today="2026-09-19" />;} render(<Example/>); const trigger=screen.getByRole('button',{name:/^Trip/}); await user.click(trigger); const day=screen.getByRole('button',{name:/September 19/}); await user.click(day); expect(screen.getByLabelText('Trip calendar')).toBeInTheDocument(); expect(trigger).toHaveTextContent('choose an end date'); await user.click(day); expect(screen.queryByLabelText('Trip calendar')).not.toBeInTheDocument(); });
test('a completed range starts again from the next clicked day', async () => { const user = userEvent.setup(); function Example(){const [value,setValue]=useState<DateRangeValue>({from:'2026-09-19',to:'2026-09-23'}); return <DateRangePicker label="Trip" value={value} onValueChange={setValue} defaultMonth="2026-09-01" />;} render(<Example/>); await user.click(screen.getByRole('button',{name:/^Trip/})); await user.click(screen.getByRole('button',{name:/September 25/})); expect(screen.getByRole('button',{name:/^Trip/})).toHaveTextContent('25 Sept 2026 — choose an end date'); });
test('disabled pickers omit hidden form values and cannot clear selections', async () => { const { container } = render(<form><DatePicker label="Start" value="2026-09-19" name="start" disabled onValueChange={() => {}} /><DateRangePicker label="Trip" value={{from:'2026-09-19',to:'2026-09-23'}} startName="from" endName="to" disabled onValueChange={() => {}} /></form>); expect(screen.getByRole('button',{name:/^Start/})).toBeDisabled(); expect(screen.getByRole('button',{name:/^Trip/})).toBeDisabled(); expect(new FormData(container.querySelector('form')!).entries().next().done).toBe(true); });
