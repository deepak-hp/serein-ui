import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from '../src/index';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'Email address', placeholder: 'deepak@example.com', description: 'We only use this for account messages.' },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Error: Story = { args: { error: 'Enter a valid email address.' } };
export const Disabled: Story = { args: { disabled: true, value: 'deepak@example.com' } };
