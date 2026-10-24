import { useEffect, useRef } from 'react';
import { Animated, Easing, View, type StyleProp, type ViewStyle } from 'react-native';
import { useReducedMotion, useTheme } from './theme';

const HEIGHTS = [6, 10, 14, 10, 6];

/** Loading as graduations filling in turn. Decorative: the caller announces the busy state. */
export function Drizzle({ color, style }: { color: string; style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const phase = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(Animated.timing(phase, { toValue: 1, duration: theme.duration.rain, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [reduced, phase, theme.duration.rain]);

  return <View aria-hidden importantForAccessibility="no-hide-descendants" style={[{ flexDirection: 'row', alignItems: 'flex-end', height: 14, gap: 3 }, style]}>
    {HEIGHTS.map((height, i) => {
      const at = i / HEIGHTS.length;
      // Each tick brightens as the phase passes it; with reduced motion the ticks hold still.
      const opacity = reduced ? 0.6 : phase.interpolate({ inputRange: [0, at, at + 0.2, 1], outputRange: [0.22, 0.22, 1, 0.22], extrapolate: 'clamp' });
      return <Animated.View key={i} style={{ width: 2, height, backgroundColor: color, opacity }} />;
    })}
  </View>;
}
