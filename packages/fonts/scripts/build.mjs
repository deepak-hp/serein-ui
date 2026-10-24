// Builds @serein-ui/fonts: copies the OFL font files from Fontsource and writes @font-face rules under Serein's family names.
// React Native can't read woff2 or variable axes, so static TTF instances (from Expo Google Fonts) are copied to dist/native too.
// `--check` verifies the build without writing (used as the package test).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(PKG, 'dist');
const CHECK = process.argv.includes('--check');
const SOURCES = [
  { family: 'Anek Latin', dir: '@fontsource-variable/anek-latin', css: 'wdth.css' },   // weight 100–800 and width 75–125%
  { family: 'Chivo Mono', dir: '@fontsource-variable/chivo-mono', css: 'index.css' },  // weight 100–900
];

// Static weights used by @serein-ui/native (the type tokens use 300–600 sans and 400 mono). Width stays 100%: no static 88% instance exists.
const NATIVE = [
  ...[[300, 'Light'], [400, 'Regular'], [500, 'Medium'], [600, 'SemiBold']].map(([w, n]) => ({ dir: '@expo-google-fonts/anek-latin', from: `${w}${n}/AnekLatin_${w}${n}.ttf`, name: `AnekLatin-${n}.ttf` })),
  { dir: '@expo-google-fonts/chivo-mono', from: '400Regular/ChivoMono_400Regular.ttf', name: 'ChivoMono-Regular.ttf' },
];
const nativeFrom = (f) => path.join(PKG, 'node_modules', f.dir, f.from);

const faces = [];
const files = new Set();
const licences = [];
for (const s of SOURCES) {
  const root = path.join(PKG, 'node_modules', s.dir);
  const css = fs.readFileSync(path.join(root, s.css), 'utf8');
  for (const block of css.match(/@font-face\s*\{[^}]+\}/g)) {
    if (/font-style:\s*italic/.test(block)) continue;
    const file = /url\(\.\/files\/([^)]+)\)/.exec(block)[1];
    files.add(JSON.stringify({ from: path.join(root, 'files', file), name: file }));
    faces.push(block.replace(/font-family:\s*'[^']+'/, `font-family: '${s.family}'`).replace(/url\(\.\/files\//, 'url(./files/'));
  }
  licences.push(`${s.family} (via ${s.dir})\n\n${fs.readFileSync(path.join(root, 'LICENSE'), 'utf8').trim()}`);
}

for (const dir of new Set(NATIVE.map((f) => f.dir))) licences.push(`Static TTFs for React Native (via ${dir})\n\n${fs.readFileSync(path.join(PKG, 'node_modules', dir, 'LICENSE_FONT'), 'utf8').trim()}`);

const out = `/* @serein-ui/fonts - self-hosted, SIL Open Font License 1.1 (see OFL.txt). Generated; do not edit. */\n\n${faces.join('\n\n')}\n`;

// The rupee sign must be covered by one of the Anek Latin subsets.
const covers = (block, cp) => (/unicode-range:\s*([^;]+);/.exec(block)?.[1] ?? '').split(',').some((r) => {
  const [a, b] = r.trim().replace(/U\+/gi, '').split('-').map((h) => parseInt(h, 16));
  return cp >= a && cp <= (b ?? a);
});
const anek = faces.filter((f) => f.includes("'Anek Latin'"));
if (!anek.some((f) => covers(f, 0x20b9))) throw new Error('No Anek Latin subset covers ₹ (U+20B9).');
if (!anek.every((f) => /font-stretch:\s*75% 125%/.test(f))) throw new Error('Anek Latin faces must expose the 75–125% width axis.');

if (CHECK) {
  const built = fs.readFileSync(path.join(DIST, 'fonts.css'), 'utf8');
  if (built !== out) throw new Error('dist/fonts.css is stale: run the build.');
  for (const f of files) if (!fs.existsSync(path.join(DIST, 'files', JSON.parse(f).name))) throw new Error(`Missing ${JSON.parse(f).name}`);
  for (const f of NATIVE) if (!fs.readFileSync(path.join(DIST, 'native', f.name)).equals(fs.readFileSync(nativeFrom(f)))) throw new Error(`dist/native/${f.name} is stale: run the build.`);
  console.log(`@serein-ui/fonts OK: ${faces.length} faces, ₹ covered, width axis present, ${NATIVE.length} native TTFs`);
} else {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(path.join(DIST, 'files'), { recursive: true });
  for (const f of files) { const { from, name } = JSON.parse(f); fs.copyFileSync(from, path.join(DIST, 'files', name)); }
  fs.mkdirSync(path.join(DIST, 'native'));
  for (const f of NATIVE) fs.copyFileSync(nativeFrom(f), path.join(DIST, 'native', f.name));
  fs.writeFileSync(path.join(DIST, 'fonts.css'), out);
  fs.writeFileSync(path.join(PKG, 'OFL.txt'), licences.join('\n\n---\n\n') + '\n');
  console.log(`@serein-ui/fonts: ${faces.length} faces, ${files.size} files, ${NATIVE.length} native TTFs`);
}
