# Serein foundations

Serein takes its material language from fine rain falling from a clear evening sky: clear surfaces, soft light, and restrained movement. The approved astrology-informed foundation remains symbolic. Orange actions, white and near-black canvases, Plus Jakarta Sans, and limited green are preserved. Personal chart details are not distributed.

## Colour roles

Source of truth: `src/tokens.css`. Distributed values are included in the [machine-readable contract](../ai/contract.json) and [token stylesheet](../tokens.css).

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `#FFFFFF` | `#101113` |
| Quiet surface | `#F6F6F5` | `#191B1D` |
| Raised surface | `#FFFFFF` | `#202224` |
| Input surface | `#FFFFFF` | `#16181A` |
| Text | `#20211F` | `#F3F3F0` |
| Supporting text | `#60615F` | `#B6B8B3` |
| Control boundary | `#878984` | `#747771` |
| Decorative divider | `#E3E5E0` | `#363936` |
| Neutral hover | `#ECEDEA` | `#2A2D2F` |
| Neutral active | `#E2E4DF` | `#34383B` |
| Primary action | `#FF681F` | `#FF803E` |
| Primary hover | `#F45C14` | `#FF925B` |
| Primary active | `#E8540E` | `#FFA16F` |
| Primary text | `#141414` | `#141414` |
| Accent text | `#A83A0A` | `#FF874D` |
| Success | `#28694F` | `#8AD3AC` |
| Success surface | `#E9F7EF` | `#142820` |
| Error | `#B4233C` | `#FF9CAF` |
| Error surface | `#FDECEF` | `#32171D` |
| Warning | `#88500B` | `#FFD28A` |
| Warning surface | `#FFF4DC` | `#332711` |

Orange is reserved for priority actions and selected controls. Neutral controls use the quiet surface at rest and dedicated hover and active fills; they do not borrow the orange selection wash. Filled orange buttons use dark text, never white. Green communicates an actual successful result. Every status also has words or another non-colour cue. The stronger border token defines interactive boundaries; the softer divider is only for decorative separation. Surfaces are opaque, with neutral shadows reserved for transient elevation rather than ambient coloured glows.

## Geometry and typography

| Token | Value | Use |
| --- | --- | --- |
| `--sr-radius-tag` | 5px | Small indicators and options |
| `--sr-radius-control` | 8px | Buttons, fields, joined-control outer corners |
| `--sr-radius-popup` | 12px | Menus and popovers |
| `--sr-radius-panel` | 16px | Cards and grouped surfaces |
| `--sr-radius-sheet` | 20px | Focused modal surfaces |

Circles and pill controls retain their functional shapes. Standard buttons and fields are at least 48px high; common menu options are at least 44px. Visible focus uses a two-pixel outline with three-pixel offset. The softer shapes do not reduce hit targets or focus visibility.

Each component owns its outer frame. DataTable also owns its horizontal scrolling, named region, and keyboard focus; place it in an unframed layout wrapper rather than adding a second border or scroll region. Joined controls share one seam, and row/item dividers stop before the container's outer edge. Preserve control boundaries and keyboard focus outlines: they communicate different states, even when both are visible.

`--sr-font-family-sans` selects Plus Jakarta Sans Variable, then Plus Jakarta Sans and a sans-serif fallback. Labels/buttons use 14px, inputs 16px, helpers 13px. Buttons and control labels use weight 600. Heading tracking stays at or above -0.04em. Tables and numeric controls use tabular figures. Group related content tightly and leave more space between tasks; do not make every paragraph a card.

## Material and motion

`--sr-shadow-raised` is `none`: cards and grouped surfaces use fill and divider relationships at rest. `--sr-shadow-overlay` and `--sr-shadow-overlay` express elevation only for transient layers. `--dp-shadow-action` gives the primary action a restrained top-edge highlight and offset shadow. Keep control boundaries visible in both themes.

Status icons communicate real pending, success, or error states; motion never determines completion. Reduced-motion settings disable the animated transitions and state-icon motion. Optional `sr-navigation-surface` supports `subtle`, `expressive`, and `solid` modes on one navigation plane. Content, nested controls, and forms stay opaque. Reduced transparency, increased contrast, and forced colours use solid fallbacks. See [navigation material guidance](APPLE-DESIGN.md).

## Integration and accessibility

Apply `data-theme="light|dark"` on `<html>` and `sr-theme` on `<body>` so portalled overlays inherit the same theme. The `dp-*` styling contract stays stable through the Serein rename. Existing demo storage keys stay stable too.

The React package is named `@serein-ui/react`, with a verified [GitHub beta download](https://github.com/deepak-hp/serein-ui/releases/tag/v0.1.0-beta.1). npm publication and scope verification remain deferred. The canonical repository is `deepak-hp/serein-ui`, and its [documentation site](https://deepak-hp.github.io/serein-ui/) is deployed. Existing persisted demo storage keys remain unchanged for compatibility.

Keep visible labels, connected errors, keyboard operation, focus return, and semantic landmarks. Verify light/dark, narrow layouts, reduced motion, forced colours, and full user processes in the consuming app. Automated checks do not certify WCAG 2.2 AA or EAA conformance. See [accessibility guidance](ACCESSIBILITY.md) and [recorded evidence](ACCESSIBILITY-EVIDENCE.md).
