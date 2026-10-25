# Serein — build and release plan

Status: approved 21 October 2026 · applies to the *precision instrument* direction with the Vermilion signal.

> **Update, 24 October 2026 — merged with the Codex beta.** Decisions that changed from the original plan below:
> - Home is `deepak-hp/serein-ui` (not a new `serein-ds` org); npm scope is `@serein-ui/*`.
> - The web behaviour layer is **Base UI** (already integrated and tested), not React Aria; styles are precompiled StyleX.
> - **Storybook** is the single documentation site; the Starlight docs app was not adopted.
> - Phase 0 (foundations) is done. Phase 1's component list is largely covered by the 42 merged components; Phase 2's signature components (Readout, Tape, Gauge, Meter, RainChart, Keypad, Drizzle) are added. Next: React Native parity, the AI tool outputs (skill, MCP checks, lint plugin) and the release checklist.
> - Only `@serein-ui/react` is distributed for now; it bundles the tokens, fonts, icons and formatting it needs.
> - React Native parity has started: `@serein-ui/native` (Expo SDK 58) has the theme provider, fonts, Button, TextField, Switch and Readout, with `apps/native-playground` as the Expo showcase.

---

## 1. Cross-platform strategy

**Principle: share the decisions, not the pixels.** Tokens, behaviour specs and AI rules are written once. Each platform renders them natively.

```
                    ┌──────────────────────────────┐
                    │  tokens/  (DTCG 2025.10 JSON) │  ← single source of truth
                    │  specs/   (one file/component)│  ← anatomy, states, keyboard, ARIA, motion
                    │  ai/      (rules + recipes)   │  ← one source for every AI tool
                    └──────────────┬───────────────┘
              Style Dictionary v5  │  spec + doc generators
     ┌──────────────┬──────────────┼───────────────┬──────────────┐
  CSS vars       TS / JS        Swift          Kotlin         Tailwind v4
     │              │          (SwiftUI)      (Compose)        preset
@serein-ui/css   @serein-ui/react   SereinKit     serein-compose        │
 (any HTML)   @serein-ui/native   (tokens)       (tokens)      AI-friendly
     │        (Expo / RN)                                    output target
 Tauri / Electron desktop shells reuse @serein-ui/react
```

| Layer | Package | What it is | When |
|---|---|---|---|
| Tokens | `@serein-ui/tokens` | DTCG 2025.10 source, built with Style Dictionary v5 into CSS variables, TS, JSON, Swift, Kotlin and a Tailwind v4 `@theme` file | Phase 0 |
| Fonts | `@serein-ui/fonts` | Self-hosted Anek Latin (plus Indic sibling families) and Chivo Mono (both OFL), with no Google CDN request, which is the safer choice under EU privacy law | Phase 0 |
| Icons | `@serein-ui/icons` | The authored 20px / 1.5px set as SVG, React and React Native components | Phase 0 → ongoing |
| Styles | `@serein-ui/css` | Framework-neutral component CSS (`.btn`, `.tape` …), so plain HTML, Vue, Svelte and Angular can use it | Phase 1 |
| Web | `@serein-ui/react` | React components on **React Aria** (behaviour and accessibility), styled by `@serein-ui/css`. Also served as a **shadcn-compatible registry** so people (and AI tools) can copy the source in | Phase 1 |
| Mobile | `@serein-ui/native` | React Native / Expo components with the same APIs and names as `@serein-ui/react` | Phase 2 |
| Desktop | — | No separate library. Tauri (recommended, lighter) or Electron shells use `@serein-ui/react` with the compact density (`control-height-compact`), menus and keyboard shortcuts | Phase 3 docs + template |
| Native | `SereinKit` (Swift), `serein-compose` (Kotlin) | Tokens, fonts and specs only at first. Full native component kits only if there is real demand | Tokens in Phase 1; kits after 1.0 |
| Flutter | `serein_tokens` | Tokens only | After 1.0, on request |

**Why this shape**
- **React first for web.** It has the largest ecosystem, and it is what AI coding tools generate best. React Aria handles focus, keyboard, typeahead and overlays to WCAG standard, so Serein never hand-rolls them.
- **CSS as its own layer.** Polaris's move to web components shows that framework-tied UI ages badly. Framework-neutral CSS plus tokens keeps Serein usable anywhere. Web components (Lit) are an option for 1.x if non-React demand appears.
- **React Native for mobile.** A one-person open-source project can't maintain three native component kits. React Native shares the React mental model, component names and AI rules. Native teams still get tokens, fonts and specs.
- **Specs as files.** Each component's behaviour (states, keys, ARIA, motion) lives in `specs/<component>.yaml`. Docs, types, tests and the MCP server are generated from it, so web and mobile can't drift apart.

**Repository layout** (pnpm workspaces + Turborepo)
```
serein/
  tokens/            DTCG source + Style Dictionary config
  specs/             one YAML per component
  ai/                rules.md, recipes/, anti-patterns.md  (source for AGENTS.md, skills, Cursor rules…)
  packages/          css, react, native, icons, fonts, tokens, mcp, eslint-plugin
  apps/docs          documentation site (with live examples)
  apps/playground    Expo app + Tauri app showing the showcases
  registry/          shadcn-compatible JSON, built from packages/react
  private/           gitignored (birth data — never committed)
```

---

## 2. Component roadmap

Each phase ends with a usable, published release. A component is **done** only when it has: spec, web implementation, keyboard and screen-reader behaviour, light and dark themes, reduced-motion behaviour, docs with do/don't, axe-clean tests, visual-regression snapshots and an AI recipe.

| Phase | Release | Components and work | Exit criteria |
|---|---|---|---|
| **0 · Foundations** | `0.0.x` (private) | Token pipeline, fonts, icon set (≈40), CSS reset and focus ring, theme switching, `formatINR` / Indian number grouping, docs-site skeleton, test harness (Playwright + axe + visual diff), spec template | Tokens build for all targets; CI green |
| **1 · Core** | `0.1` | Button, IconButton, Link, TextField, TextArea, Select, Checkbox, Radio, Switch, SegmentedControl, Tag, Notice, Toast, Drizzle, Skeleton, ListRow, Avatar, Panel, Divider, Tooltip, VisuallyHidden | First public release on web; first AI skill and MCP server |
| **2 · Signature and data** | `0.2` | Readout, Tape, Keypad, Gauge, Meter, RainChart, Table (sort, row actions), Tabs, Pagination, EmptyState, OTP input (paste allowed, WCAG 3.3.8). **React Native parity for Phases 1–2** | The phone showcase runs in Expo; the desktop showcase runs on the web |
| **3 · Overlays and navigation** | `0.3` | Dialog, Sheet (bottom sheet on mobile), Popover, Menu, Command palette (Ctrl K), Combobox, DatePicker (`en-IN`, Monday weeks), NavRail, TabBar, Toolbar, Breadcrumbs. Tauri desktop template | Full apps buildable; focus never hidden behind sticky bars (2.4.11) |
| **4 · Patterns** | `0.4`–`0.9` | Documented flows: send money, pay bill, receipt, form validation, sign-in (no memory tests), onboarding, settings, dashboard. Indic script switching (`lang` → Anek Devanagari / Kannada / Tamil …), high-contrast theme, forced-colours support | Each pattern has an AI recipe and an end-to-end test |
| **1.0** | `1.0` | API freeze, accessibility conformance report, migration policy, Swift/Kotlin token packages stable | See release checklist |

The Rain and Turmeric themes are removed in Phase 0; only Vermilion ships. A high-contrast theme is added in Phase 4.

---

## 3. AI integration

**Goal:** an assistant with Serein installed produces a correct, calm, accessible screen on the first try, and a machine can check that it did.

**One source, many formats.** `packages/react/ai/COMPOSITION.md` (the Serein rules, component chooser, recipes such as money entry) and `ai/README.md` are the hand-written AI docs; the contract and full-text guide are generated from them on every build. Planned generated outputs:

| Output | For | Maturity |
|---|---|---|
| `AGENTS.md` (repo root and inside each package) | Any agent that reads AGENTS.md (Codex, Cursor, Claude Code, Copilot…) | Established |
| Claude Code skill / plugin `serein` | Claude Code; loads the rules and recipes on demand | Established |
| `.cursor/rules/serein.mdc`, `.github/copilot-instructions.md` | Cursor, GitHub Copilot | Established |
| shadcn registry (`npx shadcn add https://<site>/r/button.json`) | shadcn CLI and the shadcn MCP server | Established |
| `llms.txt` / `llms-full.txt` on the docs site | Tools that crawl docs | Experimental, cheap |

**`@serein-ui/mcp` server** (MCP, works in any MCP client). Planned tools:
- `list_components` and `get_component(name)`: props, states, ARIA, keyboard, examples (from the specs).
- `get_tokens(theme)`: resolved values per theme.
- `find_recipe(task)`: the closest pattern for "send money", "settings page" and so on.
- `check_snippet(code)`: runs the Serein lint rules and returns violations with fixes.

**Guardrails that make output checkable**
- `@serein-ui/eslint-plugin` and a stylelint config. They flag raw colours and pixel values that should be tokens, more than one signal button in a view, icon-only buttons without labels, money not formatted with `formatINR` or not shown in a Readout, and placeholder-as-label.
- These same rules run in `check_snippet`, so assistants can self-correct.

**Proof, not promises.** Build a small benchmark: about 12 prompts ("build a send-money screen", "make a budget dashboard"…), run in Claude Code and Cursor with and without Serein. Score each result by lint violations, axe results and a rubric review of screenshots. Publish the results with each release.

---

## 4. Release checklist

### Before the first public release (0.1)
- [ ] **Name.** The bare npm name `serein` is taken (a stale package from 2022); `@serein-ui/*` packages don't exist yet. Create the npm org `serein` (ownership not yet verified), or fall back to `@serein-ds`. On GitHub, `serein`, `serein-ui`, `serein-design` and `sereinhq` are taken; `serein-ds`, `sereindesign` and `serein-system` were free on 21 Oct 2026. Do a trademark search before branding.
- [ ] **Licences.** MIT for code; OFL 1.1 notices for Anek and Chivo Mono; CC BY 4.0 for docs (recommended).
- [ ] **Community files.** `README`, `CONTRIBUTING`, `CODE_OF_CONDUCT`, `SECURITY.md` (private disclosure address), `GOVERNANCE`, issue and PR templates, DCO sign-off.
- [ ] **Privacy.** `private/` is gitignored and the git history is checked for birth data before the first push. Public docs contain only the symbolic explanation.
- [ ] **Versioning.** Semver with Changesets, and a changelog per package.
- [ ] **Supply chain.** npm trusted publishing (OIDC) with provenance, 2FA on every maintainer account, an SBOM per release, Dependabot or Renovate, and no install scripts.
- [ ] **CI** on every PR: lint, typecheck, unit tests, Playwright, axe (zero violations), visual regression in light and dark, bundle-size budget, token build.
- [ ] **Support matrix.** Current and previous major versions of Chrome, Edge, Firefox and Safari; iOS Safari 17+; Android Chrome; React 18 and 19; SSR-safe output.
- [ ] **Docs.** Install per platform, theming, a tokens reference, component pages (do/don't, accessibility notes), an "Use with AI" page, and the showcases.

### Accessibility evidence (every release)
- [ ] Automated: axe on every component state, in light and dark.
- [ ] Manual keyboard pass per component, following its spec.
- [ ] Screen readers: NVDA + Firefox, JAWS + Chrome, VoiceOver on macOS and iOS, TalkBack.
- [ ] 200% and 400% zoom, 320px reflow, text-spacing overrides, forced colours, reduced motion.
- [ ] Publish the results table and known issues in the docs.

### For 1.0
- [ ] API freeze and a deprecation policy (at least one minor version of warnings before a removal).
- [ ] An **Accessibility Conformance Report** (VPAT 2.5 INT, EN 301 549 edition) for the library. State plainly that a component library helps but cannot make an app conformant by itself.
- [ ] An external accessibility review (ideally including disabled testers).
- [ ] Native token packages (Swift, Kotlin) published and documented.
- [ ] The AI benchmark results published.
- [ ] Launch: docs site, the playground apps (web, Expo, Tauri), and a write-up of the design story (without personal data).

---

## 5. Decisions needed from you

1. **Mobile:** React Native / Expo first (recommended), or native SwiftUI and Jetpack Compose component kits?
2. **Tailwind:** ship a Tailwind v4 preset as an output target (recommended; AI tools default to Tailwind), or CSS variables only?
3. **Licence:** MIT for code (recommended), or Apache-2.0 (adds an explicit patent grant)?
4. **Names:** GitHub org `serein-ds` and npm scope `@serein` (if available), or something else?
