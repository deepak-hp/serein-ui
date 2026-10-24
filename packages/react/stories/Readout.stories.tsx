import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Readout } from '../src/index';

const meta = {
  title: 'Components/Readout',
  component: Readout,
  tags: ['autodocs'],
  args: { value: 482315.4, size: 'xl', fraction: 'always', sign: 'auto' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xl', 'l', 'm'] },
    fraction: { control: 'inline-radio', options: ['auto', 'always', 'never'] },
    sign: { control: 'inline-radio', options: ['auto', 'always'] },
  },
  parameters: { docs: { description: { component: 'A money or key figure as an instrument display: light, narrow, tabular figures with a muted currency symbol and fraction. Assistive technology reads the full formatted amount. Use one extra-large readout per screen.' } } },
} satisfies Meta<typeof Readout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Balance: Story = { play: async ({ canvasElement }) => { await expect(within(canvasElement).getByText('₹4,82,315.40')).toBeInTheDocument(); } };
export const AmountEntry: Story = { args: { value: 2400, size: 'l', fraction: 'auto' } };
export const SecondaryFigure: Story = { args: { value: 39776, size: 'm', fraction: 'never' } };
export const Outgoing: Story = { args: { value: -2400, size: 'l', fraction: 'auto' } };
export const Incoming: Story = { args: { value: 15250, size: 'm', sign: 'always', fraction: 'never' } };
