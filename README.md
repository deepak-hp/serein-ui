# Serein

A precise, calm, accessible design system for web, mobile and desktop, built so coding assistants can create thoughtful interfaces too. MIT-licensed.

Serein is designed like an instrument: **fine graduations, exact readouts, and one vivid vermilion signal**, set in Anek Latin with Chivo Mono for measurements. [DESIGN.md](DESIGN.md) records the language; the token files in [`tokens/`](tokens) are its source of truth.

Explore the documentation and components in [Storybook](https://deepak-hp.github.io/serein-ui/). Human accessibility review remains open.

## Packages

| Package | What it is |
| --- | --- |
| [`@serein-ui/react`](packages/react) | 49 React components on Base UI with precompiled StyleX, Storybook, AI contract and recipes. Ships the tokens and fonts inside. |
| [`@serein-ui/tokens`](packages/tokens) | DTCG 2025.10 tokens as CSS variables, JS/TS, JSON, a Tailwind v4 theme (default palette removed), Swift and Kotlin. Contrast is tested in both themes. |
| [`@serein-ui/fonts`](packages/fonts) | Self-hosted Anek Latin and Chivo Mono (OFL). |
| [`@serein-ui/css`](packages/css) | Framework-neutral reset, base styles and a theme-switching helper. |
| [`@serein-ui/icons`](packages/icons) | 46 authored icons on a 20px grid: SVG, strings and React. |
| [`@serein-ui/format`](packages/format) | Indian-first money and number formatting (₹1,00,000, true minus sign). |

All six packages are on npm. `@serein-ui/react` bundles what it needs from the others, so most apps install only that.

## Use it

```sh
npm install @serein-ui/react
```

```tsx
import '@serein-ui/react/fonts.css';
import '@serein-ui/react/styles.css';
import { Button, Readout } from '@serein-ui/react';
```

Set `data-theme="light"` or `"dark"` on `<html>` (omit it to follow the system) and `class="sr-theme"` on `<body>`. See the [library setup](packages/react/README.md).

## Develop

Requires Node 22+ and pnpm 10.

```sh
pnpm install
pnpm build       # every package
pnpm test        # unit, contrast, Tailwind and spec checks
pnpm storybook   # http://127.0.0.1:6006
```

Dependencies only install versions at least 14 days old (`minimumReleaseAge`), and install scripts are blocked unless reviewed.

## Start here

- [Cross-platform plan and roadmap](docs/PLAN.md)
- [End goal and master checklist](docs/RELEASE-CHECKLIST.md)
- [AI integration](packages/react/ai/README.md) and [composition recipes](packages/react/ai/COMPOSITION.md)
- [Accessibility scope](packages/react/docs/ACCESSIBILITY.md)
- [Release and verification guide](docs/RELEASING.md)
- [Supported environments](docs/SUPPORT.md)
- [Contributing and maintenance](CONTRIBUTING.md)

The current components target React web; native adapters are on the roadmap (React Native first). Automated accessibility tests are not a conformance certification.

The source is available under the [MIT License](LICENSE). [Licensing details](docs/LICENSING.md) explain the separate terms for dependencies and the bundled fonts.
