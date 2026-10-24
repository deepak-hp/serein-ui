import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from '../src/index';
import { expect, userEvent, within } from 'storybook/test';
const meta={title:'Components/Calendar',component:Calendar,tags:['autodocs'],args:{label:'September 2026',value:'2026-09-19',today:'2026-09-19',defaultMonth:'2026-09-01',onValueChange:()=>{}}} satisfies Meta<typeof Calendar>; export default meta; type Story=StoryObj<typeof meta>;
function Controlled(args:ComponentProps<typeof Calendar>){const [value,setValue]=useState(args.value);useEffect(()=>setValue(args.value),[args.value]);return <Calendar {...args} value={value} onValueChange={next=>{setValue(next);args.onValueChange(next)}}/>}
export const Default:Story={render:Controlled}; export const Bounds:Story={args:{min:'2026-09-05',max:'2026-09-25'},render:Controlled}; export const DisabledDates:Story={args:{disabledDates:['2026-09-15','2026-09-16']},render:Controlled};
export const KeyboardSelection:Story={render:Controlled,play:async({canvasElement})=>{
 const canvas=within(canvasElement); const selected=canvas.getByRole('button',{name:/September 19/}); selected.focus();
 await userEvent.keyboard('{ArrowRight}{Enter}');
 await expect(canvas.getByRole('button',{name:/September 20/})).toHaveFocus();
 await expect(canvas.getByRole('button',{name:/September 20/}).closest('[role="gridcell"]')).toHaveAttribute('aria-selected','true');
}};
