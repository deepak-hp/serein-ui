import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Checkbox, RadioGroup, Switch } from '../src/selection';

test('checkbox toggles from the keyboard and exposes its description', async () => {
  const user = userEvent.setup();
  function Example() {
    const [checked, setChecked] = useState(false);
    return <Checkbox label="Product updates" description="A short weekly digest." checked={checked} onCheckedChange={setChecked} />;
  }
  render(<Example />);
  const checkbox = screen.getByRole('checkbox', { name: 'Product updates' });
  expect(checkbox).toHaveAccessibleDescription('A short weekly digest.');
  await user.tab();
  await user.keyboard(' ');
  expect(checkbox).toBeChecked();
});

test('checkbox exposes an indeterminate state', () => {
  render(<Checkbox label="Select all" checked={false} indeterminate onCheckedChange={() => {}} />);
  expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute('aria-checked', 'mixed');
});

test('hidden checkbox label preserves its accessible name, description, and keyboard activation', async () => {
  const user = userEvent.setup();
  function Example() {
    const [checked, setChecked] = useState(false);
    return <Checkbox hideLabel label="Select quarterly-report-final-approved.pdf" description="Select this file for a bulk action." checked={checked} onCheckedChange={setChecked} />;
  }
  render(<Example />);
  const checkbox = screen.getByRole('checkbox', { name: 'Select quarterly-report-final-approved.pdf' });
  expect(checkbox).toHaveAccessibleDescription('Select this file for a bulk action.');
  await user.tab();
  await user.keyboard(' ');
  expect(checkbox).toBeChecked();
});

test('hidden checkbox label preserves the indeterminate state', () => {
  render(<Checkbox hideLabel label="Select every file" checked={false} indeterminate onCheckedChange={() => {}} />);
  expect(screen.getByRole('checkbox', { name: 'Select every file' })).toHaveAttribute('aria-checked', 'mixed');
});

test('hidden checkbox label preserves the disabled state', async () => {
  const onCheckedChange = vi.fn();
  render(<Checkbox hideLabel label="Select archived-notes.txt" checked={false} disabled onCheckedChange={onCheckedChange} />);
  const checkbox = screen.getByRole('checkbox', { name: 'Select archived-notes.txt' });
  await userEvent.click(checkbox);
  expect(checkbox).toHaveAttribute('aria-disabled', 'true');
  expect(onCheckedChange).not.toHaveBeenCalled();
});

test('disabled switch cannot change', async () => {
  const onCheckedChange = vi.fn();
  render(<Switch label="Live updates" checked={false} onCheckedChange={onCheckedChange} disabled />);
  const control = screen.getByRole('switch', { name: 'Live updates' });
  await userEvent.click(control);
  expect(control).toHaveAttribute('aria-disabled', 'true');
  expect(onCheckedChange).not.toHaveBeenCalled();
});

test('radio group selects an option with the keyboard and preserves option descriptions', async () => {
  const user = userEvent.setup();
  function Example() {
    const [value, setValue] = useState('personal');
    return <RadioGroup label="Workspace" value={value} onValueChange={setValue} options={[
      { value: 'personal', label: 'Personal', description: 'Your private space.' },
      { value: 'studio', label: 'Studio', description: 'A shared workspace.' },
    ]} />;
  }
  render(<Example />);
  const personal = screen.getByRole('radio', { name: 'Personal' });
  expect(personal).toHaveAccessibleDescription('Your private space.');
  await user.tab();
  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('radio', { name: 'Studio' })).toBeChecked();
});

test('disabled radio options cannot be selected', async () => {
  const onValueChange = vi.fn();
  render(<RadioGroup label="Workspace" value="personal" onValueChange={onValueChange} options={[
    { value: 'personal', label: 'Personal' },
    { value: 'studio', label: 'Studio', disabled: true },
  ]} />);
  const studio = screen.getByRole('radio', { name: 'Studio' });
  await userEvent.click(studio);
  expect(studio).toHaveAttribute('aria-disabled', 'true');
  expect(onValueChange).not.toHaveBeenCalled();
});

test('radio descriptions remain associated when values contain spaces', () => {
  render(<RadioGroup label="Workspace" value="studio space" onValueChange={() => {}} options={[
    { value: 'studio space', label: 'Studio', description: 'A shared workspace.' },
  ]} />);
  expect(screen.getByRole('radio', { name: 'Studio' })).toHaveAccessibleDescription('A shared workspace.');
});
