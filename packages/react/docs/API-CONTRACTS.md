# Component contracts

The package is an MIT-licensed React web library. Install it with `npm install @serein-ui/react`, then import components and their types from `@serein-ui/react` and import `@serein-ui/react/styles.css` once. Styles are precompiled; consumers do not configure StyleX. Use the generated Agent API reference for the exact props of each component.

## Values and forms

`Select`, `Checkbox`, `Switch`, `RadioGroup`, `Tabs`, `NumberField`, `Slider`, `Combobox`, `MultiSelect`, `ToggleGroup`, `DateField`, and `Pagination` use controlled values: the application stores the value and responds to the documented change callback. Values and callback names vary by control; for example Checkbox uses `checked`/`onCheckedChange` while Select uses `value`/`onValueChange`.

TextField and Textarea support native controlled or uncontrolled input props. FileUpload reports a FileList; the application owns file validation and upload transport. Keep one state model for a mounted control, use stable row/option keys, and use the documented `name` prop where supported when submitting native forms.

Labels must describe the purpose of each control. Pass descriptions and errors through the component API so they remain associated with the actual input. IconButton requires `label`; StatusIcon is decorative and needs adjacent status text. TypeScript cannot verify that a label is meaningful or that application content is accessible.

Checkbox accepts `hideLabel` for compact row selection when the adjacent record already supplies visible context. `label` remains required and becomes visually hidden, preserving the accessible name. The compact label wrapper reserves a 48 by 48 CSS-pixel click area. Give that column enough space and use a specific name such as `Select Homepage hero.png`; keep the normal visible label for standalone questions or preferences. This option does not hide `description` or change selection, disabled or indeterminate behavior.

## Opening and closing overlays

Dialog, AlertDialog, Drawer, Popover, DropdownMenu, DatePicker and DateRangePicker share these optional props:

| Prop | Contract |
| --- | --- |
| `open` | Controlled state. The parent must update it for a requested change to take effect. |
| `defaultOpen` | Initial uncontrolled state; later changes do not control the overlay. |
| `onOpenChange(next)` | Reports an open/close request. It does not override a controlled parent's state. |

Omit `open` for the existing trigger-managed behaviour. Choose `open` or `defaultOpen`, rather than both. Existing trigger, title and content requirements still apply.

```tsx
const [open, setOpen] = useState(false);

<Drawer
  triggerLabel="Edit settings"
  title="Settings"
  open={open}
  onOpenChange={setOpen}
>
  <Button onClick={() => setOpen(false)}>Done</Button>
</Drawer>
```

Dialog and AlertDialog confirmation invokes `onConfirm` and requests closing. It does not wait for a Promise. For an asynchronous operation, keep the overlay controlled, manage pending/error state in the application, and close after the operation succeeds. A controlled parent can decline dismissal while necessary. AlertDialog initially focuses Cancel and does not dismiss on outside interaction.

Base UI manages focus and portal lifecycles. Set the theme on `html` and `sr-theme` on `body`, including server-rendered markup, so portaled controls inherit it.

## Search and multiple selection

`MultiSelect` controls a `string[]` value. Use stable unique option values and respond to `onValueChange`; filtering must not replace the selected values. Selected chips have named removal controls and keyboard navigation. A `name` submits repeated values through native FormData. The disabled prop prevents changes, including chip removal. Supply error/description props to associate validation and help with the search input.

`CommandPalette` accepts local actions with stable unique IDs, labels, optional descriptions, keywords and disabled state. It supports `open`, `defaultOpen` and `onOpenChange` with the same controlled-state rules as other overlays. Search focuses on opening; selecting an enabled action invokes `onSelect` and requests closing. Global keyboard shortcuts and asynchronous action status belong to the application. The palette does not await a Promise or infer when an action succeeds.

Patterns / Workspace settings demonstrates both controls alongside tabs and an editable form. Its Save action stores state only within that mounted preview; no data is sent or persisted across reloads.

## Dates and selection

`Calendar`, `DatePicker` and `DateRangePicker` use controlled date-only ISO strings (`YYYY-MM-DD`), independent of the device time zone. They use a Gregorian calendar and English labels; time selection and locale configuration are not part of these APIs. Impossible dates throw a RangeError. `min` and `max` are inclusive, and `disabledDates` prevents selecting individual dates or completing a range across an unavailable date.

`Calendar` uses `value: string | null` and `onValueChange`. It does not take focus on mount unless `autoFocus` is explicitly enabled. `defaultMonth` sets the initial visible month; `today` can make previews and server/client rendering deterministic.

`DatePicker` adds descriptions, errors, a placeholder, the overlay props above, and `name` for a hidden native form value. Visible dates are readable labels; submitted values remain ISO strings. Opening focuses the selected date or the calendar's initial available date. Selecting a date closes the popup and returns focus to the trigger. Clear resets to null.

`DateRangePicker` uses `{ from: string | null, to: string | null }`. The first click begins a partial range; the second completes it, including a same-day range. Clicking after a completed selection starts a new range. Store partial values as well as completed ones. `startName` and `endName` submit separate ISO form values. Disabled pickers omit their hidden form values. A range cannot have an end without a start, or an end before its start.

`Select` accepts null for its placeholder state, optional descriptions/errors, and disabled options. Use Select for choosing a value; use DropdownMenu for actions. Both show an explicit message when their options/items array is empty.

## Package and rendering boundary

The package exports ESM JavaScript, TypeScript declarations, compiled CSS and offline AI contracts. React and React DOM are peer dependencies; the current supported range is React 19.3. The compiled entry preserves `"use client"` for tools that recognize client component boundaries. This artifact check does not certify any particular server framework integration.

The SSR regression check imports and renders the compiled package without a DOM, then hydrates the same fixture in Chromium and exercises interactions. See `SSR.md` for its scope. Application event handlers and state still belong in client components in a server-component application.

## Development and release checks

Use the repository's Node 24 development runtime. Install dependencies with `npm ci` and browser binaries with `npm run test:browser-install`.

- `npm run check:production`: unit tests, TypeScript, library/playground builds, package exports and client directive, generated AI contract, SSR/hydration, and a strict TypeScript consumer installed from a local tarball.
- `npm run test:stories`: browser interactions and automated accessibility checks across both themes and reduced-motion preferences.
- `npm run build:storybook`: static documentation build.
- With Storybook running: `npm run ai:check-mcp` and `npm run check:docs` check live metadata and integration documents.

These checks do not replace the manual assistive-technology, cross-browser, application-level WCAG and applicable EAA work recorded in `VERIFICATION.md` and `ACCESSIBILITY.md`. Native mobile/desktop adapters and advanced component families remain separate work.
