import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Gauge } from '../src/index';

const meta = {
  title: 'Components/Gauge',
  component: Gauge,
  tags: ['autodocs'],
  args: { value: 39776, max: 60000, limit: 55000, label: 'October budget used' },
  argTypes: { value: { control: { type: 'number', step: 1000 } }, max: { control: { type: 'number', step: 1000 } }, limit: { control: { type: 'number', step: 1000 } }, unit: { control: 'number' } },
  parameters: { docs: { description: { component: 'A budget or quota as a vertical graduated rain-gauge tube: 4px per scale unit, ticks at 1, 5 and 10 units, and a dashed limit line. It is exposed as a meter whose accessible name and text state the value and limit in words. Use Meter where width is tight.' } } },
} satisfies Meta<typeof Gauge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Budget: Story = { play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('meter', { name: 'October budget used' })).toHaveAttribute('aria-valuetext', '₹39,776 of ₹55,000'); } };
export const WithoutLimit: Story = { args: { limit: undefined, label: 'Storage used', value: 24000 } };
export const NearLimit: Story = { args: { value: 54200 } };
export const CustomScale: Story = { args: { value: 140, max: 200, limit: 180, unit: 10, label: 'Data used', formatTick: (v: number) => `${v} GB`, formatValue: (v: number) => `${v} GB` } };
