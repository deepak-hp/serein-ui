import { describe, expect, it, beforeEach } from 'vitest';
import { setTheme, getTheme, resolvedTheme, themeScript } from '../src/theme.js';

// Minimal stand-ins for <html> and localStorage, so the helper is tested without a DOM library.
const fakeRoot = () => { const a = new Map(); return { setAttribute: (k, v) => a.set(k, v), getAttribute: (k) => a.get(k) ?? null, removeAttribute: (k) => a.delete(k) }; };
beforeEach(() => {
  const s = new Map();
  globalThis.localStorage = { getItem: (k) => s.get(k) ?? null, setItem: (k, v) => s.set(k, String(v)) };
  globalThis.matchMedia = (q) => ({ matches: q.includes('dark') });
});

describe('theme helper', () => {
  it('forces light and dark, and returns to system', () => {
    const root = fakeRoot();
    setTheme('dark', { root });
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(getTheme()).toBe('dark');
    setTheme('system', { root });
    expect(root.getAttribute('data-theme')).toBeNull();
    expect(getTheme()).toBe('system');
  });

  it('resolves system through prefers-color-scheme', () => {
    const root = fakeRoot();
    expect(resolvedTheme({ root })).toBe('dark');
    setTheme('light', { root, persist: false });
    expect(resolvedTheme({ root })).toBe('light');
  });

  it('rejects unknown modes and ignores bad stored values', () => {
    expect(() => setTheme('sepia', { root: fakeRoot() })).toThrow(RangeError);
    localStorage.setItem('serein-theme', 'sepia');
    expect(getTheme()).toBe('system');
  });

  it('emits a no-flash script that only accepts known themes', () => {
    const s = themeScript();
    expect(s).toContain('"serein-theme"');
    expect(s).toContain('t==="light"||t==="dark"');
  });
});
