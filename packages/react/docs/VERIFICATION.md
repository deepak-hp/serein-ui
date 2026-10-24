# Verification record - 20 September 2026

Scope: the local React library, compiled package, playground and Storybook. This is an engineering test record, not an accessibility conformance statement.

| Check | Result |
| --- | --- |
| Unit, keyboard, async lifecycle, structural axe and token contrast tests | 84 passed, including date bounds, blocked range interiors, same-day ranges, partial selection, disabled form values, Select validation and menu actions |
| Storybook browser interaction and axe checks | 137 passed in each light/dark and reduced-motion on/off combination (548 total) |
| Final async-demo duration/metadata change | Targeted browser check and TypeScript check passed |
| TypeScript, library and playground production builds | Passed |
| Storybook static build | Passed; source-derived documentation for 42 exported components |
| Compiler-free packed consumer installation | Passed; strict TypeScript with declaration checking, generic table columns, native button props, public status/async types, required icon labels and CSS import |
| Package boundary and exports | Preserved client directive, resolvable exports, typed CSS import, CSS side effects and React peers verified |
| SSR and hydration | All 42 components and 2 hooks included in a DOM-free server-rendered fixture; Chromium in America/Los_Angeles hydrates without recoverable/console errors; unique IDs, text entry, Select update and dialog focus return passed |
| Generated AI contract | Covers all 42 public components (including ToastProvider) and 2 hooks; declarations/tokens match |
| Live MCP | Initialize, tools/list, docs-list and docs-show verified; typed metadata for all 42 components |
| Accessibility gate sanity check | A temporary unnamed button failed axe's button-name rule as expected; temporary story removed |
| Visual inspection | Storybook loads, primary button renders correctly, light/dark toolbar changes the canvas |
| Live Agent API and integration MDX modules | Rendered in browser; raw dependencies and static AI downloads pass HTTP checks |
| Idle/pending StatusIcon | Distinct plane glyphs and visible status text; pending animation opt-in and restoration of reduced-motion preference pass in Chromium |
| Compiled Storybook preview | Served send-icon paths match the built package; Vite output moved to `storybook-static` so `dist` remains watched |
| Catalogue | All 37 documentation routes exist; generated inventory checked against actual runtime exports |
| Composition | Drawer with Select and Combobox passes real-browser selection and popup hit testing |
| Narrow/desktop layout | Four specimens at 390px/1280px pass page-overflow checks; screenshots inspected, Badge wrapping and Drawer spacing corrected |
| Search/settings layout | Six specimens at 320px/1280px in light/dark fit the viewport; screenshots inspected, narrow footer refined, palette initial focus and multi-select popup bounds pass |
| Select and DropdownMenu | Default, long-label and empty states fit 320px in both themes, without internal horizontal overflow; Escape returns focus in all 12 cases |
| Calendar and date pickers | All three controls fit 320px in both themes, with at least 24px day targets; screenshots inspected with a non-UTC browser time zone |

The component expansion adds 28 exports across forms, overlays, feedback, navigation and data display. Base UI owns focus, popup and notification lifecycles. The final review corrected popup layers within modals, validation attributes on the native slider input, combobox open-state naming, and timing assertions that ran before Base UI completed focus/removal work. These tests remain observable-behaviour checks; they do not use fixed delays.

The API pass adds optional controlled lifecycle props to Dialog, AlertDialog, Drawer, Popover and DropdownMenu without removing trigger-managed use. Missing public status, async and selection types are exported. The packed consumer exposed a missing CSS declaration; the CSS subpath now has a types export and the strict consumer check passes without an app-specific CSS shim. Storybook's Component contracts page documents these behaviours. A preserved client directive is an artifact check, not a claim that every server framework has been tested.

The search extension adds CommandPalette and MultiSelect, including consumer type examples and SSR coverage. Workspace settings composes both with tabs, native inputs and notification controls. Its save/reset behaviour is in-memory only. Review found a hidden required field could prevent saving from another tab; explicit validation now returns to General and focuses the error, covered in unit and browser tests. Project selection may be empty, and the helper copy says so. This pass did not perform the manual assistive-technology audits below.

The Agent API loading failure came from importing raw text through Storybook's `/ai` static route. Generated Markdown mirrors now live under `docs/`, and the AI contract check verifies they match the distributed files. The live documentation and UI checks are available as `npm run check:docs` and `npm run check:storybook-ui` with Storybook running. The latter requires the Playwright browser installation.

The Storybook build emits a non-blocking documentation tooling notice for the internal preview wrapper and a large-chunk warning for the documentation site. These do not affect the distributed library's CSS/JS or prevent the static build.



The date extension adds Calendar, DatePicker and DateRangePicker using DayPicker for Gregorian grid behaviour and Base UI for popup lifecycle. ISO values stay date-only across time zones. Tests cover inclusive bounds, partial and same-day ranges, unavailable dates inside ranges, restarting completed ranges, keyboard selection, clear and disabled native-form behaviour. Select and DropdownMenu now have bounded popups, distinct selected/focused states, long-label wrapping and explicit empty states. Select also supports null placeholders, disabled options and associated description/error text.

## Apple-guided navigation refinement — 27 September 2026

Added optional Subtle/Expressive navigation materials and a Solid alternative without changing existing palette/font/control tokens. `check:materials` passed three finishes in both themes, extreme-backdrop text contrast (minimum 4.86:1), keyboard focus return and sticky clearance, 320px reflow, axe and opaque reduced-transparency/increased-contrast/forced-colour fallbacks. The new three Storybook stories passed in light and dark (6 cases). Library unit tests (84), reference workflows and its five accessibility scenarios, AI contract, reference production build and Storybook build passed. Screenshots and the machine-readable material report are in `.review/materials`. Read APPLE-DESIGN.md for scope and source mapping; these checks are not native-platform or conformance certification.

## Composition pilot — 28 September 2026

Added task-oriented composition guidance to the generated AI text, fingerprint checks, starter instructions and Storybook. The AI freshness check first failed against the old generated contract, then passed after rebuilding. Both independent invoice layouts use the same shared fixture and controls; accessibility and interaction-parity repairs are documented in COMPOSITION-PILOT.md.

Passed: library build and local package refresh; AI contract check (42 components, 2 hooks); reference production build; 9 reference unit tests; 8 starter tests; existing reference workflow/browser checks; Storybook production build including Composition documentation; 16 composition layout/theme/viewport cases at 1440, 615, 390 and 320px with zero tested axe violations and no page overflow. Pair layout reflow passed at 1440, 615 and 320px in both themes, with shared search/reset, unique landmarks, keyboard detail focus/return and a forced-colours keyboard smoke check. Captures and results are under `.review/composition/` (local-only).

Existing non-blocking large-chunk and Storybook preview-docgen warnings remain. The sandbox blocked esbuild's parent-directory reads; the same existing build commands completed with elevated local execution. No full library unit/story matrix or manual assistive-technology audit was rerun for this documentation/reference-only addition.

The design detector flagged a thick accent border in the guided output. That generated visual choice is retained and documented as a pilot finding, not presented as a recommended pattern. These checks validate the demo's mechanics; they do not prove that the guided design is preferable.

## Ritam package rename — 28 September 2026

Renamed the unpublished package to `@ritam-ui/react` throughout manifests, imports, fixtures, AI documentation, Storybook, visible demo labels, archive generation and starter instructions. The only previous-name strings kept in active code are explicit legacy browser-storage keys and their tests, preserving existing projects and theme preferences. New saves use the Ritam keys. A package-name/version freshness assertion now prevents stale AI contracts; it failed before regeneration and passed after rebuilding.

Historical note: this entry records the package identity at the time. The active library was renamed again to Serein and `@serein-ui/react` on 13 October 2026; the frozen evaluation archive remains unchanged.

Passed: renamed library build and reference package install; type check and AI contract; 8 starter unit tests; a fresh generated app's tarball install, build, browser behavior and accessibility checks; 10 reference unit tests; reference production build and workflow/browser checks; 16 composition responsive/theme/accessibility cases; Storybook production build; legacy/current theme preference and non-destructive save checks. The reference dev server was restarted to clear the old package's dependency cache. Existing non-blocking build warnings remain.

## Release candidate — 28 September 2026

The complete `npm run check:release` command passed with exit code 0 on Windows using Node 24.19.0, npm 10.8.1 and Chromium. It covered 84 library unit tests, 15 reference tests, 8 starter tests, 560 Storybook theme/motion cases, package and AI freshness regressions, strict packed consumer and SSR/hydration, a fresh generated app, static Storybook, live documentation and MCP metadata for all 42 components, existing workspace/material/composition checks, 84 catalogue component/theme audits and 26 workflow accessibility/overflow audits.

An independent Git source export also passed a clean lockfile install, build, package/AI checks, fresh reference setup and reference build. The dependency audit reported zero known vulnerabilities across 401 resolved dependencies. Independent task and whole-branch reviews have no unresolved material findings. Integration repaired test readiness for popup closure and lazy pages, dynamic server addresses, and equivalent minified hex colours; assertions still check the actual interaction and colour values.

The final verification log is a local ignored artifact at `trial/release-final-pass.log`; captures are under `.review`. Existing Storybook annotation/docgen and documentation chunk warnings remain non-blocking. Hosted Linux CI has been configured but not observed running. Publication, final licensing, native-platform support and the manual accessibility gates below remain incomplete.

## Release work still required

- [ ] NVDA/Firefox and VoiceOver/Safari testing of actual app flows.
- [ ] Manual text-spacing, 200% text zoom, 400% zoom/reflow, forced-colors, and focus-obscuration assessment across supported browsers.
- [ ] Complete WCAG 2.2 A/AA criterion-by-criterion evaluation of each finished application, including content, authentication, time limits and recovery.
- [ ] Applicable EAA product/service scope, national implementation, accessibility information, support and ongoing conformity review.
- [ ] Usability evaluation with people with disabilities and a release evidence record.

See [accessibility guidance](ACCESSIBILITY.md) for ownership and authoritative references. No WCAG or EAA conformance claim is made by this record.
