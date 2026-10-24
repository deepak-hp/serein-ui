import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { AlertDialog } from '../src/index';

const meta = { title: 'Components/AlertDialog', component: AlertDialog, tags: ['autodocs'], args: { triggerLabel: 'Delete workspace', title: 'Delete workspace?', description: 'This permanently deletes the workspace and its files.', confirmLabel: 'Delete workspace', onConfirm: () => {} } } satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const SafeInitialFocus: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole('button', { name: 'Delete workspace' })); const body = within(canvasElement.ownerDocument.body); await expect(await body.findByRole('alertdialog', { name: 'Delete workspace?' })).toBeVisible(); await waitFor(() => expect(body.getByRole('button', { name: 'Cancel' })).toHaveFocus()); } };
