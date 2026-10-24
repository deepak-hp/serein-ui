import { useEffect, useState, type ComponentProps } from 'react';
import { Pagination } from '../src/index';
export function PaginationExample(props: ComponentProps<typeof Pagination>) {
  const [page, setPage] = useState(props.page);
  useEffect(() => setPage(props.page), [props.page]);
  return <div style={{ display: 'grid', gap: 20 }}><Pagination {...props} page={page} onPageChange={value => { setPage(value); props.onPageChange(value); }} /><p aria-live="polite" style={{ color: 'var(--dp-muted)', fontSize: 14 }}>Page {page} of {props.pageCount}</p></div>;
}
