# Serein - React component library

React 19, Base UI and precompiled StyleX, styled by Serein's precision-instrument language: fine graduations, exact readouts, one vivid vermilion signal, Anek Latin and Chivo Mono, machined corners and solid materials. Colours, type, spacing and motion come from [`@serein-ui/tokens`](../tokens) and ship inside this package.

The library exports React components and hooks. Start with **Storybook → Start here → Catalogue** for the complete inventory and links to each component, and **Foundations** for colour, type, spacing and icons.

## Try it

For a GitHub beta download, use the archive and checksum from the [Serein prereleases](https://github.com/deepak-hp/serein-ui/releases). Verify the SHA-256 using the [beta instructions](https://github.com/deepak-hp/serein-ui/blob/main/docs/BETA-EVALUATION.md), then install the file in your application:

```sh
npm install /absolute/path/to/serein-ui-react-<version>.tgz
```

Use Node 22 or newer with React and React DOM `^19.3.0`. npm registry publication is deferred.

To start a new app from this checkout, run `pnpm create:app "../my-app"` from `packages/react`. The destination must be empty. This builds and vendors the current package, creates a React/Vite app and installs its dependencies. Use `--no-install` to generate the files and archive first. See [starter instructions](docs/STARTER.md).

Contributors work from the repository root:

```sh
pnpm install
pnpm build
pnpm storybook
```

## Package contract

The package exports React components, a precompiled stylesheet and the Serein fonts. Consuming apps do not need a StyleX compiler.

```tsx
import '@serein-ui/react/fonts.css';   // Anek Latin and Chivo Mono, self-hosted (OFL)
import '@serein-ui/react/styles.css';  // Serein tokens + component styles
import { Button } from '@serein-ui/react';

export function Example() {
  return <Button>Continue</Button>;
}
```

Set `data-theme="light"` or `data-theme="dark"` on the document's `html` element (omit it to follow the system preference), and `class="sr-theme"` on `body`. Theme selection is document-wide so portalled dropdowns and dialogs inherit the same tokens. Scoped or nested themes are not supported. Every value is a `--sr-*` custom property; read them rather than hard-coding colours.

`Button` supports primary, secondary and quiet variants, plus loading and disabled states. `TextField` associates its label, description and error with the input. `Select` uses Base UI keyboard behaviour. `Dialog` supports Escape and returns focus to its trigger.

`useAsyncAction` accepts an asynchronous action with an AbortSignal and exposes idle, pending, success and error states. It guards duplicate requests and stale results. `StatusIcon` is decorative; pair it with visible status text or an appropriate live region. Reduced-motion preferences suppress icon animations.

## Verify

```sh
pnpm --filter @serein-ui/react check
pnpm --filter @serein-ui/react check:consumer
```

The consumer check packs and installs the library into a separate temporary app, then bundles its public exports and CSS without the StyleX compiler.

For the complete local release gate, install Chromium once with `pnpm --filter @serein-ui/react test:browser-install`, then run `pnpm --filter @serein-ui/react check:release`. It starts and stops only the Storybook process it owns. See the [release guide](../../docs/RELEASING.md).

This package targets React web. Native mobile and native desktop adapters, advanced component modules and a full accessibility audit remain future work; the current tests do not establish full WCAG conformance.

## Selection and navigation

All selection controls are controlled: pass their current value and update it from the change callback. Checkbox and Switch accept `label`, optional `description`, `checked`, `onCheckedChange`, `disabled` and `name`. Checkbox also supports `indeterminate`.

```tsx
<Checkbox label="Include summary" checked={summary} onCheckedChange={setSummary} />
<Switch label="Reminders" checked={reminders} onCheckedChange={setReminders} />
<RadioGroup label="Duration" value={duration} onValueChange={setDuration}
  options={[{ value: '25', label: '25 minutes' }, { value: '45', label: '45 minutes' }]} />
<Tabs label="Session information" value={tab} onValueChange={setTab}
  items={[{ value: 'overview', label: 'Overview', content: <p>Your session</p> },
          { value: 'notes', label: 'Notes', content: <TextField label="Notes" /> }]} />
```

Tab arrow keys activate enabled tabs on focus. Disabled tabs can receive arrow-key focus for discoverability but cannot activate. Panels remain mounted while hidden so drafts persist across tab changes.

## Storybook and AI tools

Run `pnpm storybook` (repository root) for the reference at http://127.0.0.1:6006. `pnpm --filter @serein-ui/react build:storybook` generates the static site in `storybook-static`; the same build is published as the documentation site. Use the toolbar to switch themes or explicitly preview animations.

Storybook reads TypeScript source for API extraction while a Vite alias renders the compiled library. The local MCP endpoint is http://127.0.0.1:6006/mcp. See [AI setup and fallback](ai/README.md). Text-only tools can read `ai/llms-full.txt`; `ai/contract.json` is regenerated from declarations and tokens on each build. No private birth data is included.

```sh
pnpm --filter @serein-ui/react ai:check
pnpm --filter @serein-ui/react ai:check-mcp
pnpm --filter @serein-ui/react test:stories
pnpm --filter @serein-ui/react check:docs
pnpm --filter @serein-ui/react check:storybook-ui
```

The MCP, docs and UI checks require Storybook running. Story tests run interactions and axe checks in both themes, with reduced motion both enabled and disabled; accessibility violations fail the tests. Read [accessibility scope and release checks](docs/ACCESSIBILITY.md) before shipping.

Storybook 10.6 is paired with Vitest 4.1 and TypeScript 6.0: its browser addon requires Vitest 4, and its documentation generator needs the JavaScript TypeScript compiler API.

## Navigation surface

`.sr-navigation-surface` with `data-sr-material="subtle" | "expressive" | "solid"` styles one navigation plane (app bar or sidebar). Serein materials are always solid: no translucency or blur. See [navigation guidance](docs/APPLE-DESIGN.md).
