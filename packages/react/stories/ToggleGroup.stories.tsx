import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ToggleGroup } from '../src/index';

const options = [{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }];
const meta = { title: 'Components/ToggleGroup', component: ToggleGroup, tags: ['autodocs'], args: { label: 'View', description: 'Choose the reporting interval.', value: ['day'], options, onValueChange: () => {} } } satisfies Meta<typeof ToggleGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: args => <ControlledToggleGroup {...args} /> };
export const Disabled: Story = { args: { disabled: true }, render: args => <ControlledToggleGroup {...args} /> };
export const Vertical: Story = { args: { orientation: 'vertical' }, render: args => <ControlledToggleGroup {...args} /> };
export const KeyboardSelection: Story = { ...Default, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.tab(); await userEvent.keyboard('{ArrowRight} '); await expect(canvas.getByRole('button', { name: 'Week' })).toHaveAttribute('aria-pressed', 'true'); } };

function ControlledToggleGroup(props: ComponentProps<typeof ToggleGroup>) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  return <ToggleGroup {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange(next); }} />;
}
