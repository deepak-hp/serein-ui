import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs } from '../src/index';

const items = [
  { value: 'overview', label: 'Overview', content: <p>Your system at a glance.</p> },
  { value: 'activity', label: 'Activity', content: <p>Recent changes and activity.</p> },
  { value: 'settings', label: 'Settings', content: <p>Workspace preferences.</p> },
];
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { label: 'Workspace views', value: 'overview', items, onValueChange: () => {} },
  argTypes: { label: { control: 'text' }, value: { control: 'text' }, items: { control: 'object' }, onValueChange: { action: 'changed' } },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: args => <ControlledTabs {...args} /> };
export const ArrowNavigation: Story = {
  render: args => <ControlledTabs {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overview = canvas.getByRole('tab', { name: 'Overview' });
    await userEvent.click(overview);
    await userEvent.keyboard('{ArrowRight}');
    const activity = canvas.getByRole('tab', { name: 'Activity' });
    await expect(activity).toHaveAttribute('aria-selected', 'true');
  },
};

function ControlledTabs(props: ComponentProps<typeof Tabs>) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  const handleValueChange = (next: string) => {
    setValue(next);
    props.onValueChange(next);
  };
  return <Tabs {...props} value={value} onValueChange={handleValueChange} />;
}
