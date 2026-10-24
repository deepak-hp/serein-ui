import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Dialog } from '../src/index';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: { triggerLabel: 'Review session', title: 'Start a session', description: 'Review your focus time before you begin.', children: <p>45 minutes selected.</p>, confirmLabel: 'Start session', onConfirm: () => {} },
  argTypes: { triggerLabel: { control: 'text' }, title: { control: 'text' }, description: { control: 'text' }, confirmLabel: { control: 'text' }, onConfirm: { action: 'confirmed' } },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Review session' }));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByRole('dialog', { name: 'Start a session' })).toBeVisible();
  },
};
export const EscapeCloses: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Review session' });
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByRole('dialog', { name: 'Start a session' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
export const Controlled: Story = { render: args => <ControlledDialog {...args} /> };

function ControlledDialog(props: ComponentProps<typeof Dialog>) {
  const [open, setOpen] = useState(true);
  return <Dialog {...props} open={open} onOpenChange={setOpen} />;
}
