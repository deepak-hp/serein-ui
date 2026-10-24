import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkspaceSettingsExample } from '../stories/WorkspaceSettingsExample';

test('settings saves the draft locally and resets to the last saved values', async () => {
  const user = userEvent.setup();
  render(<WorkspaceSettingsExample />);
  const name = screen.getByRole('textbox', { name: 'Workspace name' });
  await user.clear(name);
  await user.type(name, 'Studio North');
  await user.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(screen.getByRole('status', { name: 'Save status' })).toHaveTextContent('Saved in this preview.');
  await user.clear(name);
  await user.type(name, 'Unsaved draft');
  await user.click(screen.getByRole('button', { name: 'Reset changes' }));
  expect(name).toHaveValue('Studio North');
});

test('settings preserves project selections across tabs', async () => {
  const user = userEvent.setup();
  render(<WorkspaceSettingsExample />);
  await user.click(screen.getByRole('button', { name: 'Remove Design system' }));
  await user.click(screen.getByRole('tab', { name: 'Notifications' }));
  await user.click(screen.getByRole('tab', { name: 'General' }));
  expect(screen.queryByRole('button', { name: 'Remove Design system' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Reset changes' }));
  expect(screen.getByRole('button', { name: 'Remove Design system' })).toBeInTheDocument();
});

test('an invalid field on another tab returns to General and focuses the error', async () => {
  const user = userEvent.setup();
  render(<WorkspaceSettingsExample />);
  const name = screen.getByRole('textbox', { name: 'Workspace name' });
  await user.clear(name);
  await user.click(screen.getByRole('tab', { name: 'Notifications' }));
  await user.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute('aria-selected', 'true');
  expect(name).toHaveAttribute('aria-invalid', 'true');
  await waitFor(() => expect(name).toHaveFocus());
  await user.type(name, 'Recovered workspace');
  await user.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(screen.getByRole('status', { name: 'Save status' })).toHaveTextContent('Saved in this preview.');
});
