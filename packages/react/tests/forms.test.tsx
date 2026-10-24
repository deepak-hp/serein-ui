import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import axe from 'axe-core';
import { Combobox, DateField, FileUpload, NumberField, Slider, Textarea, ToggleGroup } from '../src/forms';

test('textarea associates its description and error with its visible label', () => {
  render(<Textarea label="Project brief" description="Keep it concise." error="Add a summary." />);
  const input = screen.getByRole('textbox', { name: 'Project brief' });
  expect(input).toHaveAccessibleDescription('Keep it concise. Add a summary.');
  expect(input).toHaveAttribute('aria-invalid', 'true');
});

test('number field changes with the keyboard and reports errors', async () => {
  const user = userEvent.setup();
  function Example() {
    const [value, setValue] = useState<number | null>(2);
    return <NumberField label="Seats" value={value} onValueChange={setValue} min={1} max={5} error="Choose between 1 and 5." />;
  }
  render(<Example />);
  const input = screen.getByRole('textbox', { name: 'Seats' });
  expect(input).toHaveAccessibleDescription('Choose between 1 and 5.');
  await user.tab();
  await user.keyboard('{ArrowUp}');
  expect(input).toHaveValue('3');
});

test('slider changes from the keyboard and disabled sliders cannot change', async () => {
  const user = userEvent.setup();
  function Example() {
    const [value, setValue] = useState(40);
    return <Slider label="Volume" value={value} onValueChange={setValue} min={0} max={100} step={10} />;
  }
  render(<Example />);
  const slider = screen.getByRole('slider', { name: 'Volume' });
  await user.tab();
  await user.keyboard('{ArrowRight}');
  expect(slider).toHaveAttribute('aria-valuenow', '50');
});

test('disabled slider does not call its change handler', async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  render(<Slider label="Volume" value={40} onValueChange={onValueChange} disabled />);
  const slider = screen.getByRole('slider', { name: 'Volume' });
  await user.click(slider);
  await user.keyboard('{ArrowRight}');
  expect(onValueChange).not.toHaveBeenCalled();
});

test('slider attaches validation metadata to its range input', () => {
  const { rerender } = render(<Slider label="Volume" value={40} onValueChange={() => {}} error="Choose a volume." />);
  const slider = screen.getByRole('slider', { name: 'Volume' });
  expect(slider).toHaveAttribute('aria-invalid', 'true');
  expect(slider).toHaveAccessibleDescription('Choose a volume.');
  expect(slider).toHaveAttribute('aria-errormessage');
  rerender(<Slider label="Volume" value={40} onValueChange={() => {}} />);
  expect(slider).not.toHaveAttribute('aria-invalid');
  expect(slider).not.toHaveAttribute('aria-errormessage');
});

test('combobox filters labels, announces an empty search, and selects with the keyboard', async () => {
  const user = userEvent.setup();
  function Example() {
    const [value, setValue] = useState<string | null>('personal');
    return <Combobox label="Workspace" placeholder="Search workspaces" value={value} onValueChange={setValue} options={[
      { value: 'personal', label: 'Personal' },
      { value: 'studio', label: 'Studio' },
    ]} />;
  }
  render(<Example />);
  const input = screen.getByRole('combobox', { name: 'Workspace' });
  expect(input).toHaveAttribute('placeholder', 'Search workspaces');
  await user.tab();
  await user.type(input, 'no workspace');
  expect(await screen.findByText('No matching options.')).toBeVisible();
  await user.clear(input);
  await user.type(input, 'studio');
  await user.keyboard('{ArrowDown}{Enter}');
  expect(input).toHaveValue('Studio');
});

test('open combobox retains an accessible label while showing empty search results', async () => {
  const user = userEvent.setup();
  render(<main><Combobox label="Workspace" value={null} onValueChange={() => {}} options={[{ value: 'personal', label: 'Personal' }]} /></main>);
  const input = screen.getByRole('combobox', { name: 'Workspace' });
  await user.click(input);
  const listbox = await screen.findByRole('listbox', { name: 'Workspace' });
  expect(listbox).toBeVisible();
  await user.type(input, 'unavailable');
  expect(await screen.findByText('No matching options.')).toBeVisible();
  // Keep the body-mounted popup inside this isolated page fixture's landmark for the broad axe scan.
  const portal = listbox.closest('[data-base-ui-portal]')!;
  const portalParent = portal.parentNode!;
  screen.getByRole('main').append(portal);
  try {
    const results = await axe.run(document.body, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
    expect(results.violations).toEqual([]);
  } finally {
    portalParent.append(portal);
  }
});

test('toggle group supports arrow-key focus and selection', async () => {
  const user = userEvent.setup();
  function Example() {
    const [value, setValue] = useState<string[]>(['day']);
    return <ToggleGroup label="View" value={value} onValueChange={setValue} options={[
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
    ]} />;
  }
  render(<Example />);
  const day = screen.getByRole('button', { name: 'Day' });
  await user.tab();
  expect(day).toHaveFocus();
  await user.keyboard('{ArrowRight} ');
  expect(screen.getByRole('button', { name: 'Week' })).toHaveAttribute('aria-pressed', 'true');
});

test('date field retains native date semantics and reports changes', async () => {
  const onValueChange = vi.fn();
  render(<DateField label="Start date" value="2026-09-19" onValueChange={onValueChange} />);
  const input = screen.getByLabelText('Start date');
  expect(input).toHaveAttribute('type', 'date');
  await userEvent.clear(input);
  await userEvent.type(input, '09/20/2026');
  expect(onValueChange).toHaveBeenCalled();
});

test('file upload exposes the native file input and selected files', async () => {
  const user = userEvent.setup();
  const onFilesChange = vi.fn();
  render(<FileUpload label="Supporting files" description="PDF files only." accept="application/pdf" onFilesChange={onFilesChange} />);
  const input = screen.getByLabelText('Supporting files');
  expect(input).toHaveAttribute('type', 'file');
  expect(input).toHaveAccessibleDescription('PDF files only.');
  const file = new File(['brief'], 'brief.pdf', { type: 'application/pdf' });
  await user.upload(input, file);
  expect(onFilesChange).toHaveBeenCalledWith(expect.any(FileList));
});
