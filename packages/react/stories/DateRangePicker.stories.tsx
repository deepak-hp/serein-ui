import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateRangePicker } from '../src/index';
import { expect, userEvent, waitFor, within } from 'storybook/test';
const meta={title:'Components/DateRangePicker',component:DateRangePicker,tags:['autodocs'],args:{label:'Travel dates',value:{from:'2026-09-19',to:'2026-09-23'},today:'2026-09-19',defaultMonth:'2026-09-01',onValueChange:()=>{}}} satisfies Meta<typeof DateRangePicker>; export default meta; type Story=StoryObj<typeof meta>;
function Controlled(args:ComponentProps<typeof DateRangePicker>){const [value,setValue]=useState(args.value);useEffect(()=>setValue(args.value),[args.value]);return <DateRangePicker {...args} value={value} onValueChange={next=>{setValue(next);args.onValueChange(next)}}/>}
export const Default:Story={render:Controlled}; export const Open:Story={args:{defaultOpen:true},render:Controlled}; export const Incomplete:Story={args:{value:{from:'2026-09-19',to:null}},render:Controlled}; export const Bounds:Story={args:{min:'2026-09-05',max:'2026-09-25',disabledDates:['2026-09-15']},render:Controlled};
export const TwoDateSelection:Story={args:{value:{from:null,to:null}},render:Controlled,play:async({canvasElement})=>{
 const canvas=within(canvasElement);const trigger=canvas.getByRole('button',{name:/^Travel dates/});await userEvent.click(trigger);
 const body=within(canvasElement.ownerDocument.body);await userEvent.click(body.getByRole('button',{name:/September 19/}));
 await expect(body.getByRole('dialog')).toBeVisible();await expect(body.getByText('Choose an end date to complete the range.')).toBeVisible();
 await userEvent.click(body.getByRole('button',{name:/September 23/}));await waitFor(()=>expect(body.queryByRole('dialog')).not.toBeInTheDocument());
 await expect(trigger).toHaveTextContent('19–23 Sept 2026');await waitFor(()=>expect(trigger).toHaveFocus());
}};
