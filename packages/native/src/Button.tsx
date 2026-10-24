import { useState, type ReactNode } from 'react';
import { Pressable, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { Drizzle } from './Drizzle';
import { useReducedMotion, useTheme, type Theme } from './theme';
import { typeStyle } from './typography';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger';

export type ButtonProps = Omit<PressableProps, 'children' | 'style' | 'disabled'> & {
  /** primary is the signal fill; at most one per view. */
  variant?: ButtonVariant;
  /** Shows Drizzle in place of the label, announces busy, ignores presses and keeps its width. */
  busy?: boolean;
  /** The web package's name for busy. */
  loading?: boolean;
  /** Keeps the button focusable but unavailable, and shows and announces why. Prefer it to disabled. */
  unavailableReason?: string;
  /** Matches the web prop. Say why nearby, or use unavailableReason instead. */
  disabled?: boolean;
  /** Full width; use for the primary action at the bottom of a phone flow. */
  block?: boolean;
  /** The label: verb plus object, stating the amount when money moves. */
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function palette(theme: Theme, variant: ButtonVariant, unavailable: boolean) {
  const c = theme.color;
  if (unavailable) return { fill: c['surface-sunken'], pressed: c['surface-sunken'], edge: c.line, ink: c['ink-muted'] };
  switch (variant) {
    case 'primary': return { fill: c.signal, pressed: c['signal-pressed'], edge: c['signal-edge'], ink: c['on-signal'] };
    case 'secondary': return { fill: c['surface-raised'], pressed: c['surface-pressed'], edge: c['line-strong'], ink: c.ink };
    case 'quiet': return { fill: 'transparent', pressed: c['surface-pressed'], edge: 'transparent', ink: c.ink };
    case 'danger': return { fill: c.danger, pressed: c.danger, edge: c.danger, ink: c['on-danger'] };
  }
}

export function Button({ variant = 'primary', busy = false, loading = false, unavailableReason, disabled = false, block = false, children, style, onPress, onFocus, onBlur, accessibilityHint, accessibilityState, ...props }: ButtonProps) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const isBusy = busy || loading;
  const unavailable = disabled || !!unavailableReason;
  const p = palette(theme, variant, unavailable);
  const inert = isBusy || unavailable;

  return <View style={[{ alignSelf: block ? 'stretch' : 'flex-start', gap: theme.space['2'] }, style]}>
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled: unavailable, busy: isBusy }}
      accessibilityHint={unavailableReason ?? accessibilityHint}
      // Pressable stays focusable either way, so an unavailable button's reason can still be read.
      // It copies an explicit disabled={false} over accessibilityState, so pass it only when true.
      disabled={disabled || undefined}
      onPress={inert ? undefined : onPress}
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      style={({ pressed }) => {
        const down = pressed && !inert;
        return {
          minHeight: theme.size.control,
          paddingVertical: theme.space['2'],
          paddingHorizontal: theme.space['5'],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme.radius.control,
          borderWidth: theme.size.hairline,
          borderColor: p.edge,
          backgroundColor: down ? p.pressed : p.fill,
          opacity: down && variant === 'danger' ? 0.86 : 1,
          // The press travels 1px down; with reduced motion only the colour changes.
          transform: down && !reduced ? [{ translateY: 1 }] : [],
          ...(focused ? { outlineColor: theme.color.focus, outlineWidth: theme.size['focus-width'], outlineOffset: theme.size['focus-offset'], outlineStyle: 'solid' } : {}),
        };
      }}
    >
      <Text style={[typeStyle('body', 600), { color: p.ink, textAlign: 'center', opacity: isBusy ? 0 : 1 }]}>{children}</Text>
      {isBusy && <Drizzle color={p.ink} style={{ position: 'absolute' }} />}
    </Pressable>
    {/* The hint already announces the reason, so the visible copy is hidden from screen readers. */}
    {unavailableReason && <Text aria-hidden style={[typeStyle('label'), { color: theme.color['ink-muted'] }]}>{unavailableReason}</Text>}
  </View>;
}
