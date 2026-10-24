import assert from 'node:assert/strict';
import { existsSync, writeFileSync } from 'node:fs';
import { mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { createApp, parseArguments } from './create-app.mjs';

const trialRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const unitRoot = join(trialRoot, '.starter-unit');

async function makeFixture(t) {
  const directory = join(unitRoot, `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const template = join(directory, 'starter-template');
  const destination = join(directory, 'new-app');
  await mkdir(template, { recursive: true });
  await mkdir(join(template, 'src'), { recursive: true });
  await writeFile(join(template, 'package.json'), JSON.stringify({
    name: 'starter-app',
    private: true,
    dependencies: { '@serein-ui/react': '^0.0.1' },
  }, null, 2));
  await writeFile(join(template, 'src', 'main.jsx'), 'export default null;\n');
  t.after(async () => {
    const safeRelative = relative(unitRoot, directory);
    assert.ok(safeRelative && !safeRelative.startsWith('..') && !resolve(directory).includes(tmpdir()));
    await rm(directory, { recursive: true, force: true });
  });
  return { directory, template, destination };
}

function fakeRunner(calls) {
  return (command, args, options) => {
    calls.push({ command, args, options });
    if (args.includes('pack')) {
      const vendor = args.at(-1);
      writeFileSync(join(vendor, 'serein-ui-react-0.0.1.tgz'), 'archive');
      return JSON.stringify([{ filename: 'serein-ui-react-0.0.1.tgz' }]);
    }
    return '';
  };
}

test('parseArguments accepts one destination and --no-install', () => {
  assert.deepEqual(parseArguments(['apps/demo', '--no-install']), {
    destination: 'apps/demo',
    install: false,
  });
});

test('parseArguments rejects missing destinations and unexpected flags', () => {
  assert.throws(() => parseArguments([]), /destination/i);
  assert.throws(() => parseArguments(['demo', '--unsafe']), /Unknown option/i);
  assert.throws(() => parseArguments(['demo', 'again']), /exactly one/i);
});

test('createApp refuses a nonempty destination without changing its file', async (t) => {
  const { destination, template } = await makeFixture(t);
  await mkdir(destination);
  const sentinel = join(destination, '.keep');
  await writeFile(sentinel, 'leave me');

  await assert.rejects(
    createApp(destination, { install: false, templateDirectory: template, runner: fakeRunner([]) }),
    /empty/i,
  );
  assert.equal(await readFile(sentinel, 'utf8'), 'leave me');
});

test('createApp refuses an existing file and symlink destination', async (t) => {
  const { directory, destination, template } = await makeFixture(t);
  await writeFile(destination, 'sentinel');
  await assert.rejects(
    createApp(destination, { install: false, templateDirectory: template, runner: fakeRunner([]) }),
    /directory/i,
  );

  const linked = join(directory, 'linked-app');
  await symlink(join(directory, 'elsewhere'), linked, 'junction');
  await assert.rejects(
    createApp(linked, { install: false, templateDirectory: template, runner: fakeRunner([]) }),
    /symbolic link|junction/i,
  );
});

test('createApp copies the template, vendors the archive, and skips install', async (t) => {
  const { destination, template } = await makeFixture(t);
  const calls = [];

  await createApp(destination, { install: false, templateDirectory: template, npmExecPath: 'npm-cli.js', runner: fakeRunner(calls) });

  assert.equal(await readFile(join(destination, 'src', 'main.jsx'), 'utf8'), 'export default null;\n');
  const generatedPackage = JSON.parse(await readFile(join(destination, 'package.json'), 'utf8'));
  assert.equal(generatedPackage.name, 'new-app');
  assert.equal(generatedPackage.dependencies['@serein-ui/react'], 'file:vendor/serein-ui-react.tgz');
  assert.ok(existsSync(join(destination, 'vendor', 'serein-ui-react.tgz')));
  assert.deepEqual(calls.map(({ args }) => args.slice(1, 5)), [
    ['--cache', join(trialRoot, '.npm-cache'), 'run', 'build'],
    ['--cache', join(trialRoot, '.npm-cache'), 'pack', '--json'],
  ]);
  assert.equal(calls.some(({ args }) => args[0] === 'install'), false);
});

test('createApp preserves the template package manifest', async (t) => {
  const { destination, template } = await makeFixture(t);
  const original = await readFile(join(template, 'package.json'), 'utf8');

  await createApp(destination, { install: false, templateDirectory: template, npmExecPath: 'npm-cli.js', runner: fakeRunner([]) });

  assert.equal(await readFile(join(template, 'package.json'), 'utf8'), original);
});

test('createApp runs build through the default runner when inherited output is null', async (t) => {
  const { directory, destination, template } = await makeFixture(t);
  const fakeNpm = join(directory, 'fake-npm.mjs');
  await writeFile(fakeNpm, [
    "import { writeFileSync } from 'node:fs';",
    "import { join } from 'node:path';",
    "const argumentsList = process.argv.slice(2);",
    "if (argumentsList.includes('pack')) {",
    "  const destinationIndex = argumentsList.indexOf('--pack-destination');",
    "  writeFileSync(join(argumentsList[destinationIndex + 1], 'serein-ui-react-0.0.1.tgz'), 'archive');",
    "  console.log(JSON.stringify([{ filename: 'serein-ui-react-0.0.1.tgz' }]));",
    "}",
  ].join('\n'));

  await createApp(destination, {
    install: false,
    repositoryRoot: directory,
    templateDirectory: template,
    npmExecPath: fakeNpm,
  });

  assert.ok(existsSync(join(destination, 'vendor', 'serein-ui-react.tgz')));
});

test('createApp keeps the scaffold when installation fails', async (t) => {
  const { directory, template } = await makeFixture(t);
  const destination = join(directory, 'demo$(echo unsafe)`echo unsafe`');
  const runner = (command, args, options) => {
    if (args.includes('pack')) {
      writeFileSync(join(args.at(-1), 'serein-ui-react-0.0.1.tgz'), 'archive');
      return JSON.stringify([{ filename: 'serein-ui-react-0.0.1.tgz' }]);
    }
    if (args.includes('install')) throw new Error('offline');
    return '';
  };

  let error;
  try {
    await createApp(destination, { templateDirectory: template, npmExecPath: 'npm-cli.js', runner });
    assert.fail('installation failure should reject');
  } catch (receivedError) {
    error = receivedError;
  }
  assert.match(error.message, /scaffold was created[\s\S]*npm install/i);
  assert.ok(error.message.includes(destination));
  assert.doesNotMatch(error.message, /\bcd /);
  assert.ok(existsSync(join(destination, 'package.json')));
  assert.ok(existsSync(join(destination, 'vendor', 'serein-ui-react.tgz')));
});
