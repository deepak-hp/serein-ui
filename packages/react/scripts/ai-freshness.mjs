import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

export function normalizeText(text) {
  return text.replace(/\r\n?/g, '\n');
}

export async function readText(path) {
  return normalizeText(await readFile(path, 'utf8'));
}

export async function writeText(path, text) {
  await writeFile(path, normalizeText(text));
}

export function aiFingerprint(input) {
  return createHash('sha256').update(JSON.stringify(input)).digest('hex');
}
