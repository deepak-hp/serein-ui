# Serein rules for AI assistants

Source of truth for every AI-facing file (AGENTS.md, Claude Code skill, Cursor rules, Copilot instructions). Edit here only; the others are generated in Phase 1.

## Setup
- Import `@serein-ui/fonts`, then `@serein-ui/tokens/css`, then `@serein-ui/css`. With Tailwind v4, import `@serein-ui/tokens/tailwind.css` after `tailwindcss`.
- Never hard-code a colour, font, radius, shadow, duration or spacing value. Use `var(--sr-…)` tokens or the Tailwind utilities that map to them (`bg-surface`, `text-ink`, `p-4`, `rounded-panel`). Tailwind's default palette is deliberately absent.

## Compose a screen
1. Name the one task. It becomes the single primary (signal) action, labelled verb + object, and it states the amount when money moves ("Send ₹2,400").
2. Lead with the figure the person came for, as a readout (`type.readout-*`, tabular figures). Then the context that explains it, then the detail, then the actions.
3. Put the heading and its metadata on one row: the heading on the left, the metadata in `type.measure` on the right. Never put an eyebrow or kicker label above a heading.
4. Space with tokens: `space.4` within a group, `space.5`–`space.6` between groups, `space.7`+ between sections.
5. Design every state: empty, loading (Drizzle plus a label), error (what happened, what is safe, what to do), success (a statement, not a celebration), and over-limit.

## Colour
- Grounds: `surface`, `surface-raised` (panels, inputs, keys), `surface-sunken` (wells, tracks, pressed keys), `surface-overlay` (menus, sheets).
- Text: `ink`, `ink-muted`. Lines: `line` (decorative), `line-strong` (control boundaries).
- `signal` marks only the one primary action, the needle, today's value and the gauge level. Text on it is `on-signal`. Never use it for large areas, notices or status.
- Status: `success`, `warning` and `danger`, each with an icon and a word. Danger is rose; never use the signal for errors.

## Type
- Anek Latin for all text and figures. Chivo Mono only for units, axis labels, references and timestamps; never for prose or as "technical" decoration.
- Money: `formatMoney` from `@serein-ui/format` (₹1,00,000 grouping, true minus −₹2,400, "+" for money in).

## Accessibility (non-negotiable)
- Every control has a visible label; icon-only controls have `aria-label`. Placeholders never replace labels.
- Never remove the focus ring. Targets are at least 24px; Serein controls are 36–56px.
- Announce outcomes (`role="status"` for success; `role="alert"` for failures, with focus moved to the recovery action).
- Respect `prefers-reduced-motion`: no travel, nudges or growth, only fades.

## Never
Gradients, glass or blur, glows, emoji, decorative illustrations or people, stars, moons, zodiac or galaxy imagery, eyebrow labels, section numbers, more than one signal element per region, cards inside cards, coloured side borders, or hero-metric templates nobody asked for.
