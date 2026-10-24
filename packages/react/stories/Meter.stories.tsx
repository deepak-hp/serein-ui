import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Meter } from '../src/index';

const meta = {
  title: 'Components/Meter',
  component: Meter,
  tags: ['autodocs'],
  args: { value: 39776, max: 60000, limit: 55000, label: 'October budget used' },
  argTypes: { value: { control: { type: 'number', step: 1000 } }, max: { control: { type: 'number', step: 1000 } }, limit: { control: { type: 'number', step: 1000 } }, unit: { control: 'number' } },
  decorators: [Story => <div style={{ maxWidth: 520 }}><Story /></div>],
  parameters: { docs: { description: { component: 'The horizontal variant of Gauge for tight spaces: a fluid graduated bar with the same props and meter semantics, and the limit labelled beneath its dashed marker.' } } },
} satisfies Meta<typeof Meter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Budget: Story = { play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('meter', { name: 'October budget used' })).toHaveAttribute('aria-valuenow', '39776'); } };
export const WithoutLimit: Story = { args: { limit: undefined, label: 'Storage used', value: 24000 } };
export const NearLimit: Story = { args: { value: 54200 } };
