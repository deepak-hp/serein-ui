import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const appRoot = path.resolve(import.meta.dirname, '..');
const trialRoot = path.resolve(appRoot, '..', '..');
const repositoryRoot = path.resolve(trialRoot, '..');
const filename = 'serein-ui-react-0.1.0-beta.1.tgz';
const expectedSha256 = 'e7fefb1a74be80df55384ca446db9995359d7d2ae560676bf94d5c23f53cc470';
const vendorDirectory = path.join(appRoot, 'vendor');
const destination = path.join(vendorDirectory, filename);
const provenancePath = path.join(vendorDirectory, 'provenance.json');
const lockfilePath = path.join(appRoot, 'package-lock.json');

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed.\n${result.stdout}${result.stderr}`);
  }
  return result.stdout.trim();
}

async function sha256(file) {
  return createHash('sha256').update(await readFile(file)).digest('hex');
}

async function sha512Integrity(file) {
  return `sha512-${createHash('sha512').update(await readFile(file)).digest('base64')}`;
}

async function updateLockfileIntegrity(integrity) {
  const lockfile = JSON.parse(await readFile(lockfilePath, 'utf8'));
  const packageEntry = lockfile.packages?.['node_modules/@serein-ui/react'];
  if (!packageEntry) {
    throw new Error('package-lock.json does not contain the installed @serein-ui/react entry.');
  }
  packageEntry.integrity = integrity;
  await writeFile(lockfilePath, `${JSON.stringify(lockfile, null, 2)}\n`);
}

async function prepareFrozenArchive() {
  const source = path.resolve(
    process.argv[3]
      ?? process.env.SEREIN_TARBALL
      ?? path.join(trialRoot, '.review', 'beta-review-86926d4', filename),
  );
  const actualSha256 = await sha256(source).catch((error) => {
    throw new Error(`Unable to read reviewed Serein archive at ${source}: ${error.message}`);
  });
  if (actualSha256 !== expectedSha256) {
    throw new Error(`Serein archive SHA-256 mismatch: expected ${expectedSha256}, received ${actualSha256}`);
  }

  await copyFile(source, destination);
  return {
    mode: 'frozen-reviewed-archive',
    package: '@serein-ui/react@0.1.0-beta.1',
    archiveSha256: actualSha256,
    archiveIntegrity: await sha512Integrity(destination),
    reviewedSourceCommit: 'd8f8c54',
    source,
  };
}

async function prepareCurrentSource() {
  const npmCli = process.env.NPM_CLI_JS
    ?? process.env.npm_execpath
    ?? (process.platform === 'win32'
      ? 'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js'
      : undefined);
  if (!npmCli) {
    throw new Error('Current-source setup must run through `npm run setup` or set NPM_CLI_JS to npm-cli.js.');
  }

  run(process.execPath, [npmCli, 'run', 'build'], trialRoot);
  await rm(destination, { force: true });
  run(process.execPath, [npmCli, 'pack', '--ignore-scripts', '--pack-destination', vendorDirectory], trialRoot);

  const sourceCommit = run('git', ['-C', repositoryRoot, 'rev-parse', 'HEAD'], repositoryRoot);
  const sourceStatus = run('git', [
    '-C', repositoryRoot, 'status', '--short', '--',
    'trial/src', 'trial/package.json', 'trial/package-lock.json', 'trial/scripts',
    'trial/ai', 'trial/docs', 'trial/LICENSE', 'trial/THIRD_PARTY_NOTICES.md',
  ], repositoryRoot);

  return {
    mode: 'packed-current-source',
    package: '@serein-ui/react@0.1.0-beta.1',
    archiveSha256: await sha256(destination),
    archiveIntegrity: await sha512Integrity(destination),
    sourceCommit,
    sourceDirty: sourceStatus.length > 0,
    sourceStatus: sourceStatus ? sourceStatus.split(/\r?\n/) : [],
  };
}

if (process.argv[2] && process.argv[2] !== '--frozen') {
  throw new Error('Usage: npm run setup (pack current source) or npm run setup -- --frozen [archive]');
}

await mkdir(vendorDirectory, { recursive: true });
const provenance = process.argv[2] === '--frozen'
  ? await prepareFrozenArchive()
  : await prepareCurrentSource();
await updateLockfileIntegrity(provenance.archiveIntegrity);
await writeFile(provenancePath, `${JSON.stringify({ ...provenance, node: process.version }, null, 2)}\n`);
console.log(`Prepared ${destination}`);
console.log(`SHA-256 ${provenance.archiveSha256}`);
console.log('Updated package-lock.json with the prepared archive integrity.');
console.log(`Provenance ${provenancePath}`);
