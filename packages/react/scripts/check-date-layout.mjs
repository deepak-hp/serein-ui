import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve('.playwright');
const base = process.env.STORYBOOK_URL ?? 'http://127.0.0.1:6006';
const { chromium } = await import('playwright');
await mkdir('.review', { recursive: true });
const browser = await chromium.launch();
const failures = [];
try {
  const page = await browser.newPage({ reducedMotion: 'reduce', timezoneId:'America/Los_Angeles' });
  for (const theme of ['light', 'dark']) {
    for (const component of ['calendar', 'datepicker', 'daterangepicker']) {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(`${base}/iframe.html?id=components-${component}--${component==='calendar'?'default':'open'}&viewMode=story&globals=theme:${theme}`);
      await page.getByRole('grid').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `.review/dates-${component}-${theme}.png` });
      const overflow = await page.evaluate(() => {
        const elements = [...document.querySelectorAll('.dp-calendar,[role="dialog"]')];
        return document.documentElement.scrollWidth > innerWidth+1 || elements.some(el => el.scrollWidth > el.clientWidth+1);
      });
      if (overflow) failures.push(`${component}/${theme}: calendar or popup overflows`);
      const day = await page.locator('.rdp-day_button').first().boundingBox();
      if (!day || day.width < 24 || day.height < 24) failures.push(`${component}/${theme}: day target below 24px`);
    }
  }
  assert.deepEqual(failures, []);
  console.log('Calendar and both pickers fit 320px in light/dark with minimum 24px day targets, including a non-UTC browser timezone.');
} finally { await browser.close(); }
