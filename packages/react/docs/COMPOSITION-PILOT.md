# Composition pilot: invoice workspace

Open the reference app at `http://127.0.0.1:5174/?view=composition` after `npm run reference:setup` and `npm run reference:dev`. The workspace header also links to Composition lab.

## Question

Does task-specific composition guidance help an assistant use the existing component library more thoughtfully? This is a single illustrative pair, not a blind study or evidence of a general improvement. No winner or improvement percentage is asserted.

## Common brief

A small studio owner needs to identify overdue invoices, compare client, invoice ID, project, due date, amount and status, and open details before following up. Include heading “Invoices”, note “Fictional studio data · 28 September 2026”, summaries of Overdue/Due soon/Paid amounts computed from allInvoices, search labelled “Search invoices”, status Select labelled “Invoice status” with All/Overdue/Due soon/Paid, clear Button “Clear filters”, DataTable caption “Studio invoices”, and invoice-specific Review accessible names. Render the provided invoice list; no real backend/send action. Empty message: “No invoices match your filters.” Data and behavior are parent-owned. Use Button, TextField, Select, DataTable and Badge, semantic HTML/CSS for layout, light/dark, and no page overflow at 320px. A table may scroll inside a labelled focusable region. Keep orange brand, Plus Jakarta Sans and crisp borders.

Both workers received the same shared TypeScript props, fixture, exact component declarations, tokens and global CSS. They were asked to use their best design judgment and were forbidden to read the other layout. Both used `gpt-5.6-terra` in fresh subagent conversations, with no parent conversation fork. Other ambient tool/system instructions still exist; this is not a controlled model research environment. Generation was one initial attempt per worker; the API does not expose a deterministic random seed here.

## Difference between runs

- **Version A:** brief + component declarations + brand tokens only; no composition guide.
- **Version B:** same materials plus `ai/COMPOSITION.md`, especially its invoice recipe.

The parent supplied identical search, status-filter and detail behavior. The comparison lets the user switch A/B at the same width or show both together. Shared state preserves the query across views. At narrow widths the pair stacks; each table can scroll to retain all fields.

## Repairs after generation

These integration repairs do not establish a guide effect:

- Changed B's nested main landmark into a labelled section and labelled its table scroll region.
- Gave each layout and table a unique accessible name for simultaneous display.
- Matched the outer table-scroll instructions for both variants after accessibility review.
- Removed A's extra sortable headers so both expose the same interaction set.
- Added the comparison controls, theme switch, shared detail region and focus return outside the generated layouts.

Visual decisions inside the generated layouts are retained for comparison, including choices the guide did not prevent. The mechanical design detector flagged B's thick orange side border. B also uses a large heading and generous vertical gaps despite the guide's recommendation to keep invoice records readily reachable. Those are pilot findings, not quietly polished away to make the guided output win.

## What this establishes

The guide is available in the packed package, full AI text, starter instructions and Storybook Composition documentation. The fixture, route and checks provide a repeatable way to inspect two results.

It does **not** establish improved taste across assistants, apps or repeated generations. The brief already specified much of the interface, neither output is anonymous to the author, and one sample per condition cannot isolate guidance from generation variation. A later evaluation should use several tasks/runs, less prescriptive briefs, comparable budgets and blinded human preference/task-completion review.

Use the review rubric in `ai/COMPOSITION.md`: task clarity, hierarchy, content fit, interaction completeness, responsiveness, accessibility and design fidelity. Automated checks cannot substitute for visual preference or full accessibility review.
