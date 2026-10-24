import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base = process.env.STORYBOOK_URL ?? 'http://127.0.0.1:6006';
const endpoint = `${base}/mcp`;
let session;
let id = 0;
async function call(method, params = {}) {
  const response = await fetch(endpoint, { method: 'POST', headers: {
    'Content-Type': 'application/json', Accept: 'application/json, text/event-stream',
    ...(session ? { 'Mcp-Session-Id': session } : {}),
  }, body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params }) });
  assert.ok(response.ok, `${method}: HTTP ${response.status}`);
  session = response.headers.get('mcp-session-id') || session;
  const text = await response.text();
  const data = response.headers.get('content-type')?.includes('text/event-stream')
    ? JSON.parse(text.split('\n').filter(line => line.startsWith('data:')).at(-1).slice(5)) : JSON.parse(text);
  assert.ok(!data.error, JSON.stringify(data.error));
  return data.result;
}
const initialized = await call('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'serein-check', version: '1.0.0' } });
await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', ...(session ? { 'Mcp-Session-Id': session } : {}) }, body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) });
const { tools } = await call('tools/list');
console.log('MCP server:', initialized.serverInfo, 'Tools:', tools.map(tool => tool.name));
const docsList = tools.find(tool => tool.name === 'docs-list');
assert.ok(docsList, 'Expected documentation discovery tool');
const listing = await call('tools/call', { name: docsList.name, arguments: {} });
assert.ok(!listing.isError, JSON.stringify(listing));
assert.ok(JSON.stringify(listing).includes('Button'), 'Documentation should list the Button');
const details = await call('tools/call', { name: 'docs-show', arguments: { id: 'components-checkbox' } });
assert.ok(!details.isError, JSON.stringify(details));
assert.ok(JSON.stringify(details).includes('onCheckedChange'), 'Documentation tool must supply the actual control API');
const manifest = await (await fetch(`${base}/manifests/components.json`)).json();
const contract = JSON.parse(await readFile('ai/contract.json', 'utf8'));
for (const name of contract.components) {
  const component = Object.values(manifest.components).find(entry => entry.name === name);
  assert.ok(component && !component.error, `${name}: manifest unavailable`);
  assert.ok(Object.keys(component.reactDocgenTypescript?.props || component.reactDocgen?.props || {}).length, `${name}: missing prop metadata`);
  if (['Dialog', 'AlertDialog', 'Drawer', 'Popover', 'DropdownMenu'].includes(name)) {
    const props = component.reactDocgenTypescript?.props || component.reactDocgen?.props || {};
    for (const prop of ['open', 'defaultOpen', 'onOpenChange']) assert.ok(props[prop], `${name}: missing ${prop} metadata`);
  }
}
console.log(`MCP discovery and typed metadata verified for all ${contract.components.length} exported components.`);
