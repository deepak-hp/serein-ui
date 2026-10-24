import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from '../src/index';

const options = [
  { value: 'personal', label: 'Personal', description: 'Your private workspace.' },
  { value: 'studio', label: 'Studio', description: 'A shared creative workspace.' },
  { value: 'client', label: 'Client work', description: 'Separate work for a client.', disabled: true },
];
const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: { label: 'Workspace', value: 'personal', options, onValueChange: () => {}, disabled: false },
  argTypes: { label: { control: 'text' }, value: { control: 'text' }, options: { control: 'object' }, disabled: { control: 'boolean' }, onValueChange: { action: 'changed' } },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: args => <ControlledRadioGroup {...args} /> };
export const Disabled: Story = { args: { disabled: true } };

function ControlledRadioGroup(props: ComponentProps<typeof RadioGroup>) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  const handleValueChange = (next: string) => {
    setValue(next);
    props.onValueChange(next);
  };
  return <RadioGroup {...props} value={value} onValueChange={handleValueChange} />;
}
