import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Readout, Tape } from '../src/index';

const meta = {
  title: 'Components/Tape',
  component: Tape,
  tags: ['autodocs'],
  args: { value: 2400, max: 100000 },
  argTypes: { value: { control: { type: 'number', step: 100 } }, max: { control: { type: 'number', step: 1000 } } },
  parameters: { docs: { description: { component: 'An amount ruler that slides under a fixed signal needle: a graduation every 100, a major every 1,000 and a label every 5,000. Amounts above the limit run into a hatched zone. It is decorative and hidden from assistive technology, so always pair it with a Readout or an action that states the amount.' } } },
} satisfies Meta<typeof Tape>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const OverLimit: Story = { args: { value: 112000 } };
export const Stepped: Story = { render: () => <SteppedDemo /> };

function SteppedDemo() {
  const [value, setValue] = useState(2400);
  return <div style={{ display: 'grid', gap: 12 }}>
    <Readout value={value} size="m" fraction="never" />
    <Tape value={value} max={100000} />
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {[-1000, 1000, 10000, 100000].map(step => <Button key={step} variant="secondary" onClick={() => setValue(Math.max(0, value + step))}>{step < 0 ? '−1,000' : `+${step.toLocaleString('en-IN')}`}</Button>)}
    </div>
  </div>;
}
