import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, readdir, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { request } from 'node:http';
import { pathToFileURL } from 'node:url';

const ids = ['c18a4d2', 'c39e7b1', 'c62f9a3', 'c85d1e6'];
const sha = value => createHash('sha256').update(value).digest('hex');
const exporter = await import('./export-review-packet.mjs').catch(() => ({}));
const here = resolve(import.meta.dirname, '..', '..');
async function fixture(t) {
  const dir = await mkdtemp(resolve(tmpdir(), 'review-packet-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const root = resolve(dir, 'repo/trial/evaluation-next');
  const put = async (path, bytes) => {
    await mkdir(dirname(resolve(root, path)), { recursive: true });
    await writeFile(resolve(root, path), bytes);
  };
  const hashes = {};
  for (let index = 0; index < 48; index++) {
    hashes[`materials/input-${index}`] = sha(`frozen ${index}`);
    await put(`materials/input-${index}`, `frozen ${index}`);
  }
  const fingerprint = JSON.stringify({ hashes });
  await put('materials/fingerprint.json', fingerprint);
  const candidates = [];
  for (const id of ids) {
    const sourceHashes = {};
    for (const file of ['App.tsx', 'app.css', 'prompt.txt']) {
      const content = file === 'prompt.txt' ? 'PRIVATE GENERATOR PROMPT' : `${id} ${file}`;
      sourceHashes[file] = sha(content);
      await put(`runs/${id}/${file}`, content);
    }
    const check = JSON.stringify({ id, typecheck: 0, build: 0, hashes: sourceHashes, frozenFingerprintSha256: sha(fingerprint) });
    await put(`evidence/${id}/final/check.json`, check);
    await put(`builds/${id}/index.html`, '<!doctype html><script type="module" src="./assets/app.js"></script><link rel="stylesheet" href="./assets/app.css">');
    await put(`builds/${id}/assets/app.js`, 'document.body.dataset.ready="true";');
    await put(`builds/${id}/assets/app.css`, 'body{color:black}');
    await put(`builds/${id}/assets/secret.js.map`, 'PRIVATE SOURCE MAP');
    await put(`builds/${id}/private-key.json`, 'PRIVATE CONDITION KEY');
    await put(`evidence/${id}/browser/browser.json`, JSON.stringify({ id, results: [{ name: 'render-light-1280', status: 'fail', message: 'preserved failure' }] }));
    for (const theme of ['light', 'dark']) for (const width of [1280, 320]) {
      await put(`evidence/${id}/browser/render-${theme}-${width}.json`, '{"errors":[],"axeViolations":[]}');
    }
    candidates.push({ id, status: 'rebuilt', sourceHashes, checkReportSha256: sha(check) });
  }
  await put('builds/replay.json', JSON.stringify({ replayedAt: '2026-10-21T00:00:00.000Z', frozenFingerprintSha256: sha(fingerprint), frozenFilesVerified: 48, candidates }));
  await put('review/rubric.md', 'Review each candidate independently.');
  await put('review/observations.csv', 'reviewer,date,candidate,dimension,observation,severity\n');
  await put('review/objective-results.json', JSON.stringify({ denominator: 4, candidates: ids.map(id => ({ id, browser: [{ name: 'render-light-1280', status: 'fail' }] })) }));
  await put('evidence-supplemental/summary.json', JSON.stringify({ candidateDenominator: 4, candidates: ids.map(id => ({ id, primaryInteractionsPassed: 1, supplementalInteractionsPassed: 3 })) }));
  await put('scripts/replay-build.mjs', '// replay identity');
  await put('private-key.json', 'PRIVATE CONDITION KEY');
  await put('../LICENSE', 'MIT license fixture');
  await put('../public/licenses/plus-jakarta-sans.txt', 'OFL font license fixture');
  return { dir, root, repoRoot: resolve(dir, 'repo'), outputDir: resolve(dir, 'unpacked anywhere', 'review'), templateDir: resolve(here, 'trial/reviewer-template'), sourceCommit: 'a'.repeat(40) };
}

test('exports four portable candidates and only allowlisted public evidence with byte identity', async t => {
  assert.equal(typeof exporter.assembleReviewPacket, 'function', 'packet exporter is implemented');
  const input = await fixture(t);
  await exporter.assembleReviewPacket(input);
  const files = await readdir(input.outputDir, { recursive: true });
  assert.ok(files.includes('SHA256SUMS'));
  assert.equal(await readFile(resolve(input.outputDir, 'licenses/plus-jakarta-sans.txt'), 'utf8'), 'OFL font license fixture');
  for (const id of ids) assert.ok(files.includes(`candidates/${id}/index.html`) || files.includes(`candidates\\${id}\\index.html`));
  const all = await Promise.all(files.filter(file => /\.(?:json|mjs|md|csv|html|js|css)$/.test(file)).map(file => readFile(resolve(input.outputDir, file), 'utf8')));
  assert.doesNotMatch(all.join('\n'), /PRIVATE|frozenFingerprintSha256|prompt\.txt|sourceMappingURL/);
  assert.ok(!files.some(file => /(?:\.map$|private-key|manifest|fingerprint)/i.test(file)));
  assert.deepEqual(await readFile(resolve(input.outputDir, 'evidence/primary/objective-results.json')), await readFile(resolve(input.root, 'review/objective-results.json')));
  assert.deepEqual(await readFile(resolve(input.outputDir, 'evidence/supplemental/summary.json')), await readFile(resolve(input.root, 'evidence-supplemental/summary.json')));
  assert.equal(await readFile(resolve(input.outputDir, 'observations.csv'), 'utf8'), 'reviewer,date,candidate,dimension,observation,severity\n');
  const source = JSON.parse(await readFile(resolve(input.outputDir, 'SOURCE.json'), 'utf8'));
  assert.equal(source.candidates.length, 4);
  assert.deepEqual(Object.keys(source.candidates[0].sourceHashes), ['App.tsx', 'app.css']);
  for (const line of (await readFile(resolve(input.outputDir, 'SHA256SUMS'), 'utf8')).trim().split('\n')) {
    const [hash, file] = line.split('  ');
    assert.equal(sha(await readFile(resolve(input.outputDir, file))), hash, file);
  }
});

test('never overwrites existing output and fails before export for changed frozen sources or missing assets', async t => {
  assert.equal(typeof exporter.assembleReviewPacket, 'function', 'packet exporter is implemented');
  const input = await fixture(t);
  await mkdir(input.outputDir, { recursive: true });
  await writeFile(resolve(input.outputDir, 'keep.txt'), 'keep');
  await assert.rejects(exporter.assembleReviewPacket(input), /exist/i);
  assert.equal(await readFile(resolve(input.outputDir, 'keep.txt'), 'utf8'), 'keep');
  await rm(input.outputDir, { recursive: true });
  await writeFile(resolve(input.root, 'materials/input-0'), 'changed');
  await assert.rejects(exporter.assembleReviewPacket(input), /Frozen input changed/);
  await writeFile(resolve(input.root, 'materials/input-0'), 'frozen 0');
  await rm(resolve(input.root, `builds/${ids[0]}/assets/app.js`));
  await assert.rejects(exporter.assembleReviewPacket(input), /missing|ENOENT/i);
});

test('retains failed builds as unavailable and never exports stale playback for them', async t => {
  const input = await fixture(t);
  const checkPath = resolve(input.root, `evidence/${ids[0]}/final/check.json`);
  const check = JSON.parse(await readFile(checkPath, 'utf8'));
  check.build = 1;
  const bytes = JSON.stringify(check);
  await writeFile(checkPath, bytes);
  const replayPath = resolve(input.root, 'builds/replay.json');
  const replay = JSON.parse(await readFile(replayPath, 'utf8'));
  replay.candidates[0].status = 'unavailable';
  replay.candidates[0].checkReportSha256 = sha(bytes);
  await writeFile(replayPath, JSON.stringify(replay));
  await exporter.assembleReviewPacket(input);
  const source = JSON.parse(await readFile(resolve(input.outputDir, 'SOURCE.json'), 'utf8'));
  assert.equal(source.candidates.length, 4);
  assert.equal(source.candidates[0].playback, 'unavailable');
  await assert.rejects(readFile(resolve(input.outputDir, `candidates/${ids[0]}/index.html`)), { code: 'ENOENT' });
});

test('rejects accidentally condition-bearing public reports and stale replay identities', async t => {
  const input = await fixture(t);
  const report = resolve(input.root, 'evidence-supplemental/summary.json');
  const original = await readFile(report);
  await writeFile(report, '{"condition":"unmasking"}');
  await assert.rejects(exporter.assembleReviewPacket(input), /Nonpublic field/);
  await writeFile(report, original);
  const replayPath = resolve(input.root, 'builds/replay.json');
  const replay = JSON.parse(await readFile(replayPath, 'utf8'));
  replay.candidates[0].sourceHashes['App.tsx'] = '0'.repeat(64);
  await writeFile(replayPath, JSON.stringify(replay));
  await assert.rejects(exporter.assembleReviewPacket(input), /Replay source identity changed/);
});

test('rejects destinations inside either frozen experiment before creating any directory', async t => {
  const input = await fixture(t);
  for (const experiment of ['evaluation', 'evaluation-next']) {
    const outputDir = resolve(input.repoRoot, 'trial', experiment, 'must-not-create/nested');
    await assert.rejects(exporter.assembleReviewPacket({ ...input, outputDir }), /frozen experiment/i);
    await assert.rejects(readFile(resolve(outputDir, 'SOURCE.json')), { code: 'ENOENT' });
    assert.ok(!(await readdir(resolve(input.repoRoot, 'trial', experiment)).catch(error => error.code === 'ENOENT' ? [] : Promise.reject(error))).includes('must-not-create'));
  }
  const alias = resolve(input.dir, 'alias-to-frozen');
  await symlink(input.root, alias, 'junction');
  await assert.rejects(exporter.assembleReviewPacket({ ...input, outputDir: resolve(alias, 'must-not-create') }), /frozen experiment/i);
  assert.ok(!(await readdir(input.root)).includes('must-not-create'));
});

function get(port, path, method = 'GET') {
  return new Promise((accept, reject) => {
    const req = request({ host: '127.0.0.1', port, path, method }, res => {
      const chunks = [];
      res.on('data', value => chunks.push(value));
      res.on('end', () => accept({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }));
    });
    req.on('error', reject); req.end();
  });
}

test('unpacked dependency-free server serves local links and denies traversal, unlisted files, and missing files', async t => {
  assert.equal(typeof exporter.assembleReviewPacket, 'function', 'packet exporter is implemented');
  const input = await fixture(t);
  await exporter.assembleReviewPacket(input);
  await writeFile(resolve(input.outputDir, 'secret.txt'), 'unlisted private file');
  const { createPacketServer } = await import(pathToFileURL(resolve(input.outputDir, 'serve.mjs')));
  const server = await createPacketServer(input.outputDir);
  await new Promise(accept => server.listen(0, '127.0.0.1', accept));
  t.after(() => new Promise(accept => server.close(accept)));
  const port = server.address().port;
  const index = await get(port, '/');
  assert.equal(index.status, 200);
  for (const match of index.body.matchAll(/href="([^"]+)"/g)) {
    assert.equal((await get(port, `/${match[1]}`)).status, 200, match[1]);
  }
  for (const id of ids) {
    const page = await get(port, `/candidates/${id}/?theme=dark`);
    assert.equal(page.status, 200);
    for (const match of page.body.matchAll(/(?:src|href)="(\.\/[^"?#]+)"/g)) {
      const asset = await get(port, `/candidates/${id}/${match[1].slice(2)}`);
      assert.equal(asset.status, 200);
    }
  }
  for (const path of ['/../secret.txt', '/%2e%2e/secret.txt', '/%252e%252e/secret.txt', '/candidates/%2e%2e/%2e%2e/secret.txt', '/%2fsecret.txt', '/%5csecret.txt', '/bad%ZZ', '/C:/secret.txt']) {
    assert.equal((await get(port, path)).status, 400, path);
  }
  for (const path of ['/missing.js', '/secret.txt', '/.git/config']) assert.equal((await get(port, path)).status, 404, path);
  assert.equal((await get(port, '/', 'POST')).status, 405);
  assert.equal((await get(port, '/', 'HEAD')).body, '');
  await rm(resolve(input.outputDir, `candidates/${ids[0]}/assets/app.js`));
  assert.equal((await get(port, `/candidates/${ids[0]}/assets/app.js`)).status, 404);
});
