import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const trialRoot = resolve(join(scriptPath, '..', '..'));
const approvedVersion = '0.1.0-beta.1';
const approvedTag = 'v0.1.0-beta.1';

export function validatePackageMetadata(pkg) {
  if (pkg.version !== approvedVersion) throw new Error(`Package version must be ${approvedVersion}.`);
  if (pkg.publishConfig?.access !== 'public' || pkg.publishConfig?.tag !== 'beta') {
    throw new Error('Package publishConfig must be public access with the beta tag.');
  }
  if (pkg.name !== '@serein-ui/react') throw new Error('Package name must be @serein-ui/react.');
  if (!pkg.repository?.url) throw new Error('Package repository URL is required.');
}

export function buildSourceMetadata(input) {
  if (!/^[0-9a-f]{40}$/.test(input.sourceCommit)) throw new Error('sourceCommit must be a full Git SHA.');
  if (!/^[0-9a-f]{64}$/.test(input.sha256)) throw new Error('sha256 must be a SHA-256 digest.');
  if (input.version !== approvedVersion || input.proposedTag !== approvedTag) throw new Error('Package version and proposed tag must match the approved beta.');
  return {
    unsigned: true,
    package: input.packageName,
    version: input.version,
    proposedTag: input.proposedTag,
    sourceCommit: input.sourceCommit,
    repositoryURL: input.repositoryURL,
    archive: { name: input.archiveName, sha256: input.sha256 },
    toolchain: { node: input.nodeVersion, npm: input.npmVersion },
    note: 'Unsigned source metadata; verify the checksum and source commit independently.',
  };
}

export async function ensureOutputDirectory(outputDir, root = trialRoot) {
  const output = resolve(outputDir);
  const review = resolve(root, '.review');
  const within = relative(review, output);
  if (!within || isAbsolute(within) || within === '..' || within.startsWith(`..${sep}`)) throw new Error('Output directory must be inside trial/.review.');
  // Check each existing parent before creating anything below it. A junction or
  // symlink must never turn even a rejected export into an outside-directory write.
  let parent = resolve(root);
  for (const part of ['.review', ...within.split(sep).slice(0, -1)]) {
    parent = join(parent, part);
    try { await mkdir(parent); } catch (error) { if (error.code !== 'EEXIST') throw error; }
    const details = await lstat(parent);
    if (!details.isDirectory() || details.isSymbolicLink()) throw new Error('Output parents must resolve inside trial/.review without symlinks.');
  }
  try { await mkdir(output); } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`Output directory already exists: ${relative(root, output)}`);
    throw error;
  }
  return output;
}

function npmCli() {
  if (!process.env.npm_execpath) throw new Error('Run through npm so npm_execpath is available.');
  return process.env.npm_execpath;
}

function runNpm(args, capture = false) {
  return execFileSync(process.execPath, [npmCli(), ...args], {
    cwd: trialRoot,
    windowsHide: true,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
    env: { ...process.env, npm_config_cache: join(trialRoot, '.npm-cache') },
  });
}

function git(args) {
  return execFileSync('git', args, { cwd: trialRoot, encoding: 'utf8', windowsHide: true }).trim();
}

export function assertCleanSourceStatus(status) {
  if (status) throw new Error(`Source tree must be clean before and after preparation:\n${status}`);
}

function assertCleanTrackedSource() {
  assertCleanSourceStatus(git(['status', '--porcelain', '--untracked-files=all']));
}

async function sha256(file) {
  return createHash('sha256').update(await readFile(file)).digest('hex');
}

export async function prepareBetaRelease(outputArg) {
  assertCleanTrackedSource();
  const pkg = JSON.parse(await readFile(join(trialRoot, 'package.json'), 'utf8'));
  validatePackageMetadata(pkg);
  const sourceCommit = git(['rev-parse', 'HEAD']);
  const outputDir = await ensureOutputDirectory(outputArg ?? join(trialRoot, '.review', `beta-release-${sourceCommit.slice(0, 7)}`));

  runNpm(['run', 'build']);
  runNpm(['run', 'check:package']);
  assertCleanTrackedSource();
  const packed = JSON.parse(runNpm(['pack', '--json', '--pack-destination', outputDir], true));
  const archivePath = resolve(outputDir, packed[0]?.filename ?? '');
  if (!archivePath.startsWith(outputDir + sep)) throw new Error('npm pack returned an unsafe archive path.');
  const digest = await sha256(archivePath);
  const metadata = buildSourceMetadata({
    packageName: pkg.name,
    version: pkg.version,
    sourceCommit,
    proposedTag: approvedTag,
    repositoryURL: pkg.repository.url,
    archiveName: packed[0].filename,
    sha256: digest,
    nodeVersion: process.version,
    npmVersion: execFileSync(process.execPath, [npmCli(), '--version'], { encoding: 'utf8' }).trim(),
  });
  await writeFile(join(outputDir, 'SHA256SUMS'), `${digest}  ${packed[0].filename}\n`);
  await writeFile(join(outputDir, 'SOURCE.json'), `${JSON.stringify(metadata, null, 2)}\n`);
  assertCleanTrackedSource();
  console.log(`Prepared unsigned beta archive: ${archivePath}`);
  return { outputDir, archivePath, metadata };
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const index = process.argv.indexOf('--output-dir');
  const alternate = process.argv.indexOf('--out-dir');
  const option = index >= 0 ? index : alternate;
  if (option >= 0 && !process.argv[option + 1]) throw new Error('An output directory is required after --output-dir.');
  await prepareBetaRelease(option >= 0 ? process.argv[option + 1] : undefined);
}
