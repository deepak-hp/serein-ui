import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Dialog } from '../src/components';
import { AlertDialog, Drawer, DropdownMenu, Popover } from '../src/overlays';

test('popover and dropdown menu honor defaultOpen', () => {
  render(<><Popover defaultOpen triggerLabel="Account actions" title="Account actions"><p>Manage your profile.</p></Popover><DropdownMenu defaultOpen triggerLabel="More actions" items={[{ label: 'Archive' }]} /></>);
  expect(screen.getByRole('dialog', { name: 'Account actions' })).toBeInTheDocument();
  expect(screen.getByRole('menu')).toBeInTheDocument();
});

test('a controlled dialog reports close without closing when its parent refuses', async () => {
  const user = userEvent.setup();
  const onOpenChange = vi.fn();
  render(<Dialog open triggerLabel="Review session" title="Start a session" description="Review your focus time." onOpenChange={onOpenChange}>45 minutes</Dialog>);
  expect(screen.getByRole('dialog', { name: 'Start a session' })).toBeInTheDocument();
  await user.keyboard('{Escape}');
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(screen.getByRole('dialog', { name: 'Start a session' })).toBeInTheDocument();
});

test('a controlled drawer closes when its parent accepts the requested state', async () => {
  const user = userEvent.setup();
  function Example() { const [open, setOpen] = useState(true); return <Drawer open={open} onOpenChange={setOpen} triggerLabel="Open navigation" title="Navigation">Overview</Drawer>; }
  render(<Example />);
  await user.click(screen.getByRole('button', { name: 'Close Navigation' }));
  expect(screen.queryByRole('dialog', { name: 'Navigation' })).not.toBeInTheDocument();
});

test('alert dialog confirmation reports the action without overriding controlled open state', async () => {
  const user = userEvent.setup();
  const confirm = vi.fn();
  const onOpenChange = vi.fn();
  render(<AlertDialog open triggerLabel="Delete workspace" title="Delete workspace?" description="This cannot be undone." confirmLabel="Delete" onConfirm={confirm} onOpenChange={onOpenChange} />);
  await user.click(screen.getByRole('button', { name: 'Delete' }));
  expect(confirm).toHaveBeenCalledOnce();
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(screen.getByRole('alertdialog', { name: 'Delete workspace?' })).toBeInTheDocument();
});
