export const timezones = ['Asia/Kolkata', 'Europe/London', 'America/New_York'] as const;
export type Settings = { name: string; timezone: string; notifications: boolean };
export type Workspace = { name: string; digest: boolean };
export const defaults: Settings = { name: 'Alex Morgan', timezone: 'Asia/Kolkata', notifications: true };
export function validateName(value: string) { return !value.trim() ? 'Enter a name.' : value.trim().length > 80 ? 'Use 80 characters or fewer.' : ''; }
export function parseSettings(raw: string): Settings {
  const x = JSON.parse(raw);
  if (!x || x.version !== 1 || typeof x.name !== 'string' || validateName(x.name) || !timezones.includes(x.timezone) || typeof x.notifications !== 'boolean') throw new Error('Invalid settings');
  return { name: x.name, timezone: x.timezone, notifications: x.notifications };
}
export function parseWorkspace(raw: string): Workspace {
  const x = JSON.parse(raw);
  if (!x || x.version !== 1 || typeof x.name !== 'string' || validateName(x.name) || typeof x.digest !== 'boolean') throw new Error('Invalid workspace');
  return { name: x.name, digest: x.digest };
}
export const storageKey = (kind: string) => `ritam-ui.examples.${kind}`;
export function saveRecord(storage: Pick<Storage, 'setItem'>, kind: string, value: Settings | Workspace) { storage.setItem(storageKey(kind), JSON.stringify({ version: 1, ...value })); }
export function readRecord<T>(kind: string, parse: (raw: string) => T): { value: T | null; error: boolean } {
  try { const raw = localStorage.getItem(storageKey(kind)); return { value: raw === null ? null : parse(raw), error: false }; } catch { return { value: null, error: true }; }
}
export const pause = () => new Promise<void>(resolve => setTimeout(resolve, 650));
export type Invoice = { id: string; client: string; email: string; amount: number; due: string; status: 'Overdue' | 'Open' | 'Paid'; item: string };
export const invoices: Invoice[] = [
  { id: 'INV-1042', client: 'North Studio', email: 'billing@north.example', amount: 2400, due: '14 Sep 2026', status: 'Overdue', item: 'Brand identity · final delivery' },
  { id: 'INV-1043', client: 'Fieldwork', email: 'hello@fieldwork.example', amount: 1850, due: '30 Sep 2026', status: 'Open', item: 'Website design · September' },
  { id: 'INV-1044', client: 'Common Ground', email: 'team@common.example', amount: 960, due: '10 Sep 2026', status: 'Paid', item: 'Editorial templates' },
];
export function filterInvoices(records: Invoice[], query: string, status: string) { return records.filter(x => (status === 'All' || x.status === status) && `${x.id} ${x.client}`.toLowerCase().includes(query.trim().toLowerCase())); }
export const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
