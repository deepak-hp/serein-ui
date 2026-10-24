# Accessibility evidence matrix

Serein targets WCAG 2.2 AA. This matrix records available component and reference-app evidence; it is not a conformance claim. W3C states that automated and human evaluation complement each other, and that conformance includes every page in a complete process. See [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and the [complete-process requirement](https://www.w3.org/TR/WCAG22/#cc5).

## Ownership and selection

Base UI owns its upstream keyboard/ARIA/focus primitives. Serein retains bounded integration regressions to check wrapper contracts, label/error wiring and composed focus, rather than re-running the upstream baseline. Serein's custom DataTable, status announcements, motion, calendar/date adapters, colours, targets, reflow, visible focus and enabled optional materials remain library responsibilities.

Select native review paths for those customization risks: Projects' nested Drawer/discard/date/table interactions; invalid → corrected → failed → retry/success states; and custom announcements. Preserve distinct archive/restore, storage recovery, inline-details and completion-focus outcomes from the source protocol. Reuse observations for identical wrappers only with the same setup and an explicit record of what was reused; expand when behavior, source or dependencies change. Full task scripts remain a reproducible reference, not an exhaustive component/device cross-product.

Native Windows/AT and actual-zoom checks are deferred during background-only work; Mac review follows later. Pending rows below describe evidence still needed, not new test results. Disabled-user usability input and consuming-product content/full-process/EAA applicability review are separate human activities. No external review is automated and no EAA certification is claimed.

| Area / success criterion | Current automated evidence | Required manual or product review | Status |
| --- | --- | --- | --- |
| Names, roles, values; labels and errors (4.1.2, 3.3.2) | `tests/accessibility.test.tsx`, `forms.test.tsx`, component stories, axe | Verify Serein wrapper/error wiring and custom announcements on selected recovery paths; product wording/localization remain consumer-owned | Open manual gate |
| Keyboard and focus order (2.1.1, 2.4.3) | `tabs.test.tsx`, `selection.test.tsx`, `overlays.test.tsx`, `date-pickers.test.tsx`, `calendar.test.tsx`; automated keyboard paths through Invoices, Settings, and Onboarding in Chromium, Firefox, and WebKit | Selected Serein composed focus, popup/date and custom-table paths in native browsers; consumer complete processes separately | Open manual gate |
| Focus visible / not obscured (2.4.7, 2.4.11) | token focus rule; `check-reference-accessibility.mjs` centre hit-testing | Inspect visible indicator thickness/contrast and selected sticky/overlay risks; centre hit-testing is not proof | Open manual gate |
| Reflow, text spacing, contrast and targets (1.4.10, 1.4.12, 1.4.3, 1.4.11, 2.5.8) | reference reflow/text-spacing/forced-colour checks; token contrast checks; three-route 320 px text-spacing and overflow checks in Chromium, Firefox, and WebKit | Actual browser zoom at 200% and 400%, rendered contrast, target sizing, Windows contrast themes | Open manual gate |
| Motion and forced colours (2.3.3 additional AAA practice; 1.4.11 support) | reduced-motion and forced-colour CSS; reference checks | Confirm actual browser/OS behavior; 2.3.3 is an additional practice, not AA | Open manual gate |
| Consistent Help (3.2.6) | No meaningful automated rule in this library | Review help placement across each complete product process | Consumer-product review |
| Redundant Entry (3.3.7) | No meaningful automated rule in this library | Review repeated-data flows and any permitted auto-population | Consumer-product review |
| Assistive technology | No emulator substitutes for native AT | Selected Serein-owned paths with NVDA + Firefox and later VoiceOver + Safari; record actual recovery announcements | Deferred; pending native evidence |

The axe 4.13 `wcag22a` tag set is empty in the current setup, so it is not treated as proof of WCAG 2.2 A coverage. Browser viewport/text enlargement checks emulate stress conditions; they do not replace native browser zoom. The reference protocol is checkout-only source `reference/ACCESSIBILITY-REVIEW.md`; test coverage references are in [`ACCESSIBILITY.md`](ACCESSIBILITY.md).

## Customization review, 24 October 2026

The unchanged runtime at `0b9a6c4` passed fresh library/reference tests, 564 theme/motion story cases, 18 focused wrapper scenarios across Chromium/Firefox/WebKit, compact-checkbox targets, theme/material regressions and the three composed workflows in each engine. See the [source validation record](https://github.com/deepak-hp/serein-ui/blob/main/docs/validation/2026-10-24-customization-accessibility.md) for exact versions, commands, counts and limitations. Native and human rows above remain pending; the older observations below retain their original scope and date.

## Automated browser observation, 7 October 2026

After rebuilding `reference/dist`, `check-workflows.mjs` completed in Playwright Chromium, Firefox, and WebKit. Each engine produced its own result JSON and screenshots under `.review/workflows` (Chromium), `.review/workflows/firefox`, and `.review/workflows/webkit`.

For each engine, the run recorded:

- 18 route/theme/viewport axe and horizontal-overflow checks: Invoices, Settings, and Onboarding in light and dark themes at 1440, 390, and 320 CSS pixels;
- 8 error/completion-state theme checks at 320 CSS pixels;
- one 320 CSS pixel text-spacing/overflow pass for each of the three routes, using 1.5 line height, 0.12 em letter spacing, 0.16 em word spacing, and 2 em paragraph spacing;
- a keyboard path on each route, including focus-in-viewport checks, validation focus, and keyboard activation; and
- the existing persistence, reset, recovery, actual storage-failure, corrupted-storage, and browser-error assertions.

All recorded axe violation counts were zero, all recorded overflow values were false, and the browser-error arrays were empty. These automated observations are bounded to the tested states and axe rules. They are not a WCAG conformance statement or a substitute for human review.

Actual browser zoom, NVDA with Firefox and VoiceOver with Safari were not exercised in this session and remain manual gates. Playwright Firefox and WebKit do not simulate those assistive-technology combinations; native assistive-technology review still needs an appropriate device and reviewer.

EAA applicability depends on the product/service, jurisdictional implementation, and economic operator. A component library cannot determine it. See the [official Directive text](https://eur-lex.europa.eu/eli/dir/2019/882/oj).
