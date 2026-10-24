import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Combobox } from '../src/index';

const options = [{ value: 'personal', label: 'Personal' }, { value: 'studio', label: 'Studio' }, { value: 'client', label: 'Client work' }];
const meta = { title: 'Components/Combobox', component: Combobox, tags: ['autodocs'], args: { label: 'Workspace', description: 'Search your available workspaces.', value: 'personal', options, onValueChange: () => {} } } satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: args => <ControlledCombobox {...args} /> };
export const Disabled: Story = { args: { disabled: true }, render: args => <ControlledCombobox {...args} /> };
export const KeyboardSelection: Story = { ...Default, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.tab(); await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}'); await expect(canvas.getByRole('combobox', { name: 'Workspace' })).toHaveValue('Studio'); } };
export const EmptyResults: Story = { ...Default, play: async ({ canvasElement }) => { const canvas = within(canvasElement); const input = canvas.getByRole('combobox', { name: 'Workspace' }); await userEvent.tab(); await userEvent.clear(input); await userEvent.type(input, 'unavailable'); await expect(input).toHaveValue('unavailable'); const body = within(canvasElement.ownerDocument.body); await expect(await body.findByText('No matching options.')).toBeVisible(); } };

function ControlledCombobox(props: ComponentProps<typeof Combobox>) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  return <Combobox {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange(next); }} />;
}
