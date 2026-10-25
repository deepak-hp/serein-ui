import { Text, type StyleProp, type TextStyle } from 'react-native';
import { formatMoney, moneyParts } from '@serein-ui/format';
import { useTheme } from './theme';
import { typeStyle } from './typography';

export type ReadoutProps = {
  value: number;
  currency?: string;
  locale?: string;
  size?: 'xl' | 'l' | 'm';
  fraction?: 'auto' | 'always' | 'never';
  sign?: 'auto' | 'always';
  style?: StyleProp<TextStyle>;
};

/** A key figure as an instrument display. Screen readers hear the full formatted amount, not the styled pieces. */
export function Readout({ value, currency = 'INR', locale = 'en-IN', size = 'xl', fraction = 'auto', sign = 'auto', style }: ReadoutProps) {
  const theme = useTheme();
  const options = { currency, locale, fraction, sign } as const;
  const parts = moneyParts(value, options);
  const muted = { color: theme.color['ink-muted'] };
  return <Text accessible accessibilityRole="text" accessibilityLabel={formatMoney(value, options)} numberOfLines={1} adjustsFontSizeToFit style={[typeStyle(`readout-${size}`), { color: theme.color.ink }, style]}>
    {parts.sign}<Text style={muted}>{parts.currency}</Text>{parts.integer}{parts.fraction ? <Text style={muted}>{parts.decimal}{parts.fraction}</Text> : null}
  </Text>;
}
