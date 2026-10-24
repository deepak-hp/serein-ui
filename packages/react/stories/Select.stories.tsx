import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Select } from '../src/index';

const options = [{ value: 'personal', label: 'Personal' }, { value: 'studio', label: 'Studio' }, { value: 'client', label: 'Client work' }];
const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { label: 'Workspace', value: 'personal', options, onValueChange: () => {}, disabled: false },
  argTypes: { label: { control: 'text' }, value: { control: 'text' }, disabled: { control: 'boolean' }, options: { control: 'object' }, onValueChange: { action: 'changed' } },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: args => <ControlledSelect {...args} />,
};

function ControlledSelect(props: ComponentProps<typeof Select>) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  const handleValueChange = (next: string) => {
    setValue(next);
    props.onValueChange(next);
  };
  return <Select {...props} value={value} onValueChange={handleValueChange} />;
}
export const Disabled: Story = { args: { disabled: true } };
export const Placeholder: Story = { ...Default, args:{value:null,placeholder:'Choose a workspace'} };
export const Error: Story = { ...Default, args:{value:null,description:'Choose where to create your project.',error:'Choose a workspace to continue.'} };
export const Empty: Story = { ...Default,args:{value:null,options:[]} };
export const LongLabels: Story = { ...Default,args:{options:[{value:'personal',label:'Personal workspace for design and development'},{value:'studio',label:'Studio workspace with shared project resources'},{value:'client',label:'Client work',disabled:true}]} };
export const Open: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox', { name: 'Workspace' }));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByRole('listbox')).toBeVisible();
  },
};
export const KeyboardSelection: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Workspace' });
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByRole('option', { name: 'Client work' })).toBeVisible();
    await userEvent.keyboard('{End}{Enter}');
    await expect(trigger).toHaveTextContent('Client work');
    await waitFor(() => expect(body.queryByRole('listbox')).not.toBeInTheDocument());
  },
};
