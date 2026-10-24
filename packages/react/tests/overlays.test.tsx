import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Tooltip, Popover, DropdownMenu, AlertDialog, Drawer, Accordion } from '../src/overlays';

test('tooltip exposes descriptive content on keyboard focus', async () => {
  const user = userEvent.setup();
  render(<Tooltip content="Copies the workspace link"><button>Copy link</button></Tooltip>);
  await user.tab();
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Copies the workspace link');
});

test('popover closes with Escape and restores trigger focus', async () => {
  const user = userEvent.setup();
  render(<Popover triggerLabel="Account actions" title="Account actions"><p>Manage your profile.</p></Popover>);
  const trigger = screen.getByRole('button', { name: 'Account actions' });
  await user.click(trigger);
  expect(await screen.findByRole('dialog', { name: 'Account actions' })).toBeInTheDocument();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test('dropdown menu exposes disabled items and activates an available item', async () => {
  const user = userEvent.setup();
  const archive = vi.fn();
  render(<DropdownMenu triggerLabel="More actions" items={[{ label: 'Rename' }, { label: 'Delete', disabled: true }, { label: 'Archive', onSelect: archive }]} />);
  const trigger = screen.getByRole('button', { name: 'More actions' });
  await user.click(trigger);
  expect(await screen.findByRole('menu')).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('aria-disabled', 'true');
  await user.click(screen.getByRole('menuitem', { name: 'Archive' }));
  expect(archive).toHaveBeenCalledOnce();
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});

test('destructive alert dialog starts on cancel and does not dismiss from its backdrop', async () => {
  const user = userEvent.setup();
  render(<AlertDialog triggerLabel="Delete workspace" title="Delete workspace?" description="This cannot be undone." confirmLabel="Delete" onConfirm={() => {}} />);
  const trigger = screen.getByRole('button', { name: 'Delete workspace' });
  await user.click(trigger);
  expect(await screen.findByRole('alertdialog', { name: 'Delete workspace?' })).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus());
  await user.click(document.querySelector('[data-base-ui-dialog-backdrop]') as HTMLElement);
  expect(screen.getByRole('alertdialog', { name: 'Delete workspace?' })).toBeInTheDocument();
  await user.keyboard('{Escape}');
  await waitFor(() => expect(trigger).toHaveFocus());
});

test('drawer closes when the close action is pressed', async () => {
  const user = userEvent.setup();
  render(<Drawer triggerLabel="Open navigation" title="Navigation"><a href="#overview">Overview</a></Drawer>);
  await user.click(screen.getByRole('button', { name: 'Open navigation' }));
  expect(await screen.findByRole('dialog', { name: 'Navigation' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Close Navigation' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('accordion expands its selected panel with the keyboard', async () => {
  const user = userEvent.setup();
  render(<Accordion label="Frequently asked questions" items={[{ value: 'shipping', label: 'Shipping', content: 'Orders leave within two days.' }]} />);
  await user.tab();
  await user.keyboard('{Enter}');
  expect(screen.getByRole('region', { name: 'Shipping' })).toHaveTextContent('Orders leave within two days.');
});

test('controlled accordion keeps its expanded label and chevron state in sync', async () => {
  function Example() { const [value, setValue] = useState(['shipping']); return <><button onClick={() => setValue([])}>Collapse shipping</button><Accordion label="Frequently asked questions" value={value} onValueChange={setValue} items={[{ value: 'shipping', label: 'Shipping', content: 'Orders leave within two days.' }]} /></>; }
  render(<Example />);
  const trigger = screen.getByRole('button', { name: 'Shipping' });
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(trigger.querySelector('svg')).toHaveAttribute('data-expanded', 'true');
  expect(screen.getByRole('region', { name: 'Shipping' })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Collapse shipping' }));
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(trigger.querySelector('svg')).toHaveAttribute('data-expanded', 'false');
  expect(screen.queryByRole('region', { name: 'Shipping' })).not.toBeInTheDocument();
});
