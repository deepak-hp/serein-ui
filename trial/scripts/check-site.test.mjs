import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { resolveSiteRequest } from './check-site.mjs';

test('maps requests only below the recorded base path', async () => {
  const root = await mkdtemp(join(tmpdir(), 'serein-check-site-'));
  await mkdir(join(root, 'assets'), { recursive: true });
  await writeFile(join(root, 'site-metadata.json'), JSON.stringify({ basePath: '/serein-ui/' }));
  await writeFile(join(root, 'index.html'), '<!doctype html><title>Catalogue</title>');
  await writeFile(join(root, 'assets', 'app.js'), 'export {};');

  assert.deepEqual(await resolveSiteRequest(root, '/serein-ui/', '/serein-ui/'), { path: '/serein-ui/', status: 200, filePath: join(root, 'index.html') });
  assert.deepEqual(await resolveSiteRequest(root, '/serein-ui/', '/serein-ui/assets/app.js'), { path: '/serein-ui/assets/app.js', status: 200, filePath: join(root, 'assets', 'app.js') });
  assert.deepEqual(await resolveSiteRequest(root, '/serein-ui/', '/outside.js'), { path: '/outside.js', status: 404 });
  assert.deepEqual(await resolveSiteRequest(root, '/serein-ui/', '/serein-ui/../private.txt'), { path: '/private.txt', status: 404 });
});
