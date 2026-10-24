# Composing screens with Serein

Use this guide with the installed version's contract and examples. These recipes guide composition; they are not additional exported components. Preserve Serein's precision-instrument language. A screen's purpose determines its structure.

## The Serein language in six rules

1. **Measure, don't decorate.** Every line is a graduation, a boundary or data. No gradients, glass, glows, emoji, decorative illustration, stars, moons or zodiac imagery.
2. **One signal.** The vermilion `--sr-color-signal` marks the single primary action per view (plus a needle or today's value in a measurement). Everything else is ink on a ground. Never use the signal for status, notices or large areas.
3. **The figure is the hero.** Lead with the figure the person came for as a `Readout` (light, tabular, Indian grouping such as ₹1,00,000, true minus −₹2,400). Labels and units are small and exact, set in Chivo Mono only when they are measurements.
4. **Headings carry their metadata.** Put the heading on the left and its metadata (date, unit, count) right-aligned on the same row. No eyebrow or kicker labels, no section numbers.
5. **Settle, don't bounce.** Motion travels to a reading and stops (`--sr-easing-settle`). Every animated outcome is also announced; reduced motion removes travel.
6. **Every state is written.** Empty, loading (`Drizzle` plus words), error (what happened, what is safe, what to do), success (a statement, not a celebration), and over-limit.

## Start with a four-line brief

1. User and task: who is here and what do they need to finish?
2. Priority: what information or action deserves attention first?
3. Content: what real fields, volume, wording and relationships must fit?
4. States: what can be empty, slow, invalid, unavailable or unsuccessful?

Infer settled facts from the request. Ask only when the missing answer changes the solution. For prototypes, label fictional data and simulated operations. Never invent success, metrics, saved data or product capabilities.

## Choose a composition

| Task | Starting structure | Choose something else when |
| --- | --- | --- |
| Compare and act on records | Concise task header, relevant summary, search/filters, DataTable, detail region | Images or spatial relationships matter more than column comparison |
| Edit one record or settings | Readable heading, grouped form, descriptions at the point of need, save/error feedback | The user needs to scan and edit many rows simultaneously |
| Browse visual work | Image-led collection, concise metadata, filters and an accessible detail view | Visuals are decorative and records are best compared as text |

These are starting points, not mandatory templates. Document why the chosen layout serves this task. Don't describe a recipe as a library export. Custom semantic HTML/CSS is appropriate for layout; reuse exported controls rather than rebuilding their behavior.

## Make deliberate visual decisions

- **Hierarchy:** lead with the task. Keep important content near its actions. Use heading size, weight and whitespace to express relationships; avoid making every section equally prominent.
- **Containers:** use a card when an item is an independent unit. Use alignment and dividers for a continuous list or form. Explain the need before nesting surfaces.
- **Density:** dense workspaces need compact, scannable rows; focused forms need comfortable reading width. Density must not reduce usable hit targets or hide focus.
- **Colour:** retain Anek Latin, Chivo Mono (measurements only) and shared tokens. The vermilion signal denotes the one priority action; use dark `--sr-color-on-signal` text on it. For small signal-coloured text on a neutral surface, use `--sr-color-signal-ink`, not the bright `--sr-color-signal` fill. Use theme-aware semantic tokens or Badge for statuses, and green sparingly for actual success. Semantic meaning also needs text.
- **Content:** use realistic field lengths, dates and quantities. Name actions specifically. Avoid empty slogans, invented performance numbers and charts that don't help the task.
- **Typography:** use a small consistent hierarchy, readable line lengths and tabular numerals for amounts. Long labels must wrap or have an accessible full-text path.
- **Responsive layout:** decide what stacks, wraps or stays in a scrollable region. A comparison table may scroll inside a labelled focusable region; the page itself must not overflow. Never silently drop essential data.
- **Motion/materials:** animate changes that need explanation. Follow reduced-motion and contrast preferences. Materials are solid everywhere; hierarchy comes from tone, hairlines and type, never translucency.

## Recipe: money entry

**Task:** a person sends or pays an amount and must be sure of the figure before confirming.

Lead with the recipient, then a `Readout` of the amount above a `Tape` that shows it against the limit, then a `Keypad`. The single signal `Button` states the amount ("Send ₹2,400"). Over the limit, keep the button focusable but unavailable and say why ("Over daily limit"); the tape's hatched zone shows the same fact visually. While sending, the button keeps its width and shows a busy state; on success state the outcome in words with a reference; on failure say nothing was charged and move focus to "Try again". Storybook's Patterns / Send money demonstrates this.

## Recipe: invoice collection

**Task:** a small studio owner identifies overdue invoices, compares amounts/dates and reviews details before following up.

Lead with invoices and the current collection priority. Use factual summaries that support that task. Place search and status filters immediately before the records. Show client, invoice identifier, due date, amount and status; align amounts and expose sorting only if implemented. Keep the table reachable without an oversized introductory section. Provide review actions with invoice-specific accessible names. Detail content must preserve the selected record's identity and not imply a message was sent.

Distinguish no matching results from no invoices yet. Clearing filters should recover results. An actual reminder flow needs pending, success and failure tied to the real operation; a local prototype must say it is a demo. Do not add revenue charts just because the page handles money.

**Reviewed source:** `ai/examples/Invoices.tsx`, with `ai/examples/model.ts`, `ai/examples/Shell.tsx`, and `ai/examples/workflows.css`. Use this shape when users compare a modest number of factual records and take a record-specific next step. Avoid it when the task is spatial or image-led, or when many rows must be edited at once. Preserve filter recovery, selected-record identity, detail-heading focus, trigger focus return, and explicit local-simulation/failure states.

## Recipe: grouped settings

**Task:** a user changes a small set of related preferences and understands what saved.

Group fields by meaning with visible labels, short descriptions and errors near their fields. Use TextField/Select for values, Switch for immediate on/off settings only when the behavior supports that, and Checkbox for selection or confirmation. Use Tabs only when groups are substantial and navigation aids the task. Keep unsaved changes and cross-tab validation visible. Offer one clear save path; preserve input on failure and return focus appropriately. Don't use DropdownMenu as a form field or claim local memory is a backend save.

**Reviewed source:** `ai/examples/Settings.tsx`, with `ai/examples/model.ts`, `ai/examples/Shell.tsx`, and `ai/examples/workflows.css`. Use this shape for a small, related preference set with one save action. Avoid it for immediate settings or bulk editing. Preserve name validation, pending field protection, retained drafts after failure, recoverable storage errors, and local-only wording.

## Recipe: sequential onboarding

**Reviewed source:** `ai/examples/Onboarding.tsx`, with `ai/examples/model.ts`, `ai/examples/Shell.tsx`, and `ai/examples/workflows.css`. Use it when the user must complete a short dependent sequence and review choices before locally saving. Avoid it when the task has no real sequence or users need free navigation among substantial independent sections. Preserve step indication, back navigation, validation focus, review content, completion/failure recovery, and an honest statement about local storage and accounts.

## Recipe: visual collection

**Task:** a user recognizes and selects assets by appearance.

Let actual preview content lead. Keep metadata and selection controls consistent across items. Preserve image aspect ratios where meaningful, include text names and appropriate alternatives, and offer a useful empty state. Adapt column count to available space rather than shrinking text. Use a list/table alternative when detailed comparison dominates. The current package does not include a full gallery, upload transport or image editor; compose layout and verified APIs without inventing exports.

For compact row selection, use `Checkbox hideLabel` beside the visible record identity. Its required `label` still names the action for assistive technology. Reserve a 48px control column and a wrapping content column; avoid absolute positioning or clipping that can conceal collisions at narrow widths. For example:

```tsx
<div style={{ display: 'grid', gridTemplateColumns: '48px minmax(0, 1fr)', gap: 12, alignItems: 'center' }}>
  <Checkbox label={`Select ${file.name}`} hideLabel checked={selected} onCheckedChange={setSelected} />
  <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{file.name}</span>
</div>
```

Keep owner, type, size and status available when they inform the decision. Once selection opens a decision form, provide a clear cancel/edit path as well as retry; retain the failed request's data. After the final eligible record is processed, replace selection instructions with an accurate completed-queue state and update the summary to include the new outcome. These are composition responsibilities, not automatic Checkbox behavior.

## Build, inspect, correct

1. Retrieve the relevant component APIs and examples before coding.
2. Compose with documented controls and shared tokens; do not guess props.
3. Run type/build and interaction checks. Test meaningful loading/error/empty states when the screen has those behaviors.
4. Render light/dark and narrow/desktop. Exercise keyboard use, focus and long content. Automated accessibility checks do not certify compliance.
5. Inspect the screenshot: does the intended task lead, does grouping make sense, is anything decorative competing with useful content, and does the layout fit this product? Check that visible labels and record names do not overlap or duplicate unnecessarily. Zero page overflow can still hide clipped content or excessively tall rows; an axe pass does not assess those problems.
6. Correct concrete issues, then recheck the affected behavior. Describe what was checked and what remains unverified.

## Review rubric

Compare results on task clarity, hierarchy, content fit, interaction completeness, responsive behavior, accessibility and fidelity to the design language. Use a human review for visual quality. Passing a token/API check does not prove a good design; an AI-generated aesthetic score is not an objective measure. For a reproducible multi-task protocol and reporting limits, read `docs/AI-EVALUATION.md`.

For experiments, keep the task, data, APIs, model and generation budget comparable. Record exactly which guidance each run received. Don't deliberately weaken a baseline. Include several tasks and independent runs before making general claims, and evaluate accessibility separately from visual preference.
