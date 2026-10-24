import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Combobox, Drawer, Select } from '../src/index';

const meta = { title: 'Components/Drawer', component: Drawer, tags: ['autodocs'], args: { triggerLabel: 'Open navigation', title: 'Navigation', description: 'Move between workspace areas.', children: <nav aria-label="Workspace"><a href="#overview">Overview</a></nav>, side: 'right' } } satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const EscapeCloses: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); const trigger = canvas.getByRole('button', { name: 'Open navigation' }); await userEvent.click(trigger); const body = within(canvasElement.ownerDocument.body); await expect(await body.findByRole('dialog', { name: 'Navigation' })).toBeVisible(); await userEvent.keyboard('{Escape}'); await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument()); await waitFor(() => expect(trigger).toHaveFocus()); } };
export const Controlled: Story = { render: args => <ControlledDrawer {...args} /> };
export const NestedControls: Story = { render: () => <DrawerControls />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole('button', { name: 'Open filters' })); const body = within(canvasElement.ownerDocument.body); const select = body.getByRole('combobox', { name: 'Drawer workspace' }); await userEvent.click(select); const studio = await body.findByRole('option', { name: 'Studio' }); await expect(studio).toBeVisible(); const bounds = studio.getBoundingClientRect(); await expect(studio.contains(document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2))).toBe(true); await userEvent.click(studio); await expect(select).toHaveTextContent('Studio'); const combobox = body.getByRole('combobox', { name: 'Drawer project' }); await userEvent.click(combobox); await userEvent.clear(combobox); await userEvent.type(combobox, 'Client'); const client = await body.findByRole('option', { name: 'Client work' }); await userEvent.click(client); await expect(combobox).toHaveValue('Client work'); } };

function ControlledDrawer(props: ComponentProps<typeof Drawer>) {
  const [open, setOpen] = useState(true);
  return <Drawer {...props} open={open} onOpenChange={setOpen} />;
}

function DrawerControls() {
  const [workspace, setWorkspace] = useState('personal');
  const [project, setProject] = useState<string | null>('overview');
  return <Drawer triggerLabel="Open filters" title="Filters"><div style={{ display: 'grid', gap: 24 }}><Select label="Drawer workspace" value={workspace} onValueChange={setWorkspace} options={[{ value: 'personal', label: 'Personal' }, { value: 'studio', label: 'Studio' }]} /><Combobox label="Drawer project" value={project} onValueChange={setProject} options={[{ value: 'overview', label: 'Overview' }, { value: 'client', label: 'Client work' }]} /></div></Drawer>;
}
