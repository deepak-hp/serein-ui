import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { AsyncEmailDemo } from './AsyncEmailDemo';

const meta = {
  title: 'Patterns/AsyncAction',
  component: AsyncEmailDemo,
  tags: ['autodocs'],
  args: { delayMs: 1800 },
  argTypes: { delayMs: { control: { type: 'number', min: 300, max: 10000 }, description: 'Simulated operation duration in milliseconds.' } },
  parameters: { docs: { description: { component: 'A local, abortable action visualized with the library status icon. It does not send an email.' } } },
} satisfies Meta<typeof AsyncEmailDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SendEmail: Story = {
  render: args => <AsyncEmailDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Send test email' }));
    await expect(await canvas.findByText('Sending your email…')).toBeVisible();
  },
};

