import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useReducedMotion, useTheme } from './theme';
import { typeStyle } from './typography';

export type SwitchProps = {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Accepted for parity with the web package's form field name; native has no form submission. */
  name?: string;
  style?: StyleProp<ViewStyle>;
};

const TRAVEL = 18;

/** An on/off setting. The whole row, label included, is one 48px target. */
export function Switch({ label, description, checked, onCheckedChange, disabled = false, style }: SwitchProps) {
  const theme = useTheme();
  const c = theme.color;
  const reduced = useReducedMotion();
  const x = useRef(new Animated.Value(checked ? TRAVEL : 0)).current;

  useEffect(() => {
    const to = checked ? TRAVEL : 0;
    if (reduced) { x.setValue(to); return; }
    const [x1, y1, x2, y2] = theme.easing.settle;
    Animated.timing(x, { toValue: to, duration: theme.duration.fast, easing: Easing.bezier(x1, y1, x2, y2), useNativeDriver: true }).start();
  }, [checked, reduced, x, theme]);

  return <View style={[{ opacity: disabled ? 0.5 : 1 }, style]}>
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onCheckedChange(!checked)}
      style={{ minHeight: theme.size.control, flexDirection: 'row', alignItems: 'center', gap: theme.space['3'] }}
    >
      <View style={{
        width: 42, height: 24, padding: 2, justifyContent: 'center',
        borderRadius: 999, borderWidth: theme.size.hairline,
        borderColor: checked ? c['signal-edge'] : c['line-strong'],
        backgroundColor: checked ? c.signal : c['surface-raised'],
      }}>
        <Animated.View style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: checked ? c['on-signal'] : c['ink-muted'], transform: [{ translateX: x }] }} />
      </View>
      <Text style={[typeStyle('label', 600), { color: disabled ? c['ink-muted'] : c.ink, flexShrink: 1 }]}>{label}</Text>
    </Pressable>
    {description && <Text aria-hidden style={[typeStyle('label', 400), { color: c['ink-muted'], marginLeft: 54 }]}>{description}</Text>}
  </View>;
}
