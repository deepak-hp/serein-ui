import assert from 'node:assert/strict';
import test from 'node:test';
import { execFile } from 'node:child_process';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { aiFingerprint, normalizeText } from './ai-freshness.mjs';

const run = promisify(execFile);
const mirror = 'ai/examples/Shell.tsx';
const unexpected = 'ai/examples/unexpected-example.txt';

async function check() {
  try {
    const result = await run(process.execPath, ['scripts/check-ai.mjs']);
    return { code: 0, output: `${result.stdout}${result.stderr}` };
  } catch (error) {
    return { code: error.code, output: `${error.stdout ?? ''}${error.stderr ?? ''}` };
  }
}

test('AI freshness ignores LF/CRLF differences and rejects stale or unexpected examples', { concurrency: false }, async () => {
  const lf = 'one\ntwo\n';
  const crlf = 'one\r\ntwo\r\n';
  assert.equal(normalizeText(lf), normalizeText(crlf));
  assert.equal(aiFingerprint({ text: normalizeText(lf) }), aiFingerprint({ text: normalizeText(crlf) }));

  const original = await readFile(mirror, 'utf8');
  try {
    await writeFile(mirror, original.replace(/\r?\n/g, '\r\n'));
    let result = await check();
    assert.equal(result.code, 0, result.output);

    await writeFile(mirror, `${original}\n// stale mirror regression fixture\n`);
    result = await check();
    assert.notEqual(result.code, 0);
    assert.match(result.output, /AI example is stale: Shell\.tsx/);
  } finally {
    await writeFile(mirror, original);
  }

  try {
    await writeFile(unexpected, 'temporary regression fixture\n');
    const result = await check();
    assert.notEqual(result.code, 0);
    assert.match(result.output, /AI examples must contain only the explicit generated mirror set/);
  } finally {
    await rm(unexpected, { force: true });
  }

  const finalResult = await check();
  assert.equal(finalResult.code, 0, finalResult.output);
});
