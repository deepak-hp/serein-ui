# @serein-ui/icons

Serein's icon set: 20px grid, 1.5px stroke, square caps, mitred joins. Every icon uses `currentColor`.

```sh
pnpm add @serein-ui/icons
```

## Use

SVG string:

```js
import { icons, iconNames } from '@serein-ui/icons';
el.innerHTML = icons['arrow-up-right'];
```

React (optional peer dependency, no JSX required):

```js
import { IconArrowUpRight, Icon } from '@serein-ui/icons/react';

<IconArrowUpRight />                    // decorative: aria-hidden, focusable="false"
<IconArrowUpRight title="Send" />       // meaningful: role="img" + <title>
<Icon name="check" size={24} className="ok" />
```

Props: `size` (default 20), `title`, `className`, any other SVG prop; refs are forwarded.

Raw file:

```js
import url from '@serein-ui/icons/svg/check.svg';
```

## Style rules

- `viewBox="0 0 20 20"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, `stroke-linecap="square"`, `stroke-linejoin="miter"`.
- Artwork inside the 2-18 live area (the build rejects coordinates outside 0-20).
- Only `<path>`, `<circle>`, `<rect>`, `<line>`. Dots are `<circle ... fill="currentColor" stroke="none"/>`.
- No other fills, transforms, ids or style attributes.

## Add an icon

1. Create `src/icons/<kebab-name>.svg` using the root element of any existing icon.
2. Run `pnpm build`. Violations fail with a message naming the file and the rule.
3. Open `dist/sheet.html` and check it at 20px and 40px in both themes.
4. `pnpm test`.
