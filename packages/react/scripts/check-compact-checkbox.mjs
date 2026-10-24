import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';

process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve('.playwright');
const { chromium } = await import('playwright');
const axe = await readFile('node_modules/axe-core/axe.min.js', 'utf8');
const fixture = resolve('.review/compact-checkbox-fixture');
const output = resolve('.review/compact-checkbox');
await mkdir(fixture, { recursive: true });
await mkdir(output, { recursive: true });

await writeFile(resolve(fixture, 'index.html'), '<!doctype html><html lang="en"><head><title>Compact Checkbox regression</title></head><body><div id="root"></div><script type="module" src="/entry.jsx"></script></body></html>');
await writeFile(resolve(fixture, 'entry.jsx'), `
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Checkbox } from '../../dist/index.js';
import '../../dist/styles.css';
import '@fontsource-variable/plus-jakarta-sans';

const files = [
  { name: 'quarterly-report-final-approved-with-supporting-notes.pdf', detail: '4.8 MB · Updated today' },
  { name: 'research-interviews-and-observations-from-the-field.docx', detail: '1.2 MB · Updated yesterday' },
  { name: 'archive-2025.zip', detail: '82 MB · Updated 3 days ago' },
];

function App() {
  const [selected, setSelected] = useState([true, false, false]);
  const theme = new URLSearchParams(location.search).get('theme') || 'light';
  document.documentElement.dataset.dpTheme = theme;
  return <main className="dp-theme" style={{ minHeight: '100vh', padding: 16 }}>
    <h1 style={{ margin: '0 0 16px', fontSize: 20 }}>Project files</h1>
    <div data-file-list style={{ width: '100%', maxWidth: 720, border: '1px solid var(--dp-divider)', borderRadius: 'var(--dp-radius-panel)', overflow: 'hidden' }}>
      {files.map((file, index) => <div data-compact-row key={file.name} style={{ display: 'grid', gridTemplateColumns: '48px minmax(0, 1fr)', alignItems: 'center', minHeight: 64, borderTop: index ? '1px solid var(--dp-divider)' : undefined }}>
        <div data-selection-cell style={{ width: 48 }}>
          <Checkbox hideLabel label={\`Select \${file.name}\`} checked={selected[index]} indeterminate={index === 1} disabled={index === 2} onCheckedChange={checked => setSelected(current => current.map((value, itemIndex) => itemIndex === index ? checked : value))} />
        </div>
        <div data-file-copy style={{ minWidth: 0, padding: '8px 16px 8px 8px' }}>
          <div data-file-name style={{ overflowWrap: 'anywhere', fontWeight: 600 }}>{file.name}</div>
          <div style={{ marginTop: 2, color: 'var(--dp-muted)', fontSize: 13 }}>{file.detail}</div>
        </div>
      </div>)}
    </div>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
`);

const server = await createServer({
  root: fixture,
  configFile: false,
  cacheDir: resolve('.review/compact-checkbox-vite-cache'),
  server: { host: '127.0.0.1', port: 0, strictPort: false, fs: { allow: [resolve('.')] } },
});
await server.listen();
const base = server.resolvedUrls?.local[0];
if (!base) throw new Error('Vite did not expose a local fixture URL.');

const browser = await chromium.launch();
const results = [];
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const theme of ['light', 'dark']) {
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 720 });
      await page.goto(`${base}?theme=${theme}`);
      const namedCheckbox = page.getByRole('checkbox', { name: 'Select quarterly-report-final-approved-with-supporting-notes.pdf' });
      await namedCheckbox.waitFor();
      await page.evaluate(() => document.fonts.ready);

      const rows = await page.locator('[data-compact-row]').evaluateAll(elements => elements.map(row => {
        const label = row.querySelector('label');
        const checkbox = row.querySelector('[role="checkbox"]');
        const hiddenLabel = label?.lastElementChild;
        const copy = row.querySelector('[data-file-copy]');
        const fileName = row.querySelector('[data-file-name]');
        if (!label || !checkbox || !hiddenLabel || !copy || !fileName) throw new Error('Compact row is missing an expected element.');
        const rowRect = row.getBoundingClientRect();
        const labelRect = label.getBoundingClientRect();
        const checkboxRect = checkbox.getBoundingClientRect();
        const copyRect = copy.getBoundingClientRect();
        const nameRect = fileName.getBoundingClientRect();
        const hiddenStyle = getComputedStyle(hiddenLabel);
        return {
          row: { left: rowRect.left, right: rowRect.right },
          label: { left: labelRect.left, right: labelRect.right, width: labelRect.width, height: labelRect.height },
          checkboxCenter: { x: checkboxRect.left + checkboxRect.width / 2, y: checkboxRect.top + checkboxRect.height / 2 },
          labelCenter: { x: labelRect.left + labelRect.width / 2, y: labelRect.top + labelRect.height / 2 },
          copy: { left: copyRect.left, right: copyRect.right },
          name: { left: nameRect.left, right: nameRect.right, clipped: fileName.scrollWidth > fileName.clientWidth + 1 || fileName.scrollHeight > fileName.clientHeight + 1 },
          hidden: { position: hiddenStyle.position, width: hiddenStyle.width, height: hiddenStyle.height, overflow: hiddenStyle.overflow, whiteSpace: hiddenStyle.whiteSpace, clipPath: hiddenStyle.clipPath },
        };
      }));

      for (const [index, row] of rows.entries()) {
        assert.ok(Math.abs(row.label.width - 48) < 0.1 && Math.abs(row.label.height - 48) < 0.1, `${theme}/${width}/row ${index + 1}: label target is ${row.label.width}×${row.label.height}, expected 48×48`);
        assert.ok(Math.abs(row.checkboxCenter.x - row.labelCenter.x) < 0.1 && Math.abs(row.checkboxCenter.y - row.labelCenter.y) < 0.1, `${theme}/${width}/row ${index + 1}: checkbox is not centered in the label target`);
        assert.ok(row.label.right <= row.copy.left + 0.1, `${theme}/${width}/row ${index + 1}: selection label overlaps file copy`);
        assert.ok(row.name.left >= row.copy.left && row.name.right <= row.copy.right + 0.1, `${theme}/${width}/row ${index + 1}: filename escapes its minmax(0, 1fr) column`);
        assert.equal(row.name.clipped, false, `${theme}/${width}/row ${index + 1}: filename text is clipped`);
        assert.deepEqual(row.hidden, { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', whiteSpace: 'nowrap', clipPath: 'inset(50%)' }, `${theme}/${width}/row ${index + 1}: label text is not robustly visually hidden`);
      }

      const firstLabel = page.locator('[data-compact-row]').first().locator('label');
      const firstLabelBox = await firstLabel.boundingBox();
      assert.ok(firstLabelBox, `${theme}/${width}: enabled compact label has no bounding box`);
      assert.equal(await namedCheckbox.isChecked(), true, `${theme}/${width}: enabled compact checkbox did not start checked`);
      await page.mouse.click(firstLabelBox.x + 4, firstLabelBox.y + firstLabelBox.height / 2);
      assert.equal(await namedCheckbox.isChecked(), false, `${theme}/${width}: click near the 48px label edge did not clear the checkbox`);
      await page.mouse.click(firstLabelBox.x + 4, firstLabelBox.y + firstLabelBox.height / 2);
      assert.equal(await namedCheckbox.isChecked(), true, `${theme}/${width}: second click near the 48px label edge did not restore the checkbox`);

      const disabledCheckbox = page.getByRole('checkbox', { name: 'Select archive-2025.zip' });
      const disabledLabelBox = await page.locator('[data-compact-row]').last().locator('label').boundingBox();
      assert.ok(disabledLabelBox, `${theme}/${width}: disabled compact label has no bounding box`);
      assert.equal(await disabledCheckbox.isChecked(), false, `${theme}/${width}: disabled compact checkbox did not start unchecked`);
      await page.mouse.click(disabledLabelBox.x + 4, disabledLabelBox.y + disabledLabelBox.height / 2);
      assert.equal(await disabledCheckbox.isChecked(), false, `${theme}/${width}: disabled compact checkbox changed from a label-edge click`);

      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${theme}/${width}: page overflows horizontally`);
      await page.addScriptTag({ content: axe });
      const violations = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } }).then(result => result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) }))));
      assert.deepEqual(violations, [], `${theme}/${width}: axe violations`);
      await page.screenshot({ path: resolve(output, `${width}-${theme}.png`), fullPage: true, animations: 'disabled' });
      results.push({ theme, width, rows: rows.length, target: '48x48', axeViolations: 0, overflow: false });
    }
  }
} finally {
  await writeFile(resolve(output, 'results.json'), JSON.stringify({ nodeVersion: process.version, results }, null, 2));
  await browser.close();
  await server.close();
}

console.log('Compact Checkbox: 12 rows across 320/1280px and light/dark keep hidden accessible labels, centered 48px targets with working edge clicks, inert disabled rows, bounded filenames, no overflow, and zero WCAG 2.2 axe violations.');
