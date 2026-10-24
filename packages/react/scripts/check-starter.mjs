import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
if (!process.env.npm_execpath) throw new Error('Run npm run check:starter.');
const npm = (args, cwd = root) => execFileSync(process.execPath, [process.env.npm_execpath, ...args], { cwd, stdio: 'pipe', encoding: 'utf8', env: { ...process.env, npm_config_cache: join(root, '.npm-cache') } });
await mkdir(join(root, '.starter-check'), { recursive: true });
const testRoot = await mkdtemp(join(root, '.starter-check', 'run-'));
const app = join(testRoot, 'my-app');
console.log(npm(['run', 'create:app', '--', app]));
console.log(npm(['run', 'build'], app));
const manifest = JSON.parse(await readFile(join(app, 'package.json'), 'utf8'));
assert.equal(manifest.dependencies['@serein-ui/react'], 'file:vendor/serein-ui-react.tgz');
assert.ok(!existsSync(join(app, 'node_modules/@stylexjs/babel-plugin')), 'App should not need the StyleX compiler');
await readFile(join(app, 'node_modules/@serein-ui/react/ai/contract.json'));
await readFile(join(app, 'AGENTS.md'));
await readFile(join(app, 'UI-LIBRARY.md'));
const protectedFile = join(app, 'keep.txt');
await writeFile(protectedFile, 'do not overwrite');
assert.throws(() => npm(['run', 'create:app', '--', app, '--no-install']), 'Existing app must be refused');
assert.equal(await readFile(protectedFile, 'utf8'), 'do not overwrite');

process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve(root, '.playwright');
const { chromium } = await import('playwright');
const port = 5181;
let serverOutput = '';
const server = spawn(process.execPath, [join(app, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: app, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
server.stdout.on('data', chunk => serverOutput += chunk);
server.stderr.on('data', chunk => serverOutput += chunk);
let browser;
try {
  browser = await chromium.launch();
  let ready = false;
  for (let i = 0; i < 80; i++) {
    if (server.exitCode !== null) throw new Error(serverOutput);
    try { if ((await fetch(`http://127.0.0.1:${port}`)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, `Preview failed to start: ${serverOutput}`);
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 }, colorScheme: 'light', reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${port}`);
  await page.getByRole('heading', { name: 'Your next app', exact: true }).waitFor();
  await page.keyboard.press('Tab');
  assert.ok(await page.getByRole('link', { name: 'Skip to content' }).evaluate(el => el === document.activeElement));
  await page.keyboard.press('Enter');
  assert.ok(await page.getByRole('main').evaluate(el => el === document.activeElement));
  await page.keyboard.press('Tab');
  const field = page.getByRole('textbox', { name: 'Workspace name', exact: true });
  assert.ok(await field.evaluate(el => el === document.activeElement));
  await page.keyboard.press('Enter');
  assert.equal(await field.getAttribute('aria-invalid'), 'true');
  assert.ok(await field.evaluate(el => el === document.activeElement));
  await field.fill('Northstar');
  assert.notEqual(await field.getAttribute('aria-invalid'), 'true');
  await page.getByRole('button', { name: 'Preview workspace', exact: true }).click();
  await page.getByText('Preview ready', { exact: true }).waitFor();
  await page.getByText('Northstar is ready to make your own.', { exact: true }).waitFor();
  const axe = await readFile(join(root, 'node_modules/axe-core/axe.min.js'), 'utf8');
  await mkdir(join(root, '.review/starter'), { recursive: true });
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Use dark theme', exact: true }).click();
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('data-dp-theme'), theme);
    for (const width of [320, 1100]) {
      await page.setViewportSize({ width, height: 800 });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: join(root, `.review/starter/${theme}-${width}.png`), animations: 'disabled', fullPage: true });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Starter page must reflow');
    }
    await page.addScriptTag({ content: axe });
    const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } })).violations);
    assert.deepEqual(violations.map(v => v.id), [], `Starter accessibility: ${theme}`);
  }
  assert.deepEqual(errors, []);
  const assets = await readdir(join(app, 'dist/assets'));
  assert.ok(assets.some(file => file.endsWith('.css')), 'Compiled consumer must emit CSS');
  console.log(`Starter verified: actual tarball install, independent build, AI files, overwrite refusal, validation, persisted themes, responsive UI and axe. Generated app: ${app}`);
} finally { try { await browser?.close(); } finally { server.kill(); } }
