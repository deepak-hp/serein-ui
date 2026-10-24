import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Drizzle } from '../src/index';

const meta = {
  title: 'Components/Drizzle',
  component: Drizzle,
  tags: ['autodocs'],
  args: { size: 'sm', label: 'Loading statement' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'lg'] } },
  parameters: { docs: { description: { component: "Serein's loading indicator: eight fine graduations that light in turn, like rain filling a gauge. It inherits the surrounding text colour. With a label it is a status announced to assistive technology; without one it is decorative. Under reduced motion the ticks pulse in place." } } },
} satisfies Meta<typeof Drizzle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Loading statement'); } };
export const Large: Story = { args: { size: 'lg' } };
export const Decorative: Story = { args: { label: undefined } };
export const InSignalColour: Story = { render: args => <span style={{ color: 'var(--sr-color-signal-ink)' }}><Drizzle {...args} /></span> };
