import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Tooltip } from '../src/index';

const meta = { title: 'Components/Tooltip', component: Tooltip, tags: ['autodocs'], args: { content: 'Copies a shareable workspace link', children: <Button variant="secondary">Copy link</Button> } } satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const KeyboardFocus: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.tab(); const body = within(canvasElement.ownerDocument.body); await expect(await body.findByRole('tooltip')).toHaveTextContent('Copies a shareable workspace link'); await expect(canvas.getByRole('button', { name: 'Copy link' })).toHaveFocus(); } };
