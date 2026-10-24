// Validates src/icons/*.svg and emits dist/ (svg, index, react, sheet). Dependency-free.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src', 'icons');
const DIST = path.join(ROOT, 'dist');

const ROOT_ATTRS = {
  xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor',
  'stroke-width': '1.5', 'stroke-linecap': 'square', 'stroke-linejoin': 'miter',
};
const ELEMENTS = {
  path: ['d'], circle: ['cx', 'cy', 'r'], rect: ['x', 'y', 'width', 'height', 'rx', 'ry'], line: ['x1', 'y1', 'x2', 'y2'],
};
const OPTIONAL = ['fill', 'stroke'];
const LO = 0, HI = 20;

// ---- parsing
function parseAttrs(s, where, errs) {
  const attrs = {};
  const re = /([A-Za-z_:][\w:.-]*)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(s))) {
    if (m[1] in attrs) errs.push(`${where}: duplicate attribute "${m[1]}"`);
    attrs[m[1]] = m[2];
  }
  const rest = s.replace(re, '').trim();
  if (rest) errs.push(`${where}: unparseable attribute text "${rest}"`);
  return attrs;
}

function parse(src, name) {
  const errs = [];
  const text = src.replace(/^﻿/, '').trim();
  const m = /^<svg\b([^>]*)>([\s\S]*)<\/svg>$/.exec(text);
  if (!m) return { errs: [`${name}: file must be a single <svg>...</svg> element`] };
  const root = parseAttrs(m[1], `${name} <svg>`, errs);
  const kids = [];
  const body = m[2];
  const tagRe = /\s*<([A-Za-z][\w:-]*)\b([^>]*?)\/>\s*/y;
  let pos = 0;
  while (pos < body.length) {
    tagRe.lastIndex = pos;
    const t = tagRe.exec(body);
    if (!t) {
      errs.push(`${name}: unexpected content "${body.slice(pos).trim().slice(0, 40)}" (only self-closed <path>/<circle>/<rect>/<line> allowed)`);
      break;
    }
    kids.push({ tag: t[1], attrs: parseAttrs(t[2], `${name} <${t[1]}>`, errs) });
    pos = tagRe.lastIndex;
  }
  return { root, kids, errs };
}

// ---- geometry
const num = (v) => (v != null && /^-?(\d+\.?\d*|\.\d+)$/.test(v) ? parseFloat(v) : NaN);

// Walks path data and returns every absolute point (control points and endpoints).
function pathPoints(d, where, errs) {
  const pts = [];
  const arity = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
  const leftover = d.replace(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?|[\s,]/gi, '');
  if (leftover) { errs.push(`${where}: invalid characters in path data "${leftover}"`); return pts; }
  let p = 0, cmd = null, x = 0, y = 0, sx = 0, sy = 0;
  const skip = () => { while (p < d.length && /[\s,]/.test(d[p])) p++; };
  const readNum = () => {
    skip();
    const r = /^-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/i.exec(d.slice(p));
    if (!r) return NaN;
    p += r[0].length;
    return parseFloat(r[0]);
  };
  const readFlag = () => { skip(); const c = d[p]; if (c === '0' || c === '1') { p++; return +c; } return NaN; };
  skip();
  while (p < d.length) {
    skip();
    if (p >= d.length) break;
    if (/[A-Za-z]/.test(d[p])) {
      cmd = d[p++];
      if (!(cmd.toLowerCase() in arity)) { errs.push(`${where}: unknown path command "${cmd}"`); return pts; }
    } else if (cmd === null) { errs.push(`${where}: path must start with a command`); return pts; }
    const lc = cmd.toLowerCase(), rel = cmd === lc;
    if (lc === 'z') {
      x = sx; y = sy; skip();
      if (p < d.length && !/[A-Za-z]/.test(d[p])) { errs.push(`${where}: numbers after Z`); return pts; }
      continue;
    }
    const a = [];
    for (let k = 0; k < arity[lc]; k++) a.push(lc === 'a' && (k === 3 || k === 4) ? readFlag() : readNum());
    if (a.some(Number.isNaN)) { errs.push(`${where}: malformed arguments for "${cmd}"`); return pts; }
    const ox = rel ? x : 0, oy = rel ? y : 0;
    if (lc === 'h') { x = rel ? x + a[0] : a[0]; pts.push([x, y]); }
    else if (lc === 'v') { y = rel ? y + a[0] : a[0]; pts.push([x, y]); }
    else if (lc === 'a') { x = ox + a[5]; y = oy + a[6]; pts.push([x, y]); }
    else {
      for (let k = 0; k < a.length; k += 2) pts.push([ox + a[k], oy + a[k + 1]]);
      x = ox + a[a.length - 2]; y = oy + a[a.length - 1];
    }
    if (lc === 'm') { sx = x; sy = y; cmd = rel ? 'l' : 'L'; }
  }
  return pts;
}

function validate(name, parsed) {
  const errs = [...parsed.errs];
  if (!parsed.root) return errs;
  const { root, kids } = parsed;
  for (const [k, v] of Object.entries(ROOT_ATTRS)) {
    if (!(k in root)) errs.push(`${name}: <svg> missing ${k}="${v}"`);
    else if (root[k] !== v) errs.push(`${name}: <svg> ${k}="${root[k]}" must be "${v}"${k === 'viewBox' ? ' (wrong viewBox)' : ''}`);
  }
  for (const k of Object.keys(root)) if (!(k in ROOT_ATTRS)) errs.push(`${name}: disallowed attribute "${k}" on <svg>`);
  if (!kids.length) errs.push(`${name}: icon has no shapes`);
  const chk = (v, label) => {
    if (Number.isNaN(v)) errs.push(`${name}: non-numeric ${label}`);
    else if (v < LO || v > HI) errs.push(`${name}: ${label} = ${v} is outside ${LO}-${HI}`);
  };
  kids.forEach(({ tag, attrs }, i) => {
    const w = `${name} <${tag}>#${i + 1}`;
    if (!(tag in ELEMENTS)) { errs.push(`${name}: disallowed element <${tag}> (allowed: ${Object.keys(ELEMENTS).join(', ')})`); return; }
    for (const k of Object.keys(attrs)) {
      if (!ELEMENTS[tag].includes(k) && !OPTIONAL.includes(k)) errs.push(`${w}: disallowed attribute "${k}"`);
    }
    for (const k of ELEMENTS[tag].filter((k) => !['rx', 'ry'].includes(k))) if (!(k in attrs)) errs.push(`${w}: missing "${k}"`);
    if ('fill' in attrs || 'stroke' in attrs) {
      if (!(attrs.fill === 'currentColor' && attrs.stroke === 'none' && tag === 'circle')) {
        errs.push(`${w}: only dots may set paint: <circle ... fill="currentColor" stroke="none"/>`);
      }
    }
    if (tag === 'path') {
      if (attrs.d != null) pathPoints(attrs.d, w, errs).forEach(([px, py]) => { chk(px, `x ${px}`); chk(py, `y ${py}`); });
    } else if (tag === 'circle') {
      const cx = num(attrs.cx), cy = num(attrs.cy), r = num(attrs.r);
      if ([cx, cy, r].some(Number.isNaN)) errs.push(`${w}: non-numeric value`);
      else { chk(cx - r, 'cx-r'); chk(cx + r, 'cx+r'); chk(cy - r, 'cy-r'); chk(cy + r, 'cy+r'); }
    } else if (tag === 'rect') {
      const x = num(attrs.x), y = num(attrs.y), ww = num(attrs.width), h = num(attrs.height);
      if ([x, y, ww, h].some(Number.isNaN)) errs.push(`${w}: non-numeric value`);
      else { chk(x, 'x'); chk(y, 'y'); chk(x + ww, 'x+width'); chk(y + h, 'y+height'); }
    } else if (tag === 'line') {
      ['x1', 'y1', 'x2', 'y2'].forEach((k) => chk(num(attrs[k]), k));
    }
  });
  return errs;
}

// ---- output helpers
const attrStr = (a) => Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ');
const svgOf = (kids) => `<svg ${attrStr(ROOT_ATTRS)}>${kids.map(({ tag, attrs }) => `<${tag} ${attrStr(attrs)}/>`).join('')}</svg>`;
const pascal = (n) => n.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('');
const camel = (k) => k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---- main
const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.svg')).sort();
const names = files.map((f) => f.slice(0, -4));
const allErrs = [];
const parsed = {};
for (const f of files) {
  const name = f.slice(0, -4);
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) allErrs.push(`${f}: file name must be kebab-case`);
  const p = parse(fs.readFileSync(path.join(SRC, f), 'utf8'), f);
  allErrs.push(...validate(f, p));
  parsed[name] = p;
}
if (!files.length) allErrs.push('no icons found in src/icons');
if (allErrs.length) {
  console.error(`Icon validation FAILED (${allErrs.length} problem${allErrs.length > 1 ? 's' : ''}):\n` + allErrs.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'svg'), { recursive: true });
const svgs = {};
for (const n of names) {
  svgs[n] = svgOf(parsed[n].kids);
  fs.writeFileSync(path.join(DIST, 'svg', n + '.svg'), svgs[n] + '\n');
}

const w = (f, s) => fs.writeFileSync(path.join(DIST, f), s);
w('index.js', `export const icons = {\n${names.map((n) => `  ${JSON.stringify(n)}: ${JSON.stringify(svgs[n])},`).join('\n')}\n};\n\nexport const iconNames = Object.keys(icons);\n`);
w('index.d.ts', `export type IconName =\n${names.map((n) => `  | ${JSON.stringify(n)}`).join('\n')};\n\nexport declare const icons: Record<IconName, string>;\nexport declare const iconNames: IconName[];\n`);

const kidsJs = (kids) => '[' + kids.map(({ tag, attrs }) => `[${JSON.stringify(tag)}, ${JSON.stringify(Object.fromEntries(Object.entries(attrs).map(([k, v]) => [camel(k), v])))}]`).join(', ') + ']';
const rootJs = JSON.stringify(Object.fromEntries(Object.entries(ROOT_ATTRS).map(([k, v]) => [camel(k), v])));
w('react.js', `import { createElement, forwardRef } from 'react';

const root = ${rootJs};

const make = (displayName, shapes) => {
  const Component = forwardRef(function (props, ref) {
    const { size = 20, title, className, ...rest } = props;
    const a11y = title ? { role: 'img' } : { 'aria-hidden': 'true', focusable: 'false' };
    return createElement(
      'svg',
      { ...root, width: size, height: size, className, ref, ...a11y, ...rest },
      title ? createElement('title', null, title) : null,
      ...shapes.map(([tag, attrs]) => createElement(tag, attrs)),
    );
  });
  Component.displayName = displayName;
  return Component;
};

${names.map((n) => `export const Icon${pascal(n)} = make('Icon${pascal(n)}', ${kidsJs(parsed[n].kids)});`).join('\n')}

const byName = {
${names.map((n) => `  ${JSON.stringify(n)}: Icon${pascal(n)},`).join('\n')}
};

export const Icon = forwardRef(function Icon({ name, ...props }, ref) {
  const Component = byName[name];
  return Component ? createElement(Component, { ...props, ref }) : null;
});
Icon.displayName = 'Icon';
`);
w('react.d.ts', `import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
import type { IconName } from './index.js';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'title'> {
  /** Width and height. Default 20. */
  size?: number | string;
  /** When set the icon is exposed as an image with this accessible name; otherwise it is hidden from assistive tech. */
  title?: string;
}
export type IconComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

export declare const Icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement> & { name: IconName }>;
${names.map((n) => `export declare const Icon${pascal(n)}: IconComponent;`).join('\n')}
`);

const cell = (n) => `<figure><span class="row">${svgs[n].replace('<svg ', '<svg width="20" height="20" ')}${svgs[n].replace('<svg ', '<svg width="40" height="40" ')}</span><figcaption>${esc(n)}</figcaption></figure>`;
const cells = names.map(cell).join('');
w('sheet.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>@serein-ui/icons contact sheet</title>
<style>
*{box-sizing:border-box}body{margin:0;font:12px/16px ui-monospace,SFMono-Regular,Menlo,monospace;display:grid;grid-template-columns:1fr 1fr}
@media (max-width:900px){body{grid-template-columns:1fr}}
section{padding:24px}h1{font:500 13px/18px ui-monospace,monospace;margin:0 0 16px}
.light{background:#f3f3f1;color:#0b0c0e}.dark{background:#0b0c0e;color:#f3f4f6}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:1px}
figure{margin:0;padding:14px 8px 10px;display:grid;justify-items:center;gap:10px;outline:1px solid color-mix(in srgb,currentColor 14%,transparent)}
.row{display:flex;align-items:center;gap:14px;height:40px}.row svg{display:block}
figcaption{font-size:11px;opacity:.7;text-align:center;word-break:break-all}
</style></head><body>
<section class="light"><h1>light / ${names.length} icons</h1><div class="grid">${cells}</div></section>
<section class="dark"><h1>dark / ${names.length} icons</h1><div class="grid">${cells}</div></section>
</body></html>
`);

console.log(`Icon build OK: ${names.length} icons -> dist/ (svg, index.js, index.d.ts, react.js, react.d.ts, sheet.html)`);
