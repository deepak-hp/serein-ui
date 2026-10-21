import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { normalizeBasePath } from './build-site.mjs';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

function containsPath(parent, candidate) {
  const difference = relative(parent, candidate);
  return difference === '' || (!isAbsolute(difference) && difference !== '..' && !difference.startsWith(`..${sep}`));
}

export async function resolveSiteRequest(rootDirectory, basePath, requestUrl) {
  const root = resolve(rootDirectory);
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  } catch {
    return { path: requestUrl, status: 400 };
  }
  if (!pathname.startsWith(basePath)) return { path: pathname, status: 404 };
  const relativePath = pathname.slice(basePath.length);
  const requestedPath = resolve(root, relativePath || 'index.html');
  if (!containsPath(root, requestedPath)) return { path: pathname, status: 403 };
  try {
    const details = await stat(requestedPath);
    const filePath = details.isDirectory() ? join(requestedPath, 'index.html') : requestedPath;
    await stat(filePath);
    return { path: pathname, status: 200, filePath };
  } catch {
    return { path: pathname, status: 404 };
  }
}

export async function createSiteServer(directory) {
  const root = resolve(directory);
  const metadata = JSON.parse(await readFile(join(root, 'site-metadata.json'), 'utf8'));
  const basePath = normalizeBasePath(metadata.basePath);
  const requests = [];
  const server = createServer(async (request, response) => {
    const result = await resolveSiteRequest(root, basePath, request.url ?? '/');
    requests.push({ path: result.path, status: result.status });
    if (result.status === 200) {
      try {
        const filePath = result.filePath;
        const data = await readFile(filePath);
        response.setHeader('Content-Type', contentTypes[extname(filePath)] ?? 'application/octet-stream');
        response.end(data);
      } catch {
        response.writeHead(500).end('Unable to read site file');
      }
      return;
    }
    response.writeHead(result.status).end(result.status === 403 ? 'Invalid site path' : result.status === 400 ? 'Invalid URL' : 'Not found');
  });
  await new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolvePromise);
  });
  const address = server.address();
  const origin = `http://127.0.0.1:${address.port}`;
  return {
    basePath,
    baseUrl: `${origin}${basePath}`,
    origin,
    requests,
    close: () => new Promise((resolvePromise, reject) => server.close((error) => error ? reject(error) : resolvePromise())),
  };
}

async function main() {
  const site = await createSiteServer(join(packageRoot, 'site-dist'));
  process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve(packageRoot, '.playwright');
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const pageErrors = [];
  const failedResponses = [];
  const escapedRequests = [];
  const observe = (page) => {
    page.on('pageerror', (error) => pageErrors.push(`${page.url()}: ${error.message}`));
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.origin === site.origin && !url.pathname.startsWith(site.basePath)) escapedRequests.push(url.pathname);
    });
    page.on('response', (response) => {
      const url = new URL(response.url());
      if (url.origin === site.origin && response.status() >= 400) failedResponses.push(`${response.status()} ${url.pathname}`);
    });
  };

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    page.setDefaultTimeout(15_000);
    observe(page);

    await page.goto(site.baseUrl);
    await page.waitForURL((url) => url.searchParams.get('view') === 'catalogue');
    await page.getByRole('heading', { name: 'Component catalogue', exact: true }).waitFor();
    const components = page.getByRole('navigation', { name: 'Components', exact: true });
    await components.getByRole('link', { name: 'Checkbox', exact: true }).click();
    assert.equal(new URL(page.url()).searchParams.get('component'), 'Checkbox');
    const permalink = await page.getByRole('link', { name: 'Permalink', exact: true }).getAttribute('href');
    assert.equal(permalink, '?view=catalogue&component=Checkbox');
    await page.reload();
    await page.getByRole('heading', { name: 'Checkbox', exact: true }).waitFor();

    for (const [path, label] of [
      ['licenses/serein.txt', 'license'],
      ['catalogue-assets/ai/llms-full.txt', 'AI reference'],
    ]) {
      const response = await page.request.get(new URL(path, site.baseUrl).href);
      assert.equal(response.status(), 200, label);
      assert.ok((await response.text()).trim().length > 20, `${label} must not be empty`);
    }

    const story = await browser.newPage({ viewport: { width: 1000, height: 700 }, reducedMotion: 'reduce' });
    story.setDefaultTimeout(15_000);
    observe(story);
    await story.goto(new URL('storybook/iframe.html?id=components-button--primary&viewMode=story', site.baseUrl).href);
    await story.getByRole('button', { name: 'Save changes', exact: true }).waitFor();
    await story.goto(new URL('storybook/iframe.html?id=components-button--docs&viewMode=docs', site.baseUrl).href);
    await story.getByRole('heading', { name: 'Button', exact: true }).first().waitFor();
    for (const [storyId, linkName, expectedPath] of [
      ['components-link--default', 'Read the component API', '/docs/start-here-agent-api--docs'],
      ['components-breadcrumbs--default', 'Library', '/docs/start-here-catalogue--docs'],
    ]) {
      await story.goto(new URL(`storybook/iframe.html?id=${storyId}&viewMode=story`, site.baseUrl).href);
      const renderedHref = new URL(await story.getByRole('link', { name: linkName, exact: true }).getAttribute('href'), story.url());
      assert.equal(renderedHref.pathname, `${site.basePath}storybook/`, `${linkName} must retain the Storybook base path`);
      assert.equal(renderedHref.searchParams.get('path'), expectedPath);
    }

    const manager = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    manager.setDefaultTimeout(30_000);
    observe(manager);
    await manager.goto(new URL('storybook/?path=/docs/start-here-catalogue--docs', site.baseUrl).href);
    const preview = manager.frameLocator('#storybook-preview-iframe');
    try {
      await preview.getByRole('heading', { name: /Component catalogue/ }).waitFor();
    } catch (error) {
      const iframeSource = await manager.locator('#storybook-preview-iframe').getAttribute('src');
      const previewFrame = manager.frames().find((frame) => frame.url().includes('/iframe.html') && frame.url().includes('start-here-catalogue--docs'));
      const previewText = previewFrame ? (await previewFrame.locator('body').innerText()).slice(0, 500) : '';
      throw new Error(`Catalogue preview did not render; iframe=${iframeSource}; body=${previewText}; frames=${manager.frames().map((frame) => frame.url()).join(', ')}`, { cause: error });
    }
    await preview.getByRole('link', { name: 'Button', exact: true }).click();
    await manager.waitForURL((url) => url.pathname === `${site.basePath}storybook/` && url.searchParams.get('path') === '/docs/components-button--docs');
    await manager.frameLocator('#storybook-preview-iframe').getByRole('heading', { name: /Button/ }).first().waitFor();

    for (const [docsId, linkName, expectedHref] of [
      ['foundations-apple-guidance--docs', 'foundations', 'https://github.com/deepak-hp/serein-ui/blob/main/trial/docs/FOUNDATIONS.md'],
      ['start-here-accessibility--docs', 'VERIFICATION.md', 'https://github.com/deepak-hp/serein-ui/blob/main/trial/docs/VERIFICATION.md'],
      ['start-here-accessibility--docs', 'ACCESSIBILITY-EVIDENCE.md', 'https://github.com/deepak-hp/serein-ui/blob/main/trial/docs/ACCESSIBILITY-EVIDENCE.md'],
    ]) {
      await story.goto(new URL(`storybook/iframe.html?id=${docsId}&viewMode=docs`, site.baseUrl).href);
      assert.equal(await story.getByRole('link', { name: linkName, exact: true }).getAttribute('href'), expectedHref);
    }

    assert.deepEqual(pageErrors, [], `Page errors:\n${pageErrors.join('\n')}`);
    assert.deepEqual(failedResponses, [], `HTTP failures:\n${failedResponses.join('\n')}`);
    assert.deepEqual(escapedRequests, [], `Same-origin requests escaped ${site.basePath}:\n${escapedRequests.join('\n')}`);
    const serverFailures = site.requests.filter(({ status }) => status >= 400);
    assert.deepEqual(serverFailures, [], `Server failures:\n${JSON.stringify(serverFailures, null, 2)}`);
    process.stdout.write(`Static site passed at ${site.basePath}: catalogue redirect/navigation/reload, Storybook manager catalogue cross-link and story/docs, license and AI assets; no page errors, 404s, or escaped same-origin requests.\n`);
  } finally {
    await browser.close();
    await site.close();
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.stack ?? error}\n`);
    process.exitCode = 1;
  });
}
