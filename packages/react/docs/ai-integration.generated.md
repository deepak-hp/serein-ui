# Serein — AI integration

Status: Serein is an MIT-licensed React web library. GitHub prerelease `@serein-ui/react` version `0.1.0-beta.1` is available; npm publication is deferred. Use this exact package name and do not claim native mobile support.

## Quick start for any coding assistant

Serein's visual language is clear surfaces, warm orange actions, soft neutral elevation, and purposeful state motion. Use the shared surface, field, radius, and shadow tokens instead of inventing per-screen palettes or geometry. Preserve orange buttons with dark text in both themes; green is for actual success. The name's evening-rain meaning is a material metaphor, not a request for weather, stars, gradients, or decorative animation. `docs/FOUNDATIONS.md` defines the exact roles; the checkout's root `DESIGN.md` also records the visual system.

Resting cards are flat; menus and dialogs carry elevation. Secondary actions use neutral rest/hover/active fills. Badges pair success, warning, or error text with the corresponding semantic surface token. Keep contrast-qualified field boundaries and visible keyboard focus; decorative edges can stay quiet.

Read `llms-full.txt` and `contract.json` in this directory. These are generated from the installed package's TypeScript declarations and CSS tokens on every build. Read `examples/README.md` when a local workflow recipe fits the task; those reviewed files are client-side demonstrations, not package exports or backend integrations. Read stories for usage, `docs/FOUNDATIONS.md` for the implemented visual system, and `docs/ACCESSIBILITY.md` for obligations and known limits. Never invent props or components.

For the released candidate, download `serein-ui-react-0.1.0-beta.1.tgz`, `SHA256SUMS` and unsigned `SOURCE.json` from the [GitHub prerelease](https://github.com/deepak-hp/serein-ui/releases/tag/v0.1.0-beta.1), verify the checksum, and follow [the evaluation installation instructions](https://github.com/deepak-hp/serein-ui/blob/main/docs/BETA-EVALUATION.md). For a local checkout, run `npm ci`, `npm run build`, then `npm run storybook` from `trial`; `npm pack` remains an optional local-package path. Import `@serein-ui/react/styles.css` once. Import `@fontsource-variable/plus-jakarta-sans` if using the brand font dependency. The consumer does not need a StyleX compiler.

Set `data-theme="light"` or `"dark"` on `<html>` and class `sr-theme` on `<body>`. The theme is document-wide, including portals. Do not apply the theme solely to a nested wrapper. Only use supported, documented props.

## Live AI tools through MCP

Start Storybook, then add an HTTP MCP server to your AI client's project settings:

- Name: `serein`
- Transport: Streamable HTTP
- URL: `http://127.0.0.1:6006/mcp`

Use the client's documented MCP server setup; configuration file formats differ. The server must run on the same machine as the client. A cloud-only assistant cannot reach your laptop's localhost. This repository does not edit global AI-client settings or expose the server publicly.

Discover the available tools first; use documentation listing/detail tools to inspect components, then run supported story tests. The official Storybook MCP addon and manifests are preview features. They are not a promise that every AI product can connect. Any tool that can read text files can use the generated offline contract instead.

Storybook provides `/manifests/components.json` and `/manifests/docs.json`; this library also serves `/ai/llms.txt`, `/ai/llms-full.txt` and `/ai/contract.json`. Static Storybook builds include the text/JSON material; the MCP endpoint requires the running dev server.

## Design and accessibility rules

Before composing a screen, read `ai/COMPOSITION.md` (also included in `llms-full.txt`). Identify the user's task, choose an appropriate layout recipe, and inspect the rendered result. Component reuse alone does not establish good hierarchy or task fit. The recipes describe composition, not additional exports. For repeatable comparison of assistant outputs, use `docs/AI-EVALUATION.md`; it requires human review and does not yield a universal quality score.

- Reuse exported components before writing custom controls. Keep Plus Jakarta Sans, token colours and the established geometry.
- Use dark text on the orange primary fill. White text on that orange is not an approved text pairing.
- Every control needs a meaningful visible label. Keep descriptions and errors associated with inputs. Error meaning must also be conveyed with text.
- `Select`, `Checkbox`, `Switch`, `RadioGroup` and `Tabs` are controlled: store their value and handle changes. Do not pass undocumented native props to wrapper APIs that do not support them.
- For Checkbox row selection beside an already visible record name, use `hideLabel` with a specific required `label` and a 48px selection column. Do not constrain a visible-label Checkbox to a tiny cell or hide text through selectors targeting its internal DOM.
- `Dialog`, `AlertDialog`, `Drawer`, `Popover` and `DropdownMenu` support `open`, `defaultOpen` and `onOpenChange`. A controlled parent owns closing. Confirmation requests closing immediately; it does not await an asynchronous operation. Keep async confirmation controlled and close only after success. Read `docs/API-CONTRACTS.md` for value, overlay and package contracts.
- `StatusIcon` is decorative. Pair it with text; use a polite live region for asynchronous status. `useAsyncAction` must receive the real operation and its AbortSignal. Report success only when that operation resolves.
- Respect reduced motion by default. The explicit Storybook motion preview is a demo override, not a production preference.
- Test keyboard navigation, focus return, errors, loading, disabled states, light/dark and narrow layouts. Automated axe checks do not prove full WCAG conformance or EAA compliance.

## Navigation materials and Apple guidance

Preserve Flame & Ink's approved palette, Plus Jakarta Sans, crisp controls and filled orange primary actions. Apple guidance refines navigation hierarchy, legibility and interaction within that identity; it is not a replacement theme. Read `docs/APPLE-DESIGN.md` for the source-to-design mapping.

The compiled stylesheet provides `.sr-navigation-surface` with `data-sr-material="subtle"`, `"expressive"` or `"solid"` on a navigation container. It is a CSS utility, not an exported React component or a universal control prop. Omission uses subtle. Use one navigation plane; keep content/forms/tables and nested controls opaque/plain. The app owns positioning, padding and preference UI. Both glass finishes become opaque under supported reduced-transparency, increased-contrast or forced-colour preferences; offer an explicit Solid choice for browsers without preference support. No backdrop-filter support also means opaque fallback. Keep primary orange and dark labels unchanged. These web effects do not reproduce native Liquid Glass APIs or adaptive refraction.

## Component families and ownership

The generated contract includes every runtime component and hook, grouped by family. Storybook's Start here / Catalogue links every implementation to its examples. Use `useToast` under one `ToastProvider`; `add` creates a message, `update` accepts a partial patch, and `dismiss` closes one or all. Use `timeout: 0` when a message must remain available until acknowledgement. Keep important errors inline as well.

Use `DataTable` for semantic client-side rows and sorting; supply stable row keys, then compose `Pagination` externally if required. It is not a virtualized or editable data grid. `DateField` uses the native browser date picker. `FileUpload` selects local files; the application owns validation and upload requests. Do not describe native input affordances as a custom calendar or a completed upload.

Use `MultiSelect` for controlled string-array choices with search, selected chips and labeled removal. Supply stable option values and a `name` for repeated native form entries. Use `CommandPalette` for local actions: each item has a stable `id`, label, optional description/keywords/disabled state, and `onSelect`. It supports controlled opening but does not install a global shortcut or await asynchronous actions. The application owns those policies. Storybook's Patterns / Workspace settings demonstrates both with tabs, draft reset and local save feedback; it is an in-memory example, not a backend integration.

## Dates and selection

`Calendar`, `DatePicker` and `DateRangePicker` use controlled date-only ISO strings in a Gregorian calendar with English labels. Use `value: string | null` for single dates and `{ from: string | null, to: string | null }` for ranges. Store partial ranges after the first click; the second click completes the range. `min`/`max` are inclusive, and `disabledDates` blocks unavailable dates and ranges crossing them. Pickers support descriptions, errors and controlled opening. `name` submits a single date; range forms use `startName` and `endName`. Disabled pickers omit form entries. Use `today` and `defaultMonth` for deterministic previews. Date values remain the same across time zones. Time selection and locale configuration are not supported by these wrappers.

`Select` supports a null placeholder value, descriptions/errors and disabled options. `DropdownMenu` is for actions. Do not use an action menu as a form field.

## Example prompt

“Read the Serein contract and accessibility guidance. Build a settings form using the documented components, preserve the theme and keyboard behaviour, add stories for errors and disabled states, and run the relevant checks. If a requested capability is missing, identify it instead of inventing a prop.”

## Verification

`npm run ai:check` verifies generated docs against current declaration and token files. `npm run test:stories` runs browser interaction/accessibility checks in light and dark, with reduced motion on and off. `npm run check:consumer` installs a packed copy into a separate app. Rebuild after changing component source.

`npm run check:production` adds package/client-boundary, SSR/hydration and strict packed-consumer type checks to the normal tests and builds. The compiled entry preserves `"use client"`; individual server frameworks still need integration testing. These checks do not establish native platform support or accessibility certification.

References: [Storybook MCP](https://storybook.js.org/docs/ai/mcp/overview), [Storybook manifests](https://storybook.js.org/docs/ai/manifests), [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
