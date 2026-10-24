import { useState, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';

const s = stylex.create({
  scroll: { overflowX: 'auto', maxWidth: '100%', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--dp-divider)', borderRadius: 'var(--dp-radius-panel)', backgroundColor: 'var(--dp-raised)', boxShadow: 'var(--dp-shadow-surface)', ':focus-visible': { outline: '2px solid var(--dp-focus)', outlineOffset: 3 } },
  table: { width: '100%', borderCollapse: 'collapse', color: 'var(--dp-text)', fontSize: 14, lineHeight: 1.6, textAlign: 'left', fontVariantNumeric: 'tabular-nums' },
  caption: { textAlign: 'left', padding: 16, fontWeight: 650, fontSize: 16 },
  head: { backgroundColor: 'var(--dp-surface)', fontWeight: 650, padding: '10px 16px', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--dp-border)' },
  cell: { padding: '14px 16px', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--dp-divider)', overflowWrap: 'anywhere' },
  lastCell: { borderBottomWidth: 0 },
  row: { ':hover': { backgroundColor: 'var(--dp-surface)' } },
  sort: { display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 36, padding: '4px 0', borderWidth: 0, backgroundColor: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', cursor: 'pointer', textAlign: 'left' },
  empty: { textAlign: 'center', padding: 32, color: 'var(--dp-muted)' },
});

export type TableSort = { key: string; direction: 'asc' | 'desc' } | null;
export type DataTableColumn<Row> = { key: string; header: string; cell: (row: Row) => ReactNode; sortValue?: (row: Row) => string | number | null | undefined };
export type DataTableProps<Row> = {
  caption: string;
  rows: Row[];
  columns: DataTableColumn<Row>[];
  rowKey: (row: Row) => string;
  /** Omit to let the table manage its sort; pass null for a controlled unsorted table. */
  sort?: TableSort;
  onSortChange?: (sort: TableSort) => void;
  loading?: boolean;
  emptyMessage?: string;
};
/** Semantic client-side table. Compose Pagination externally; no virtualization or server query is implied. */
export function DataTable<Row>({ caption, rows, columns, rowKey, sort: controlledSort, onSortChange, loading = false, emptyMessage = 'No results.' }: DataTableProps<Row>) {
  const [localSort, setLocalSort] = useState<TableSort>(null);
  const sort = controlledSort === undefined ? localSort : controlledSort;
  const active = columns.find(column => column.key === sort?.key);
  const displayed = active?.sortValue && sort ? [...rows].sort((a, b) => {
    const left = active.sortValue!(a), right = active.sortValue!(b);
    if (left == null) return right == null ? 0 : 1;
    if (right == null) return -1;
    const result = typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right), undefined, { numeric: true });
    return sort.direction === 'asc' ? result : -result;
  }) : rows;
  function changeSort(key: string) {
    const next: TableSort = { key, direction: sort?.key === key && sort.direction === 'asc' ? 'desc' : 'asc' };
    if (controlledSort === undefined) setLocalSort(next);
    onSortChange?.(next);
  }
  return <div role="region" aria-label={`${caption} table scroll area`} tabIndex={0} {...stylex.props(s.scroll)}>
    <table aria-busy={loading || undefined} {...stylex.props(s.table)}>
      <caption {...stylex.props(s.caption)}>{caption}</caption>
      <thead><tr>{columns.map(column => <th key={column.key} scope="col" aria-sort={column.sortValue ? sort?.key === column.key ? sort.direction === 'asc' ? 'ascending' : 'descending' : 'none' : undefined} {...stylex.props(s.head)}>
        {column.sortValue ? <button type="button" aria-label={`Sort by ${column.header}, ${sort?.key === column.key && sort.direction === 'asc' ? 'descending' : 'ascending'}`} onClick={() => changeSort(column.key)} {...stylex.props(s.sort)}>{column.header}<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={sort?.key === column.key ? sort.direction === 'asc' ? 'm5 15 7-7 7 7' : 'm5 9 7 7 7-7' : 'm8 9 4-4 4 4M8 15l4 4 4-4'} /></svg></button> : column.header}
      </th>)}</tr></thead>
      <tbody>{loading || !displayed.length ? <tr><td colSpan={Math.max(columns.length, 1)} {...stylex.props(s.empty)}>{loading ? 'Loading results…' : emptyMessage}</td></tr> : displayed.map((row, rowIndex) => <tr key={rowKey(row)} {...stylex.props(s.row)}>{columns.map(column => <td key={column.key} {...stylex.props(s.cell, rowIndex === displayed.length - 1 && s.lastCell)}>{column.cell(row)}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}
