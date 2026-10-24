import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { lstat, mkdir, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const npmCli = process.env.npm_execpath;
const node = process.execPath;
const consumerDirectory = join(root, '.consumer-check');
const cacheDirectory = join(root, '.npm-cache');

export function resolvePackageTarball(supplied = process.env.SEREIN_PACKAGE_TARBALL) {
  if (!supplied) return null;
  if (!isAbsolute(supplied)) throw new Error('SEREIN_PACKAGE_TARBALL must be an absolute archive path.');
  return resolve(supplied);
}

export async function validateSuppliedTarball(packageTarball, cleanupDirectory = consumerDirectory) {
  const archive = resolve(packageTarball);
  const cleanup = resolve(cleanupDirectory);
  const inside = (directory, file) => {
    const path = relative(directory, file);
    return !isAbsolute(path) && path !== '..' && !path.startsWith(`..${sep}`);
  };
  if (inside(cleanup, archive)) {
    throw new Error('Supplied package archive must be outside the consumer cleanup directory.');
  }
  const details = await lstat(archive);
  if (!details.isFile()) throw new Error('Supplied package archive must be a regular file, not a directory or symlink.');
  try {
    const cleanupDetails = await lstat(cleanup);
    if (cleanupDetails.isSymbolicLink()) throw new Error('Consumer cleanup directory must not be a symlink.');
    if (inside(await realpath(cleanup), await realpath(archive))) throw new Error('Supplied package archive must be outside the consumer cleanup directory.');
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  return archive;
}

export async function cleanupPackageTarball(packageTarball, supplied) {
  if (packageTarball && !supplied && existsSync(packageTarball)) await rm(packageTarball, { force: true });
}

function npm(args, cwd = root) {
  if (!npmCli) throw new Error('Run this check with npm run check:consumer.');
  return execFileSync(node, [npmCli, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, npm_config_cache: cacheDirectory },
  });
}

async function cssFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = join(directory, entry.name);
    return entry.isDirectory() ? cssFiles(entryPath) : entry.name.endsWith('.css') ? [entryPath] : [];
  }));
  return files.flat();
}

export async function runConsumerCheck() {
  const suppliedTarball = resolvePackageTarball();
  let packageTarball = suppliedTarball;
  try {
    if (!packageTarball) {
      const packed = JSON.parse(npm(['pack', '--json']));
      packageTarball = join(root, packed[0].filename);
    }
    if (!existsSync(packageTarball)) throw new Error(`Consumer archive does not exist: ${packageTarball}`);
    if (suppliedTarball) await validateSuppliedTarball(packageTarball);

  await rm(consumerDirectory, { recursive: true, force: true });
  await mkdir(consumerDirectory, { recursive: true });
  await writeFile(join(consumerDirectory, 'package.json'), JSON.stringify({
    private: true,
    type: 'module',
  }, null, 2));
  await writeFile(join(consumerDirectory, 'consumer.tsx'), await readFile(join(root, 'tests/fixtures/consumer.tsx'), 'utf8'));
  await writeFile(join(consumerDirectory, 'tsconfig.json'), JSON.stringify({
    compilerOptions: { strict: true, noEmit: true, target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', skipLibCheck: false, types: ['react', 'react-dom'] },
    include: ['consumer.tsx'],
  }, null, 2));

  npm(['install', '--ignore-scripts', '--no-package-lock', packageTarball, 'react@^19.3.0', 'react-dom@^19.3.0', '@types/react@^19.3.0', '@types/react-dom@^19.3.0', 'esbuild@^0.28.2'], consumerDirectory);

  const projectRequire = createRequire(import.meta.url);
  execFileSync(node, [projectRequire.resolve('typescript/bin/tsc'), '-p', join(consumerDirectory, 'tsconfig.json')], { cwd: consumerDirectory, stdio: 'inherit' });

  if (existsSync(join(consumerDirectory, 'node_modules', '@stylexjs', 'babel-plugin'))) {
    throw new Error('Consumer check must bundle without the StyleX compiler');
  }

  const require = createRequire(join(consumerDirectory, 'package.json'));
  const { build } = require('esbuild');
  await build({
    entryPoints: [join(consumerDirectory, 'consumer.tsx')],
    outdir: join(consumerDirectory, 'dist'),
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
  });

  const bundle = await readFile(join(consumerDirectory, 'dist', 'consumer.js'), 'utf8');
  if (/stylex\.create\s*\(/.test(bundle)) {
    throw new Error('Consumer bundle contains an uncompiled stylex.create call');
  }

  const emittedCss = await cssFiles(join(consumerDirectory, 'dist'));
  if (emittedCss.length === 0) throw new Error('Consumer bundle did not emit CSS');
  const css = (await Promise.all(emittedCss.map((file) => readFile(file, 'utf8')))).join('\n');
  if (!css.includes('--sr-color-signal')) throw new Error('Consumer CSS does not contain the library theme tokens');
  if (!css.includes('.sr-calendar')) throw new Error('Consumer CSS does not include calendar styles');
  if (!css.includes('.sr-status-icon--pending')) {
    throw new Error('Consumer CSS does not contain the StatusIcon motion rules');
  }
  console.log('Packed consumer: strict public types, accessible-name contract and compiler-free JS/CSS bundle verified.');
  } finally {
    await cleanupPackageTarball(packageTarball, Boolean(suppliedTarball));
  }
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) await runConsumerCheck();
