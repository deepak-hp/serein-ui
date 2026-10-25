# @serein-ui/native

Serein for React Native and Expo. Components share their names and props with `@serein-ui/react`; tokens come from `@serein-ui/tokens`, money formatting from `@serein-ui/format` and fonts from `@serein-ui/fonts`. Status: early (Phase 2 parity has started). Built and tested against Expo SDK 58 (React Native 0.88, New Architecture).

## Use

```tsx
import { Button, Readout, SereinProvider, useSereinFonts } from '@serein-ui/native';

export default function App() {
  const [fontsLoaded] = useSereinFonts();
  if (!fontsLoaded) return null;
  return <SereinProvider>{/* theme="system" by default; "light" or "dark" forces one */}
    <Readout value={2400} />
    <Button onPress={send}>Send ₹2,400</Button>
  </SereinProvider>;
}
```

Peer dependencies: `react` (19.3 or later), `react-native` (0.88 or later) and `expo-font`.

## What's here

| Export | Notes |
|---|---|
| `SereinProvider` | `theme`: `'system'` (default, follows the device), `'light'` or `'dark'`. Providers nest, so a region can force a theme. |
| `useTheme()` | Resolved tokens: `color`, `shadow`, `space`, `radius`, `size`, `duration`, `easing`, `type`, `font`. Follows the system when there's no provider. |
| `useReducedMotion()` | Tracks the system setting through `AccessibilityInfo`. Components drop travel and keep colour changes. |
| `useSereinFonts()`, `fontFiles` | Loads Anek Latin (300/400/500/600) and Chivo Mono (400) from `@serein-ui/fonts/native/*.ttf` with expo-font. |
| `typeStyle(name, weight?)`, `fontFamily()` | Type tokens as text styles. The weight is carried by the font family, never by `fontWeight`. |
| `Button`, `TextField`, `Switch`, `Readout` | See parity below. |

## Parity with `@serein-ui/react`

| Component | Same as web | Different on native |
|---|---|---|
| `Button` | `variant` (`primary`, `secondary`, `quiet`), `loading`, `disabled`, label as children | Adds `variant="danger"`, `busy` (`loading` is an alias), `unavailableReason` and `block` from `specs/button.yaml`, which the web package doesn't have yet. `onPress` and Pressable props instead of DOM button props; `style` instead of `className`. |
| `TextField` | `label`, `description`, `error`, `disabled` | TextInput props (`value`, `onChangeText`, …) instead of input props. The error is an `alert` live region and is announced on iOS. |
| `Switch` | `label`, `description`, `checked`, `onCheckedChange`, `disabled`, `name` | `name` is accepted but unused (no forms on native). The whole row is the 48px target. |
| `Readout` | `value`, `currency`, `locale`, `size`, `fraction`, `sign` | `style` instead of `className`. No 88% width (static fonts are 100%); it shrinks to fit one line instead of overflowing. |

## Accessibility

- Roles and states: `button` with `disabled`/`busy`, `switch` with `checked`/`disabled`, `alert` for field errors. A Readout reads as its full formatted amount.
- An unavailable button keeps focus, is announced as disabled and gives its reason as the hint. The reason is also shown under it.
- Every control is at least 48px tall (`size.control`). Keyboard focus draws the 2px `color.focus` outline.
- Reduced motion: no press travel, no Switch thumb travel, and Drizzle holds still.

## Develop

```bash
pnpm --filter @serein-ui/native test
```

`apps/native-playground` shows every component in both themes.
