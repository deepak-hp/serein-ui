import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from '../src/index';
const meta = { title: 'Components/Breadcrumbs', component: Breadcrumbs, tags: ['autodocs'], args: { items: [{ label: 'Library', href: './?path=/docs/start-here-catalogue--docs' }, { label: 'Components', href: './?path=/docs/components-button--docs' }, { label: 'Breadcrumbs' }] } } satisfies Meta<typeof Breadcrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const LongPath: Story = { args: { items: [{ label: 'Workspace', href: '#' }, { label: 'Design system documentation', href: '#' }, { label: 'Accessible navigation patterns' }] } };
