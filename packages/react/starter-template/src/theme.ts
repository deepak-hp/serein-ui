export type Theme = 'light' | 'dark';
const key = 'ritam-ui.theme';
const legacyKey = 'deepak-ui.theme';

export function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(key) ?? localStorage.getItem(legacyKey);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch { /* Theme switching still works when storage is unavailable. */ }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.dpTheme = theme;
  document.body.classList.add('dp-theme');
}

export function saveTheme(theme: Theme) {
  applyTheme(theme);
  try { localStorage.setItem(key, theme); } catch { /* Keep this session's selection. */ }
}
