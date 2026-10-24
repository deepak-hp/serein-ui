import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const npm = process.env.npm_execpath;
if (!npm) throw new Error('Run the release gate through pnpm (pnpm run check:release).');
let storybook;

function run(args, env = {}) {
  const result = spawnSync(process.execPath, [npm, ...args], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, npm_config_cache: join(root, '.npm-cache'), ...env },
  });
  if (result.status !== 0) throw new Error(`npm ${args.join(' ')} failed`);
}

async function availablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  await new Promise(resolve => server.close(resolve));
  return port;
}

function start(command, args, label, cwd = root) {
  const child = spawn(command, args, { cwd, windowsHide: true, stdio: 'inherit' });
  child.once('error', error => { child.startError = new Error(`${label} could not start: ${error.message}`); });
  return child;
}

async function waitFor(url, child, label) {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (child.startError) throw child.startError;
    if (child.exitCode !== null) throw new Error(`${label} exited before becoming ready`);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`${label} did not become ready at ${url}`);
}

async function stop(child) {
  if (!child || child.exitCode !== null) return;
  child.kill('SIGTERM');
  await Promise.race([
    new Promise(resolve => child.once('exit', resolve)),
    new Promise(resolve => setTimeout(resolve, 5000)),
  ]);
}

for (const [signal, exitCode] of [['SIGINT', 130], ['SIGTERM', 143]]) {
  process.once(signal, () => {
    void (async () => {
      await stop(storybook);
      process.exit(exitCode);
    })();
  });
}

try {
  run(['run', 'check:production']);
  run(['run', 'test:package']);
  run(['run', 'test:ai-freshness']);
  run(['run', 'test:stories']);
  run(['run', 'build:storybook']);
  run(['run', 'test:starter']);
  run(['run', 'check:starter']);

  const storybookPort = await availablePort();
  storybook = start(process.execPath, [join(root, 'node_modules/storybook/dist/bin/dispatcher.js'), 'dev', '--host', '127.0.0.1', '--port', String(storybookPort), '--no-open', '--disable-telemetry'], 'Storybook');
  const storybookUrl = `http://127.0.0.1:${storybookPort}`;
  await waitFor(`${storybookUrl}/index.json`, storybook, 'Storybook');
  const storybookEnv = { STORYBOOK_URL: storybookUrl };
  for (const check of ['check:docs', 'check:storybook-ui', 'ai:check-mcp', 'check:layout', 'check:search-layout', 'check:menu-select', 'check:date-layout']) run(['run', check], storybookEnv);
} finally {
  await stop(storybook);
}
