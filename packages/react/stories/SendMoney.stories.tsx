import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Keypad, Readout, Tape, type KeypadKey } from '../src/index';

const dailyLimit = 100000;
const meta = {
  title: 'Patterns/Send money',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Amount entry composed from Readout, Tape, Keypad and Button. The keypad edits the amount, the tape slides under its needle, and the action always states what it will do. Over the daily limit the reason is shown in words and the action becomes unavailable.' } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const money = (n: number) => `₹${n.toLocaleString('en-IN')}`;
function SendMoney({ start = 2400 }: { start?: number }) {
  const [amount, setAmount] = useState(start);
  const over = amount > dailyLimit;
  const press = (key: KeypadKey) => setAmount(current => key === 'delete' ? Math.floor(current / 10) : key === '.' ? current : Math.min(key === '00' ? current * 100 : current * 10 + Number(key), 9999999));
  return <section aria-label="Send money" style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
    <div style={{ display: 'grid', gap: 4, justifyItems: 'center' }}>
      <p style={{ margin: 0, fontFamily: 'var(--sr-font-family-mono)', fontSize: 12, color: 'var(--sr-color-ink-muted)' }}>SENDING TO ASHA RAO</p>
      <Readout value={amount} size="l" fraction="never" />
    </div>
    <Tape value={amount} max={dailyLimit} />
    <p role="status" style={{ margin: 0, minHeight: 20, textAlign: 'center', fontSize: 13, color: over ? 'var(--sr-color-danger)' : 'var(--sr-color-ink-muted)' }}>
      {over ? `Daily limit is ${money(dailyLimit)}. Lower the amount to continue.` : `Daily limit ${money(dailyLimit)}`}
    </p>
    <Keypad onKey={press} />
    <Button disabled={over || amount === 0}>{amount === 0 ? 'Enter an amount' : `Send ${money(amount)}`}</Button>
  </section>;
}

export const Default: Story = {
  render: () => <SendMoney />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Send ₹2,400' })).toBeEnabled();
    await userEvent.click(canvas.getByRole('button', { name: '5' }));
    await expect(canvas.getByRole('button', { name: 'Send ₹24,005' })).toBeEnabled();
  },
};
export const OverTheDailyLimit: Story = {
  render: () => <SendMoney start={125000} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Daily limit is ₹1,00,000');
    await expect(canvas.getByRole('button', { name: 'Send ₹1,25,000' })).toBeDisabled();
  },
};
