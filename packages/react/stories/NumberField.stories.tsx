import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberField } from '../src/index';

const meta = { title: 'Components/NumberField', component: NumberField, tags: ['autodocs'], args: { label: 'Seats', description: 'Choose between 1 and 20 seats.', value: 4, min: 1, max: 20, onValueChange: () => {} } } satisfies Meta<typeof NumberField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: args => <ControlledNumberField {...args} /> };
export const Error: Story = { args: { error: 'Choose a number between 1 and 20.' }, render: args => <ControlledNumberField {...args} /> };
export const Disabled: Story = { args: { disabled: true }, render: args => <ControlledNumberField {...args} /> };

function ControlledNumberField(props: ComponentProps<typeof NumberField>) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  return <NumberField {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange(next); }} />;
}
