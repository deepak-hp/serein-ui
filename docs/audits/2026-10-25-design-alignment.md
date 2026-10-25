# Design alignment audit: web components (25 October 2026)

**Scope:** all 49 `@serein-ui/react` components, light and dark, against [DESIGN.md](../../DESIGN.md) and the token source.
**Method:**
1. A computed-style census of every component story (161 stories × 2 themes). It flags font families, sizes and weights, corner radii, colours that don't map to a token, signal usage, blur, animations and lifted shadows.
2. A static scan of the compiled stylesheet.
3. Tight screenshots of each component in both themes, reviewed by eye.

Visually hidden native inputs (Base UI's form proxies) show browser-default colours in the census; those are false positives and are excluded.

## Rules applied

| Area | Serein rule (DESIGN.md) | Applied as |
|---|---|---|
| Signal | One vivid colour for the one action, needles and today's value; never status or large areas | Buttons, links, needles, today's value and switch-on keep the signal. Selection marks (checkbox, radio, calendar day, pagination) become **ink**. Selected segments and tabs become **neutral**. |
| Selected | A raised key on a sunken track | ToggleGroup and similar segmented controls |
| Type | `label` 13/500, `body` 15/400, `heading` 17/600, `title` 28/500, `measure` 12 mono; weights 300–600 | Control text 15, field labels 13/500, helpers 13, headings 17/600; no 650/700 |
| Shape | Machined corners, never pills; scales square | Square-cornered avatars, machined switch, needle slider thumb. Radios stay circular (an established single-choice convention). |
| Loading | Drizzle (graduations filling in turn); skeletons breathe, never shimmer | Button busy state, Spinner, StatusIcon loading, DataTable loading |
| Focus | 2px ring, 2px offset (`size.focus-offset`) | Every control (inset rings stay inset where a container would clip) |
| Materials | Solid; overlays only get `shadow.overlay` | New `color.scrim` token for modal backdrops |
| Measurement | Chivo Mono only for units, labels of data, references | DataTable column headers |

## Findings

| # | Component(s) | Finding | Fix | Severity |
|---|---|---|---|---|
| 1 | 39 components | Text is set at 14px in 211 places, plus stray 18/20/22.5px; weights 650 and 700 | Map to the Serein scale and 300–600 weights | High: the type rhythm is off everywhere |
| 2 | Tabs | Selected tab is a warm-tinted, outlined pill | Ink text with a 2px signal underline on a hairline; no fill | High |
| 3 | ToggleGroup | Selected option is a full signal fill (a second "primary" on screen) | Raised key on a sunken track, ink text | High |
| 4 | Checkbox, RadioGroup, Calendar, DatePicker, DateRangePicker | Selection marks use the signal fill | Ink fill with a raised-surface mark; range middle on sunken | High |
| 5 | Pagination | Current page is outlined in signal on a tinted fill | Ink-filled current page; neighbours are secondary keys | Medium |
| 6 | MultiSelect, CommandPalette, Select, Combobox, DropdownMenu | Chips and highlighted options use the warm `signal-soft` tint | Chips on sunken with a hairline; highlighted options on `surface-hover` | Medium |
| 7 | Avatar | A circle, solid ink in light mode but outlined in dark (themes disagree) | Square-cornered (`radius.control`), sunken ground, ink initials, same in both themes | Medium |
| 8 | Switch | Pill track and round knob | Machined track (`radius.control`), squared knob; on state keeps the signal | Medium |
| 9 | Slider | Thick signal fill and round thumb | Hairline track, ink range, signal needle thumb (like the Tape) | Medium |
| 10 | Button (busy), Spinner, StatusIcon, DataTable (loading) | A rotating arc spinner | Drizzle ticks; a 4-tick version for the 20px icon slot | Medium |
| 11 | Every control | Focus offset is 3px | 2px via `size.focus-offset` | Medium |
| 12 | Dialog, AlertDialog, Drawer, CommandPalette | Backdrop is a hard-coded black at 52% | New `color.scrim` token, defined per theme | Low |
| 13 | Separator | Browser-default grey rule | `color.line` | Low |
| 14 | DataTable | Column headers set as bold sentence-case text | `measure` style: Chivo Mono 12, uppercase, muted | Low |
| 15 | FileUpload | The native "Choose file" button is browser-styled | Styled as a secondary key | Low |
| 16 | Gauge | The limit label collides with a nearby tick label (e.g. 180 GB next to 200 GB) | Hide tick labels within one label height of the limit label | Low |
| 17 | Accordion | Panel radius 13px; content sits tight under the header | `radius.panel`; panel padding on the spacing scale | Low |
| 18 | Card, Dialog, Drawer titles | Weight 650 | `heading` 17/600 | Low |
| 19 | Breadcrumbs | Every ancestor is a vermilion link (several signal elements in one strip) | Ancestors in `ink-muted` with underline on hover; current page in ink | Low |
| 20 | StatusIcon animations | Hard-coded 1.1s, 0.8s, 360ms and 280ms timings | Duration tokens | Low |

## Kept on purpose

- **Input text stays 16px.** iOS Safari zooms into any input set below 16px, so fields keep 16px while labels and helpers follow the scale.
- **Radio buttons stay circular.** It is the universal single-choice signal; changing it costs recognition for no gain.
- **Tooltips stay inverse** (ink ground, raised text) so they read as transient.
- **Switch-on stays signal**, as specified in the design system ("On: a signal track").

## After the fixes

All 20 findings are fixed. Results on 25 October 2026:

- **Census:** flags went from 380 to 139. Every remaining flag is either intentional or a false positive:
  - Signal on the primary action, Tape and RainChart needles, today's bar, and the Switch on state.
  - Visually hidden native inputs, which keep browser colours.
  - Keypad digits at 26px (a specified display size) and the circular radios.
  - Nested inner radii: the Accordion trigger at 13px inside a 14px panel; the Switch knob and segmented keys at 5px inside an 8px track.
  - Data animations (Drizzle, Gauge and Meter reveal, Skeleton breathe).
- **Static stylesheet:** font sizes are now only 12, 13, 15, 16 (inputs), 17, 26, 28, 32, 60 and 88px. Weights are 300–600. A 3px focus offset no longer appears anywhere.
- **Tests:** 101 unit tests pass. All 170 Storybook story tests (interactions and axe) pass in each of the four runs: light and dark, with reduced motion on and off.
- **Other checks:** `ai:check`, `check:docs` and `check:layout` pass.

Found while verifying and fixed in the same change:

- Sortable DataTable headers did not inherit the measure style, because buttons reset `text-transform`.
- Layering the current-page style on a Button variant let the variant's fill win. The current page is now styled on its own.
- The Avatar "themes disagree" observation came from the Image story's sample picture, which is dark in both themes. The initials fallback is now identical in both themes.
