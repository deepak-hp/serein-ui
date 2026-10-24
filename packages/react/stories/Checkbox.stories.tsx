import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from '../src/index';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Product updates', description: 'A short weekly digest.', checked: false, onCheckedChange: () => {}, disabled: false, indeterminate: false, hideLabel: false },
  argTypes: { label: { control: 'text' }, description: { control: 'text' }, checked: { control: 'boolean' }, indeterminate: { control: 'boolean' }, disabled: { control: 'boolean' }, hideLabel: { control: 'boolean' }, onCheckedChange: { action: 'changed' } },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: args => <ControlledCheckbox {...args} /> };
export const Indeterminate: Story = { args: { indeterminate: true, checked: false }, render: args => <ControlledCheckbox {...args} /> };
export const Disabled: Story = { args: { disabled: true, checked: true } };
export const KeyboardToggle: Story = {
  render: args => <ControlledCheckbox {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Product updates' });
    await userEvent.tab();
    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();
  },
};

export const CompactRows: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <CompactRowsExample />,
};

function ControlledCheckbox(props: ComponentProps<typeof Checkbox>) {
  const [checked, setChecked] = useState(props.checked);
  const [indeterminate, setIndeterminate] = useState(props.indeterminate);
  useEffect(() => setChecked(props.checked), [props.checked]);
  useEffect(() => setIndeterminate(props.indeterminate), [props.indeterminate]);
  const handleCheckedChange = (next: boolean) => {
    setChecked(next);
    setIndeterminate(false);
    props.onCheckedChange(next);
  };
  return <Checkbox {...props} checked={checked} indeterminate={indeterminate} onCheckedChange={handleCheckedChange} />;
}

const compactFiles = [
  { name: 'quarterly-report-final-approved-with-supporting-notes.pdf', detail: '4.8 MB · Updated today' },
  { name: 'research-interviews-and-observations-from-the-field.docx', detail: '1.2 MB · Updated yesterday' },
  { name: 'archive-2025.zip', detail: '82 MB · Updated 3 days ago' },
];

function CompactRowsExample() {
  const [selected, setSelected] = useState([true, false, false]);
  return <main style={{ width: '100%', maxWidth: 720, padding: 24 }}>
    <h2 style={{ margin: '0 0 16px', fontSize: 20 }}>Project files</h2>
    <div style={{ border: '1px solid var(--dp-divider)', borderRadius: 'var(--dp-radius-panel)', overflow: 'hidden' }}>
      {compactFiles.map((file, index) => <div key={file.name} style={{ display: 'grid', gridTemplateColumns: '48px minmax(0, 1fr)', alignItems: 'center', minHeight: 64, borderTop: index ? '1px solid var(--dp-divider)' : undefined }}>
        <Checkbox hideLabel label={`Select ${file.name}`} checked={selected[index]} onCheckedChange={checked => setSelected(current => current.map((value, itemIndex) => itemIndex === index ? checked : value))} />
        <div style={{ minWidth: 0, padding: '8px 16px 8px 8px' }}>
          <div style={{ overflowWrap: 'anywhere', fontWeight: 600 }}>{file.name}</div>
          <div style={{ marginTop: 2, color: 'var(--dp-muted)', fontSize: 13 }}>{file.detail}</div>
        </div>
      </div>)}
    </div>
  </main>;
}
