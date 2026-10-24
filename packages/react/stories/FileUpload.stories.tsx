import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUpload } from '../src/index';

const meta = { title: 'Components/FileUpload', component: FileUpload, tags: ['autodocs'], args: { label: 'Supporting files', description: 'Select PDF files. Your application handles validation and uploading.', accept: 'application/pdf', onFilesChange: () => {} } } satisfies Meta<typeof FileUpload>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Multiple: Story = { args: { multiple: true } };
export const Error: Story = { args: { error: 'Attach at least one PDF.' } };
export const Disabled: Story = { args: { disabled: true } };
