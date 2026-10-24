// Validates specs/*.yaml: required fields, allowed values, and that every token path exists in @serein-ui/tokens.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, 'packages/tokens/dist/json/tokens.json'), 'utf8'));
const has = (obj, p) => p.split('.').reduce((o, k) => (o && k in o ? o[k] : undefined), obj) !== undefined;
const tokenExists = (p) => has(tokens.base, p) || has(tokens.themes.light, p);

const STATUS = ['planned', 'draft', 'beta', 'stable'];
const REQUIRED = ['name', 'status', 'phase', 'summary', 'platforms', 'anatomy', 'props', 'states', 'keyboard', 'aria', 'motion', 'content', 'do', 'dont', 'tokens', 'wcag'];
const files = fs.readdirSync(path.join(ROOT, 'specs')).filter((f) => f.endsWith('.yaml') && !f.startsWith('_'));
const errors = [];

for (const f of files) {
  const s = parse(fs.readFileSync(path.join(ROOT, 'specs', f), 'utf8'));
  const e = (m) => errors.push(`${f}: ${m}`);
  for (const k of REQUIRED) if (!(k in s)) e(`missing "${k}"`);
  if (!/^[A-Z][A-Za-z0-9]+$/.test(s.name ?? '')) e('name must be PascalCase');
  if (f !== `${s.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}.yaml`) e(`file name should be ${s.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}.yaml`);
  if (!STATUS.includes(s.status)) e(`status must be one of ${STATUS.join(', ')}`);
  if (typeof s.summary !== 'string' || !s.summary.endsWith('.')) e('summary must be one sentence ending in a full stop');
  for (const t of s.tokens ?? []) if (!tokenExists(t)) e(`unknown token "${t}"`);
  for (const c of s.wcag ?? []) if (!/^\d\.\d\.\d{1,2}$/.test(String(c))) e(`"${c}" is not a WCAG success criterion number`);
  for (const p of s.props ?? []) if (!p.name || !p.type || !p.description) e(`prop "${p.name ?? '?'}" needs name, type and description`);
  for (const m of s.motion ?? []) if (!m.reducedMotion) e(`motion "${m.moment}" has no reducedMotion behaviour`);
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`specs OK: ${files.length} component spec(s) valid`);
