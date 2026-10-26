# @serein-ui/css

Framework-neutral base styles for Serein: a reset, typography, focus rings, selection and reduced-motion defaults, plus a small theme helper.

```css
@import '@serein-ui/fonts';
@import '@serein-ui/tokens/css';
@import '@serein-ui/css';          /* or reset.css and base.css separately */
```

`@serein-ui/react` ships its own equivalent, so you only need this package for pages without it.

## Theme helper

```js
import { setTheme, getTheme, resolvedTheme, themeScript } from '@serein-ui/css/theme';

setTheme('dark');            // 'light' | 'dark' | 'system'; persists to localStorage by default
resolvedTheme();             // 'light' or 'dark' after following the system
```

To avoid a flash of the wrong theme, inline `themeScript()` in a `<script>` in `<head>` so the stored choice applies before first paint.

MIT licensed.
