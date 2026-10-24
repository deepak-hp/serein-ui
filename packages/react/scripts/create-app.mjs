import { execFileSync } from 'node:child_process';
import { constants } from 'node:fs';
import {
  copyFile,
  lstat,
  mkdir,
  readFile,
  readdir,
  readlink,
  rename,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultRepositoryRoot = dirname(scriptDirectory);
const stableArchiveName = 'serein-ui-react.tgz';

export function parseArguments(argumentsList) {
  if (argumentsList.includes('--help') || argumentsList.includes('-h')) {
    if (argumentsList.length !== 1) throw new Error('--help cannot be combined with other arguments.');
    return { help: true };
  }

  let destination;
  let install = true;
  for (const argument of argumentsList) {
    if (argument === '--no-install') {
      install = false;
    } else if (argument.startsWith('-')) {
      throw new Error(`Unknown option: ${argument}`);
    } else if (destination) {
      throw new Error('Pass exactly one destination directory.');
    } else {
      destination = argument;
    }
  }
  if (!destination) throw new Error('A destination directory is required.');
  return { destination, install };
}

async function destinationState(destination) {
  try {
    const information = await lstat(destination);
    if (information.isSymbolicLink()) throw new Error(`Destination is a symbolic link or junction: ${destination}`);
    if (!information.isDirectory()) throw new Error(`Destination must be a directory: ${destination}`);
    if ((await readdir(destination)).length !== 0) throw new Error(`Destination must be empty: ${destination}`);
    return 'empty';
  } catch (error) {
    if (error?.code === 'ENOENT') return 'missing';
    throw error;
  }
}

function npmRunner(npmExecPath) {
  if (!npmExecPath) {
    throw new Error('npm_execpath is unavailable. Run this command through "npm run create:app -- <destination>".');
  }
  return (command, args, options) => {
    const output = execFileSync(command, args, options);
    return output === null ? '' : output.toString();
  };
}

async function copyTree(source, destination, transform, relativePath = '') {
  const sourceInfo = await lstat(source);
  if (sourceInfo.isDirectory()) {
    if (relativePath) await mkdir(destination);
    for (const entry of await readdir(source)) {
      const childRelativePath = relativePath ? join(relativePath, entry) : entry;
      await copyTree(join(source, entry), join(destination, entry), transform, childRelativePath);
    }
    return;
  }
  if (sourceInfo.isSymbolicLink()) {
    await symlink(await readlink(source), destination);
    return;
  }
  if (!sourceInfo.isFile()) throw new Error(`Cannot copy unsupported template entry: ${source}`);

  const contents = await transform(source, relativePath);
  if (contents === undefined) {
    await copyFile(source, destination, constants.COPYFILE_EXCL);
  } else {
    await writeFile(destination, contents, { flag: 'wx' });
  }
}

function projectName(destination) {
  const name = basename(resolve(destination)).toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^[._-]+|[._-]+$/g, '');
  if (!name || !/^[a-z0-9]/.test(name)) throw new Error(`Destination name cannot form a safe npm package name: ${basename(destination)}`);
  return name;
}

function updatePackageManifest(contents, name) {
  const manifest = JSON.parse(contents.toString());
  manifest.name = name;
  manifest.dependencies = {
    ...manifest.dependencies,
    '@serein-ui/react': `file:vendor/${stableArchiveName}`,
  };
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

export async function createApp(destinationInput, options = {}) {
  if (!destinationInput) throw new Error('A destination directory is required.');
  const destination = resolve(destinationInput);
  const repositoryRoot = options.repositoryRoot ?? defaultRepositoryRoot;
  const templateDirectory = options.templateDirectory ?? join(repositoryRoot, 'starter-template');
  const install = options.install ?? true;
  const runner = options.runner ?? npmRunner(options.npmExecPath ?? process.env.npm_execpath);
  const npmCache = join(repositoryRoot, '.npm-cache');

  await destinationState(destination);
  const name = projectName(destination);

  runner(process.execPath, [options.npmExecPath ?? process.env.npm_execpath, '--cache', npmCache, 'run', 'build'], {
    cwd: repositoryRoot,
    stdio: 'inherit',
  });

  await destinationState(destination);
  await mkdir(destination, { recursive: true });
  const expectedManifest = join(templateDirectory, 'package.json');
  await copyTree(templateDirectory, destination, async (source, relativePath) => {
    if (resolve(source) !== resolve(expectedManifest) || relativePath !== 'package.json') return undefined;
    return updatePackageManifest(await readFile(source), name);
  });

  const vendorDirectory = join(destination, 'vendor');
  await mkdir(vendorDirectory);
  const packed = runner(process.execPath, [options.npmExecPath ?? process.env.npm_execpath, '--cache', npmCache, 'pack', '--json', '--pack-destination', vendorDirectory], {
    cwd: repositoryRoot,
    stdio: 'pipe',
  });
  const packageResult = JSON.parse(Buffer.isBuffer(packed) ? packed.toString() : packed);
  const packedName = packageResult?.[0]?.filename;
  if (typeof packedName !== 'string' || packedName !== basename(packedName)) {
    throw new Error('npm pack did not return a valid archive filename.');
  }
  await rename(join(vendorDirectory, packedName), join(vendorDirectory, stableArchiveName));

  if (!install) return destination;
  try {
    runner(process.execPath, [options.npmExecPath ?? process.env.npm_execpath, '--cache', npmCache, 'install', '--ignore-scripts'], {
      cwd: destination,
      stdio: 'inherit',
    });
  } catch (error) {
    throw new Error(`The app scaffold was created, but installation failed.\nApp directory: ${destination}\nOpen a terminal in that directory, then run:\n  npm install --ignore-scripts`, { cause: error });
  }
  return destination;
}

function usage() {
  return 'Usage: npm run create:app -- <destination> [--no-install]';
}

function nextSteps(destination, install) {
  const introduction = `Created app at: ${destination}\n\nOpen a terminal in that directory, then run:`;
  if (install) return `${introduction}\n  npm run dev`;
  return `${introduction}\n  npm install --ignore-scripts\n  npm run dev`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const argumentsResult = parseArguments(process.argv.slice(2));
    if (argumentsResult.help) {
      console.log(usage());
    } else {
      const destination = await createApp(argumentsResult.destination, argumentsResult);
      console.log(nextSteps(destination, argumentsResult.install));
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
