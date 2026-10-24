import assert from 'node:assert/strict';
import { resolve } from 'node:path';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve('.playwright');
const { chromium } = await import('playwright');
const baseUrl = process.env.STORYBOOK_URL || 'http://127.0.0.1:6006';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 720, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${baseUrl}/iframe.html?id=start-here-agent-api--docs&viewMode=docs`);
  await page.getByRole('heading', { name: /Agent API reference/ }).waitFor();
  await page.getByRole('heading', { name: /StatusIcon.d.ts/ }).waitFor();
  assert.equal(errors.length, 0, errors.join('\n'));
  await page.goto(`${baseUrl}/iframe.html?id=components-statusicon--pending&viewMode=story&globals=theme:dark`);
  await page.getByText('Message in progress', { exact: true }).waitFor();
  const icon = page.locator('svg.dp-status-icon');
  assert.equal(await icon.locator('path').count(), 2, 'Pending plane needs visible trails even with motion disabled');
  assert.equal(await icon.evaluate(element => getComputedStyle(element).animationName), 'none');
  await page.getByRole('button', { name: 'Preview animation', exact: true }).click();
  await page.getByRole('button', { name: 'Use system preference', exact: true }).waitFor();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.dp-status-icon')).animationName === 'dp-status-icon-send');
  await page.getByRole('button', { name: 'Use system preference', exact: true }).click();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.dp-status-icon')).animationName === 'none');
  await page.goto(`${baseUrl}/iframe.html?id=components-statusicon--idle&viewMode=story&globals=theme:dark`);
  await page.getByText('Message ready', { exact: true }).waitFor();
  assert.equal(await icon.locator('path').count(), 1);
  assert.equal(await icon.evaluate(element => getComputedStyle(element).animationName), 'none');
  assert.equal(errors.length, 0, errors.join('\n'));
  console.log('Live docs render; idle/pending differ; animation opt-in and system preference restoration work.');
} finally {
  await browser.close();
}
