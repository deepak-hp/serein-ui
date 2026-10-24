import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve('.playwright');
const { chromium } = await import('playwright');
const base = process.env.STORYBOOK_URL ?? 'http://127.0.0.1:6006';
await mkdir('.review', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const cases = [
    { id: 'components-datatable--default', width: 390, theme: 'dark', ready: ['table', 'Recent invoices'] },
    { id: 'components-numberfield--default', width: 390, theme: 'light', ready: ['button', 'Increase Seats'] },
    { id: 'components-drawer--nested-controls', width: 1280, theme: 'dark', ready: ['combobox', 'Drawer project'] },
    { id: 'start-here-catalogue--docs', width: 1280, theme: 'light', docs: true, ready: ['heading', /Component catalogue/] },
  ];
  for (const entry of cases) {
    await page.setViewportSize({ width: entry.width, height: 850 });
    await page.goto(`${base}/iframe.html?id=${entry.id}&viewMode=${entry.docs ? 'docs' : 'story'}&globals=theme:${entry.theme}`);
    await page.getByRole(entry.ready[0], { name: entry.ready[1] }).waitFor();
    if (entry.id.includes('nested-controls')) await page.waitForFunction(() => document.querySelector('input[role="combobox"]')?.value === 'Client work');
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    assert.equal(overflow, false, `${entry.id}: page overflows at ${entry.width}px`);
    await page.screenshot({ path: `.review/${entry.id}-${entry.width}-${entry.theme}.png`, fullPage: false });
  }
  const index = await (await fetch(`${base}/index.json`)).json();
  const { components } = await (await fetch(`${base}/ai/contract.json`)).json();
  for (const name of components) {
    const slug = name === 'ToastProvider' ? 'toast' : name.toLowerCase();
    assert.ok(index.entries[`components-${slug}--docs`], `Missing documentation route for ${name}`);
  }
  console.log(`Four layout specimens fit their viewports; all ${components.length} catalogue routes exist. Screenshots: .review/`);
} finally { await browser.close(); }
