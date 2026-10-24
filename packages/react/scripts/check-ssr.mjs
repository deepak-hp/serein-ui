import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { access, readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve(root, '.playwright');
const { chromium } = await import('playwright');
const output = resolve(root, '.ssr-check', 'client.js');
const dist = resolve(root, 'dist');
await access(resolve(dist, 'index.js'));
await access(resolve(dist, 'styles.css'));

assert.equal(typeof globalThis.window, 'undefined', 'SSR verification must start without a browser window');
let server;
let browser;
try {
  const clientFixture = await readFile(resolve(root, 'tests/fixtures/ssr-client.mjs'), 'utf8');
  await build({ stdin: { contents: clientFixture, resolveDir: resolve(root, 'tests/fixtures'), sourcefile: 'ssr-client.mjs' }, outfile: output, bundle: true, platform: 'browser', format: 'esm', target: 'es2022' });
  const { SsrApp } = await import('../tests/fixtures/ssr-app.mjs');
  const markup = renderToString(React.createElement(SsrApp));
  assert.match(markup, /SSR fixture/);
  const [client, styles] = await Promise.all([readFile(output), readFile(resolve(dist, 'styles.css'))]);
  const html = `<!doctype html><html data-dp-theme="light"><head><meta charset="utf-8"><link rel="stylesheet" href="/styles.css"></head><body class="dp-theme"><div id="root">${markup}</div><script type="module" src="/client.js"></script></body></html>`;
  server = createServer((request, response) => {
    const body = request.url === '/client.js' ? client : request.url === '/styles.css' ? styles : html;
    response.writeHead(200, { 'content-type': request.url === '/client.js' ? 'text/javascript' : request.url === '/styles.css' ? 'text/css' : 'text/html' });
    response.end(body);
  });
  await new Promise((resolveListen, rejectListen) => { server.once('error', rejectListen); server.listen(0, '127.0.0.1', resolveListen); });
  const { port } = server.address();
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ timezoneId: 'America/Los_Angeles' });
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__ssrHydrated === true);
  assert.deepEqual(await page.evaluate(() => window.__ssrRecoverableErrors), [], 'hydrateRoot recovered from an SSR mismatch');
  const duplicateIds = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  assert.deepEqual(duplicateIds, [], `SSR rendered duplicate IDs: ${duplicateIds.join(', ')}`);
  await page.getByRole('textbox', { name: 'SSR text field' }).fill('hydrated value');
  await expectValue(page, 'SSR text field', 'hydrated value');
  const select = page.getByRole('combobox', { name: 'SSR selection' });
  await select.focus(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('End'); await page.keyboard.press('Enter');
  assert.match(await select.textContent(), /Two/, 'SSR selection did not change to Two');
  await page.getByRole('button', { name: 'Open SSR dialog' }).click();
  await page.getByRole('dialog', { name: 'SSR dialog' }).waitFor();
  await page.keyboard.press('Escape');
  await assertFocus(page, 'Open SSR dialog');
  assert.deepEqual(await page.evaluate(() => window.__ssrRecoverableErrors), [], 'an interaction recovered from an SSR mismatch');
  assert.deepEqual(pageErrors, [], pageErrors.join('\n'));
  assert.deepEqual(consoleErrors, [], consoleErrors.join('\n'));
  console.log('SSR render without DOM, hydration, unique IDs, text entry, selection, and dialog focus verified.');
} finally {
  await browser?.close();
  await new Promise(resolveClose => server?.close(resolveClose) ?? resolveClose());
  await rm(output, { force: true });
}

async function expectValue(page, label, value) { assert.equal(await page.getByRole('textbox', { name: label }).inputValue(), value); }
async function assertFocus(page, name) {
  await page.waitForFunction(buttonName => [...document.querySelectorAll('button')].some(button => button.textContent?.trim() === buttonName && button === document.activeElement), name);
  assert.equal(await page.getByRole('button', { name }).evaluate(element => document.activeElement === element), true, `Focus did not return to ${name}`);
}
