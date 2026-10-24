import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from '../src/tabs';

function Example() {
  const [value, setValue] = useState('overview');
  return <Tabs label="Session details" value={value} onValueChange={setValue} items={[
    { value: 'overview', label: 'Overview', content: <p>Session overview</p> },
    { value: 'locked', label: 'Locked', disabled: true, content: <p>Unavailable content</p> },
    { value: 'notes', label: 'Notes', content: <input aria-label="Session notes" /> },
  ]} />;
}

test('tabs expose named panels and arrow navigation cannot activate disabled tabs', async () => {
  const user = userEvent.setup();
  render(<Example />);
  expect(screen.getByRole('tablist', { name: 'Session details' })).toBeInTheDocument();
  expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Session overview');
  await user.tab();
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', { name: 'Locked' })).toHaveFocus();
  expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', { name: 'Notes' })).toHaveFocus();
  expect(screen.getByRole('tab', { name: 'Notes' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel', { name: 'Notes' })).toBeInTheDocument();
  expect(screen.queryByRole('tabpanel', { name: 'Overview' })).not.toBeInTheDocument();
});

test('switching tabs retains input values and cannot activate a disabled tab', async () => {
  const user = userEvent.setup();
  render(<Example />);
  await user.click(screen.getByRole('tab', { name: 'Notes' }));
  await user.type(screen.getByRole('textbox', { name: 'Session notes' }), 'Keep this note');
  await user.click(screen.getByRole('tab', { name: 'Overview' }));
  await user.click(screen.getByRole('tab', { name: 'Locked' }));
  expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  await user.click(screen.getByRole('tab', { name: 'Notes' }));
  expect(screen.getByRole('textbox', { name: 'Session notes' })).toHaveValue('Keep this note');
});
