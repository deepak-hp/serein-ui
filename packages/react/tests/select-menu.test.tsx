import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../src/components';
import { DropdownMenu } from '../src/overlays';

test('Select exposes placeholder and associated validation help', () => {
  render(<Select label="Project" value={null} onValueChange={() => {}} options={[]} placeholder="Choose a project" description="Choose your working project." error="A project is required." />);
  const input = screen.getByRole('combobox', { name: 'Project' });
  expect(input).toHaveTextContent('Choose a project');
  expect(input).toHaveAccessibleDescription('Choose your working project. A project is required.');
  expect(input).toHaveAttribute('aria-invalid', 'true');
});

test('Select prevents choosing a disabled option', async () => {
  const user = userEvent.setup(); const changed = vi.fn();
  render(<Select label="Project" value="one" onValueChange={changed} options={[{ value: 'one', label: 'One' }, { value: 'two', label: 'Restricted', disabled: true }]} />);
  await user.tab();
  await user.keyboard('{ArrowDown}');
  const blocked = await screen.findByRole('option', { name: 'Restricted' });
  expect(blocked).toHaveAttribute('aria-disabled', 'true');
  await user.click(blocked);
  expect(changed).not.toHaveBeenCalled();
});

test('empty menu explains why no actions are offered', () => {
  render(<DropdownMenu defaultOpen triggerLabel="Actions" items={[]} />);
  expect(screen.getByRole('menuitem', { name: 'No actions available.' })).toHaveAttribute('aria-disabled', 'true');
});

test('menu activation invokes one action without submitting its containing form', async () => {
  const user = userEvent.setup(); const selected = vi.fn(); const submit = vi.fn(event => event.preventDefault());
  render(<form onSubmit={submit}><DropdownMenu triggerLabel="Actions" items={[{ label: 'Rename', onSelect: selected }]} /></form>);
  await user.tab(); await user.keyboard('{ArrowDown}');
  await user.keyboard('{Enter}');
  expect(selected).toHaveBeenCalledOnce(); expect(submit).not.toHaveBeenCalled();
});
