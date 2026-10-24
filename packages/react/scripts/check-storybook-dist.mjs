import { readFile } from 'node:fs/promises';

const baseUrl = process.env.STORYBOOK_URL ?? 'http://127.0.0.1:6006';
const compiled = await readFile('dist/index.js', 'utf8');
const sendGlyph = compiled.match(/function SendGlyph[\s\S]*?function PaymentGlyph/)?.[0];
const expectedPaths = [...(sendGlyph?.matchAll(/d:\s*"([^"]+)"/g) ?? [])].map(match => match[1]);
if (!expectedPaths.length) throw new Error('Could not locate the current StatusIcon send glyph in dist/index.js');

const response = await fetch(`${baseUrl}/dist/index.js`);
const served = await response.text();
if (!response.ok) throw new Error(`/dist/index.js returned ${response.status}`);
if (!expectedPaths.every(path => served.includes(path))) {
  throw new Error('Live Storybook is serving a stale dist/index.js transform. Restart or watcher invalidation is required.');
}

console.log('Live Storybook serves the current compiled StatusIcon send glyph paths.');
