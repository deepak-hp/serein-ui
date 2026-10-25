import assert from 'node:assert/strict';
import { access, mkdtemp, mkdir, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import {
  buildSourceMetadata,
  assertCleanSourceStatus,
  ensureOutputDirectory,
  validatePackageMetadata,
} from './prepare-beta-release.mjs';
import { resolvePackageTarball, cleanupPackageTarball, validateSuppliedTarball } from './consumer-check.mjs';

test('source metadata contains exact archive integrity and no local paths', () => {
  const metadata = buildSourceMetadata({
    packageName: '@serein-ui/react',
    version: '0.1.0',
    sourceCommit: '0123456789abcdef0123456789abcdef01234567',
    proposedTag: 'v0.1.0',
    repositoryURL: 'https://github.com/deepak-hp/serein-ui',
    archiveName: 'serein-ui-react-0.1.0.tgz',
    sha256: 'a'.repeat(64),
    nodeVersion: 'v24.19.0',
    npmVersion: '10.8.1',
  });
  assert.equal(metadata.archive.sha256, 'a'.repeat(64));
  assert.equal(metadata.sourceCommit.length, 40);
  assert.equal(metadata.unsigned, true);
  assert.doesNotMatch(JSON.stringify(metadata), /[A-Z]:\\|node_modules|npm_config|TOKEN|SECRET/i);
});

test('package metadata rejects a version or tag that is not the approved release', () => {
  assert.throws(() => validatePackageMetadata({ version: '0.1.0-beta.1', publishConfig: { access: 'public' } }), /version/i);
  assert.throws(() => validatePackageMetadata({ version: '0.1.0', publishConfig: { access: 'restricted' } }), /publishConfig/i);
  assert.throws(() => validatePackageMetadata({ version: '0.1.0', publishConfig: { access: 'public', tag: 'beta' } }), /publishConfig/i);
});

test('source preparation rejects any nonempty Git status, including untracked files', () => {
  assert.throws(() => assertCleanSourceStatus('?? public/new-doc.md'), /source tree must be clean/i);
});

test('output directory must be inside trial/.review and must not already exist', async () => {
  const root = await mkdtemp(join(tmpdir(), 'serein-prepare-'));
  const trialRoot = join(root, 'trial');
  const reviewRoot = join(trialRoot, '.review');
  await mkdir(reviewRoot, { recursive: true });
  const target = join(reviewRoot, 'candidate');
  await ensureOutputDirectory(target, trialRoot);
  await assert.rejects(() => ensureOutputDirectory(target, trialRoot), /already exists/i);
  await assert.rejects(() => ensureOutputDirectory(join(root, 'outside'), trialRoot), /inside trial.*review/i);
});

test('output directory rejects a symlinked ancestor that escapes .review', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'serein-prepare-link-'));
  const trialRoot = join(root, 'trial');
  const reviewRoot = join(trialRoot, '.review');
  const outside = join(root, 'outside');
  await mkdir(reviewRoot, { recursive: true });
  await mkdir(outside, { recursive: true });
  try {
    await symlink(outside, join(reviewRoot, 'escape'), 'junction');
  } catch (error) {
    if (error.code === 'EPERM' || error.code === 'EACCES') return t.skip('symlink creation is unavailable');
    throw error;
  }
  await assert.rejects(() => ensureOutputDirectory(join(reviewRoot, 'escape', 'new-parent', 'candidate'), trialRoot), /resolve inside/i);
  await assert.rejects(() => access(join(outside, 'new-parent')), { code: 'ENOENT' });
});

test('supplied consumer archive is resolved and never selected for cleanup', async () => {
  const root = await mkdtemp(join(tmpdir(), 'serein-consumer-'));
  const archive = resolve(root, 'candidate.tgz');
  await writeFile(archive, 'candidate');
  assert.equal(resolvePackageTarball(archive), archive);
  await cleanupPackageTarball(archive, true);
  await access(archive);
  const cleanup = join(root, '.consumer-check');
  await mkdir(cleanup);
  const nested = join(cleanup, 'nested.tgz');
  await writeFile(nested, 'must survive');
  await assert.rejects(() => validateSuppliedTarball(nested, cleanup), /outside the consumer cleanup/i);
  if (process.platform === 'win32') await assert.rejects(() => validateSuppliedTarball(nested.replace('.consumer-check', '.CONSUMER-CHECK'), cleanup), /outside the consumer cleanup/i);
  await access(nested);
  await assert.rejects(() => validateSuppliedTarball(join(root, '.consumer-check', 'candidate.tgz'), join(root, '.consumer-check')), /outside the consumer cleanup/i);
  const link = resolve(root, 'candidate-link.tgz');
  try {
    await symlink(archive, link);
  } catch (error) {
    if (error.code !== 'EPERM' && error.code !== 'EACCES') throw error;
    return;
  }
  await assert.rejects(() => validateSuppliedTarball(link, join(root, '.consumer-check')), /regular file/i);
});

test('supplied consumer archive through an ancestor alias remains protected', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'serein-consumer-alias-'));
  const cleanup = join(root, '.consumer-check');
  await mkdir(cleanup);
  const archive = join(cleanup, 'candidate.tgz');
  await writeFile(archive, 'must survive');
  const alias = join(root, 'alias');
  try { await symlink(cleanup, alias, 'junction'); } catch (error) {
    if (error.code === 'EPERM' || error.code === 'EACCES') return t.skip('symlink creation is unavailable');
    throw error;
  }
  await assert.rejects(() => validateSuppliedTarball(join(alias, 'candidate.tgz'), cleanup), /outside the consumer cleanup/i);
  await access(archive);
});
