import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

// Packaging scripts need npm's pack/install output even when they run under pnpm in the monorepo.
export function findNpmCli() {
  const fromEnv = process.env.npm_execpath;
  if (fromEnv && /npm-cli\.c?js$/.test(fromEnv)) return fromEnv;
  const base = dirname(process.execPath);
  for (const candidate of [join(base, 'node_modules/npm/bin/npm-cli.js'), join(base, '../lib/node_modules/npm/bin/npm-cli.js')]) {
    if (existsSync(candidate)) return candidate;
  }
  if (process.env.NPM_CLI_JS) return process.env.NPM_CLI_JS;
  throw new Error('npm CLI not found next to Node; set NPM_CLI_JS to npm-cli.js.');
}
