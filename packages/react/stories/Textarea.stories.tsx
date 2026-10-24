import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '../src/index';

const meta = { title: 'Components/Textarea', component: Textarea, tags: ['autodocs'], args: { label: 'Project brief', description: 'Share the context your team needs.', placeholder: 'Describe the work…' } } satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Error: Story = { args: { error: 'Add a short project brief.' } };
export const Disabled: Story = { args: { disabled: true, value: 'The briefing is complete.' } };
