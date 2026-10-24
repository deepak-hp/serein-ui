import type { TextStyle } from 'react-native';
import { base } from '@serein-ui/tokens';
import type { FontFamilyName } from './fonts';

export type TypeName = keyof typeof base.type;
/** The weights in font.weight: light, regular, medium, semibold. */
export type FontWeight = 300 | 400 | 500 | 600;

const sans: Record<FontWeight, FontFamilyName> = {
  300: 'AnekLatin-Light',
  400: 'AnekLatin-Regular',
  500: 'AnekLatin-Medium',
  600: 'AnekLatin-SemiBold',
};

/** The registered family for a weight. Chivo Mono ships one weight, for measurements only. */
export function fontFamily(family: 'sans' | 'mono', weight: FontWeight = 400): FontFamilyName {
  return family === 'mono' ? 'ChivoMono-Regular' : sans[weight];
}

/**
 * A type token as a React Native text style. The weight is carried by the family, never fontWeight,
 * so Android doesn't synthesise bold. fontStretch (88% for readouts) has no native equivalent.
 */
export function typeStyle(name: TypeName, weight?: FontWeight): TextStyle {
  const t = base.type[name];
  const mono = t.fontFamily[0] === base.font.family.mono[0];
  return {
    fontFamily: fontFamily(mono ? 'mono' : 'sans', weight ?? (t.fontWeight as FontWeight)),
    fontSize: t.fontSize,
    lineHeight: Math.round(t.fontSize * t.lineHeight),
    letterSpacing: t.letterSpacing,
    ...('tabularNums' in t ? { fontVariant: ['tabular-nums'] } : {}),
  };
}
