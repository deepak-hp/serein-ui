// Theme switching for Serein. "system" follows prefers-color-scheme; "light" and "dark" force a theme via data-theme.
const MODES = ['light', 'dark', 'system'];
const DEFAULT_KEY = 'serein-theme';

const storage = () => { try { return globalThis.localStorage ?? null; } catch { return null; } };

/** Apply a theme to `root` (default: <html>) and remember it unless `persist` is false. */
export function setTheme(mode, { root = globalThis.document?.documentElement, persist = true, storageKey = DEFAULT_KEY } = {}) {
  if (!MODES.includes(mode)) throw new RangeError(`Unknown theme "${mode}". Use ${MODES.join(', ')}.`);
  if (!root) return mode;
  if (mode === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', mode);
  if (persist) { try { storage()?.setItem(storageKey, mode); } catch { /* storage may be blocked */ } }
  return mode;
}

/** The stored choice ("light" | "dark" | "system"); "system" when nothing is stored. */
export function getTheme({ storageKey = DEFAULT_KEY } = {}) {
  let v = null;
  try { v = storage()?.getItem(storageKey); } catch { /* storage may be blocked */ }
  return MODES.includes(v) ? v : 'system';
}

/** The theme actually showing now, resolving "system" through prefers-color-scheme. */
export function resolvedTheme({ root = globalThis.document?.documentElement } = {}) {
  const forced = root?.getAttribute('data-theme');
  if (forced === 'light' || forced === 'dark') return forced;
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Inline this in <head> before any CSS to apply a stored theme without a flash. */
export function themeScript({ storageKey = DEFAULT_KEY } = {}) {
  return `(function(){try{var t=localStorage.getItem(${JSON.stringify(storageKey)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;
}
