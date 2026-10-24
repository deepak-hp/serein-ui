import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const entry = await readFile('dist/index.js', 'utf8');
const license = await readFile('LICENSE', 'utf8');
const rootLicense = await readFile('../LICENSE', 'utf8');
const notices = await readFile('THIRD_PARTY_NOTICES.md', 'utf8');
assert.ok(/^['"]use client['"];\s/.test(entry), 'Compiled React entry needs a preserved client-component directive');
assert.ok(!entry.includes('stylex.create('), 'Published entry must contain compiled styles');
for (const target of Object.values(pkg.exports).flatMap(value => typeof value === 'string' ? [value] : Object.values(value))) await access(target);
assert.deepEqual(pkg.sideEffects, ['**/*.css'], 'Styles must survive tree shaking');
assert.ok(pkg.peerDependencies.react && pkg.peerDependencies['react-dom'], 'React must remain a peer dependency');
assert.ok(!pkg.dependencies.react && !pkg.dependencies['react-dom'], 'Do not ship another React instance');
assert.equal(pkg.version, '0.1.0-beta.1', 'The public beta package must use the approved prerelease version');
assert.notEqual(pkg.private, true, 'The public beta package must be publishable');
assert.equal(pkg.license, 'MIT', 'The public beta package must declare the approved MIT license');
assert.deepEqual(pkg.publishConfig, { access: 'public', tag: 'beta' }, 'The public beta must publish publicly under the beta tag');
assert.equal(license, rootLicense, 'The packaged license must match the repository license');
assert.match(license, /Copyright \(c\) 2026 Deepak HP/, 'The MIT license must name the approved copyright holder and year');
assert.match(notices, /Plus Jakarta Sans[\s\S]*OFL-1\.1/, 'Third-party notices must identify the font and its OFL-1.1 terms');
assert.ok(pkg.description && pkg.repository?.url && pkg.homepage && pkg.bugs?.url, 'Package metadata needs description, repository, homepage, and issue URL');
assert.equal(pkg.engines?.node, '>=24 <25', 'The package must declare the supported Node 24 release policy');

const npmCli = process.env.npm_execpath;
assert.ok(npmCli, 'Run package verification through npm so npm_execpath is available.');
const packed = JSON.parse(execFileSync(process.execPath, [npmCli, 'pack', '--dry-run', '--json'], {
  encoding: 'utf8',
  env: { ...process.env, npm_config_cache: join(process.cwd(), '.npm-cache') },
}));
const files = packed[0]?.files?.map(file => file.path) ?? [];
assert.ok(files.length > 0, 'npm pack did not return a package manifest');
const requiredFiles = ['README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'package.json', 'dist/index.js', 'dist/index.d.ts', 'dist/styles.css', 'dist/styles.d.ts', 'ai/contract.json', 'ai/llms-full.txt', 'docs/ACCESSIBILITY.md'];
for (const file of requiredFiles) assert.ok(files.includes(file), `Package is missing required public file: ${file}`);
const publicFile = file => file === 'README.md' || file === 'LICENSE' || file === 'THIRD_PARTY_NOTICES.md' || file === 'package.json'
  || /^dist\/(?:index\.js|styles\.css|[A-Za-z][A-Za-z0-9-]*\.d\.ts)$/.test(file)
  || /^ai\/(?:[A-Za-z0-9_.-]+\.(?:md|json|txt)|examples\/[A-Za-z0-9_.-]+\.(?:md|ts|tsx|css))$/.test(file)
  || /^docs\/[A-Za-z0-9_.-]+\.md$/.test(file);
const unexpected = files.filter(file => !publicFile(file));
assert.deepEqual(unexpected, [], `Unexpected package file(s): ${unexpected.join(', ')}`);
for (const file of files.filter(file => /\.(?:js|json|md|txt|css|ts|tsx)$/i.test(file))) {
  const contents = await readFile(file, 'utf8');
  assert.ok(!/(?:Deepak UI|Deepak \/ UI|Ritam UI)/.test(contents), `Stale brand name found in package file: ${file}`);
}
console.log('Package entry, exports, contents manifest, CSS side effects and React peers verified.');
