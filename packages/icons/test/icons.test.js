import { beforeAll, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src', 'icons');
const DIST = path.join(ROOT, 'dist');
const sourceNames = fs.readdirSync(SRC).filter((f) => f.endsWith('.svg')).map((f) => f.slice(0, -4)).sort();
const pascal = (n) => n.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('');

let index, react;
beforeAll(async () => {
  execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'build.mjs')], { stdio: 'pipe' });
  index = await import(path.join(DIST, 'index.js') + `?t=${Date.now()}`);
  react = await import(path.join(DIST, 'react.js') + `?t=${Date.now()}`);
});

describe('build output', () => {
  it('has every source icon in index, dist/svg and react', () => {
    expect(sourceNames.length).toBeGreaterThan(0);
    expect([...index.iconNames].sort()).toEqual(sourceNames);
    for (const n of sourceNames) {
      expect(fs.existsSync(path.join(DIST, 'svg', `${n}.svg`)), n).toBe(true);
      expect(index.icons[n], n).toContain('<svg');
      expect(react[`Icon${pascal(n)}`], n).toBeTruthy();
    }
  });

  it('every dist SVG passes the style rules', () => {
    const allowed = new Set(['path', 'circle', 'rect', 'line']);
    for (const n of sourceNames) {
      const svg = fs.readFileSync(path.join(DIST, 'svg', `${n}.svg`), 'utf8').trim();
      expect(svg, n).toBe(index.icons[n]);
      expect(svg, n).toMatch(/viewBox="0 0 20 20"/);
      for (const a of ['fill="none"', 'stroke="currentColor"', 'stroke-width="1.5"', 'stroke-linecap="square"', 'stroke-linejoin="miter"']) {
        expect(svg, `${n} ${a}`).toContain(a);
      }
      for (const forbidden of ['transform=', 'style=', ' id=', 'class=']) expect(svg, `${n} ${forbidden}`).not.toContain(forbidden);
      const tags = [...svg.matchAll(/<([a-z]+)\b/g)].map((m) => m[1]).filter((t) => t !== 'svg');
      expect(tags.length, n).toBeGreaterThan(0);
      for (const t of tags) expect(allowed.has(t), `${n} <${t}>`).toBe(true);
      // only dots may carry paint
      const inner = svg.replace(/^<svg[^>]*>/, '');
      for (const el of inner.match(/<[a-z]+[^>]*\/>/g)) {
        if (/\bfill=|\bstroke=/.test(el)) expect(el, n).toMatch(/^<circle [^>]*fill="currentColor" stroke="none"\/>$/);
      }
      // numeric coordinates stay within the 20x20 box
      for (const num of inner.matchAll(/(?:\bd|cx|cy|x|y|x1|y1|x2|y2)="([^"]*)"/g)) {
        for (const v of num[1].match(/-?\d*\.?\d+/g) ?? []) expect(Math.abs(parseFloat(v)), n).toBeLessThanOrEqual(20);
      }
    }
  });
});

describe('react components', () => {
  const Arrow = () => react.IconArrowUpRight;

  it('is aria-hidden without a title', () => {
    const html = renderToStaticMarkup(createElement(Arrow()));
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
    expect(html).not.toContain('role=');
    expect(html).not.toContain('<title>');
  });

  it('is an image with a title when given one', () => {
    const html = renderToStaticMarkup(createElement(Arrow(), { title: 'Send' }));
    expect(html).toContain('role="img"');
    expect(html).toContain('<title>Send</title>');
    expect(html).not.toContain('aria-hidden');
  });

  it('size sets width and height (default 20)', () => {
    expect(renderToStaticMarkup(createElement(Arrow()))).toMatch(/width="20" height="20"/);
    expect(renderToStaticMarkup(createElement(Arrow(), { size: 32 }))).toMatch(/width="32" height="32"/);
  });

  it('passes className and rest props through; generic Icon resolves by name', () => {
    const html = renderToStaticMarkup(createElement(react.Icon, { name: 'check', className: 'x', 'data-k': 'v' }));
    expect(html).toContain('class="x"');
    expect(html).toContain('data-k="v"');
    expect(html).toContain('<path');
  });
});
