export type ThemeMode = 'light' | 'dark' | 'system';
export interface ThemeOptions { root?: HTMLElement; persist?: boolean; storageKey?: string }
export declare function setTheme(mode: ThemeMode, options?: ThemeOptions): ThemeMode;
export declare function getTheme(options?: { storageKey?: string }): ThemeMode;
export declare function resolvedTheme(options?: { root?: HTMLElement }): 'light' | 'dark';
export declare function themeScript(options?: { storageKey?: string }): string;
