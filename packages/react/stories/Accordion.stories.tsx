import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Accordion } from '../src/index';

const meta = { title: 'Components/Accordion', component: Accordion, tags: ['autodocs'], args: { label: 'Frequently asked questions', items: [{ value: 'shipping', label: 'Shipping', content: 'Orders leave our warehouse within two business days.' }, { value: 'returns', label: 'Returns', content: 'Returns are accepted within 30 days.' }] } } satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const KeyboardExpand: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.tab(); await userEvent.keyboard('{Enter}'); await expect(canvas.getByRole('region', { name: 'Shipping' })).toHaveTextContent('Orders leave our warehouse within two business days.'); } };
