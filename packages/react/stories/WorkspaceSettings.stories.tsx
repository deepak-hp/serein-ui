import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { WorkspaceSettingsExample } from './WorkspaceSettingsExample';

const meta = {
  title: 'Patterns/Workspace settings',
  component: WorkspaceSettingsExample,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A local settings workflow composed from public components. Search changes the active section; selections survive tab changes; Save stores the draft only in this preview.' } } },
} satisfies Meta<typeof WorkspaceSettingsExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ValidationAcrossTabs: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByRole('textbox', { name: 'Workspace name' }));
    await userEvent.click(canvas.getByRole('tab', { name: 'Notifications' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(canvas.getByRole('tab', { name: 'General' })).toHaveAttribute('aria-selected', 'true');
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Workspace name' })).toHaveFocus());
    await expect(canvas.getByRole('textbox', { name: 'Workspace name' })).toHaveAccessibleDescription('Shown to everyone in this workspace. Enter a workspace name.');
  },
};
export const SearchAndSave: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole('textbox', { name: 'Workspace name' });
    await userEvent.clear(name);
    await userEvent.type(name, 'Studio North');
    const trigger = canvas.getByRole('button', { name: 'Find a setting' });
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole('dialog', { name: 'Workspace commands' });
    await userEvent.type(within(dialog).getByRole('combobox'), 'notification');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(canvas.getByRole('tab', { name: 'Notifications' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(canvas.getByRole('switch', { name: 'Email updates' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(canvas.getByRole('status', { name: 'Save status' })).toHaveTextContent('Saved in this preview.');
    await userEvent.click(canvas.getByRole('tab', { name: 'General' }));
    await expect(canvas.getByRole('textbox', { name: 'Workspace name' })).toHaveValue('Studio North');
  },
};
