import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Keypad, Readout } from '../src/index';

const meta = {
  title: 'Components/Keypad',
  component: Keypad,
  tags: ['autodocs'],
  args: { onKey: fn(), decimal: false, disabled: false },
  decorators: [Story => <div style={{ maxWidth: 320 }}><Story /></div>],
  parameters: { docs: { description: { component: 'Machined numeric keys for touch money entry: a 3 by 4 grid of native buttons, 56px tall, that press down 1px. The keypad only reports keys; the caller decides how each key edits the amount. Delete is named for assistive technology.' } } },
} satisfies Meta<typeof Keypad>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '7' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Delete last digit' }));
    await expect(args.onKey).toHaveBeenNthCalledWith(1, '7');
    await expect(args.onKey).toHaveBeenNthCalledWith(2, 'delete');
  },
};
export const Decimal: Story = { args: { decimal: true } };
export const Disabled: Story = { args: { disabled: true } };
export const EnteringAnAmount: Story = { render: () => <Entering /> };

function Entering() {
  const [amount, setAmount] = useState(0);
  return <div style={{ display: 'grid', gap: 16 }}>
    <Readout value={amount} size="l" />
    <Keypad onKey={key => setAmount(current => key === 'delete' ? Math.floor(current / 10) : key === '.' ? current : Math.min(key === '00' ? current * 100 : current * 10 + Number(key), 9999999))} />
  </div>;
}
