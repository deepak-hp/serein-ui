import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from '../src/index';
import { expect, userEvent, waitFor, within } from 'storybook/test';
const meta={title:'Components/DatePicker',component:DatePicker,tags:['autodocs'],args:{label:'Start date',value:'2026-09-19',today:'2026-09-19',defaultMonth:'2026-09-01',onValueChange:()=>{}}} satisfies Meta<typeof DatePicker>; export default meta; type Story=StoryObj<typeof meta>;
function Controlled(args:ComponentProps<typeof DatePicker>){const [value,setValue]=useState(args.value);useEffect(()=>setValue(args.value),[args.value]);return <DatePicker {...args} value={value} onValueChange={next=>{setValue(next);args.onValueChange(next)}}/>}
export const Default:Story={render:Controlled}; export const Open:Story={args:{defaultOpen:true},render:Controlled}; export const Error:Story={args:{value:null,error:'Choose a start date.'},render:Controlled}; export const Disabled:Story={args:{disabled:true},render:Controlled};
export const KeyboardSelection:Story={render:Controlled,play:async({canvasElement})=>{
 const canvas=within(canvasElement); const trigger=canvas.getByRole('button',{name:/^Start date/});await userEvent.click(trigger);
 const body=within(canvasElement.ownerDocument.body);await waitFor(()=>expect(body.getByRole('button',{name:/September 19/})).toHaveFocus());
 await userEvent.keyboard('{ArrowRight}{Enter}');await waitFor(()=>expect(body.queryByRole('dialog')).not.toBeInTheDocument());
 await expect(trigger).toHaveTextContent('20 Sept 2026');await waitFor(()=>expect(trigger).toHaveFocus());
}};
