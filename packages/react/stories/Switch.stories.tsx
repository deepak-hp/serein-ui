import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '../src/index';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: 'Live updates', description: 'Refresh your workspace automatically.', checked: false, onCheckedChange: () => {}, disabled: false },
  argTypes: { label: { control: 'text' }, description: { control: 'text' }, checked: { control: 'boolean' }, disabled: { control: 'boolean' }, onCheckedChange: { action: 'changed' } },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: args => <ControlledSwitch {...args} /> };
export const On: Story = { args: { checked: true }, render: args => <ControlledSwitch {...args} /> };
export const Disabled: Story = { args: { disabled: true, checked: true } };

function ControlledSwitch(props: ComponentProps<typeof Switch>) {
  const [checked, setChecked] = useState(props.checked);
  useEffect(() => setChecked(props.checked), [props.checked]);
  const handleCheckedChange = (next: boolean) => {
    setChecked(next);
    props.onCheckedChange(next);
  };
  return <Switch {...props} checked={checked} onCheckedChange={handleCheckedChange} />;
}
