import { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, DataTable, EmptyState, Select, TextField, useAsyncAction } from '@serein-ui/react';
import Shell, { focusId } from './Shell';
import { filterInvoices, invoices, money, pause, type Invoice } from './model';
function InvoiceDetail({ invoice, close }: { invoice: Invoice; close: () => void }) {
  const [fail, setFail] = useState(false);
  const action = useAsyncAction(async signal => { await pause(); if (signal.aborted) return; if (fail) { setFail(false); throw new Error('Demo delivery failure'); } });
  useEffect(() => focusId('invoice-detail-heading'), []);
  return <section className="invoice-detail" aria-labelledby="invoice-detail-heading"><div className="workflow-section-heading"><h2 id="invoice-detail-heading" tabIndex={-1}>{invoice.id} · {invoice.client}</h2><Button variant="quiet" onClick={close}>Close details</Button></div><dl className="workflow-facts"><div><dt>Bill to</dt><dd>{invoice.email}</dd></div><div><dt>Due</dt><dd>{invoice.due}</dd></div><div><dt>Status</dt><dd>{invoice.status}</dd></div><div><dt>Total</dt><dd>{money(invoice.amount)}</dd></div></dl><p>{invoice.item}</p>
    {invoice.status === 'Paid' ? <p>This invoice is paid. No reminder is needed.</p> : <><h3>Reminder preview</h3><p>Hello {invoice.client}, this is a reminder for {invoice.id}, {money(invoice.amount)}, due {invoice.due}. Thank you.</p><p className="workflow-muted">A local simulation only. Nothing will be sent to {invoice.email}.</p><Checkbox label="Fail the next reminder" checked={fail} onCheckedChange={setFail} disabled={action.state === 'pending' || action.state === 'success'} /><div className="workflow-actions"><Button loading={action.state === 'pending'} disabled={action.state === 'success'} onClick={action.run}>{action.state === 'error' ? 'Retry reminder' : action.state === 'success' ? 'Reminder simulated' : 'Simulate reminder'}</Button></div><p role="status">{action.state === 'pending' ? 'Simulating reminder…' : action.state === 'success' ? 'Reminder simulation complete. No email was sent.' : ''}</p>{action.state === 'error' && <p role="alert" className="workflow-error">The simulation failed. No reminder was recorded. Retry to complete it.</p>}</>}
  </section>;
}
export default function Invoices() {
  const [query, setQuery] = useState(''); const [status, setStatus] = useState('All'); const [selected, setSelected] = useState<Invoice | null>(null); const trigger = useRef<HTMLButtonElement | null>(null);
  const visible = filterInvoices(invoices, query, status);
  return <Shell title="Invoices" description="Review fictional client invoices and try a reminder. Sample snapshot: 28 September 2026; amounts in USD."><div className="workflow-filters"><TextField label="Search invoices" placeholder="Client or invoice number" value={query} onChange={e => setQuery(e.target.value)} /><Select label="Invoice status" value={status} onValueChange={setStatus} options={['All', 'Overdue', 'Open', 'Paid'].map(x => ({ value: x, label: x }))} /></div><p role="status" className="workflow-muted">{visible.length} of {invoices.length} invoices</p>
    {visible.length > 0 && <p className="workflow-table-hint workflow-muted" id="invoice-scroll-hint">Scroll the table horizontally to see every column.</p>}
    {visible.length ? <DataTable caption="Sample invoices, as of 28 September 2026" rows={visible} rowKey={invoice => invoice.id} columns={[
      { key: 'client', header: 'Invoice / client', cell: invoice => <><Button variant="quiet" aria-expanded={selected?.id === invoice.id} onClick={e => { trigger.current = e.currentTarget; setSelected(invoice); }}>{invoice.id}</Button><span className="invoice-client">{invoice.client}</span></> },
      { key: 'due', header: 'Due', cell: invoice => invoice.due },
      { key: 'status', header: 'Status', cell: invoice => invoice.status },
      { key: 'amount', header: 'Amount', cell: invoice => money(invoice.amount) },
    ]} /> : <EmptyState title="No matching invoices" description="Try a different client or status, or show all sample invoices." action={<Button onClick={() => { setQuery(''); setStatus('All'); }}>Reset filters</Button>} />}
    {selected && <InvoiceDetail key={selected.id} invoice={selected} close={() => { setSelected(null); requestAnimationFrame(() => trigger.current?.isConnected ? trigger.current.focus() : document.getElementById('workflow-main')?.focus()); }} />}
  </Shell>;
}
