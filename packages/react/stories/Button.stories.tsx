import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '../src/index';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Save changes', variant: 'primary', disabled: false, loading: false, onClick: fn() },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'quiet'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Review session' } };
export const Quiet: Story = { args: { variant: 'quiet', children: 'Skip for now' } };
export const Loading: Story = { args: { loading: true, children: 'Sending email' } };
export const Disabled: Story = { args: { disabled: true } };
export const Click: Story = {
  args: { onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Save changes' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
