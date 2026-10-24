import assert from 'node:assert/strict';
import { access, lstat, readFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const appRoot = path.resolve(import.meta.dirname, '..');
const port = Number(process.argv[2] ?? process.env.SEREIN_NEXT_PORT ?? 4319);
const origin = `http://127.0.0.1:${port}`;
const nextBin = path.join(appRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
const browserPath = process.env.PLAYWRIGHT_BROWSERS_PATH
  ?? path.resolve(appRoot, '..', '..', '.playwright');

process.env.PLAYWRIGHT_BROWSERS_PATH = browserPath;

const require = createRequire(import.meta.url);
const { source: axeSource } = require('axe-core');

async function stopServer(server) {
  if (server.exitCode !== null || server.killed) return;
  if (process.platform === 'win32') {
    const killer = spawn('taskkill', ['/pid', String(server.pid), '/t', '/f'], {
      stdio: 'ignore',
      windowsHide: true,
    });
    await new Promise((resolve) => killer.once('exit', resolve));
    return;
  }
  server.kill('SIGTERM');
  await new Promise((resolve) => server.once('exit', resolve));
}

async function waitForServer(server, output) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js exited before it was ready.\n${output.join('')}`);
    }
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Timed out waiting for ${origin}.\n${output.join('')}`);
}

async function runAxe(page, theme) {
  await page.addScriptTag({ content: axeSource });
  const violations = await page.evaluate(async () => {
    const result = await globalThis.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
    });
    return result.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      targets: nodes.map((node) => node.target),
    }));
  });
  assert.deepEqual(violations, [], `${theme} theme axe violations`);
}

async function main() {
  await access(nextBin).catch(() => {
    throw new Error('Next.js consumer is not installed; run npm run setup and npm install first.');
  });

  const output = [];
  const server = spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)], {
    cwd: appRoot,
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });
  server.stdout.on('data', (chunk) => output.push(chunk.toString()));
  server.stderr.on('data', (chunk) => output.push(chunk.toString()));

  try {
    await waitForServer(server, output);

    const packageRoot = path.join(appRoot, 'node_modules', '@serein-ui', 'react');
    const packageManifest = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
    assert.equal(packageManifest.name, '@serein-ui/react');
    assert.equal(packageManifest.version, '0.1.0-beta.1');
    assert.equal((await lstat(packageRoot)).isSymbolicLink(), false, 'Serein is an installed package directory');

    const response = await fetch(origin);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /data-testid="server-shell"/);
    assert.match(html, /Serein workspace settings/);
    assert.match(html, /Workspace name/);

    const cssLinks = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((match) => match[1]);
    assert.ok(cssLinks.length > 0, 'server HTML references CSS');
    const cssResponses = await Promise.all(cssLinks.map((href) => fetch(new URL(href, origin))));
    cssResponses.forEach((cssResponse) => assert.equal(cssResponse.status, 200));
    const css = (await Promise.all(cssResponses.map((cssResponse) => cssResponse.text()))).join('\n');
    assert.match(css, /--dp-orange:/, 'Serein design tokens are shipped');
    assert.match(css, /\.dp-theme/, 'Serein base theme CSS is shipped');

    const invalidRouteResponse = await fetch(`${origin}/api/save`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'North Star', team: 'sales', summary: false }),
    });
    assert.equal(invalidRouteResponse.status, 400, 'route rejects an unsupported team');

    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ headless: true });
    const chromiumVersion = browser.version();
    try {
      const page = await browser.newPage({ viewport: { width: 320, height: 812 } });
      const browserErrors = [];
      let expectedSaveFailures = 0;
      page.on('pageerror', (error) => browserErrors.push(`pageerror: ${error.message}`));
      page.on('response', (browserResponse) => {
        if (browserResponse.url().endsWith('/api/save') && browserResponse.status() === 503) {
          expectedSaveFailures += 1;
        }
      });
      page.on('console', (message) => {
        if (message.type() !== 'error') return;
        if (/Failed to load resource: the server responded with a status of 503/.test(message.text())) return;
        browserErrors.push(`console: ${message.text()}`);
      });

      await page.goto(origin, { waitUntil: 'networkidle' });
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        true,
        '320px viewport has no horizontal overflow',
      );
      assert.equal(await page.locator('html').getAttribute('data-dp-theme'), 'light');
      const lightBackground = await page.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor);
      assert.equal(lightBackground, 'rgb(255, 255, 255)');
      await runAxe(page, 'light');

      const themeButton = page.getByRole('button', { name: 'Use dark theme' });
      await themeButton.focus();
      await themeButton.press('Enter');
      assert.equal(await page.locator('html').getAttribute('data-dp-theme'), 'dark');
      const darkBackground = await page.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor);
      assert.equal(darkBackground, 'rgb(16, 17, 19)');
      await runAxe(page, 'dark');

      const name = page.getByRole('textbox', { name: 'Workspace name' });
      await name.focus();
      await name.press('Enter');
      await page.getByText('Enter a workspace name.').waitFor();
      assert.equal(await name.getAttribute('aria-invalid'), 'true');
      assert.equal(await name.evaluate((element) => element === document.activeElement), true);

      await name.fill('North Star');
      assert.equal(await name.getAttribute('aria-invalid'), null, 'name error clears when corrected');
      assert.equal(await page.getByText('Enter a workspace name.').count(), 0);
      const team = page.getByRole('combobox', { name: 'Team' });
      await team.focus();
      await team.press('Enter');
      const engineering = page.getByRole('option', { name: 'Engineering' });
      await engineering.waitFor();
      await engineering.press('Enter');
      assert.equal(await team.textContent(), 'Engineering');

      const summary = page.getByRole('switch', { name: 'Daily summary' });
      await summary.focus();
      await summary.press('Space');
      assert.equal(await summary.getAttribute('aria-checked'), 'true');

      const submit = page.getByRole('button', { name: 'Save workspace' });
      await submit.focus();
      await submit.press('Enter');
      await page.waitForFunction(() => {
        const button = document.querySelector('button[type="submit"]');
        return button instanceof HTMLButtonElement && button.disabled;
      });
      assert.equal(await name.isDisabled(), true);
      assert.equal(await team.isDisabled(), true);
      assert.equal(await summary.isDisabled(), true);
      await page.keyboard.press('Enter');
      await submit.click({ force: true });
      await page.locator('form').dispatchEvent('submit');
      const saveFailure = page.getByRole('alert').filter({ hasText: 'Save failed' });
      await saveFailure.waitFor();
      assert.match(await saveFailure.textContent(), /Attempt 1 failed/);
      assert.equal(await name.inputValue(), 'North Star');
      assert.equal(await team.textContent(), 'Engineering');
      assert.equal(await summary.getAttribute('aria-checked'), 'true');

      await submit.focus();
      await submit.press('Enter');
      const saved = page.getByRole('status').filter({ hasText: 'Workspace saved' });
      await saved.waitFor();
      assert.match(await saved.textContent(), /attempt 2/i);
      assert.equal(await name.inputValue(), 'North Star');

      assert.equal(expectedSaveFailures, 1, 'pending guard allows only one first-attempt request');
      assert.deepEqual(browserErrors, [], 'no hydration or browser console errors');
    } finally {
      await browser.close();
    }

    return {
      node: process.version,
      next: require('next/package.json').version,
      react: require('react/package.json').version,
      reactDom: require('react-dom/package.json').version,
      typescript: require('typescript/package.json').version,
      serein: packageManifest.version,
      playwright: require('playwright/package.json').version,
      axeCore: require('axe-core/package.json').version,
      chromium: chromiumVersion,
      viewport: '320x812',
    };
  } finally {
    await stopServer(server);
  }
}

main().then((versions) => {
  console.log('Next.js consumer verification passed: SSR, CSS, hydration, keyboard form flow, retry, themes, narrow viewport, and axe.');
  console.log(JSON.stringify(versions, null, 2));
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
