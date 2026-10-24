import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { CommandPalette } from '../src/index';

const items = [
  { id: 'new-file', label: 'New file', description: 'Create a blank file in this workspace.', keywords: ['create', 'document'], onSelect: fn() },
  { id: 'open-settings', label: 'Workspace settings', description: 'Manage preferences and access.', keywords: ['preferences', 'settings'], onSelect: fn() },
  { id: 'archive', label: 'Archive workspace', description: 'Archive this workspace after review.', disabled: true, onSelect: fn() },
];

const meta = {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  args: { items },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { defaultOpen: true, title: 'Command center', description: 'Search the actions available in this workspace.' },
};

export const KeyboardAction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Search commands' }));
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.type(body.getByRole('combobox', { name: 'Search commands' }), 'new');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Search commands' })).toHaveFocus());
    await expect(items[0].onSelect).toHaveBeenCalledOnce();
  },
};

export const NoResults: Story = {
  args: { defaultOpen: true, emptyMessage: 'No workspace actions match that search.' },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.type(body.getByRole('combobox', { name: 'Search commands' }), 'unavailable');
    await expect(body.getByText('No workspace actions match that search.')).toBeVisible();
  },
};

export const DisabledAction: Story = {
  args: { defaultOpen: true },
};
