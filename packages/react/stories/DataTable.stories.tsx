import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DataTable, Badge, type DataTableColumn } from '../src/index';
type Invoice = { id: string; customer: string; amount: number; state: string };
const columns: DataTableColumn<Invoice>[] = [
  { key: 'customer', header: 'Customer', cell: row => row.customer, sortValue: row => row.customer },
  { key: 'amount', header: 'Amount', cell: row => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(row.amount), sortValue: row => row.amount },
  { key: 'state', header: 'Status', cell: row => <Badge tone={row.state === 'Paid' ? 'success' : 'neutral'}>{row.state}</Badge> },
];
const meta = { title: 'Components/DataTable', component: DataTable, tags: ['autodocs'], parameters: { docs: { description: { component: 'Semantic client-side table with optional controlled sorting. Compose Pagination with a sliced data set. Loading and empty states are built in; virtualization, row selection and server fetching are not included. Demonstration records are fictional.' } } }, args: { caption: 'Recent invoices', rows: [{ id: '1', customer: 'Studio North', amount: 6400, state: 'Paid' }, { id: '2', customer: 'Form Works', amount: 2800, state: 'Pending' }, { id: '3', customer: 'Paper & Co', amount: 4200, state: 'Paid' }], columns, rowKey: row => row.id } } satisfies Meta<typeof DataTable<Invoice>>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const SortByAmount: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole('button', { name: /Sort by Amount/ })); await expect(canvas.getByRole('columnheader', { name: /Amount/ })).toHaveAttribute('aria-sort', 'ascending'); await expect(canvas.getAllByRole('row')[1]).toHaveTextContent('Form Works'); } };
export const Empty: Story = { args: { rows: [] } };
export const Loading: Story = { args: { rows: [], loading: true } };
