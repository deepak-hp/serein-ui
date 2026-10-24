import { transformAsync } from '@babel/core';
import stylexPlugin from '@stylexjs/babel-plugin';
import { build } from 'esbuild';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirectory = join(root, 'src');
const outputDirectory = join(root, 'dist');
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'serein-stylex-'));

function isExactBuildOutput(path) {
  return relative(root, path) === 'dist' && resolve(path) === outputDirectory;
}

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = join(directory, entry.name);
    return entry.isDirectory()
      ? sourceFiles(entryPath)
      : /\.(?:ts|tsx|js|jsx)$/.test(entry.name) ? [entryPath] : [];
  }));
  return files.flat();
}

try {
  if (!isExactBuildOutput(outputDirectory)) throw new Error('Refusing to clean a path outside this package dist directory');
  await rm(outputDirectory, { recursive: true, force: true });
  const rules = [];
  const files = await sourceFiles(sourceDirectory);

  for (const sourcePath of files) {
    const source = await readFile(sourcePath, 'utf8');
    const result = await transformAsync(source, {
      babelrc: false,
      configFile: false,
      filename: sourcePath,
      presets: [
        ['@babel/preset-typescript', { allExtensions: true, isTSX: true }],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
      plugins: [[stylexPlugin, { dev: false, runtimeInjection: false }]],
    });

    if (!result?.code) throw new Error(`Babel did not emit code for ${sourcePath}`);
    rules.push(...(result.metadata?.stylex ?? []));

    const temporaryPath = join(temporaryDirectory, relative(sourceDirectory, sourcePath))
      .replace(/\.(?:ts|tsx|jsx)$/, '.js');
    await mkdir(dirname(temporaryPath), { recursive: true });
    await writeFile(temporaryPath, result.code);
  }

  await mkdir(outputDirectory, { recursive: true });
  await build({
    entryPoints: [join(temporaryDirectory, 'index.js')],
    outfile: join(outputDirectory, 'index.js'),
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    packages: 'external',
    banner: { js: '"use client";' },
  });

  const processStyles = stylexPlugin.processStyles ?? stylexPlugin.processStylexRules;
  if (!processStyles) throw new Error('The StyleX Babel plugin does not expose a CSS processor');

  const [stylexCss, tokensCss, motionCss, calendarCss] = await Promise.all([
    Promise.resolve(processStyles(rules)),
    readFile(join(sourceDirectory, 'tokens.css'), 'utf8'),
    readFile(join(sourceDirectory, 'motion.css'), 'utf8'),
    readFile(join(sourceDirectory, 'calendar.css'), 'utf8'),
  ]);
  await writeFile(join(outputDirectory, 'styles.css'), `${stylexCss}\n${tokensCss}\n${motionCss}\n${calendarCss}`);
  await writeFile(join(outputDirectory, 'styles.d.ts'), 'export {};\n');
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
