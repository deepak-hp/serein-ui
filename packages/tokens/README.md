# @serein-ui/tokens

Serein's design tokens, generated from the [DTCG 2025.10](https://www.designtokens.org/) source in [`tokens/`](https://github.com/deepak-hp/serein-ui/tree/main/tokens). Colour pairs are contrast-tested in light and dark.

`@serein-ui/react` already includes these. Install this package when you build your own components or use Tailwind.

## CSS variables

```css
@import '@serein-ui/tokens/css';      /* --sr-* variables for both themes */
@import '@serein-ui/tokens/type.css'; /* optional sr-type-* text classes */
```

Set `data-theme="light"` or `"dark"` on `<html>`, or omit it to follow the system.

```css
.panel { background: var(--sr-color-surface-raised); border-radius: var(--sr-radius-panel); }
```

## Tailwind v4

```css
@import 'tailwindcss';
@import '@serein-ui/tokens/tailwind.css';
```

This replaces Tailwind's default palette with Serein's, so `bg-surface-raised`, `text-ink-muted` and `rounded-control` work, and off-system colours do not. Import `tailwind-theme.css` instead if you load the variables yourself.

## JavaScript, JSON and native

```js
import { themes, base, cssVar } from '@serein-ui/tokens';

themes.dark.color.signal;   // resolved value
cssVar('color.signal');     // 'var(--sr-color-signal)'
```

`@serein-ui/tokens/json` is the full resolved set. `@serein-ui/tokens/swift` and `@serein-ui/tokens/kotlin` are generated source files for native apps.

MIT licensed.
