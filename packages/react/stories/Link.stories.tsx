import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '../src/index';
const meta = { title: 'Components/Link', component: Link, tags: ['autodocs'], args: { href: './?path=/docs/start-here-agent-api--docs', children: 'Read the component API' } } satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const NewTab: Story = { args: { target: '_blank', children: 'Read the API (opens in a new tab)' } };
