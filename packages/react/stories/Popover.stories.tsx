import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Popover } from '../src/index';

const meta = { title: 'Components/Popover', component: Popover, tags: ['autodocs'], args: { triggerLabel: 'Account actions', title: 'Account actions', children: <p>Manage profile and notification preferences.</p> } } satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const EscapeCloses: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); const trigger = canvas.getByRole('button', { name: 'Account actions' }); await userEvent.click(trigger); const body = within(canvasElement.ownerDocument.body); await expect(await body.findByRole('dialog', { name: 'Account actions' })).toBeVisible(); await userEvent.keyboard('{Escape}'); await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument()); await waitFor(() => expect(trigger).toHaveFocus()); } };
