# Serein rename and visual redesign

> **Superseded (October 2026).** The visual direction described here was replaced by the precision-instrument language in [DESIGN.md](../DESIGN.md) during the Serein foundations merge. This page is kept as history.

Implemented 13 October 2026 on `codex/serein-design`.

The user selected Serein and requested a visual language informed by its meaning, while preserving the previously approved astrology-inspired foundation. The result uses clear white and evening-dark canvases, brighter dark-mode orange actions, layered opaque surfaces, shared corner/elevation tokens, and purposeful status motion. Plus Jakarta Sans and restrained success green remain.

## Delivery checklist

- [x] Rename active package, examples, scaffold, documentation, and AI integration to Serein / `@serein-ui/react`.
- [x] Preserve actual GitHub URLs, historical evaluation evidence, internal `dp-*` hooks, and existing demo storage keys.
- [x] Apply shared geometry and elevation to the component library rather than preview-only overrides.
- [x] Add an interactive studio at `?view=serein`, with identical examples in both themes.
- [x] Document exact implemented tokens in `DESIGN.md`, `.impeccable/design.json`, and `packages/react/docs/FOUNDATIONS.md`.
- [x] Regenerate and verify AI declarations, tokens, guidance, and workflow mirrors.
- [x] Correct review findings: unclipped accordion focus rings and accurate local-demo action wording.

## Verification for this change

| Check | Result |
| --- | --- |
| Library unit tests | 84 passed |
| Library build, TypeScript, playground build | Passed |
| Storybook interactions/accessibility | 140 per theme/motion combination; 560 passed |
| Package contents, SSR, consumer installation | Passed |
| Package regression and AI freshness tests | Passed |
| Starter unit tests / reference unit tests | 8 / 15 passed |
| Generated starter | Tarball installation, build, AI files, validation, persisted theme, responsive layout and axe passed |
| Catalogue | 84 component/theme audits; 1440, 390 and 320px layouts passed |
| Existing workflows | 18 route/theme/viewport and 8 state/theme audits; keyboard and text-spacing checks passed |
| Navigation materials | Three finishes in both themes, contrast, keyboard return and opaque fallbacks passed |
| Serein studio | Six theme/viewport axe and overflow audits; validation, select, dialog focus return, async cancel/success, truthful menu feedback passed |
| Token contrast | Checked foreground roles at 4.5:1 and control boundaries at 3:1 across canvas, surface, raised, field and selected surfaces; primary normal/hover text passed |
| Motion/preferences | Full/reduced status motion and forced-colour action shadow fallback passed |
| Accordion review fix | First/last keyboard focus captures in both themes; actual `:focus-visible`, solid outline and unclipped root verified |
| Design review | Independent reviewer: both material findings resolved; disposition `ship` |
| Whitespace | `git diff --check` passed |

The final library build and reference installation include the review fixes. The existing dev server needed a forced dependency refresh after reinstalling the tarball; final browser checks used that refreshed package. Full Storybook/catalogue/workflow matrices preceded the final removal of accordion clipping; the subsequent focused browser check verified that exact change in both themes.

Local screenshots and results are in `.impeccable/review/`; generated test artifacts are intentionally untracked. Run `npm run reference:setup`, `npm run reference:dev`, then `npm run check:serein` from `packages/react/` to reproduce the studio checks. The release gate also includes this check.

This record establishes the scoped rename/redesign verification. It does not establish npm scope ownership, publication, native platform support, manual assistive-technology conformance, or EAA certification. Earlier release evidence and the immutable AI pilot retain their original scope and dates.

## Research-led premium refinement — 13 October 2026

The subsequent request asked for deeper research before further visual refinement. Three independent research passes covered Apple HIG, Adobe Spectrum, Fluent 2, Radix Colors, WCAG 2.2, Linear, Untitled UI, and Raycast. The [synthesis and citations](../reports/Premium%20Serein%20component%20research.md) distinguish observed evidence, accessibility requirements, and aesthetic recommendations. Baseline screenshots and tokens were retained locally under `.impeccable/review/premium-before/`.

- [x] Replace blue-slate neutral surfaces with a restrained charcoal/neutral ladder; retain white light canvas, vivid orange actions with dark text, and limited success green.
- [x] Make secondary actions tonal, persistent cards flat, and transient overlays elevated.
- [x] Add explicit neutral and orange pressed states; keep disabled buttons neutral and stable under pointer input.
- [x] Give success, warning, and error badges their own subtle fills and readable text.
- [x] Align switch descriptions with their labels, tighten related form spacing, and normalize control weight and chevron strokes.
- [x] Separate pointer highlight, selection, and keyboard focus in Select and DropdownMenu.
- [x] Synchronize exact design tokens, design metadata, foundations, and generated AI integration files.

Verification for this refinement:

| Check | Evidence |
| --- | --- |
| Unit tests | 84 passed |
| Library / reference production builds | Passed |
| Storybook | 140 stories across light/dark and full/reduced motion: 560 passed |
| Studio | Eight theme/viewport axe and overflow audits at 1440, 966, 390, and 320px |
| Contrast | Text and required boundary roles across five resting surfaces; primary rest/hover/pressed; neutral states; all three semantic badge pairs passed |
| Interaction | Validation, Select choice, Dialog focus return, async cancellation/success, menu actions, disabled pointer stability and switch text alignment passed |
| Keyboard focus | Explicit pointer-versus-keyboard tests found and then verified the fix for Select's base outline overriding its focus ring; both Select and Menu show a solid 2px keyboard ring in both themes |
| Preferences | Reduced/full status motion and forced-colour fallback passed |
| Catalogue | 84 component/theme audits; all previews at 1440, 390, and 320px, plus navigation/search/recovery checks passed |
| Navigation materials | Three finishes in both themes, narrow reflow, contrast and opaque accessibility fallbacks passed |
| AI contract | 42 components, two hooks, current declarations/tokens, and six workflow mirrors verified |
| Design review | Independent visual/source review: ship after targeted Select focus recheck; that recheck passed |
| Detector / whitespace | No Impeccable findings; `git diff --check` passed |

The Storybook matrix preceded the final scoped Select focus-rule correction; the final rebuilt package passed the targeted keyboard tests and full catalogue audit. The dev server was restarted with a fresh dependency cache after reinstalling that package. This is scoped automated and visual evidence, not WCAG/EAA certification or manual assistive-technology sign-off.

## Border and frame audit — 13 October 2026

Reviewed all 42 components, the reference pages, catalogue, workflows, playground, stories, and starter composition for redundant frames, joined borders, and scroll wrappers. This extends the preceding invoice Version A/B fixes.

- [x] DataTable: keep its outer frame and dividers between rows; remove the final row's duplicate bottom edge.
- [x] Accordion: remove the final item's duplicate divider and fit first/last trigger hover fills to the rounded outer edge, without clipping keyboard focus.
- [x] NumberField: use one seam between the input and stepper stack.
- [x] Catalogue: remove the surrounding preview border and redundant horizontal scroller; retain the useful, non-focusable named preview region.
- [x] Workspace and invoice workflow: let DataTable own scrolling and framing. Remove the unused invoice wrapper and the page-level cell border that overrode the component's final-row rule.
- [x] Document frame ownership in foundations and AI instructions; regenerate the distributed guidance and workflow recipes.

Calendar/picker boundaries, popup frames, control outlines, and separate material-preview planes were retained where they serve distinct purposes. An independent final source review found no additional concrete issue in the changed areas.

Verification passed: library and reference production builds; TypeScript; 84 unit tests; 560 Storybook interaction/accessibility cases; 84 catalogue component/theme audits with 1440/390/320px overflow checks; 26 workflow route/state audits; workspace flows; 16 composition cases; eight studio cases; navigation-material checks; and AI contract verification. The last Accordion corner adjustment was followed by fresh builds, unit and Storybook runs, studio/focus checks, and direct visual inspection of open/closed hover states. Other page matrices preceded that corner-only adjustment.

An intermittent Select test closed its popup during jsdom's pointer/positioning path. The disabled-option test now opens by keyboard and awaits the visible option; it still attempts the disabled click and checks that no value change occurs. Five isolated runs and the final full suite passed. Real-browser pointer selection remains covered by the studio and Storybook checks.

Local screenshots are under `packages/react/.review/` and `.impeccable/review/`. This audit covers the observed frame, scrolling, corner, and focus issues; it is not a claim that every possible UI issue has been eliminated.
