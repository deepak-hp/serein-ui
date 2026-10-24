# Serein foundations

Serein is designed like a precision instrument: fine graduations, exact readouts and one vivid signal, calm enough to read like fine rain from a clear evening sky. Its symbolism comes from Jyotish as a measured science (Jantar Mantar's engraved scales, the rain gauge), used structurally: there are no stars, moons, zodiac wheels or galaxies. Personal chart details are not distributed.

## Source of truth

All values are design tokens in the repository's `tokens/` folder (W3C DTCG 2025.10 format), built by [`@serein-ui/tokens`](../../tokens) into CSS custom properties (`--sr-*`), JS/TS, JSON, a Tailwind v4 theme, Swift and Kotlin. `styles.css` in this package starts with the CSS layer, so components and your own CSS read the same variables. The token tests fail the build if any text pair drops below 4.5:1 or any boundary below 3:1 in either theme.

## Colour roles

| Role | Token | Use |
| --- | --- | --- |
| Page | `--sr-color-surface` | Screen background |
| Raised | `--sr-color-surface-raised` | Panels, inputs, keys, the selected segment |
| Sunken | `--sr-color-surface-sunken` | Wells, tracks, avatars, disabled fills |
| Overlay | `--sr-color-surface-overlay` | Menus, popovers, dialogs, toasts |
| Hover / pressed | `--sr-color-surface-hover`, `--sr-color-surface-pressed` | Neutral control states |
| Ink | `--sr-color-ink`, `--sr-color-ink-muted` | Text, readouts, metadata |
| Lines | `--sr-color-line`, `--sr-color-line-strong` | Decorative hairlines; control boundaries (≥3:1) |
| Signal | `--sr-color-signal` (+ `-hover`, `-pressed`, `-edge`) | The one primary action, needles, today's value |
| On signal | `--sr-color-on-signal` | Near-black text on the signal, both themes |
| Signal text | `--sr-color-signal-ink`, `--sr-color-signal-soft` | Links and selected text; selected/active grounds |
| Status | `--sr-color-success`, `-warning`, `-danger` (+ `-soft`) | Always with a word or icon; danger is rose, never the signal |
| Focus | `--sr-color-focus` | Neutral 2px ring with 2px offset |

The exact values for both themes are in Storybook under **Foundations / Colour** and in [`ai/contract.json`](../ai/contract.json).

## Geometry and typography

| Token | Value | Use |
| --- | --- | --- |
| `--sr-radius-tag` | 4px | Tags, the gauge tube, small indicators |
| `--sr-radius-control` | 8px | Buttons, fields, segmented tracks |
| `--sr-radius-key` | 12px | Keypad and quick-action keys |
| `--sr-radius-popup` | 12px | Menus, popovers, tooltips, select lists |
| `--sr-radius-panel` | 14px | Panels and notices |
| `--sr-radius-sheet` | 22px | Dialogs and sheets |

Standard buttons and fields are 48px high (`--sr-size-control`); compact desktop controls are 36px. Scales, tapes and gauges stay square.

`--sr-font-family-sans` is **Anek Latin** (Ek Type): every word and figure, with the ₹ sign, tabular figures and a width axis narrowed to 88% for readouts. `--sr-font-family-mono` is **Chivo Mono**, for measurements only (units, axis labels, references, timestamps). Both ship in this package via `fonts.css`. Type styles are available as `sr-type-*` classes: `readout-xl` 88px, `readout-l` 60px, `readout-m` 32px, `title` 28px, `heading` 17px, `body` 15px, `body-reading` 17px, `label` 13px, `measure` 12px mono. Nothing is set below 12px. No eyebrow labels above headings.

## Material and motion

Materials are solid. Panels use the raised surface with a hairline and `--sr-shadow-raised`; keys use `--sr-shadow-key`; overlays use `--sr-shadow-overlay`. There is no translucency, blur, gradient or glow.

Motion is fast and exact: `--sr-duration-fast` 100ms (hover, press), `--sr-duration-base` 180ms (state changes), `--sr-duration-slow` 320ms (tapes, needles, success marks), with `--sr-easing-standard` for UI and `--sr-easing-settle` for things coming to rest. Status icons communicate real pending, success or error states; motion never determines completion. Reduced-motion settings remove travel and state-icon motion.

## Integration and accessibility

Import `@serein-ui/react/fonts.css` then `@serein-ui/react/styles.css`. Apply `data-theme="light|dark"` on `<html>` (omit it to follow the system) and `sr-theme` on `<body>` so portalled overlays inherit the same theme.

Keep visible labels, connected errors, keyboard operation, focus return and semantic landmarks. Verify light/dark, narrow layouts, reduced motion, forced colours and full user processes in the consuming app. Automated checks do not certify WCAG 2.2 AA or EAA conformance. See [accessibility guidance](ACCESSIBILITY.md) and [recorded evidence](ACCESSIBILITY-EVIDENCE.md).
