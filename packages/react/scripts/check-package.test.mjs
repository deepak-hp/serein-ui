import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';

const staleFile = 'dist/index.html';
execFileSync(process.execPath, [process.env.npm_execpath, 'run', 'build'], { stdio: 'pipe' });
await mkdir('dist', { recursive: true });
await writeFile(staleFile, '<!doctype html><title>stale playground</title>');

try {
  assert.throws(
    () => execFileSync(process.execPath, ['scripts/check-package.mjs'], { stdio: 'pipe' }),
    /Unexpected package file|unexpected/i,
    'Package verification must reject a stale playground page.',
  );
  execFileSync(process.execPath, [process.env.npm_execpath, 'run', 'build'], { stdio: 'pipe' });
  execFileSync(process.execPath, [process.env.npm_execpath, 'run', 'check:package'], { stdio: 'pipe' });
} finally {
  await rm(staleFile, { force: true });
}
