import { useEffect, useId, useState } from 'react';
import { AccessibilityInfo, Platform, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { useTheme } from './theme';
import { typeStyle } from './typography';

export type TextFieldProps = Omit<TextInputProps, 'style' | 'editable'> & {
  /** Always visible above the field; never replaced by a placeholder. */
  label: string;
  description?: string;
  /** Shown below the field in danger colour and announced when it appears. */
  error?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function TextField({ label, description, error, disabled = false, style, onFocus, onBlur, accessibilityHint, ...props }: TextFieldProps) {
  const theme = useTheme();
  const c = theme.color;
  const labelId = useId();
  const [focused, setFocused] = useState(false);

  // Android announces the error through its live region; iOS needs an explicit announcement.
  useEffect(() => {
    if (error && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(error);
  }, [error]);

  const help = typeStyle('label', 400);
  return <View style={[{ gap: theme.space['2'] }, style]}>
    <Text nativeID={labelId} style={[typeStyle('label', 600), { color: c.ink }]}>{label}</Text>
    <TextInput
      {...props}
      accessibilityLabel={label}
      accessibilityLabelledBy={labelId}
      accessibilityHint={[error, description, accessibilityHint].filter(Boolean).join('. ') || undefined}
      accessibilityState={{ disabled }}
      editable={!disabled}
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      placeholderTextColor={c['ink-muted']}
      selectionColor={c.signal}
      cursorColor={c.ink}
      style={[typeStyle('body'), {
        minHeight: theme.size.control,
        paddingVertical: theme.space['2'],
        paddingHorizontal: theme.space['3'],
        color: disabled ? c['ink-muted'] : c.ink,
        backgroundColor: disabled ? c['surface-sunken'] : c['surface-raised'],
        borderWidth: theme.size.hairline,
        borderColor: error ? c.danger : c['line-strong'],
        borderRadius: theme.radius.control,
        ...(focused ? { outlineColor: c.focus, outlineWidth: theme.size['focus-width'], outlineOffset: theme.size['focus-offset'], outlineStyle: 'solid' } : {}),
      }]}
    />
    {description && <Text aria-hidden style={[help, { color: c['ink-muted'] }]}>{description}</Text>}
    {error && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={[help, { color: c.danger }]}>{error}</Text>}
  </View>;
}
