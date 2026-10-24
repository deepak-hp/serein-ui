// Builds @serein-ui/tokens from the DTCG 2025.10 source in /tokens.
// Style Dictionary parses the source and resolves references; the output formats are written here.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.resolve(PKG, '../../tokens');
const DIST = path.join(PKG, 'dist');
const THEMES = ['light', 'dark'];
const PREFIX = 'sr';

// ---------------------------------------------------------------- value → CSS
const isColor = (v) => v && typeof v === 'object' && 'colorSpace' in v;
const isDim = (v) => v && typeof v === 'object' && 'unit' in v && 'value' in v;
const round = (n, d = 4) => Math.round(n * 10 ** d) / 10 ** d;
const cssColor = (c) => {
  if (c.colorSpace !== 'srgb') throw new Error(`Unsupported colour space: ${c.colorSpace}`);
  const a = c.alpha ?? 1;
  if (a === 1) return c.hex ?? '#' + c.components.map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
  const [r, g, b] = c.components.map((x) => Math.round(x * 255));
  return `rgba(${r}, ${g}, ${b}, ${round(a, 3)})`;
};
const cssDim = (d) => (d.value === 0 ? '0' : `${d.value}${d.unit}`);
const cssFamily = (f) => (Array.isArray(f) ? f : [f]).map((n) => (/^[a-z-]+$/i.test(n) && !/\s/.test(n) && ['system-ui', 'sans-serif', 'serif', 'monospace', 'ui-monospace'].includes(n) ? n : /\s|\d/.test(n) || /^[A-Z]/.test(n) ? `"${n}"` : n)).join(', ');
const cssShadow = (s) => (Array.isArray(s) ? s : [s]).map((x) => `${x.inset ? 'inset ' : ''}${cssDim(x.offsetX)} ${cssDim(x.offsetY)} ${cssDim(x.blur)} ${cssDim(x.spread)} ${cssColor(x.color)}`).join(', ');

const toCss = (type, v) => {
  switch (type) {
    case 'color': return cssColor(v);
    case 'dimension': return cssDim(v);
    case 'duration': return `${v.value}${v.unit}`;
    case 'cubicBezier': return `cubic-bezier(${v.join(', ')})`;
    case 'fontFamily': return cssFamily(v);
    case 'fontWeight': return String(v);
    case 'shadow': return cssShadow(v);
    case 'typography': return v; // composite: expanded by the formats below
    default: throw new Error(`No CSS conversion for $type "${type}"`);
  }
};

// ---------------------------------------------------------------- load one theme (base + theme file), references resolved
async function load(theme) {
  const sd = new StyleDictionary({
    source: [`${SRC}/base/**/*.tokens.json`, `${SRC}/themes/${theme}.tokens.json`].map((g) => g.replaceAll('\\', '/')), // globs need forward slashes on Windows
    usesDtcg: true,
    log: { verbosity: 'silent', warnings: 'error', errors: { brokenReferences: 'throw' } },
    platforms: { raw: { transforms: [] } },
  });
  const tree = await sd.exportPlatform('raw');
  const flat = [];
  (function walk(node, p) {
    if (node && typeof node === 'object' && '$value' in node) { flat.push({ path: p, type: node.$type, value: node.$value, description: node.$description, ext: node.$extensions }); return; }
    for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) walk(v, [...p, k]);
  })(tree, []);
  return flat;
}

const byTheme = Object.fromEntries(await Promise.all(THEMES.map(async (t) => [t, await load(t)])));
const isThemed = (t) => t.path[0] === 'color' || t.path[0] === 'shadow';
const base = byTheme.light.filter((t) => !isThemed(t));
const themed = Object.fromEntries(THEMES.map((th) => [th, byTheme[th].filter(isThemed)]));

// Every theme must define exactly the same names.
const names = (list) => list.map((t) => t.path.join('.')).sort().join('|');
for (const th of THEMES) if (names(themed[th]) !== names(themed.light)) throw new Error(`Theme "${th}" does not define the same tokens as "light".`);
for (const t of byTheme.light) if (!t.type) throw new Error(`Token ${t.path.join('.')} has no $type.`);

const varName = (p) => `--${PREFIX}-${p.join('-')}`;
const write = (rel, text) => { const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
fs.rmSync(DIST, { recursive: true, force: true });
const HEADER = '/* Serein tokens - generated from /tokens (DTCG 2025.10). Do not edit. */\n';

// ---------------------------------------------------------------- CSS variables
const decls = (list, indent = '  ') => list.filter((t) => t.type !== 'typography').map((t) => `${indent}${varName(t.path)}: ${toCss(t.type, t.value)};`).join('\n');
const typeStyles = base.filter((t) => t.type === 'typography');
write('css/tokens.css', `${HEADER}
:root {
${decls(base)}
}

/* Light is the default; dark follows the system unless a theme is forced with data-theme. */
:root, [data-theme="light"] {
  color-scheme: light;
${decls(themed.light)}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
${decls(themed.dark, '    ')}
  }
}

[data-theme="dark"] {
  color-scheme: dark;
${decls(themed.dark)}
}
`);

const stretch = (t) => t.ext?.['dev.serein']?.fontStretch;
write('css/type.css', `${HEADER}
${typeStyles.map((t) => {
  const v = t.value, n = t.path[t.path.length - 1];
  const mono = byTheme.light.find((x) => x.path.join('.') === 'font.family.mono')?.value;
  const fam = JSON.stringify(v.fontFamily) === JSON.stringify(mono) ? 'mono' : 'sans';
  return `.${PREFIX}-type-${n} {
  font-family: var(--${PREFIX}-font-family-${fam});
  font-size: ${cssDim(v.fontSize)};
  font-weight: ${v.fontWeight};
  line-height: ${v.lineHeight};
  letter-spacing: ${cssDim(v.letterSpacing)};${stretch(t) ? `\n  font-stretch: ${stretch(t)};\n  font-variant-numeric: tabular-nums;` : ''}
}`;
}).join('\n\n')}
`);

// ---------------------------------------------------------------- Tailwind v4 theme
// Default Tailwind colours, fonts, radii and shadows are cleared so only Serein values exist (AI tools can't reach for bg-blue-500).
const short = (p) => p.slice(1).join('-');
const twTheme = `${HEADER}
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme inline {
  --color-*: initial;
  --font-*: initial;
  --radius-*: initial;
  --shadow-*: initial;
  --inset-shadow-*: initial;
  --ease-*: initial;
  --text-*: initial;

  --spacing: 4px;
${themed.light.filter((t) => t.path[0] === 'color').map((t) => `  --color-${short(t.path)}: var(${varName(t.path)});`).join('\n')}
${base.filter((t) => t.path[0] === 'font' && t.path[1] === 'family').map((t) => `  --font-${t.path[2]}: var(${varName(t.path)});`).join('\n')}
${base.filter((t) => t.path[0] === 'radius').map((t) => `  --radius-${short(t.path)}: var(${varName(t.path)});`).join('\n')}
${themed.light.filter((t) => t.path[0] === 'shadow').map((t) => `  --shadow-${short(t.path)}: var(${varName(t.path)});`).join('\n')}
${base.filter((t) => t.path[0] === 'easing').map((t) => `  --ease-${short(t.path)}: var(${varName(t.path)});`).join('\n')}
${typeStyles.map((t) => { const n = t.path[t.path.length - 1], v = t.value; return `  --text-${n}: ${cssDim(v.fontSize)};\n  --text-${n}--line-height: ${v.lineHeight};\n  --text-${n}--letter-spacing: ${cssDim(v.letterSpacing)};\n  --text-${n}--font-weight: ${v.fontWeight};`; }).join('\n')}
}
`;
write('tailwind/theme.css', twTheme);
write('tailwind/index.css', `${HEADER}@import "../css/tokens.css";\n@import "./theme.css";\n`);

// ---------------------------------------------------------------- JS / TS / JSON (raw values for JS, React Native, canvas)
const rawValue = (t) => {
  const v = t.value;
  switch (t.type) {
    case 'color': return cssColor(v);
    case 'dimension': return v.unit === 'px' ? v.value : cssDim(v);
    case 'duration': return v.value;
    case 'shadow': return cssShadow(v);
    case 'typography': return { fontFamily: Array.isArray(v.fontFamily) ? v.fontFamily : [v.fontFamily], fontSize: v.fontSize.value, fontWeight: v.fontWeight, lineHeight: v.lineHeight, letterSpacing: v.letterSpacing.value, ...(stretch(t) ? { fontStretch: stretch(t), tabularNums: true } : {}) };
    default: return v;
  }
};
const nest = (list) => {
  const o = {};
  for (const t of list) { let n = o; t.path.slice(0, -1).forEach((k) => (n = n[k] ??= {})); n[t.path[t.path.length - 1]] = rawValue(t); }
  return o;
};
const data = { base: nest(base), themes: Object.fromEntries(THEMES.map((th) => [th, nest(themed[th])])) };
const descriptions = Object.fromEntries([...base, ...themed.light].filter((t) => t.description).map((t) => [t.path.join('.'), t.description]));
write('json/tokens.json', JSON.stringify({ ...data, descriptions }, null, 2) + '\n');
write('js/index.js', `// Serein tokens — generated. Do not edit.
export const base = ${JSON.stringify(data.base, null, 2)};
export const themes = ${JSON.stringify(data.themes, null, 2)};
/** CSS custom property name for a token path, e.g. cssVar('color.signal') → 'var(--${PREFIX}-color-signal)'. */
export const cssVar = (path) => \`var(--${PREFIX}-\${path.split('.').join('-')})\`;
`);
const dts = (o, ind = '  ') => '{\n' + Object.entries(o).map(([k, v]) => `${ind}readonly ${/^[a-z_$][\w$]*$/i.test(k) ? k : JSON.stringify(k)}: ${v && typeof v === 'object' && !Array.isArray(v) ? dts(v, ind + '  ') : Array.isArray(v) ? `readonly ${typeof v[0]}[]` : typeof v};`).join('\n') + `\n${ind.slice(2)}}`;
write('js/index.d.ts', `// Serein tokens — generated. Do not edit.
export type ThemeName = ${THEMES.map((t) => `'${t}'`).join(' | ')};
export declare const base: ${dts(data.base)};
export type SereinTheme = ${dts(data.themes.light)};
export declare const themes: Record<ThemeName, SereinTheme>;
export type TokenPath = ${[...base, ...themed.light].map((t) => `'${t.path.join('.')}'`).join(' | ')};
export declare function cssVar(path: TokenPath): string;
`);

// ---------------------------------------------------------------- Swift (SwiftUI) and Kotlin (Jetpack Compose)
const camel = (p) => p.map((s, i) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())).map((s, i) => (i ? s[0].toUpperCase() + s.slice(1) : s)).join('');
const ident = (p) => { const c = camel(p); return /^\d/.test(c) ? '_' + c : c; };
const rgba = (c) => { const [r, g, b] = c.components; return { r: round(r), g: round(g), b: round(b), a: c.alpha ?? 1 }; };
const colors = (th) => themed[th].filter((t) => t.path[0] === 'color');
const dims = (group) => base.filter((t) => t.path[0] === group && t.type === 'dimension');

write('swift/SereinTokens.swift', `// Serein tokens — generated. Do not edit.
import SwiftUI

public struct SereinPalette {
${colors('light').map((t) => `    public let ${ident(t.path.slice(1))}: Color`).join('\n')}
}

public extension SereinPalette {
${THEMES.map((th) => `    static let ${th} = SereinPalette(
${colors(th).map((t) => { const c = rgba(t.value); return `        ${ident(t.path.slice(1))}: Color(.sRGB, red: ${c.r}, green: ${c.g}, blue: ${c.b}, opacity: ${c.a})`; }).join(',\n')}
    )`).join('\n')}
}

public enum SereinSpace {
${dims('space').map((t) => `    public static let s${t.path[1]}: CGFloat = ${t.value.value}`).join('\n')}
}

public enum SereinRadius {
${dims('radius').map((t) => `    public static let ${ident(t.path.slice(1))}: CGFloat = ${t.value.value}`).join('\n')}
}

public enum SereinSize {
${dims('size').map((t) => `    public static let ${ident(t.path.slice(1))}: CGFloat = ${t.value.value}`).join('\n')}
}

public enum SereinDuration {
${base.filter((t) => t.type === 'duration').map((t) => `    public static let ${ident(t.path.slice(1))}: Double = ${t.value.value / 1000}`).join('\n')}
}
`);

write('kotlin/SereinTokens.kt', `// Serein tokens — generated. Do not edit.
package dev.serein.tokens

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

data class SereinColors(
${colors('light').map((t) => `    val ${ident(t.path.slice(1))}: Color`).join(',\n')},
)

${THEMES.map((th) => `val ${th === 'light' ? 'Light' : 'Dark'}SereinColors = SereinColors(
${colors(th).map((t) => { const c = rgba(t.value); return `    ${ident(t.path.slice(1))} = Color(red = ${c.r}f, green = ${c.g}f, blue = ${c.b}f, alpha = ${c.a}f)`; }).join(',\n')},
)`).join('\n\n')}

object SereinSpace {
${dims('space').map((t) => `    val S${t.path[1]} = ${t.value.value}.dp`).join('\n')}
}

object SereinRadius {
${dims('radius').map((t) => `    val ${ident(t.path.slice(1)).replace(/^./, (c) => c.toUpperCase())} = ${t.value.value}.dp`).join('\n')}
}

object SereinSize {
${dims('size').map((t) => `    val ${ident(t.path.slice(1)).replace(/^./, (c) => c.toUpperCase())} = ${t.value.value}.dp`).join('\n')}
}

object SereinDuration {
${base.filter((t) => t.type === 'duration').map((t) => `    const val ${ident(t.path.slice(1)).replace(/^./, (c) => c.toUpperCase())}Ms = ${t.value.value}`).join('\n')}
}
`);

console.log(`@serein-ui/tokens: ${base.length} base + ${themed.light.length}×${THEMES.length} themed tokens → css, type.css, tailwind, js, json, swift, kotlin`);
