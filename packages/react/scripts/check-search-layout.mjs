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
    ...['light', 'dark'].flatMap(theme => [320, 1280].map(width => ({ id: 'patterns-workspace-settings--default', theme, width, role: 'heading', name: 'Workspace settings' }))),
    { id: 'components-commandpalette--open', theme: 'dark', width: 320, role: 'dialog', name: 'Command center' },
    { id: 'components-multiselect--long-labels', theme: 'light', width: 320, role: 'combobox', name: 'Teams' },
  ];
  for (const specimen of cases) {
    await page.setViewportSize({ width: specimen.width, height: 900 });
    await page.goto(`${base}/iframe.html?id=${specimen.id}&viewMode=story&globals=theme:${specimen.theme}`);
    await page.getByRole(specimen.role, { name: specimen.name }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${specimen.id}: horizontal page overflow at ${specimen.width}px`);
    if (specimen.id.includes('multiselect')) {
      await page.getByRole('combobox', { name: 'Teams' }).click();
      await page.getByRole('option', { name: 'Research', exact: true }).waitFor();
      const popup = await page.getByRole('listbox').boundingBox();
      assert.ok(popup && popup.x >= 0 && popup.x + popup.width <= specimen.width + 1, 'MultiSelect popup exceeds viewport');
    }
    if (specimen.id.includes('commandpalette')) {
      await page.waitForFunction(() => document.activeElement?.getAttribute('role') === 'combobox');
    }
    await page.screenshot({ path: `.review/search-${specimen.id}-${specimen.width}-${specimen.theme}.png`, fullPage: true });
  }
  console.log('Six search/settings specimens fit 320px and desktop layouts in both themes; palette focus and multi-select popup bounds verified. Screenshots: .review/');
} finally { await browser.close(); }
