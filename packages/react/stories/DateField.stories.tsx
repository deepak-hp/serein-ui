import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateField } from '../src/index';

const meta = { title: 'Components/DateField', component: DateField, tags: ['autodocs'], args: { label: 'Start date', description: 'Use your local date.', value: '2026-09-19', onValueChange: () => {} } } satisfies Meta<typeof DateField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: args => <ControlledDateField {...args} /> };
export const Error: Story = { args: { error: 'Choose a start date.' }, render: args => <ControlledDateField {...args} /> };
export const Disabled: Story = { args: { disabled: true }, render: args => <ControlledDateField {...args} /> };

function ControlledDateField(props: ComponentProps<typeof DateField>) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  return <DateField {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange(next); }} />;
}
