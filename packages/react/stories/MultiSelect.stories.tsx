import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { MultiSelect } from '../src/index';

const options = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'research', label: 'Research' },
  { value: 'customer-success', label: 'Customer success' },
  { value: 'restricted', label: 'Restricted team', disabled: true },
];

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  args: { label: 'Teams', value: ['design'], options, description: 'Choose every team with access.', onValueChange: () => {} },
} satisfies Meta<typeof MultiSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: args => <ControlledMultiSelect {...args} /> };
export const KeyboardSelection: Story = {
  render: args => <ControlledMultiSelect {...args} value={[]} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Teams' });
    await userEvent.click(input);
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByRole('listbox', { name: 'Teams' })).toBeVisible();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await userEvent.keyboard('{Escape}');
    await expect(within(canvasElement).getByRole('button', { name: 'Remove Design' })).toBeInTheDocument();
  },
};
export const EmptyResults: Story = {
  render: args => <ControlledMultiSelect {...args} emptyMessage="No teams match that search." />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Teams' });
    await userEvent.click(input);
    await userEvent.type(input, 'unavailable');
    await expect(await within(canvasElement.ownerDocument.body).findByText('No teams match that search.')).toBeVisible();
  },
};
export const Error: Story = { args: { value: [], error: 'Choose at least one team.' }, render: args => <ControlledMultiSelect {...args} /> };
export const Disabled: Story = { args: { disabled: true }, render: args => <ControlledMultiSelect {...args} /> };
export const LongLabels: Story = {
  args: {
    value: ['design', 'customer-success'],
    options: [
      { value: 'design', label: 'Design systems and interface foundations' },
      { value: 'customer-success', label: 'Customer success, support, and long-term partnerships' },
      { value: 'research', label: 'Research' },
    ],
  },
  render: args => <ControlledMultiSelect {...args} />,
};

function ControlledMultiSelect(props: ComponentProps<typeof MultiSelect>) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  return <MultiSelect {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange(next); }} />;
}
