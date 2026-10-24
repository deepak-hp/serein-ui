import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { compile } from '@tailwindcss/node';
import { base, themes, cssVar } from '../dist/js/index.js';

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(PKG, 'dist', p), 'utf8');
const css = read('css/tokens.css');

// WCAG 2 relative luminance contrast
const lum = (hex) => {
  const c = hex.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

// Every pair Serein relies on, with its WCAG 2.2 AA threshold.
const PAIRS = [
  ['ink', 'surface', 4.5], ['ink', 'surface-raised', 4.5], ['ink', 'surface-sunken', 4.5], ['ink', 'surface-overlay', 4.5],
  ['ink-muted', 'surface', 4.5], ['ink-muted', 'surface-raised', 4.5], ['ink-muted', 'surface-sunken', 4.5],
  ['signal-ink', 'surface', 4.5], ['signal-ink', 'surface-raised', 4.5],
  ['on-signal', 'signal', 4.5], ['on-signal', 'signal-hover', 4.5], ['on-danger', 'danger', 4.5],
  ['line-strong', 'surface', 3], ['line-strong', 'surface-raised', 3],
  ['focus', 'surface', 3], ['focus', 'surface-raised', 3],
  ['success', 'surface-raised', 4.5], ['warning', 'surface-raised', 4.5], ['danger', 'surface-raised', 4.5], ['danger', 'surface', 4.5],
  ['success', 'success-soft', 4.5], ['warning', 'warning-soft', 4.5], ['danger', 'danger-soft', 4.5],
  ['ink', 'success-soft', 4.5], ['ink', 'warning-soft', 4.5], ['ink', 'danger-soft', 4.5], ['ink', 'signal-soft', 4.5],
  ['ink', 'surface-hover', 4.5], ['ink', 'surface-pressed', 4.5], ['ink-muted', 'surface-hover', 4.5],
  ['on-signal', 'signal-pressed', 4.5], ['signal-edge', 'surface', 3], ['signal-edge', 'surface-raised', 3],
];

describe('themes', () => {
  it('light and dark define the same tokens', () => {
    expect(Object.keys(themes.dark.color)).toEqual(Object.keys(themes.light.color));
    expect(Object.keys(themes.dark.shadow)).toEqual(Object.keys(themes.light.shadow));
  });

  for (const theme of ['light', 'dark']) {
    for (const [fg, bg, min] of PAIRS) {
      it(`${theme}: ${fg} on ${bg} ≥ ${min}:1`, () => {
        const c = themes[theme].color;
        expect(contrast(c[fg], c[bg])).toBeGreaterThanOrEqual(min);
      });
    }
  }
});

describe('css', () => {
  it('declares every themed variable in the light, system-dark and forced-dark blocks', () => {
    const blocks = [css.indexOf('[data-theme="light"]'), css.indexOf('@media (prefers-color-scheme: dark)'), css.indexOf('[data-theme="dark"] {')];
    expect(blocks.every((i) => i > 0)).toBe(true);
    for (const name of Object.keys(themes.light.color)) {
      const re = new RegExp(`--sr-color-${name}:`, 'g');
      expect(css.match(re)?.length, name).toBe(3);
    }
  });

  it('has base variables and no unresolved references', () => {
    expect(css).toContain('--sr-space-4: 16px;');
    expect(css).toContain('--sr-easing-settle: cubic-bezier(0.16, 1, 0.3, 1);');
    expect(css).not.toMatch(/\{[a-z.]+\}/);
  });

  it('type.css uses the mono family only for measurement styles', () => {
    const type = read('css/type.css');
    expect(type).toMatch(/\.sr-type-measure \{\s+font-family: var\(--sr-font-family-mono\)/);
    expect(type).toMatch(/\.sr-type-title \{\s+font-family: var\(--sr-font-family-sans\)/);
    expect(type).toMatch(/\.sr-type-readout-xl \{[^}]*font-variant-numeric: tabular-nums/);
  });
});

describe('js', () => {
  it('exposes raw values', () => {
    expect(base.space['4']).toBe(16);
    expect(base.duration.slow).toBe(320);
    expect(base.easing.settle).toEqual([0.16, 1, 0.3, 1]);
    expect(themes.dark.color.signal).toBe('#ff6a2c');
    expect(base.type['readout-xl']).toMatchObject({ fontSize: 88, fontWeight: 300, fontStretch: '88%' });
    expect(cssVar('color.signal')).toBe('var(--sr-color-signal)');
  });
});

describe('tailwind v4', () => {
  it('maps utilities to Serein variables and removes the default palette', async () => {
    const compiler = await compile('@import "tailwindcss";\n@import "./dist/tailwind/theme.css";', { base: PKG, onDependency() {} });
    const out = compiler.build(['bg-surface', 'text-ink', 'bg-signal', 'p-4', 'gap-6', 'rounded-control', 'font-mono', 'text-title', 'shadow-raised', 'ease-settle', 'bg-blue-500', 'font-serif']);
    expect(out).toContain('var(--sr-color-surface)');
    expect(out).toContain('var(--sr-color-signal)');
    expect(out).toContain('var(--sr-radius-control)');
    expect(out).toContain('var(--sr-font-family-mono)');
    expect(out).toMatch(/\.p-4\s*\{\s*padding: calc\(4px \* 4\)/); // 16px = space-4
    expect(out).toMatch(/\.text-title\s*\{\s*font-size: 28px;/);
    expect(out).not.toContain('.bg-blue-500');
    expect(out).not.toContain('.font-serif');
  });
});

describe('native', () => {
  it('Swift and Kotlin list every colour in both themes', () => {
    const swift = read('swift/SereinTokens.swift');
    const kotlin = read('kotlin/SereinTokens.kt');
    expect(swift).toContain('static let light = SereinPalette(');
    expect(swift).toContain('static let dark = SereinPalette(');
    expect(kotlin).toContain('val DarkSereinColors = SereinColors(');
    for (const name of Object.keys(themes.light.color)) {
      const camel = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      expect(swift.match(new RegExp(`\\b${camel}:`, 'g'))?.length, `swift ${name}`).toBe(3);
      expect(kotlin.match(new RegExp(`\\b${camel}\\b`, 'g'))?.length, `kotlin ${name}`).toBe(3);
    }
  });
});
