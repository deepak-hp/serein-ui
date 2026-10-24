import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { DropdownMenu } from '../src/index';

const meta = { title: 'Components/DropdownMenu', component: DropdownMenu, tags: ['autodocs'], args: { triggerLabel: 'More actions', items: [{ label: 'Rename' }, { label: 'Duplicate' }, { label: 'Delete', disabled: true }] } } satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = {args:{defaultOpen:true}};
export const Empty: Story = {args:{defaultOpen:true,items:[]}};
export const LongLabels: Story = {args:{defaultOpen:true,items:[{label:'Move this project to the shared design workspace'},{label:'Duplicate all project files and their version history'},{label:'Delete the workspace permanently',disabled:true}]}};
export const KeyboardOpen: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); const trigger = canvas.getByRole('button', { name: 'More actions' }); await userEvent.click(trigger); const body = within(canvasElement.ownerDocument.body); await expect(await body.findByRole('menu')).toBeVisible(); await expect(body.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('aria-disabled', 'true'); await userEvent.keyboard('{Escape}'); await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument()); await waitFor(() => expect(trigger).toHaveFocus()); } };
