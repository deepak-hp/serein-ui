import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Breadcrumbs, Pagination, IconButton, Link } from '../src/navigation';
import { DataTable } from '../src/data-table';

test('breadcrumbs identify only the current destination', () => {
  render(<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Projects', href: '/projects' }, { label: 'Library' }]} />);
  expect(screen.getByRole('navigation', { name: 'Breadcrumbs' })).toBeInTheDocument();
  expect(screen.getByText('Library')).toHaveAttribute('aria-current', 'page');
  expect(screen.getAllByRole('link')).toHaveLength(2);
});

test('pagination stays compact and supports next/previous boundaries', async () => {
  const user = userEvent.setup();
  function Example() { const [page, setPage] = useState(1); return <Pagination page={page} pageCount={10000} onPageChange={setPage} />; }
  render(<Example />);
  expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  expect(screen.getAllByRole('button').length).toBeLessThan(11);
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  await user.click(screen.getByRole('button', { name: 'Page 10000' }));
  expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
});

test('icon buttons have names and new-tab links protect the opener', async () => {
  const click = vi.fn();
  render(<><IconButton label="Close panel" onClick={click}><svg /></IconButton><Link href="https://example.com" target="_blank">Documentation</Link></>);
  await userEvent.click(screen.getByRole('button', { name: 'Close panel' }));
  expect(click).toHaveBeenCalledOnce();
  expect(screen.getByRole('link')).toHaveAttribute('rel', expect.stringContaining('noopener'));
});

test('navigation controls do not submit an enclosing form', async () => {
  const submit = vi.fn(event => event.preventDefault());
  render(<form onSubmit={submit}><Pagination page={1} pageCount={3} onPageChange={() => {}} /><IconButton label="Open details"><svg /></IconButton></form>);
  await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
  await userEvent.click(screen.getByRole('button', { name: 'Open details' }));
  expect(submit).not.toHaveBeenCalled();
});

test('table sorts numeric values and exposes sorting state', async () => {
  render(<DataTable caption="Invoices" rows={[{ id: 'a', amount: 20 }, { id: 'b', amount: 3 }]} rowKey={row => row.id}
    columns={[{ key: 'amount', header: 'Amount', cell: row => row.amount, sortValue: row => row.amount }]} />);
  const table = screen.getByRole('table', { name: 'Invoices' });
  await userEvent.click(within(table).getByRole('button', { name: /Sort by Amount/ }));
  expect(within(table).getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending');
  expect(within(table).getAllByRole('cell').map(cell => cell.textContent)).toEqual(['3', '20']);
  await userEvent.click(within(table).getByRole('button', { name: /Sort by Amount/ }));
  expect(within(table).getAllByRole('cell').map(cell => cell.textContent)).toEqual(['20', '3']);
});

test('empty and loading tables communicate their states', () => {
  const { rerender } = render(<DataTable caption="Invoices" rows={[]} columns={[{ key: 'id', header: 'ID', cell: (row: { id: string }) => row.id }]} rowKey={row => row.id} />);
  expect(screen.getByText('No results.')).toBeVisible();
  rerender(<DataTable caption="Invoices" rows={[]} columns={[{ key: 'id', header: 'ID', cell: (row: { id: string }) => row.id }]} rowKey={row => row.id} loading />);
  expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByText('Loading results…')).toBeVisible();
});
