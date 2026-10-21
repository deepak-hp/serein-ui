// Export only verified playback assets and explicitly selected public evidence.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, lstat, realpath } from 'node:fs/promises';
import { resolve, dirname, relative, extname, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const ids = ['c18a4d2', 'c39e7b1', 'c62f9a3', 'c85d1e6'];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const json = value => `${JSON.stringify(value, null, 2)}\n`;
const slash = path => path.replaceAll('\\', '/');
const inside = (root, file) => { const path = relative(root, file); return !isAbsolute(path) && path !== '..' && !path.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`); };
const readJson = async file => JSON.parse(await readFile(file, 'utf8'));

async function assertExportDestination(repoRoot, outputDir) {
  const trial = await realpath(resolve(repoRoot, 'trial'));
  // Resolve existing ancestors too, so a junction cannot redirect a seemingly
  // harmless output directory into either frozen experiment.
  let ancestor = outputDir;
  let actual;
  while (!actual) {
    try { actual = resolve(await realpath(ancestor), relative(ancestor, outputDir)); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const parent = dirname(ancestor);
      if (parent === ancestor) throw error;
      ancestor = parent;
    }
  }
  for (const name of ['evaluation', 'evaluation-next']) {
    const frozen = await realpath(resolve(trial, name)).catch(error => {
      if (error.code !== 'ENOENT') throw error;
      return resolve(trial, name);
    });
    assert.ok(!inside(frozen, actual), 'Output cannot be inside a frozen experiment');
  }
}

function localReferences(text, extension) {
  const refs = [];
  const expressions = extension === '.html' ? [/(?:src|href)="([^"]+)"/g] : extension === '.css' ? [/url\(\s*["']?([^\s"')]+)["']?\s*\)/g, /@import\s+["']([^"']+)["']/g] : [/(?:\bfrom\s*|\bimport\s*\(?\s*)["']([^"']+)["']/g];
  for (const expression of expressions) for (const match of text.matchAll(expression)) {
    if (match[1].startsWith('data:') || match[1].startsWith('#')) continue;
    assert.ok(!/^(?:[a-z]+:|\/\/|\/)/i.test(match[1]), `Nonlocal asset: ${match[1]}`);
    assert.ok(match[1].startsWith('./') || match[1].startsWith('../'), `Bare asset import: ${match[1]}`);
    refs.push(match[1].split(/[?#]/)[0]);
  }
  return refs;
}

async function collectBuild(buildRoot) {
  const files = new Map();
  const root = await realpath(buildRoot);
  async function collect(name) {
    name = slash(name);
    if (files.has(name)) return;
    assert.ok(name === 'index.html' || /^assets\/[a-zA-Z0-9_.-]+\.(?:js|css|woff2?|png|svg)$/.test(name), `Asset outside allowlist: ${name}`);
    const path = await realpath(resolve(root, name));
    assert.ok(inside(root, path), `Asset escaped candidate: ${name}`);
    const bytes = await readFile(path);
    files.set(name, bytes);
    if (['.html', '.js', '.css'].includes(extname(name))) {
      const text = bytes.toString('utf8');
      assert.doesNotMatch(text, /sourceMappingURL|(?:[a-z]:[\\/]Users[\\/]|\/Users\/|\/home\/)|private-key\.json|materials\/fingerprint\.json/i, `Private or mapped asset: ${name}`);
      for (const ref of localReferences(text, extname(name))) {
        const dependency = resolve(dirname(path), ref);
        assert.ok(inside(root, dependency), `Asset escaped candidate: ${ref}`);
        await collect(slash(relative(root, dependency)));
      }
    }
  }
  await collect('index.html');
  return files;
}

function assertPublicReport(bytes, name) {
  const value = JSON.parse(bytes.toString('utf8'));
  const visit = object => {
    if (!object || typeof object !== 'object') return;
    for (const [key, item] of Object.entries(object)) {
      assert.doesNotMatch(key, /condition|prompt|manifest|fingerprint|private/i, `Nonpublic field in ${name}: ${key}`);
      visit(item);
    }
  };
  visit(value);
  assert.doesNotMatch(bytes.toString('utf8'), /(?:[a-z]:[\\/]Users[\\/]|\/Users\/|\/home\/)|private-key\.json|runs\//i, `Nonpublic content in ${name}`);
}

export async function assembleReviewPacket({ repoRoot, outputDir, sourceCommit, templateDir = resolve(import.meta.dirname, '../reviewer-template') }) {
  assert.match(sourceCommit, /^[a-f0-9]{40,64}$/, 'Expected full source revision');
  outputDir = resolve(outputDir);
  await assertExportDestination(repoRoot, outputDir);
  await assert.rejects(lstat(outputDir), { code: 'ENOENT' }, 'Output already exists; choose a new directory');
  const root = resolve(repoRoot, 'trial/evaluation-next');
  const fingerprintBytes = await readFile(resolve(root, 'materials/fingerprint.json'));
  const fingerprint = JSON.parse(fingerprintBytes);
  assert.equal(Object.keys(fingerprint.hashes).length, 48, 'Expected all 48 frozen inputs');
  for (const [name, expected] of Object.entries(fingerprint.hashes)) {
    const path = resolve(root, name);
    assert.ok(inside(root, path), 'Frozen path escaped experiment');
    assert.equal(hash(await readFile(path)), expected, `Frozen input changed: ${name}`);
  }
  const replay = await readJson(resolve(root, 'builds/replay.json'));
  assert.equal(replay.frozenFingerprintSha256, hash(fingerprintBytes), 'Replay fingerprint changed');
  assert.equal(replay.frozenFilesVerified, 48);
  assert.deepEqual(replay.candidates.map(row => row.id), ids, 'Expected all four candidates in fixed order');
  const files = new Map();
  const candidates = [];
  const reports = [];
  for (const id of ids) {
    const checkBytes = await readFile(resolve(root, `evidence/${id}/final/check.json`));
    const check = JSON.parse(checkBytes);
    assert.equal(check.frozenFingerprintSha256, hash(fingerprintBytes), `Final fingerprint changed: ${id}`);
    for (const [name, expected] of Object.entries(check.hashes)) {
      assert.ok(['App.tsx', 'app.css', 'prompt.txt'].includes(name), `Unexpected final source: ${name}`);
      assert.equal(hash(await readFile(resolve(root, `runs/${id}/${name}`))), expected, `Final source changed: ${id}/${name}`);
    }
    for (const name of ['App.tsx', 'app.css', 'prompt.txt']) assert.ok(check.hashes[name], `Missing final source identity: ${id}/${name}`);
    const row = replay.candidates.find(candidate => candidate.id === id);
    assert.equal(row.checkReportSha256, hash(checkBytes), `Replay final report changed: ${id}`);
    const available = check.typecheck === 0 && check.build === 0;
    assert.equal(row.status, available ? 'rebuilt' : 'unavailable', `Replay build status changed: ${id}`);
    if (available) {
      assert.deepEqual(row.sourceHashes, check.hashes, `Replay source identity changed: ${id}`);
      for (const [name, bytes] of await collectBuild(resolve(root, 'builds', id))) files.set(`candidates/${id}/${name}`, bytes);
    }
    candidates.push({ id, playback: available ? 'rebuilt' : 'unavailable', sourceHashes: { 'App.tsx': check.hashes['App.tsx'], 'app.css': check.hashes['app.css'] } });
  }
  // Explicit report basenames prevent copying prompts, manifests, keys or unrelated experiments.
  const reportPaths = [['review/objective-results.json', 'evidence/primary/objective-results.json'], ['evidence-supplemental/summary.json', 'evidence/supplemental/summary.json']];
  for (const id of ids) {
    reportPaths.push([`evidence/${id}/browser/browser.json`, `evidence/primary/${id}/browser.json`]);
    for (const theme of ['light', 'dark']) for (const width of [1280, 320]) reportPaths.push([`evidence/${id}/browser/render-${theme}-${width}.json`, `evidence/primary/${id}/render-${theme}-${width}.json`]);
  }
  for (const [from, to] of reportPaths) {
    const bytes = await readFile(resolve(root, from));
    assertPublicReport(bytes, from);
    files.set(to, bytes);
    reports.push({ file: to, origin: `trial/evaluation-next/${from}`, sha256: hash(bytes) });
  }
  const rubric = await readFile(resolve(root, 'review/rubric.md'), 'utf8');
  files.set('rubric.md', Buffer.from(rubric.replaceAll('objective-results.json', 'evidence/primary/objective-results.json')));
  const observations = await readFile(resolve(root, 'review/observations.csv'), 'utf8');
  assert.equal(observations.trim(), 'reviewer,date,candidate,dimension,observation,severity', 'Human observations must remain empty');
  files.set('observations.csv', Buffer.from('reviewer,date,candidate,dimension,observation,severity\n'));
  for (const name of ['serve.mjs', 'README.md', 'THIRD_PARTY_LICENSES.txt']) files.set(name, await readFile(resolve(templateDir, name)));
  files.set('licenses/serein.txt', await readFile(resolve(repoRoot, 'trial/LICENSE')));
  files.set('licenses/plus-jakarta-sans.txt', await readFile(resolve(repoRoot, 'trial/public/licenses/plus-jakarta-sans.txt')));
  const links = candidates.map(row => `<section><h2>${row.id}</h2><p>${row.playback === 'rebuilt' ? `<a href="candidates/${row.id}/?theme=light">Light</a> · <a href="candidates/${row.id}/?theme=dark">Dark</a>` : 'Unavailable — retained in denominator'}</p></section>`).join('\n');
  const reportLinks = ids.map(id => `<li>${id}: <a href="evidence/primary/${id}/browser.json">Primary browser report</a> · ${['light', 'dark'].flatMap(theme => [1280, 320].map(width => `<a href="evidence/primary/${id}/render-${theme}-${width}.json">${theme} ${width}px</a>`)).join(' · ')}</li>`).join('\n');
  files.set('index.html', Buffer.from(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>File review candidates</title><style>body{font:17px system-ui;max-width:760px;margin:40px auto;padding:20px;line-height:1.5}section{border-top:1px solid #aaa;margin-top:24px}a{color:#164d99}</style></head><body><main><h1>File review candidates</h1><p>Four candidates, one task. Condition labels are hidden; appearance may reveal identity. Order is fixed by opaque ID. Review each independently before inspecting evidence or sources.</p><p>Read the <a href="rubric.md">rubric</a> and <a href="README.md">instructions and limitations</a>; record observations in <a href="observations.csv">the empty observation sheet</a>. Reload resets the first-call service failure.</p>${links}<details><summary>Historical evidence — view after independent review</summary><p>Build replay checks playback only and does not replace historical results. All original failures remain. The supplemental method was corrected after primary failures; it is exploratory confirmation.</p><p><a href="evidence/primary/objective-results.json">Primary objective results</a> · <a href="evidence/supplemental/summary.json">Supplemental summary and supplemental render diagnostics</a></p><ul>${reportLinks}</ul><p><a href="SOURCE.json">Source identity</a> · <a href="SHA256SUMS">Packet checksums</a></p></details><p>Licenses: <a href="licenses/serein.txt">Serein</a> · <a href="licenses/plus-jakarta-sans.txt">Plus Jakarta Sans</a> · <a href="THIRD_PARTY_LICENSES.txt">Runtime dependencies</a>.</p></main></body></html>\n`));
  files.set('SOURCE.json', Buffer.from(json({ format: 1, sourceCommit, exportedAt: new Date().toISOString(), node: process.version, replayedAt: replay.replayedAt, meaning: 'Build replay and packet identity only; historical measurement unchanged. Revision is repository context; exporter and candidate hashes identify exact exported inputs.', frozenFilesVerified: 48, exporterSha256: hash(await readFile(new URL(import.meta.url))), replayScriptSha256: hash(await readFile(resolve(root, 'scripts/replay-build.mjs'))), candidates, reports })));
  const sums = [...files].sort(([a], [b]) => a.localeCompare(b)).map(([name, bytes]) => `${hash(bytes)}  ${name}`).join('\n');
  files.set('SHA256SUMS', Buffer.from(`${sums}\n`));
  // Validate and collect everything before reserving the non-overwriting destination.
  await mkdir(dirname(outputDir), { recursive: true });
  await mkdir(outputDir);
  for (const [name, bytes] of files) {
    const path = resolve(outputDir, name);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, bytes, { flag: 'wx' });
  }
  return { outputDir, files: files.size, candidates: candidates.map(({ id, playback }) => ({ id, playback })) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.version.startsWith('v24.')) throw new Error('Use Node 24');
  assert.equal(process.argv.length, 3, 'Usage: node trial/scripts/export-review-packet.mjs NEW_OUTPUT_DIRECTORY');
  const repoRoot = resolve(import.meta.dirname, '../..');
  const outputDir = resolve(process.argv[2]);
  await assertExportDestination(repoRoot, outputDir);
  await assert.rejects(lstat(outputDir), { code: 'ENOENT' }, 'Output already exists; choose a new directory');
  const replay = spawnSync(process.execPath, [resolve(repoRoot, 'trial/evaluation-next/scripts/replay-build.mjs')], { cwd: repoRoot, encoding: 'utf8' });
  assert.equal(replay.status, 0, replay.stderr || replay.stdout || 'Replay failed');
  const git = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' });
  assert.equal(git.status, 0, 'Cannot read source revision');
  console.log(json(await assembleReviewPacket({ repoRoot, outputDir, sourceCommit: git.stdout.trim() })));
}
