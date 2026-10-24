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


# Composing screens with Serein

Use this guide with the installed version's contract and examples. These recipes guide composition; they are not additional exported components. Preserve the approved Flame & Ink identity. A screen's purpose determines its structure.

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
- **Colour:** retain Plus Jakarta Sans and shared tokens. Orange denotes priority; use dark text on the orange fill. For small orange text on a neutral surface, use `--sr-color-signal-ink`, not the bright `--sr-color-signal` button fill. Use theme-aware semantic tokens or Badge for statuses, and green sparingly for actual success. Semantic meaning also needs text.
- **Content:** use realistic field lengths, dates and quantities. Name actions specifically. Avoid empty slogans, invented performance numbers and charts that don't help the task.
- **Typography:** use a small consistent hierarchy, readable line lengths and tabular numerals for amounts. Long labels must wrap or have an accessible full-text path.
- **Responsive layout:** decide what stacks, wraps or stays in a scrollable region. A comparison table may scroll inside a labelled focusable region; the page itself must not overflow. Never silently drop essential data.
- **Motion/materials:** animate changes that need explanation. Follow reduced-motion and contrast preferences. Translucency is limited to appropriate navigation surfaces, not a substitute for hierarchy.

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


# Reviewed local workflow examples

The following files are reviewed client-side local demonstrations, not package exports, private URLs, or backend examples. Read the smallest relevant file; rebuild and run npm run ai:check before relying on a local checkout.

## examples/Invoices.tsx

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, DataTable, EmptyState, Select, TextField, useAsyncAction } from '@serein-ui/react';
import Shell, { focusId } from './Shell';
import { filterInvoices, invoices, money, pause, type Invoice } from './model';
function InvoiceDetail({ invoice, close }: { invoice: Invoice; close: () => void }) {
  const [fail, setFail] = useState(false);
  const action = useAsyncAction(async signal => { await pause(); if (signal.aborted) return; if (fail) { setFail(false); throw new Error('Demo delivery failure'); } });
  useEffect(() => focusId('invoice-detail-heading'), []);
  return <section className="invoice-detail" aria-labelledby="invoice-detail-heading"><div className="workflow-section-heading"><h2 id="invoice-detail-heading" tabIndex={-1}>{invoice.id} · {invoice.client}</h2><Button variant="quiet" onClick={close}>Close details</Button></div><dl className="workflow-facts"><div><dt>Bill to</dt><dd>{invoice.email}</dd></div><div><dt>Due</dt><dd>{invoice.due}</dd></div><div><dt>Status</dt><dd>{invoice.status}</dd></div><div><dt>Total</dt><dd>{money(invoice.amount)}</dd></div></dl><p>{invoice.item}</p>
    {invoice.status === 'Paid' ? <p>This invoice is paid. No reminder is needed.</p> : <><h3>Reminder preview</h3><p>Hello {invoice.client}, this is a reminder for {invoice.id}, {money(invoice.amount)}, due {invoice.due}. Thank you.</p><p className="workflow-muted">A local simulation only. Nothing will be sent to {invoice.email}.</p><Checkbox label="Fail the next reminder" checked={fail} onCheckedChange={setFail} disabled={action.state === 'pending' || action.state === 'success'} /><div className="workflow-actions"><Button loading={action.state === 'pending'} disabled={action.state === 'success'} onClick={action.run}>{action.state === 'error' ? 'Retry reminder' : action.state === 'success' ? 'Reminder simulated' : 'Simulate reminder'}</Button></div><p role="status">{action.state === 'pending' ? 'Simulating reminder…' : action.state === 'success' ? 'Reminder simulation complete. No email was sent.' : ''}</p>{action.state === 'error' && <p role="alert" className="workflow-error">The simulation failed. No reminder was recorded. Retry to complete it.</p>}</>}
  </section>;
}
export default function Invoices() {
  const [query, setQuery] = useState(''); const [status, setStatus] = useState('All'); const [selected, setSelected] = useState<Invoice | null>(null); const trigger = useRef<HTMLButtonElement | null>(null);
  const visible = filterInvoices(invoices, query, status);
  return <Shell title="Invoices" description="Review fictional client invoices and try a reminder. Sample snapshot: 28 September 2026; amounts in USD."><div className="workflow-filters"><TextField label="Search invoices" placeholder="Client or invoice number" value={query} onChange={e => setQuery(e.target.value)} /><Select label="Invoice status" value={status} onValueChange={setStatus} options={['All', 'Overdue', 'Open', 'Paid'].map(x => ({ value: x, label: x }))} /></div><p role="status" className="workflow-muted">{visible.length} of {invoices.length} invoices</p>
    {visible.length > 0 && <p className="workflow-table-hint workflow-muted" id="invoice-scroll-hint">Scroll the table horizontally to see every column.</p>}
    {visible.length ? <DataTable caption="Sample invoices, as of 28 September 2026" rows={visible} rowKey={invoice => invoice.id} columns={[
      { key: 'client', header: 'Invoice / client', cell: invoice => <><Button variant="quiet" aria-expanded={selected?.id === invoice.id} onClick={e => { trigger.current = e.currentTarget; setSelected(invoice); }}>{invoice.id}</Button><span className="invoice-client">{invoice.client}</span></> },
      { key: 'due', header: 'Due', cell: invoice => invoice.due },
      { key: 'status', header: 'Status', cell: invoice => invoice.status },
      { key: 'amount', header: 'Amount', cell: invoice => money(invoice.amount) },
    ]} /> : <EmptyState title="No matching invoices" description="Try a different client or status, or show all sample invoices." action={<Button onClick={() => { setQuery(''); setStatus('All'); }}>Reset filters</Button>} />}
    {selected && <InvoiceDetail key={selected.id} invoice={selected} close={() => { setSelected(null); requestAnimationFrame(() => trigger.current?.isConnected ? trigger.current.focus() : document.getElementById('workflow-main')?.focus()); }} />}
  </Shell>;
}
```

## examples/Settings.tsx

```tsx
import { useState } from 'react';
import { Button, Checkbox, Select, TextField, useAsyncAction } from '@serein-ui/react';
import Shell, { Recovery, focusId } from './Shell';
import { defaults, parseSettings, pause, readRecord, saveRecord, timezones, validateName } from './model';
export default function Settings() {
  const [initial] = useState(() => readRecord('settings', parseSettings));
  const [saved, setSaved] = useState(initial.value ?? defaults);
  const [draft, setDraft] = useState(saved);
  const [blocked, setBlocked] = useState(initial.error);
  const [error, setError] = useState('');
  const [fail, setFail] = useState(false);
  const action = useAsyncAction(async signal => {
    const next = { ...draft, name: draft.name.trim() }; await pause(); if (signal.aborted) return;
    if (fail) { setFail(false); throw new Error('Demo failure'); }
    saveRecord(localStorage, 'settings', next); setSaved(next); setDraft(next);
  });
  const pending = action.state === 'pending';
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  function edit(next: typeof draft) { setDraft(next); if (error) setError(validateName(next.name)); action.reset(); }
  return <Shell title="Settings" description="Make this local workspace your own. Saved preferences stay in this browser.">
    {blocked && <Recovery onRecover={() => { setBlocked(false); focusId('settings-name'); }} />}
    <form className="workflow-form" noValidate onSubmit={e => { e.preventDefault(); if (pending || blocked) return; const message = validateName(draft.name); setError(message); if (message) { focusId('settings-name'); return; } action.run(); }}>
      <fieldset disabled={pending}><legend>Profile &amp; region</legend><p className="workflow-muted">Choose the name and time zone used in this demonstration.</p><TextField id="settings-name" label="Display name" value={draft.name} error={error} onChange={e => edit({ ...draft, name: e.target.value })} autoComplete="name" /><Select label="Time zone" value={draft.timezone} onValueChange={timezone => edit({ ...draft, timezone })} options={timezones.map(zone => ({ value: zone, label: zone }))} disabled={pending} /></fieldset>
      <fieldset disabled={pending}><legend>Notifications</legend><Checkbox label="Weekly activity summary" description="Save your preference only. No messages are sent." checked={draft.notifications} onCheckedChange={notifications => edit({ ...draft, notifications })} disabled={pending} /></fieldset>
      <details className="workflow-demo"><summary>Try a save failure</summary><Checkbox label="Fail the next save" description="One attempt fails; retry keeps your edits." checked={fail} onCheckedChange={setFail} disabled={pending} /></details>
      <div className="workflow-actions"><Button type="submit" loading={pending} disabled={blocked}>{action.state === 'error' ? 'Retry save' : 'Save settings'}</Button><Button variant="secondary" disabled={pending || !dirty} onClick={() => { setDraft(saved); setError(''); action.reset(); focusId('settings-name'); }}>Reset changes</Button></div>
      <p role="status">{pending ? 'Saving locally…' : action.state === 'success' ? 'Settings saved in this browser.' : dirty ? 'You have unsaved changes.' : 'No unsaved changes.'}</p>
      {action.state === 'error' && <p role="alert" className="workflow-error">Settings were not saved. Your edits are still here. Retry; if storage is blocked or full, enable it or free space first.</p>}
    </form>
  </Shell>;
}
```

## examples/Onboarding.tsx

```tsx
import { useState } from 'react';
import { Button, Checkbox, TextField, useAsyncAction } from '@serein-ui/react';
import Shell, { Recovery, focusId } from './Shell';
import { parseWorkspace, pause, readRecord, saveRecord, storageKey, validateName } from './model';
export default function Onboarding() {
  const [initial] = useState(() => readRecord('onboarding', parseWorkspace));
  const [draft, setDraft] = useState(initial.value ?? { name: '', digest: true });
  const [complete, setComplete] = useState(!!initial.value); const [blocked, setBlocked] = useState(initial.error);
  const [step, setStep] = useState(0); const [error, setError] = useState(''); const [restartError, setRestartError] = useState(false); const [fail, setFail] = useState(false);
  const action = useAsyncAction(async signal => { await pause(); if (signal.aborted) return; if (fail) { setFail(false); throw new Error('Demo failure'); } saveRecord(localStorage, 'onboarding', { ...draft, name: draft.name.trim() }); setComplete(true); focusId('onboarding-complete'); });
  function move(next: number) { setStep(next); action.reset(); focusId('onboarding-step'); }
  const pending = action.state === 'pending';
  function restart() { try { localStorage.removeItem(storageKey('onboarding')); setComplete(false); setDraft({ name: '', digest: true }); setStep(0); setError(''); setRestartError(false); action.reset(); focusId('workspace-name'); } catch { setRestartError(true); } }
  return <Shell title="Set up your workspace" description="A three-step local example. No account or real workspace is created.">
    {blocked && <Recovery onRecover={() => { setBlocked(false); focusId(step === 0 ? 'workspace-name' : 'onboarding-step'); }} />}
    {complete ? <section className="workflow-complete"><h2 id="onboarding-complete" tabIndex={-1}>{draft.name} is ready to explore</h2><p>Your example setup is saved in this browser. Weekly summary preference: {draft.digest ? 'on' : 'off'}.</p><div className="workflow-actions"><a href="?view=catalogue">Explore the component catalogue</a><Button variant="secondary" onClick={restart}>Restart setup</Button></div>{restartError && <p role="alert" className="workflow-error">Could not clear saved setup. Enable browser storage, then retry restart.</p>}</section> : <>
    <ol className="workflow-steps" aria-label="Setup progress">{['Workspace', 'Preferences', 'Review'].map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined}>{index + 1}. {label}{index < step ? ' · Done' : ''}</li>)}</ol>
    <form className="workflow-form" noValidate onSubmit={e => { e.preventDefault(); if (pending) return; if (step === 0) { const message = validateName(draft.name); setError(message); if (message) { focusId('workspace-name'); return; } setDraft({ ...draft, name: draft.name.trim() }); } if (step < 2) move(step + 1); else if (!blocked) action.run(); }}>
      <h2 id="onboarding-step" tabIndex={-1}>{['Name your workspace', 'Choose your preferences', 'Review your setup'][step]}</h2>
      {step === 0 && <><p className="workflow-muted">Use a team or project name. You can return to edit it before finishing.</p><TextField id="workspace-name" label="Workspace name" value={draft.name} error={error} onChange={e => { setDraft({ ...draft, name: e.target.value }); if (error) setError(validateName(e.target.value)); }} autoComplete="organization" /></>}
      {step === 1 && <Checkbox label="Weekly workspace summary" description="This saves a preference only; no notifications are delivered." checked={draft.digest} onCheckedChange={digest => setDraft({ ...draft, digest })} />}
      {step === 2 && <><dl className="workflow-facts"><div><dt>Workspace</dt><dd>{draft.name}</dd></div><div><dt>Weekly summary</dt><dd>{draft.digest ? 'On' : 'Off'}</dd></div></dl><p className="workflow-muted">Finishing saves this example setup locally. Reloading returns to the completion screen.</p><details className="workflow-demo"><summary>Try a completion failure</summary><Checkbox label="Fail the next completion" checked={fail} onCheckedChange={setFail} disabled={pending} /></details></>}
      <div className="workflow-actions">{step > 0 && <Button variant="secondary" disabled={pending} onClick={() => move(step - 1)}>Back</Button>}<Button type="submit" loading={pending} disabled={step === 2 && blocked}>{step < 2 ? 'Continue' : action.state === 'error' ? 'Retry completion' : 'Finish local setup'}</Button></div><p role="status">{pending ? 'Saving local setup…' : 'Unfinished steps are kept only while this page is open.'}</p>{action.state === 'error' && <p role="alert" className="workflow-error">Setup was not saved. Your choices are still here. Retry; if browser storage is blocked or full, enable it or free space first.</p>}
    </form></>}
  </Shell>;
}
```

## examples/Shell.tsx

```tsx
import { useEffect, useState, type ReactNode } from 'react';
import { Button } from '@serein-ui/react';
import './workflows.css';
export default function Shell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark');
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; document.title = `${title} · Serein`; }, [dark, title]);
  return <div className="workflow"><a className="skip-link" href="#workflow-main">Skip to content</a><header className="workflow-header"><a className="wordmark" href="?view=catalogue">Serein</a><a href="?view=catalogue">Back to catalogue</a><Button variant="quiet" onClick={() => setDark(!dark)}>{dark ? 'Use light theme' : 'Use dark theme'}</Button></header><main id="workflow-main" tabIndex={-1}><header className="workflow-intro"><h1>{title}</h1><p>{description}</p></header>{children}</main><footer className="workflow-footer">Local demonstration · No accounts, payments or email delivery.</footer></div>;
}
export function Recovery({ onRecover }: { onRecover: () => void }) { return <div className="workflow-notice" role="alert"><p>Saved data could not be read. It may be damaged, from another version, or browser storage may be unavailable. Existing data has not been changed.</p><Button variant="secondary" onClick={onRecover}>Allow replacement on next save</Button><p>This permits the next successful save to replace the saved record with the values shown.</p></div>; }
export function focusId(id: string) { requestAnimationFrame(() => document.getElementById(id)?.focus()); }
```

## examples/model.ts

```tsx
export const timezones = ['Asia/Kolkata', 'Europe/London', 'America/New_York'] as const;
export type Settings = { name: string; timezone: string; notifications: boolean };
export type Workspace = { name: string; digest: boolean };
export const defaults: Settings = { name: 'Alex Morgan', timezone: 'Asia/Kolkata', notifications: true };
export function validateName(value: string) { return !value.trim() ? 'Enter a name.' : value.trim().length > 80 ? 'Use 80 characters or fewer.' : ''; }
export function parseSettings(raw: string): Settings {
  const x = JSON.parse(raw);
  if (!x || x.version !== 1 || typeof x.name !== 'string' || validateName(x.name) || !timezones.includes(x.timezone) || typeof x.notifications !== 'boolean') throw new Error('Invalid settings');
  return { name: x.name, timezone: x.timezone, notifications: x.notifications };
}
export function parseWorkspace(raw: string): Workspace {
  const x = JSON.parse(raw);
  if (!x || x.version !== 1 || typeof x.name !== 'string' || validateName(x.name) || typeof x.digest !== 'boolean') throw new Error('Invalid workspace');
  return { name: x.name, digest: x.digest };
}
export const storageKey = (kind: string) => `ritam-ui.examples.${kind}`;
export function saveRecord(storage: Pick<Storage, 'setItem'>, kind: string, value: Settings | Workspace) { storage.setItem(storageKey(kind), JSON.stringify({ version: 1, ...value })); }
export function readRecord<T>(kind: string, parse: (raw: string) => T): { value: T | null; error: boolean } {
  try { const raw = localStorage.getItem(storageKey(kind)); return { value: raw === null ? null : parse(raw), error: false }; } catch { return { value: null, error: true }; }
}
export const pause = () => new Promise<void>(resolve => setTimeout(resolve, 650));
export type Invoice = { id: string; client: string; email: string; amount: number; due: string; status: 'Overdue' | 'Open' | 'Paid'; item: string };
export const invoices: Invoice[] = [
  { id: 'INV-1042', client: 'North Studio', email: 'billing@north.example', amount: 2400, due: '14 Sep 2026', status: 'Overdue', item: 'Brand identity · final delivery' },
  { id: 'INV-1043', client: 'Fieldwork', email: 'hello@fieldwork.example', amount: 1850, due: '30 Sep 2026', status: 'Open', item: 'Website design · September' },
  { id: 'INV-1044', client: 'Common Ground', email: 'team@common.example', amount: 960, due: '10 Sep 2026', status: 'Paid', item: 'Editorial templates' },
];
export function filterInvoices(records: Invoice[], query: string, status: string) { return records.filter(x => (status === 'All' || x.status === status) && `${x.id} ${x.client}`.toLowerCase().includes(query.trim().toLowerCase())); }
export const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
```

## examples/workflows.css

```css
.workflow { min-height: 100vh; }
.workflow-header { display: flex; align-items: center; flex-wrap: wrap; gap: 1rem 1.5rem; padding: 1rem max(1.25rem, calc((100% - 1120px) / 2)); border-bottom: 1px solid var(--sr-color-line); }
.workflow-header > button { margin-left: auto; }
.workflow a { color: var(--sr-color-ink); text-underline-offset: .2em; }
.workflow a:hover { color: var(--sr-color-signal-ink); }
.workflow main { width: min(1120px, calc(100% - 2.5rem)); margin: 0 auto; padding: 2.5rem 0; }
.workflow h1 { font-size: 2rem; line-height: 1.2; letter-spacing: -.03em; }
.workflow h2 { font-size: 1.25rem; line-height: 1.4; }
.workflow h3 { font-size: 1rem; margin: 1.5rem 0 .5rem; }
.workflow p { max-width: 70ch; line-height: 1.6; }
.workflow-intro { margin-bottom: 2rem; }
.workflow-intro > p, .workflow-muted, .workflow-footer { color: var(--sr-color-ink-muted); }
.workflow-form { max-width: 640px; }
.workflow-form fieldset { border: 0; border-bottom: 1px solid var(--sr-color-line); padding: 0 0 1.75rem; margin: 0 0 1.75rem; display: grid; gap: 1rem; min-width: 0; }
.workflow-form legend { padding: 0; margin-bottom: .75rem; font-size: 1.25rem; font-weight: 700; }
.workflow-form fieldset > p { margin: 0; }
.workflow-actions { display: flex; align-items: center; flex-wrap: wrap; gap: .75rem; margin: 1.5rem 0 1rem; }
.workflow-error { color: var(--sr-color-danger); }
.workflow-notice { max-width: 70ch; padding: 1.25rem; border: 1px solid var(--sr-color-line-strong); background: var(--sr-color-surface-raised); margin-bottom: 2rem; }
.workflow-notice p:last-child { margin: .75rem 0 0; font-size: .875rem; }
.workflow-demo { margin: 1.5rem 0; }
.workflow-demo summary { cursor: pointer; min-height: 44px; display: list-item; padding: .75rem 0; font-size: .875rem; }
.workflow-filters { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 1rem; max-width: 720px; margin-bottom: 1rem; }
.workflow table { width: 100%; border-collapse: collapse; text-align: left; font-size: .9375rem; font-variant-numeric: tabular-nums; }
.workflow th { font-size: .8125rem; color: var(--sr-color-ink-muted); font-weight: 600; }
.workflow th, .workflow td { padding: 1rem .75rem; white-space: nowrap; }
.workflow th:last-child, .workflow td:last-child { text-align: right; }
.workflow td:first-child button { padding-inline: 0; }
.invoice-client { display: block; }
.invoice-detail { margin-top: 2rem; border-top: 1px solid var(--sr-color-line-strong); padding-top: 1.5rem; }
.workflow-section-heading { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .5rem; }
.workflow-facts { display: flex; flex-wrap: wrap; gap: 1.5rem 3rem; margin: 1.5rem 0; }
.workflow-facts dt { color: var(--sr-color-ink-muted); font-size: .8125rem; margin-bottom: .4rem; }
.workflow-facts dd { margin: 0; font-weight: 600; overflow-wrap: anywhere; }
.workflow-facts > div { min-width: 0; }
.workflow-steps { display: flex; flex-wrap: wrap; gap: .75rem 2rem; list-style: none; margin: 0 0 2rem; padding: 0 0 1.5rem; border-bottom: 1px solid var(--sr-color-line); color: var(--sr-color-ink-muted); }
.workflow-steps [aria-current] { color: var(--sr-color-ink); font-weight: 750; text-decoration: underline; text-underline-offset: .5em; }
.workflow-complete { max-width: 640px; padding-block: 1rem; }
.workflow-footer { width: min(1120px, calc(100% - 2.5rem)); margin: 0 auto; padding: 1.5rem 0; border-top: 1px solid var(--sr-color-line); font-size: .8125rem; line-height: 1.6; }
@media (max-width: 600px) { .workflow-header { gap: .5rem 1rem; } .workflow-header .wordmark { width: 100%; } .workflow-header > button { margin-left: 0; } .workflow main { padding-top: 1.75rem; } .workflow-filters { grid-template-columns: 1fr; } .workflow th, .workflow td { padding: .75rem; } .workflow h1 { font-size: 1.75rem; } }

.workflow-table-hint { display: none; font-size: .8125rem; }
@media (max-width: 600px) { .workflow-table-hint { display: block; } }

.workflow .skip-link { color: var(--sr-color-surface); }
```

## examples/README.md

```md
# Reviewed client-side workflow examples

These files are reviewed, runnable local demonstrations, not package exports or backend integrations. Read only the example relevant to the task, together with [COMPOSITION.md](../COMPOSITION.md), [README.md](../README.md), and the [generated contract](../contract.json).

- Invoices.tsx: records, filtering, detail focus return, and simulated reminder recovery.
- Settings.tsx: grouped local preferences, validation, failure recovery, and retained input.
- Onboarding.tsx: sequential local setup, review, completion, and restart recovery.
- Shell.tsx and workflows.css: the shared semantic shell and layout treatment.
- model.ts: fictional fixture data, validation, storage boundaries, and simulated latency.

These files are the source of truth. Run pnpm build to regenerate the contract and full-text guide from them; pnpm ai:check verifies freshness.
```

# Exact public TypeScript declarations

## StatusIcon.d.ts

```tsx
import type { SVGProps } from 'react';
export type AsyncVisualState = 'idle' | 'pending' | 'success' | 'error';
export type StatusIconKind = 'send' | 'payment' | 'loading';
export interface StatusIconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
    state: AsyncVisualState;
    kind?: StatusIconKind;
    size?: number;
}
export declare function StatusIcon({ state, kind, size, className, ...props }: StatusIconProps): import("react").JSX.Element;
```

## calendar.d.ts

```tsx
import { TZDate } from '@daypicker/react';
export type CalendarProps = {
    label: string;
    value: string | null;
    onValueChange: (value: string | null) => void;
    defaultMonth?: string;
    min?: string;
    max?: string;
    disabledDates?: string[];
    disabled?: boolean;
    today?: string;
    autoFocus?: boolean;
};
export type CalendarRangeProps = Omit<CalendarProps, 'value' | 'onValueChange'> & {
    value: DateRangeValue;
    onValueChange: (value: DateRangeValue) => void;
};
export type DateRangeValue = {
    from: string | null;
    to: string | null;
};
export declare function parseISODate(value: string | null | undefined): TZDate | undefined;
export declare function formatISODate(date: Date | undefined): string | null;
export declare function Calendar({ label, value, onValueChange, defaultMonth, min, max, disabledDates, disabled, today, autoFocus }: CalendarProps): import("react").JSX.Element;
export declare function CalendarRange({ label, value, onValueChange, defaultMonth, min, max, disabledDates, disabled, today, autoFocus }: CalendarRangeProps): import("react").JSX.Element;
```

## command-palette.d.ts

```tsx
export type CommandItem = {
    id: string;
    label: string;
    description?: string;
    keywords?: string[];
    disabled?: boolean;
    onSelect: () => void;
};
export type CommandPaletteProps = {
    triggerLabel?: string;
    title?: string;
    description?: string;
    items: CommandItem[];
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    placeholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
};
export declare function CommandPalette({ triggerLabel, title, description, items, open, defaultOpen, onOpenChange, placeholder, emptyMessage, disabled, }: CommandPaletteProps): import("react").JSX.Element;
```

## components.d.ts

```tsx
import { type ReactNode, type ComponentProps } from 'react';
type NativeButtonProps = Omit<ComponentProps<'button'>, 'color'>;
export type ButtonProps = NativeButtonProps & {
    variant?: 'primary' | 'secondary' | 'quiet';
    loading?: boolean;
};
export declare function Button({ variant, loading, disabled, children, className, ...props }: ButtonProps): import("react").JSX.Element;
export type TextFieldProps = Omit<ComponentProps<'input'>, 'size'> & {
    label: string;
    description?: string;
    error?: string;
};
export declare function TextField({ label, description, error, id: givenId, ...props }: TextFieldProps): import("react").JSX.Element;
export type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
};
export type SelectProps = {
    label: string;
    value: string | null;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    disabled?: boolean;
    name?: string;
    placeholder?: string;
    description?: string;
    error?: string;
};
export declare function Select({ label, value, onValueChange, options, disabled, name, placeholder, description, error }: SelectProps): import("react").JSX.Element;
export type DialogProps = {
    triggerLabel: string;
    title: string;
    description: string;
    children: ReactNode;
    confirmLabel?: string;
    onConfirm?: () => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
};
export declare function Dialog({ triggerLabel, title, description, children, confirmLabel, onConfirm, open, defaultOpen, onOpenChange }: DialogProps): import("react").JSX.Element;
export {};
```

## data-table.d.ts

```tsx
import { type ReactNode } from 'react';
export type TableSort = {
    key: string;
    direction: 'asc' | 'desc';
} | null;
export type DataTableColumn<Row> = {
    key: string;
    header: string;
    cell: (row: Row) => ReactNode;
    sortValue?: (row: Row) => string | number | null | undefined;
};
export type DataTableProps<Row> = {
    caption: string;
    rows: Row[];
    columns: DataTableColumn<Row>[];
    rowKey: (row: Row) => string;
    /** Omit to let the table manage its sort; pass null for a controlled unsorted table. */
    sort?: TableSort;
    onSortChange?: (sort: TableSort) => void;
    loading?: boolean;
    emptyMessage?: string;
};
/** Semantic client-side table. Compose Pagination externally; no virtualization or server query is implied. */
export declare function DataTable<Row>({ caption, rows, columns, rowKey, sort: controlledSort, onSortChange, loading, emptyMessage }: DataTableProps<Row>): import("react").JSX.Element;
```

## date-pickers.d.ts

```tsx
import { type CalendarProps, type DateRangeValue } from './calendar';
export type { DateRangeValue } from './calendar';
type PickerMessages = {
    description?: string;
    error?: string;
    name?: string;
    placeholder?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    id?: string;
};
export type DatePickerProps = CalendarProps & PickerMessages;
export type DateRangePickerProps = Omit<CalendarProps, 'value' | 'onValueChange'> & Omit<PickerMessages, 'name'> & {
    value: DateRangeValue;
    onValueChange: (value: DateRangeValue) => void;
    startName?: string;
    endName?: string;
};
export declare function DatePicker({ label, value, onValueChange, description, error, name, placeholder, open, defaultOpen, onOpenChange, id: suppliedId, disabled, ...calendar }: DatePickerProps): import("react").JSX.Element;
export declare function DateRangePicker({ label, value, onValueChange, description, error, startName, endName, placeholder, open, defaultOpen, onOpenChange, id: suppliedId, disabled, ...calendar }: DateRangePickerProps): import("react").JSX.Element;
```

## feedback.d.ts

```tsx
import { type ComponentProps, type ReactNode } from 'react';
export type FeedbackTone = 'neutral' | 'success' | 'error' | 'warning';
export type BadgeProps = {
    children: ReactNode;
    tone?: FeedbackTone;
};
export declare function Badge({ children, tone }: BadgeProps): import("react").JSX.Element;
export type AlertProps = {
    title: string;
    children?: ReactNode;
    tone?: FeedbackTone;
    live?: 'off' | 'polite' | 'assertive';
};
export declare function Alert({ title, children, tone, live }: AlertProps): import("react").JSX.Element;
export type AvatarProps = {
    name: string;
    src?: string;
    size?: number;
};
export declare function Avatar({ name, src, size }: AvatarProps): import("react").JSX.Element;
export type CardProps = ComponentProps<'div'>;
/** Noninteractive surface; compose links or buttons inside instead of nesting interactive cards. */
export declare function Card({ className, ...props }: CardProps): import("react").JSX.Element;
export type SeparatorProps = ComponentProps<'hr'>;
export declare function Separator({ className, ...props }: SeparatorProps): import("react").JSX.Element;
export type SkeletonProps = {
    width?: number | string;
    height?: number;
    label?: string;
};
export declare function Skeleton({ width, height, label }: SkeletonProps): import("react").JSX.Element;
export type ProgressProps = {
    label: string;
    value?: number;
    max?: number;
};
export declare function Progress({ label, value, max }: ProgressProps): import("react").JSX.Element;
export type SpinnerProps = {
    label: string;
};
export declare function Spinner({ label }: SpinnerProps): import("react").JSX.Element;
export type EmptyStateProps = {
    title: string;
    description: string;
    action?: ReactNode;
};
export declare function EmptyState({ title, description, action }: EmptyStateProps): import("react").JSX.Element;
export type ToastOptions = {
    title: string;
    description?: string;
    tone?: FeedbackTone;
    timeout?: number;
    priority?: 'low' | 'high';
};
export type ToastController = {
    add: (options: ToastOptions) => string;
    dismiss: (id?: string) => void;
    update: (id: string, options: Partial<ToastOptions>) => void;
};
/** Must be called beneath ToastProvider. Use timeout:0 for messages that require user acknowledgement. */
export declare function useToast(): ToastController;
export type ToastProviderProps = {
    children: ReactNode;
    timeout?: number;
    limit?: number;
};
export declare function ToastProvider({ children, timeout, limit }: ToastProviderProps): import("react").JSX.Element;
```

## fonts.d.ts

```tsx
export {};
```

## forms.d.ts

```tsx
import { type ComponentProps } from 'react';
type FieldMessagesProps = {
    description?: string;
    error?: string;
};
export type TextareaProps = Omit<ComponentProps<'textarea'>, 'size'> & FieldMessagesProps & {
    label: string;
};
export declare function Textarea({ label, description, error, id: suppliedId, className, ...props }: TextareaProps): import("react").JSX.Element;
export type NumberFieldProps = FieldMessagesProps & {
    label: string;
    value: number | null;
    onValueChange: (value: number | null) => void;
    min?: number;
    max?: number;
    step?: number | 'any';
    disabled?: boolean;
    required?: boolean;
    name?: string;
    id?: string;
};
export declare function NumberField({ label, value, onValueChange, description, error, id: suppliedId, disabled, ...props }: NumberFieldProps): import("react").JSX.Element;
export type SliderProps = FieldMessagesProps & {
    label: string;
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    name?: string;
    id?: string;
};
export declare function Slider({ label, value, onValueChange, description, error, disabled, ...props }: SliderProps): import("react").JSX.Element;
export type ComboboxOption = {
    value: string;
    label: string;
    disabled?: boolean;
};
export type ComboboxProps = FieldMessagesProps & {
    label: string;
    value: string | null;
    onValueChange: (value: string | null) => void;
    options: ComboboxOption[];
    disabled?: boolean;
    name?: string;
    id?: string;
    placeholder?: string;
};
export declare function Combobox({ label, value, onValueChange, options, description, error, disabled, id: suppliedId, placeholder, ...props }: ComboboxProps): import("react").JSX.Element;
export type ToggleGroupOption = {
    value: string;
    label: string;
    disabled?: boolean;
};
export type ToggleGroupProps = FieldMessagesProps & {
    label: string;
    value: string[];
    onValueChange: (value: string[]) => void;
    options: ToggleGroupOption[];
    disabled?: boolean;
    multiple?: boolean;
    orientation?: 'horizontal' | 'vertical';
    id?: string;
};
export declare function ToggleGroup({ label, value, onValueChange, options, description, error, disabled, multiple, orientation, id: suppliedId }: ToggleGroupProps): import("react").JSX.Element;
export type DateFieldProps = Omit<ComponentProps<'input'>, 'type' | 'size' | 'value' | 'onChange'> & FieldMessagesProps & {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
};
export declare function DateField({ label, value, onValueChange, description, error, id: suppliedId, className, ...props }: DateFieldProps): import("react").JSX.Element;
export type FileUploadProps = Omit<ComponentProps<'input'>, 'type' | 'size' | 'onChange' | 'value' | 'defaultValue'> & FieldMessagesProps & {
    label: string;
    onFilesChange?: (files: FileList | null) => void;
};
export declare function FileUpload({ label, onFilesChange, description, error, id: suppliedId, className, ...props }: FileUploadProps): import("react").JSX.Element;
export {};
```

## index.d.ts

```tsx
export { Button, TextField, Select, Dialog } from './components';
export type { ButtonProps, TextFieldProps, SelectProps, SelectOption, DialogProps } from './components';
export { StatusIcon } from './StatusIcon';
export type { StatusIconProps, AsyncVisualState, StatusIconKind } from './StatusIcon';
export { useAsyncAction } from './useAsyncAction';
export type { AsyncActionController } from './useAsyncAction';
export { Tabs } from './tabs';
export type { TabsProps } from './tabs';
export { Checkbox, Switch, RadioGroup } from './selection';
export type { CheckboxProps, SwitchProps, RadioGroupProps, RadioOption } from './selection';
export { Textarea, NumberField, Slider, Combobox, ToggleGroup, DateField, FileUpload } from './forms';
export type { TextareaProps, NumberFieldProps, SliderProps, ComboboxProps, ComboboxOption, ToggleGroupProps, ToggleGroupOption, DateFieldProps, FileUploadProps } from './forms';
export { Tooltip, Popover, DropdownMenu, AlertDialog, Drawer, Accordion } from './overlays';
export type { OverlayOpenProps, TooltipProps, PopoverProps, DropdownMenuProps, DropdownMenuItem, AlertDialogProps, DrawerProps, AccordionProps, AccordionItem } from './overlays';
export { Badge, Alert, Avatar, Card, Separator, Skeleton, Progress, Spinner, EmptyState, ToastProvider, useToast } from './feedback';
export type { FeedbackTone, BadgeProps, AlertProps, AvatarProps, CardProps, SeparatorProps, SkeletonProps, ProgressProps, SpinnerProps, EmptyStateProps, ToastProviderProps, ToastOptions, ToastController } from './feedback';
export { Link, IconButton, Breadcrumbs, Pagination } from './navigation';
export type { LinkProps, IconButtonProps, BreadcrumbsProps, PaginationProps } from './navigation';
export { DataTable } from './data-table';
export type { DataTableProps, DataTableColumn, TableSort } from './data-table';
export { CommandPalette } from './command-palette';
export type { CommandPaletteProps, CommandItem } from './command-palette';
export { MultiSelect } from './multi-select';
export type { MultiSelectProps, MultiSelectOption } from './multi-select';
export { Calendar } from './calendar';
export type { CalendarProps, DateRangeValue } from './calendar';
export { DatePicker, DateRangePicker } from './date-pickers';
export type { DatePickerProps, DateRangePickerProps } from './date-pickers';
```

## multi-select.d.ts

```tsx
export type MultiSelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
};
export type MultiSelectProps = {
    label: string;
    value: string[];
    onValueChange: (value: string[]) => void;
    options: MultiSelectOption[];
    description?: string;
    error?: string;
    disabled?: boolean;
    name?: string;
    id?: string;
    placeholder?: string;
    emptyMessage?: string;
};
export declare function MultiSelect({ label, value, onValueChange, options, description, error, disabled, name, id: suppliedId, placeholder, emptyMessage }: MultiSelectProps): import("react").JSX.Element;
```

## navigation.d.ts

```tsx
import type { ComponentProps, ReactNode } from 'react';
import { type ButtonProps } from './components';
export type LinkProps = ComponentProps<'a'> & {
    href: string;
};
/** Uses a native anchor so routing, modifier clicks and downloads retain browser behaviour. */
export declare function Link({ className, target, rel, ...props }: LinkProps): import("react").JSX.Element;
export type IconButtonProps = Omit<ButtonProps, 'children' | 'aria-label' | 'aria-labelledby'> & {
    label: string;
    children: ReactNode;
};
export declare function IconButton({ label, children, className, variant, ...props }: IconButtonProps): import("react").JSX.Element;
export type BreadcrumbsProps = {
    label?: string;
    items: {
        label: string;
        href?: string;
    }[];
};
export declare function Breadcrumbs({ label, items }: BreadcrumbsProps): import("react").JSX.Element;
export type PaginationProps = {
    page: number;
    pageCount: number;
    onPageChange: (page: number) => void;
    label?: string;
    disabled?: boolean;
};
export declare function Pagination({ page, pageCount, onPageChange, label, disabled }: PaginationProps): import("react").JSX.Element;
```

## overlays.d.ts

```tsx
import { type ReactElement, type ReactNode } from 'react';
export type TooltipProps = {
    content: ReactNode;
    children: ReactElement;
    disabled?: boolean;
};
export declare function Tooltip({ content, children, disabled }: TooltipProps): import("react").JSX.Element;
export type OverlayOpenProps = {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
};
export type PopoverProps = {
    triggerLabel: string;
    title: string;
    children: ReactNode;
} & OverlayOpenProps;
export declare function Popover({ triggerLabel, title, children, open, defaultOpen, onOpenChange }: PopoverProps): import("react").JSX.Element;
export type DropdownMenuItem = {
    label: string;
    onSelect?: () => void;
    disabled?: boolean;
};
export type DropdownMenuProps = {
    triggerLabel: string;
    items: DropdownMenuItem[];
} & OverlayOpenProps;
export declare function DropdownMenu({ triggerLabel, items, open, defaultOpen, onOpenChange }: DropdownMenuProps): import("react").JSX.Element;
export type AlertDialogProps = {
    triggerLabel: string;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel?: string;
    onConfirm: () => void;
    children?: ReactNode;
} & OverlayOpenProps;
export declare function AlertDialog({ triggerLabel, title, description, confirmLabel, cancelLabel, onConfirm, children, open, defaultOpen, onOpenChange }: AlertDialogProps): import("react").JSX.Element;
export type DrawerProps = {
    triggerLabel: string;
    title: string;
    description?: string;
    children: ReactNode;
    side?: 'left' | 'right';
} & OverlayOpenProps;
export declare function Drawer({ triggerLabel, title, description, children, side, open, defaultOpen, onOpenChange }: DrawerProps): import("react").JSX.Element;
export type AccordionItem = {
    value: string;
    label: string;
    content: ReactNode;
    disabled?: boolean;
};
export type AccordionProps = {
    label: string;
    items: AccordionItem[];
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    multiple?: boolean;
};
export declare function Accordion({ label, items, value, defaultValue, onValueChange, multiple }: AccordionProps): import("react").JSX.Element;
```

## selection.d.ts

```tsx
type SelectionProps = {
    label: string;
    description?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    name?: string;
};
export type CheckboxProps = SelectionProps & {
    indeterminate?: boolean;
    hideLabel?: boolean;
};
export declare function Checkbox({ label, description, checked, onCheckedChange, disabled, name, indeterminate, hideLabel }: CheckboxProps): import("react").JSX.Element;
export type SwitchProps = SelectionProps;
export declare function Switch({ label, description, checked, onCheckedChange, disabled, name }: SwitchProps): import("react").JSX.Element;
export type RadioOption = {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
};
export type RadioGroupProps = {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: RadioOption[];
    disabled?: boolean;
    name?: string;
};
export declare function RadioGroup({ label, value, onValueChange, options, disabled, name }: RadioGroupProps): import("react").JSX.Element;
export {};
```

## styles.d.ts

```tsx
export {};
```

## tabs.d.ts

```tsx
import type { ReactNode } from 'react';
export type TabsProps = {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    items: {
        value: string;
        label: string;
        content: ReactNode;
        disabled?: boolean;
    }[];
};
/** Controlled tabs. Hidden panels stay mounted to preserve form state. */
export declare function Tabs({ label, value, onValueChange, items }: TabsProps): import("react").JSX.Element;
```

## useAsyncAction.d.ts

```tsx
import type { AsyncVisualState } from './StatusIcon';
export interface AsyncActionController {
    state: AsyncVisualState;
    run: () => void;
    cancel: () => void;
    reset: () => void;
}
export declare function useAsyncAction(action: (signal: AbortSignal) => Promise<void>): AsyncActionController;
```

# Theme tokens

```css
/* Serein tokens - generated from /tokens (DTCG 2025.10). Do not edit. */

:root {
  --sr-duration-fast: 100ms;
  --sr-duration-base: 180ms;
  --sr-duration-slow: 320ms;
  --sr-duration-rain: 1100ms;
  --sr-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --sr-easing-settle: cubic-bezier(0.16, 1, 0.3, 1);
  --sr-radius-tag: 4px;
  --sr-radius-control: 8px;
  --sr-radius-key: 12px;
  --sr-radius-popup: 12px;
  --sr-radius-panel: 14px;
  --sr-radius-sheet: 22px;
  --sr-size-target-min: 24px;
  --sr-size-control: 48px;
  --sr-size-control-compact: 36px;
  --sr-size-key: 56px;
  --sr-size-icon: 20px;
  --sr-size-focus-width: 2px;
  --sr-size-focus-offset: 2px;
  --sr-size-hairline: 1px;
  --sr-size-tick-minor: 6px;
  --sr-size-tick-major: 60px;
  --sr-size-gauge-unit: 4px;
  --sr-space-1: 4px;
  --sr-space-2: 8px;
  --sr-space-3: 12px;
  --sr-space-4: 16px;
  --sr-space-5: 24px;
  --sr-space-6: 32px;
  --sr-space-7: 48px;
  --sr-space-8: 64px;
  --sr-space-9: 96px;
  --sr-font-family-sans: "Anek Latin", "Noto Sans", system-ui, sans-serif;
  --sr-font-family-mono: "Chivo Mono", ui-monospace, "SFMono-Regular", monospace;
  --sr-font-weight-light: 300;
  --sr-font-weight-regular: 400;
  --sr-font-weight-medium: 500;
  --sr-font-weight-semibold: 600;
}

/* Light is the default; dark follows the system unless a theme is forced with data-theme. */
:root, [data-theme="light"] {
  color-scheme: light;
  --sr-color-surface: #f3f3f1;
  --sr-color-surface-raised: #ffffff;
  --sr-color-surface-sunken: #e9e9e6;
  --sr-color-surface-overlay: #ffffff;
  --sr-color-surface-hover: #f1f1ee;
  --sr-color-surface-pressed: #e6e6e2;
  --sr-color-ink: #0b0c0e;
  --sr-color-ink-muted: #575d66;
  --sr-color-line: #dfe0dd;
  --sr-color-line-strong: #868c95;
  --sr-color-focus: #0b0c0e;
  --sr-color-signal: #ff5a1f;
  --sr-color-signal-hover: #ff7440;
  --sr-color-signal-pressed: #e94d12;
  --sr-color-signal-edge: #b5350a;
  --sr-color-on-signal: #160600;
  --sr-color-signal-ink: #b5350a;
  --sr-color-signal-soft: #ffe6db;
  --sr-color-success: #127a3e;
  --sr-color-success-soft: #dff3e6;
  --sr-color-warning: #8a5800;
  --sr-color-warning-soft: #fbefd2;
  --sr-color-danger: #c2185b;
  --sr-color-danger-soft: #fbe1ea;
  --sr-color-on-danger: #ffffff;
  --sr-shadow-raised: 0 1px 2px 0 rgba(11, 12, 14, 0.06);
  --sr-shadow-key: inset 0 -1px 0 0 rgba(11, 12, 14, 0.08), 0 1px 2px 0 rgba(11, 12, 14, 0.06);
  --sr-shadow-overlay: 0 16px 40px 0 rgba(11, 12, 14, 0.14), 0 0 0 1px rgba(11, 12, 14, 0.06);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --sr-color-surface: #0b0c0e;
    --sr-color-surface-raised: #131518;
    --sr-color-surface-sunken: #07080a;
    --sr-color-surface-overlay: #1a1d21;
    --sr-color-surface-hover: #1c1f23;
    --sr-color-surface-pressed: #24282d;
    --sr-color-ink: #f3f4f6;
    --sr-color-ink-muted: #9aa1ab;
    --sr-color-line: #24282e;
    --sr-color-line-strong: #5f6773;
    --sr-color-focus: #f3f4f6;
    --sr-color-signal: #ff6a2c;
    --sr-color-signal-hover: #ff8752;
    --sr-color-signal-pressed: #ffa077;
    --sr-color-signal-edge: #ff6a2c;
    --sr-color-on-signal: #160600;
    --sr-color-signal-ink: #ff8752;
    --sr-color-signal-soft: #2e140a;
    --sr-color-success: #46d17f;
    --sr-color-success-soft: #0f2618;
    --sr-color-warning: #ffb224;
    --sr-color-warning-soft: #2b2009;
    --sr-color-danger: #ff5c8a;
    --sr-color-danger-soft: #2e0f19;
    --sr-color-on-danger: #1a040b;
    --sr-shadow-raised: inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
    --sr-shadow-key: inset 0 1px 0 0 rgba(255, 255, 255, 0.06), inset 0 -1px 0 0 rgba(0, 0, 0, 0.5);
    --sr-shadow-overlay: 0 16px 40px 0 rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06);
  }
}

[data-theme="dark"] {
  color-scheme: dark;
  --sr-color-surface: #0b0c0e;
  --sr-color-surface-raised: #131518;
  --sr-color-surface-sunken: #07080a;
  --sr-color-surface-overlay: #1a1d21;
  --sr-color-surface-hover: #1c1f23;
  --sr-color-surface-pressed: #24282d;
  --sr-color-ink: #f3f4f6;
  --sr-color-ink-muted: #9aa1ab;
  --sr-color-line: #24282e;
  --sr-color-line-strong: #5f6773;
  --sr-color-focus: #f3f4f6;
  --sr-color-signal: #ff6a2c;
  --sr-color-signal-hover: #ff8752;
  --sr-color-signal-pressed: #ffa077;
  --sr-color-signal-edge: #ff6a2c;
  --sr-color-on-signal: #160600;
  --sr-color-signal-ink: #ff8752;
  --sr-color-signal-soft: #2e140a;
  --sr-color-success: #46d17f;
  --sr-color-success-soft: #0f2618;
  --sr-color-warning: #ffb224;
  --sr-color-warning-soft: #2b2009;
  --sr-color-danger: #ff5c8a;
  --sr-color-danger-soft: #2e0f19;
  --sr-color-on-danger: #1a040b;
  --sr-shadow-raised: inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
  --sr-shadow-key: inset 0 1px 0 0 rgba(255, 255, 255, 0.06), inset 0 -1px 0 0 rgba(0, 0, 0, 0.5);
  --sr-shadow-overlay: 0 16px 40px 0 rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06);
}

/* Serein theme layer for @serein-ui/react.
   Colour, type, spacing, radius, shadow and motion values come from @serein-ui/tokens (--sr-*),
   which the build places at the top of styles.css. Apply data-theme="light|dark" on <html>
   (omit it to follow the system) and the sr-theme class on <body>. */
.sr-theme{font-family:var(--sr-font-family-sans);font-size:15px;line-height:22px;background:var(--sr-color-surface);color:var(--sr-color-ink);font-feature-settings:"tnum" 1;-webkit-font-smoothing:antialiased}
.sr-theme *, .sr-theme *::before,.sr-theme *::after{box-sizing:border-box}
.sr-theme :where(button,input,textarea,[role="combobox"],[role="tab"],[role="checkbox"],[role="switch"],[role="radio"],[role="option"],a):focus-visible{outline:var(--sr-size-focus-width) solid var(--sr-color-focus);outline-offset:var(--sr-size-focus-offset)}
.sr-theme :is(input,textarea)::placeholder{color:var(--sr-color-ink-muted);opacity:1}
.sr-theme :is(input,textarea){caret-color:var(--sr-color-signal-ink)}
.sr-theme input:disabled{opacity:.5;cursor:not-allowed}
.sr-theme ::selection{background:var(--sr-color-signal);color:var(--sr-color-on-signal)}
.sr-theme {scrollbar-color:var(--sr-color-line-strong) var(--sr-color-surface)}
.sr-theme a{color:var(--sr-color-signal-ink);text-underline-offset:.2em}
.sr-theme :where(table,progress,input[type="number"]){font-variant-numeric:tabular-nums}
.sr-theme :where(code,kbd,samp){font-family:var(--sr-font-family-mono)}
@media(prefers-reduced-motion:reduce){.sr-theme button{transition:none!important;transform:none!important}}
@media(forced-colors:active){.sr-theme{--sr-color-surface:Canvas;--sr-color-surface-raised:Canvas;--sr-color-signal-soft:ButtonFace;--sr-color-ink:CanvasText;--sr-color-ink-muted:CanvasText;--sr-color-line-strong:CanvasText;--sr-color-line:CanvasText;--sr-color-signal:ButtonFace;--sr-color-signal-hover:ButtonFace;--sr-color-signal-edge:CanvasText;--sr-color-on-signal:ButtonText;--sr-color-signal-ink:CanvasText;--sr-color-success:CanvasText;--sr-color-danger:CanvasText;--sr-color-focus:CanvasText}.sr-theme :where(button,input,textarea,[role="combobox"],[role="tab"],[role="checkbox"],[role="switch"],[role="radio"],[role="option"],a):focus-visible{outline-color:CanvasText}.sr-theme :where(button,input,textarea,[role="combobox"],[role="checkbox"],[role="switch"],[role="radio"]){forced-color-adjust:auto}}

@media(forced-colors:active){.sr-theme button[aria-current="page"],.sr-theme .rdp-selected .rdp-day_button{outline:2px solid ButtonText;outline-offset:-4px}}
@media(forced-colors:active){:root,[data-theme]{--sr-color-surface-overlay:Canvas;--sr-color-surface-hover:ButtonFace;--sr-color-surface-pressed:ButtonFace;--sr-color-signal-pressed:ButtonFace;--sr-color-success-soft:Canvas;--sr-color-danger-soft:Canvas;--sr-color-warning-soft:Canvas;--sr-color-warning:CanvasText;--sr-shadow-raised:none;--sr-shadow-overlay:none;--sr-shadow-key:none}}

/* One navigation plane (app bar, sidebar). Serein materials are solid: no translucency or blur.
   data-sr-material="subtle" (default) sits on the page; "expressive" lifts onto a raised panel; "solid" has no edge shadow.
   Layout, position and corner geometry belong to the consuming app. */
.sr-navigation-surface {
 background:var(--sr-color-surface);color:var(--sr-color-ink);
 border:var(--sr-size-hairline) solid var(--sr-color-line);
}
.sr-navigation-surface[data-sr-material="expressive"] {
 background:var(--sr-color-surface-raised);box-shadow:var(--sr-shadow-raised);
}
.sr-navigation-surface[data-sr-material="solid"] {
 background:var(--sr-color-surface);box-shadow:none;
}
@media (prefers-contrast:more), (forced-colors:active) {
 .sr-navigation-surface,.sr-navigation-surface[data-sr-material] {
  box-shadow:none;border-color:var(--sr-color-line-strong);
 }
}
@media (forced-colors:active) {
 .sr-navigation-surface,.sr-navigation-surface[data-sr-material] {
  background:Canvas;color:CanvasText;border-color:CanvasText;
 }
}
```
