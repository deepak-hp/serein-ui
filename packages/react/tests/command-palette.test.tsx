import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { CommandPalette } from '../src/command-palette';

const items = [
  { id: 'new-file', label: 'New file', description: 'Create a file', keywords: ['create'], onSelect: vi.fn() },
  { id: 'settings', label: 'Workspace settings', description: 'Manage workspace preferences', keywords: ['preferences'], onSelect: vi.fn() },
];

test('exposes an accessible dialog, search field, and results', async () => {
  const user = userEvent.setup();
  render(<CommandPalette title="Command center" description="Find an action." items={items} />);
  await user.click(screen.getByRole('button', { name: 'Search commands' }));
  expect(await screen.findByRole('dialog', { name: 'Command center' })).toHaveAccessibleDescription('Find an action.');
  const search = screen.getByRole('combobox', { name: 'Search commands' });
  expect(search).toBeVisible();
  await waitFor(() => expect(search).toHaveFocus());
  expect(screen.getByRole('listbox', { name: 'Command results' })).toBeVisible();
  expect(screen.getByRole('option', { name: /New file/ })).toBeVisible();
});

test('filters labels, descriptions, and keywords, and announces empty results', async () => {
  const user = userEvent.setup();
  render(<CommandPalette items={items} emptyMessage="No commands found." />);
  await user.click(screen.getByRole('button', { name: 'Search commands' }));
  const search = screen.getByRole('combobox', { name: 'Search commands' });
  await user.type(search, 'preferences');
  expect(screen.getByRole('option', { name: /Workspace settings/ })).toBeVisible();
  await user.clear(search);
  await user.type(search, 'missing');
  expect(await screen.findByText('No commands found.')).toBeVisible();
});

test('resets the search when the palette reopens', async () => {
  const user = userEvent.setup();
  render(<CommandPalette items={items} />);
  const trigger = screen.getByRole('button', { name: 'Search commands' });
  await user.click(trigger);
  await user.type(screen.getByRole('combobox', { name: 'Search commands' }), 'settings');
  await user.keyboard('{Escape}');
  await user.click(trigger);
  expect(screen.getByRole('combobox', { name: 'Search commands' })).toHaveValue('');
  expect(screen.getByRole('option', { name: /New file/ })).toBeVisible();
});

test('disabled commands are not selectable', async () => {
  const user = userEvent.setup();
  const onSelect = vi.fn();
  render(<CommandPalette items={[{ id: 'delete', label: 'Delete workspace', disabled: true, onSelect }]} />);
  await user.click(screen.getByRole('button', { name: 'Search commands' }));
  const command = screen.getByRole('option', { name: 'Delete workspace' });
  expect(command).toHaveAttribute('aria-disabled', 'true');
  await user.click(command);
  expect(onSelect).not.toHaveBeenCalled();
});

test('selects the highlighted command with the keyboard once and restores trigger focus', async () => {
  const user = userEvent.setup();
  const onSelect = vi.fn();
  render(<CommandPalette items={[{ id: 'new-file', label: 'New file', onSelect }]} />);
  const trigger = screen.getByRole('button', { name: 'Search commands' });
  await user.click(trigger);
  const search = screen.getByRole('combobox', { name: 'Search commands' });
  await user.type(search, 'new');
  await user.keyboard('{ArrowDown}{Enter}');
  expect(onSelect).toHaveBeenCalledOnce();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test('selects the same command again after reopening', async () => {
  const user = userEvent.setup();
  const onSelect = vi.fn();
  render(<CommandPalette items={[{ id: 'new-file', label: 'New file', onSelect }]} />);
  const trigger = screen.getByRole('button', { name: 'Search commands' });
  for (let cycle = 0; cycle < 2; cycle += 1) {
    await user.click(trigger);
    await user.type(screen.getByRole('combobox', { name: 'Search commands' }), 'new');
    await user.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  }
  expect(onSelect).toHaveBeenCalledTimes(2);
});

test('requests close after selecting while allowing a controlled parent to keep the palette open', async () => {
  const user = userEvent.setup();
  const onOpenChange = vi.fn();
  const onSelect = vi.fn();
  function Example() {
    const [open] = useState(true);
    return <CommandPalette open={open} onOpenChange={onOpenChange} items={[{ id: 'new-file', label: 'New file', onSelect }]} />;
  }
  render(<Example />);
  const search = screen.getByRole('combobox', { name: 'Search commands' });
  await user.type(search, 'new');
  await user.keyboard('{ArrowDown}{Enter}');
  expect(onSelect).toHaveBeenCalledOnce();
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(screen.getByRole('dialog', { name: 'Commands' })).toBeInTheDocument();
});
