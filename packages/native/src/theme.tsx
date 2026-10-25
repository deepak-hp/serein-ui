import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, useColorScheme } from 'react-native';
import { base, themes, type SereinTheme, type ThemeName } from '@serein-ui/tokens';

export type ThemePreference = 'system' | ThemeName;
/** Resolved tokens for one theme: the base scales plus that theme's colours and shadows. */
export type Theme = typeof base & SereinTheme & { name: ThemeName };

const resolved: Record<ThemeName, Theme> = {
  light: { ...base, ...themes.light, name: 'light' },
  dark: { ...base, ...themes.dark, name: 'dark' },
};

const ThemeContext = createContext<ThemeName | null>(null);

export type SereinProviderProps = {
  /** 'system' (default) follows the device setting, like the web package without data-theme. */
  theme?: ThemePreference;
  children: ReactNode;
};

export function SereinProvider({ theme = 'system', children }: SereinProviderProps) {
  const scheme = useColorScheme();
  const name = theme === 'system' ? (scheme === 'dark' ? 'dark' : 'light') : theme;
  return <ThemeContext.Provider value={name}>{children}</ThemeContext.Provider>;
}

/** The nearest SereinProvider's theme, or the system theme when there is none. */
export function useTheme(): Theme {
  const name = useContext(ThemeContext);
  const scheme = useColorScheme();
  return resolved[name ?? (scheme === 'dark' ? 'dark' : 'light')];
}

/** True when the person has asked the system to reduce motion. Travel is removed; colour changes stay. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => { if (live) setReduced(value); });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => { live = false; subscription.remove(); };
  }, []);
  return reduced;
}
