# Accessibility implementation notes

This library provides accessible component primitives and automated regression checks. It does **not** make a consuming application conformant with WCAG 2.2, the European Accessibility Act (EAA), or any local law. WCAG conformance applies to complete pages and complete processes, not an isolated component library. See [WCAG 2.2 conformance requirements](https://www.w3.org/TR/WCAG22/#conformance-reqs) and the [European Accessibility Act, Directive (EU) 2019/882](https://eur-lex.europa.eu/eli/dir/2019/882/oj).

## What these components provide

Base UI owns the upstream keyboard, ARIA and focus primitives used by its controls. Serein owns whether its wrappers preserve those contracts, including label/description/error wiring, and whether composed focus flows work together. Keep bounded keyboard regressions at those integration boundaries; the library review does not repeat Base UI's whole upstream component test programme.

Serein also owns its custom DataTable, status announcements, motion, calendar/date adapters, colours, target sizes, reflow and visible focus. Optional materials need review when enabled. These customizations are the focus of the library checks below.

- Native labels, required state, descriptions, invalid state, and error messages for `TextField`. When an error is supplied, it remains connected through `aria-describedby` and `aria-errormessage`.
- Keyboard-operable Base UI controls with labelled select lists, dialogs, checkboxes, switches, radio groups, and tabs. Tabs use roving focus and activation on focus; dialogs return focus to their trigger after close.
- A consistent `:focus-visible` outline for native and Base UI control roles, including tabs and selection controls. Most controls use 44–48 CSS-pixel minimum dimensions; number-field steppers use 44×24 CSS-pixel targets.
- Reduced-motion handling and a forced-colors mode that uses system colors rather than relying on the normal theme palette.
- Decorative SVGs are hidden from assistive technology.

The automated test suite runs axe-core rules tagged `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, and `wcag22aa`, plus keyboard regression tests for tabs, selection controls, select, and dialog focus restoration. Color contrast is intentionally excluded from axe in jsdom because its canvas-based calculation is not available there; evaluate rendered themes in a real browser.

## Consuming application responsibilities

The application team owns the final accessible name, instructions and error wording, logical focus order across composed screens, page language, headings, landmarks, live updates, media alternatives, authentication, timeout handling, and every complete user process. Validate all consumer CSS overrides because they can remove contrast, target size, or focus visibility.

EAA applicability depends on the product or service, jurisdictional implementation, and the economic operator. The Directive places service-design and ongoing-conformity obligations on service providers; a component library cannot determine scope or make that assessment. Refer to Article 4 and Article 13 of the [official Directive text](https://eur-lex.europa.eu/eli/dir/2019/882/oj).

## Library validation scope

The installed-package reference workspace has an additional `npm run check:reference-accessibility` regression check for 320px reflow, text-spacing overrides, simulated text enlargement, forced-colour emulation and keyboard-only editing. Its manual protocol is in `reference/ACCESSIBILITY-REVIEW.md` in the source checkout. Native screen-reader and browser-zoom checks remain pending; emulation does not discharge them.

Current evidence is recorded in [VERIFICATION.md](VERIFICATION.md). Storybook runs real-browser interaction and axe checks in both themes, including open overlays; violations fail the run. Token contrast regression tests check supported text and enabled-control boundaries. These checks supplement, rather than replace, the manual evaluation below.

The criterion-by-criterion evidence map, explicit manual gates, and the limits of the automated checks are in [ACCESSIBILITY-EVIDENCE.md](ACCESSIBILITY-EVIDENCE.md).

The expanded library also tests open combobox naming and search, slider validation on the actual range input, destructive-dialog cancellation focus, nested dropdown hit testing inside a Drawer, table sorting semantics, pagination boundaries, toast dismissal and image fallback. Toasts use Base UI's notification lifecycle; keep important errors inline and use `timeout: 0` for persistent notifications. Native date fields and file inputs need platform-specific picker evaluation; Serein's custom date pickers compose DayPicker calendars with Base UI popovers and need review of their adapter wiring and focus/selection behavior.

- Select representative Serein-owned risks: Projects' nested Drawer/discard decision, date popup and table; invalid → corrected → failed → retry/success states; and custom status announcements. Preserve distinct outcomes such as archive/restore, storage recovery, inline-details focus and completion focus when selecting from the source protocol.
- Use native NVDA + Firefox and, later on a Mac, VoiceOver + Safari for the selected paths. Reuse an observation only for identical wrappers with the same setup, and record that reuse explicitly. Expand selection when behavior, source or dependencies change, or a distinct composition introduces a new risk.
- Check actual 200% text enlargement and 400% browser zoom/reflow, rendered light/dark themes, native contrast themes and reduced motion on those paths. Inspect visible/unobscured focus and measure Serein colours and targets, including optional materials when enabled. Emulation remains supplementary.

Native Windows/assistive-technology and actual-zoom review is deferred while work is restricted to background tasks; Mac review follows later. Unperformed checks remain pending. The source protocol retains the full task scripts as reproducible references, not a demand to repeat every upstream component and device permutation.

Disabled-user usability input is a separate human review activity. The consuming product team must also evaluate its content, localization and complete processes, and obtain any required EAA applicability review. These activities are not automated native-library checks, and neither this library nor its checks provide EAA certification.

WCAG 2.2 itself describes accessibility evaluation as a combination of automated testing and human evaluation, and states that conformance requires all pages in a complete process to conform. See [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and its [complete-process requirement](https://www.w3.org/TR/WCAG22/#cc5).
