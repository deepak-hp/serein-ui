import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { IconButton } from '../src/index';
const meta = { title: 'Components/IconButton', component: IconButton, tags: ['autodocs'], args: { label: 'Add item', children: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" /></svg>, onClick: fn() } } satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { play: async ({ canvasElement, args }) => { await userEvent.click(within(canvasElement).getByRole('button', { name: 'Add item' })); await expect(args.onClick).toHaveBeenCalledOnce(); } };
export const Disabled: Story = { args: { disabled: true } };
export const Primary: Story = { args: { variant: 'primary' } };
