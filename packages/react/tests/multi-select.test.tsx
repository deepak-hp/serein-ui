import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ComponentProps } from 'react';
import { MultiSelect } from '../src/multi-select';

const options = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'research', label: 'Research' },
  { value: 'restricted', label: 'Restricted', disabled: true },
];

function Controlled(props: Partial<ComponentProps<typeof MultiSelect>> = {}) {
  const [value, setValue] = useState(props.value ?? ['design']);
  return <MultiSelect label="Teams" options={options} {...props} value={value} onValueChange={setValue} />;
}

test('selects multiple options with the keyboard and exposes removable chips', async () => {
  const user = userEvent.setup();
  render(<Controlled value={[]} error="Choose at least one team." />);
  const input = screen.getByRole('combobox', { name: 'Teams' });
  await user.click(input);
  expect(await screen.findByRole('listbox', { name: 'Teams' })).toBeVisible();
  expect(input).toHaveAccessibleDescription('Choose at least one team.');
  await user.keyboard('{ArrowDown}{Enter}');
  expect(screen.getByRole('button', { name: 'Remove Design', hidden: true })).toBeInTheDocument();
  await user.keyboard('{ArrowDown}{Enter}');
  expect(screen.getByRole('button', { name: 'Remove Engineering', hidden: true })).toBeInTheDocument();
});

test('removes chips with their named button and chip keyboard controls', async () => {
  const user = userEvent.setup();
  render(<Controlled value={['design', 'engineering', 'research']} />);
  const remove = screen.getByRole('button', { name: 'Remove Design' });
  await user.click(remove);
  expect(screen.queryByRole('button', { name: 'Remove Design' })).not.toBeInTheDocument();
  const input = screen.getByRole('combobox', { name: 'Teams' });
  input.focus();
  await user.keyboard('{ArrowLeft}{Backspace}');
  expect(screen.queryByRole('button', { name: 'Remove Research' })).not.toBeInTheDocument();
  input.focus();
  await user.keyboard('{ArrowLeft}{ArrowLeft}{Delete}');
  expect(screen.queryByRole('button', { name: 'Remove Engineering' })).not.toBeInTheDocument();
});

test('filters labels without discarding selections and announces empty results', async () => {
  const user = userEvent.setup();
  render(<Controlled value={['design']} emptyMessage="No teams found." />);
  const input = screen.getByRole('combobox', { name: 'Teams' });
  await user.click(input);
  await user.type(input, 'engine');
  expect(await screen.findByRole('option', { name: 'Engineering' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Remove Design', hidden: true })).toBeInTheDocument();
  await user.clear(input);
  await user.type(input, 'unavailable');
  expect(await screen.findByText('No teams found.')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Remove Design', hidden: true })).toBeInTheDocument();
});

test('associates descriptions and errors while disabled state blocks input, removals, and options', async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  render(<MultiSelect label="Teams" value={['design']} onValueChange={onValueChange} options={options} description="Choose teams." error="Choose at least one team." disabled />);
  const input = screen.getByRole('combobox', { name: 'Teams' });
  expect(input).toBeDisabled();
  expect(input).toHaveAccessibleDescription('Choose teams. Choose at least one team.');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  input.focus();
  await user.keyboard('{ArrowLeft}{Backspace}{Delete}');
  const remove = screen.getByRole('button', { name: 'Remove Design' });
  expect(remove).toHaveAttribute('aria-disabled', 'true');
  await user.click(remove);
  expect(onValueChange).not.toHaveBeenCalled();
});

test('uses repeated native form values and skips disabled options', async () => {
  const user = userEvent.setup();
  function FormExample() {
    const [value, setValue] = useState(['design']);
    return <form aria-label="Team form"><MultiSelect label="Teams" name="teams" value={value} onValueChange={setValue} options={options} /></form>;
  }
  const { container } = render(<FormExample />);
  const input = screen.getByRole('combobox', { name: 'Teams' });
  await user.click(input);
  await user.type(input, 'restricted');
  expect(await screen.findByRole('option', { name: 'Restricted' })).toHaveAttribute('aria-disabled', 'true');
  await user.keyboard('{ArrowDown}{Enter}');
  expect(screen.queryByRole('button', { name: 'Remove Restricted' })).not.toBeInTheDocument();
  const data = new FormData(container.querySelector('form')!);
  expect(data.getAll('teams')).toEqual(['design']);
});
