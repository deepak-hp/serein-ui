import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve('.playwright');
const base = process.env.STORYBOOK_URL ?? 'http://127.0.0.1:6006';
const { chromium } = await import('playwright');
await mkdir('.review', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const theme of ['light', 'dark']) {
    for (const component of ['select', 'dropdownmenu']) {
     for (const variant of ['default', 'long-labels', 'empty']) {
      await page.setViewportSize({ width: 320, height: 680 });
      await page.goto(`${base}/iframe.html?id=components-${component}--${variant}&viewMode=story&globals=theme:${theme}`);
      const trigger = page.getByRole(component === 'select' ? 'combobox' : 'button', { name: component === 'select' ? 'Workspace' : 'More actions' });
      await trigger.waitFor();
      if (await trigger.getAttribute('aria-expanded') !== 'true') await trigger.click();
      const popup = page.getByRole(component === 'select' ? 'listbox' : 'menu');
      await popup.waitFor();
      await page.keyboard.press('ArrowDown');
      await page.screenshot({ path: `.review/menu-select-${component}-${theme}-${variant}.png` });
      const bounds = await popup.boundingBox();
      assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= 321, `${component} exceeds viewport`);
      assert.ok(await popup.evaluate(el => el.scrollWidth <= el.clientWidth + 1), `${component}/${variant} has horizontal overflow`);
      await page.keyboard.press('Escape');
      await popup.waitFor({ state: 'hidden' });
      await page.waitForFunction(() => document.activeElement?.getAttribute('aria-expanded') === 'false');
      console.log(`${component}/${theme}/${variant}: popup fits; Escape returns focus.`);
     }
    }
  }
} finally { await browser.close(); }
