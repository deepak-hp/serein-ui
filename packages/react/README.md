# Serein - React component library

React 19, Base UI and precompiled StyleX. The approved Flame & Ink direction uses Plus Jakarta Sans, crisp corners, solid orange primary actions, and restrained state-driven motion.

The library exports 42 components (including ToastProvider) and 2 hooks. Start with **Storybook → Start here → Catalogue** for the complete inventory, supported behaviours, and direct links to each component. The original playground is a smaller design demonstration; Storybook is the full reference.

## Try it

For a GitHub beta download, use the archive and checksum from the same [Serein prerelease](https://github.com/deepak-hp/serein-ui/releases). Verify the SHA-256 using the [beta instructions](https://github.com/deepak-hp/serein-ui/blob/main/docs/BETA-EVALUATION.md), then install the file in your existing application:

```sh
npm install /absolute/path/to/serein-ui-react-0.1.0-beta.1.tgz
```

Use Node 24 with React and React DOM `^19.3.0`. Import `@serein-ui/react/styles.css` and set the document theme as shown under Package contract below. npm registry publication is deferred; an archive release is a separate distribution path. The source-checkout commands below are for contributors and local development.

To start a new app from this checkout, run `npm run create:app -- "../my-app"` from `trial`. The destination must be empty. This builds and vendors the current checkout package, creates a React/Vite app, and installs its dependencies. Use `--no-install` to generate the files and archive first. See [starter instructions](docs/STARTER.md).

Use Node 24.19 or newer within the Node 24 major and npm:

```sh
npm ci
npm run build
npm run dev
```

The playground includes Button, TextField, Select, Dialog, Checkbox, RadioGroup, Switch and Tabs in light and dark themes, plus simulated email and payment states. No email is sent and no payment is processed. Rebuild the package after editing `src` to update the playground.



## Reference workspace

The [reference app](reference/README.md) combines the installed library into a project-management workflow with search, status/date filters, editing and local persistence. From `trial`:

```sh
npm run reference:setup
npm run reference:dev
```

Open http://127.0.0.1:5174. The setup builds and installs a local tarball; it does not publish anything. It refreshes the tracked reference manifest and lockfile hash, while the generated `reference/vendor` tarball remains untracked. In a fresh clone, run setup before `reference:build`; never assume that archive is committed. Repeat setup after library changes. The sample app has no backend or accounts and keeps its data in this browser.

Open [Composition lab](http://127.0.0.1:5174/?view=composition) to compare two independently generated invoice layouts with identical data and interactions. Read [the pilot method and limits](docs/COMPOSITION-PILOT.md); it does not claim a general improvement in AI design quality. Assistants can use the [composition guide](ai/COMPOSITION.md), also included in the full AI text and Storybook's Start here / Composition page. Run `npm run check:composition` with the reference app running to verify the comparison.

## Package contract

The package exports React components and a precompiled CSS file. Consuming apps do not need a StyleX compiler.

```tsx
import '@fontsource-variable/plus-jakarta-sans';
import '@serein-ui/react/styles.css';
import { Button } from '@serein-ui/react';

export function Example() {
  return <Button>Continue</Button>;
}
```

Set `data-dp-theme="light"` or `data-dp-theme="dark"` on the document's `html` element, and `class="dp-theme"` on `body`. Theme selection is document-wide so portalled dropdowns and dialogs inherit the same tokens. Scoped or nested themes are not supported in this trial. The font import is an explicit host-app choice.

`Button` supports primary, secondary and quiet variants, plus loading and disabled states. `TextField` associates its label, description and error with the input. `Select` uses Base UI keyboard behaviour. `Dialog` supports Escape and returns focus to its trigger.

`useAsyncAction` accepts an asynchronous action with an AbortSignal and exposes idle, pending, success and error states. It guards duplicate requests and stale results. `StatusIcon` is decorative; pair it with visible status text or an appropriate live region. Reduced-motion preferences suppress icon animations.

## Verify

```sh
npm run check
npm run check:consumer
```

The consumer check packs and installs the library into a separate temporary app, then bundles its public exports and CSS without the StyleX compiler. The MIT-licensed beta is prepared but not yet published to npm.

For the complete local release gate, install Chromium once with `npm run test:browser-install`, then run `npm run check:release`. It starts and stops only the Storybook and reference-preview processes that it owns. See the [release guide](../docs/RELEASING.md) for the checked surfaces and owner-only publication steps.

This package currently targets React web. Native mobile and native desktop adapters, advanced component modules and a full accessibility audit remain future work; the current tests do not establish full WCAG conformance.

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

Tab arrow keys activate enabled tabs on focus. Disabled tabs can receive arrow-key focus for discoverability but cannot activate. Panels remain mounted while hidden so drafts persist across tab changes. State is not persisted across page refreshes.

The Motion section has an explicit “Preview animations” checkbox for testing animations when the operating system requests reduced motion. This override is confined to the playground's motion section; library defaults still respect the system preference.

## Storybook and AI tools

Run `npm run storybook` for the component reference at http://127.0.0.1:6006. `npm run build:storybook` generates a static site in `storybook-static` without publishing it. Use the toolbar to switch themes or explicitly preview animations.

Storybook reads TypeScript source for API extraction while a Vite alias renders the compiled library. The official local MCP endpoint is http://127.0.0.1:6006/mcp. Connect it through an MCP-capable client's project settings. See [AI setup and fallback](ai/README.md). Text-only tools can read `ai/llms-full.txt`; `ai/contract.json` is regenerated from declarations and tokens on each build. No private birth data is included.

```sh
npm run ai:check
npm run ai:check-mcp
npm run test:browser-install
npm run test:stories
npm run check:docs
npm run check:storybook-ui
npm run check:layout
```

The MCP and docs checks require Storybook running. Browser installation is needed once per Playwright browser version; binaries stay in `.playwright` or your explicit `PLAYWRIGHT_BROWSERS_PATH`. Story tests run interactions and axe checks in both themes, with reduced motion both enabled and disabled. Accessibility violations fail the tests. The docs check verifies live MDX dependencies as well as downloadable AI files. Read [accessibility scope and release checks](docs/ACCESSIBILITY.md) before shipping.

Generated Storybook Markdown lives under `docs/` to avoid colliding with the `/ai` static download route. `npm run ai:check` verifies those mirrors match the distributed AI documentation.

The live UI check requires Storybook running and Playwright installed. It checks that Agent API renders, idle and pending are visually distinct, and the animation preview can opt in and restore reduced motion. It also checks the served send-icon paths against the compiled library to catch stale previews. Storybook uses `storybook-static` as its output folder so Vite continues watching library rebuilds in `dist`.

Storybook 10.6 is paired with Vitest 4.1 and TypeScript 6.0: its browser addon requires Vitest 4, and its documentation generator needs the JavaScript TypeScript compiler API. The existing tests are rerun on this compatible toolchain.

## Apple design guidance

The approved Flame & Ink identity now supports optional Subtle and Expressive navigation finishes, plus Solid. Compare them in the reference app's **Appearance → Navigation finish** or Storybook's **Foundations / Navigation material**. Read [the design rules and Apple source mapping](docs/APPLE-DESIGN.md) before using these materials. The compiled stylesheet and AI guide include the integration; there is no new dependency or React component API.
