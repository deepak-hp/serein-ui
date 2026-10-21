import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { assembleSite, normalizeBasePath } from './build-site.mjs';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'serein-site-test-'));
  const reference = join(root, 'reference');
  const storybook = join(root, 'storybook');
  const output = join(root, 'site');
  await mkdir(join(reference, 'assets'), { recursive: true });
  await mkdir(join(reference, 'catalogue-assets', 'ai'), { recursive: true });
  await mkdir(join(reference, 'licenses'), { recursive: true });
  await mkdir(join(storybook, 'licenses'), { recursive: true });
  await writeFile(join(reference, 'index.html'), '<!doctype html><html><head></head><body><div id="root"></div></body></html>');
  await writeFile(join(reference, 'assets', 'app.js'), 'export {};');
  await writeFile(join(reference, 'catalogue-assets', 'ai', 'llms-full.txt'), 'reviewed AI guidance');
  await writeFile(join(reference, 'licenses', 'serein.txt'), 'MIT');
  await writeFile(join(storybook, 'index.html'), '<!doctype html><title>Storybook</title>');
  await writeFile(join(storybook, 'licenses', 'serein.txt'), 'MIT');
  return { root, reference, storybook, output };
}

test('normalizes repository and root deployment paths', () => {
  assert.equal(normalizeBasePath('/serein-ui'), '/serein-ui/');
  assert.equal(normalizeBasePath('/'), '/');
  assert.throws(() => normalizeBasePath('https://example.com/serein-ui/'), /URL path/);
  assert.throws(() => normalizeBasePath('/serein-ui/../private/'), /segments/);
  for (const unsafePath of ['/serein-ui/<script>/', '/serein-ui\\private/', '/%2e%2e/private/', '/serein ui/']) {
    assert.throws(() => normalizeBasePath(unsafePath), /safe URL path segments/);
  }
});

test('assembles catalogue and Storybook without retaining stale output', async () => {
  const { reference, storybook, output } = await fixture();
  await mkdir(output, { recursive: true });
  await writeFile(join(output, 'private-notes.txt'), 'must disappear');

  const result = await assembleSite({ referenceDirectory: reference, storybookDirectory: storybook, outputDirectory: output, basePath: '/serein-ui/' });

  assert.equal(result.catalogueUrl, '/serein-ui/?view=catalogue');
  assert.equal(result.storybookUrl, '/serein-ui/storybook/');
  assert.equal(await readFile(join(output, '.nojekyll'), 'utf8'), '');
  assert.equal(await readFile(join(output, 'catalogue-assets', 'ai', 'llms-full.txt'), 'utf8'), 'reviewed AI guidance');
  assert.equal(await readFile(join(output, 'licenses', 'serein.txt'), 'utf8'), 'MIT');
  assert.match(await readFile(join(output, 'storybook', 'index.html'), 'utf8'), /Storybook/);
  await assert.rejects(readFile(join(output, 'private-notes.txt'), 'utf8'), /ENOENT/);
  assert.match(await readFile(join(output, 'index.html'), 'utf8'), /search\.length === 0/);
});

test('refuses incomplete build inputs', async () => {
  const { reference, storybook, output } = await fixture();
  await writeFile(join(reference, 'catalogue-assets', 'ai', 'llms-full.txt'), '');
  await assert.rejects(
    assembleSite({ referenceDirectory: reference, storybookDirectory: storybook, outputDirectory: output, basePath: '/' }),
    /required public file is empty/,
  );
});

test('refuses output nested in a source or a source nested in output', async () => {
  const first = await fixture();
  await assert.rejects(
    assembleSite({ referenceDirectory: first.reference, storybookDirectory: first.storybook, outputDirectory: join(first.reference, 'site'), basePath: '/' }),
    /must not overlap/,
  );

  const second = await fixture();
  await assert.rejects(
    assembleSite({ referenceDirectory: second.reference, storybookDirectory: second.storybook, outputDirectory: second.root, basePath: '/' }),
    /must not overlap/,
  );
});
