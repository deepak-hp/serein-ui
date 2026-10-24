import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Slider } from '../src/index';

const meta = { title: 'Components/Slider', component: Slider, tags: ['autodocs'], args: { label: 'Volume', description: 'Set the playback volume.', value: 40, min: 0, max: 100, step: 10, onValueChange: () => {} } } satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: args => <ControlledSlider {...args} /> };
export const Disabled: Story = { args: { disabled: true }, render: args => <ControlledSlider {...args} /> };
export const KeyboardChange: Story = { ...Default, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.tab(); await userEvent.keyboard('{ArrowRight}'); await expect(canvas.getByRole('slider', { name: 'Volume' })).toHaveAttribute('aria-valuenow', '50'); } };

function ControlledSlider(props: ComponentProps<typeof Slider>) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  return <Slider {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange(next); }} />;
}
