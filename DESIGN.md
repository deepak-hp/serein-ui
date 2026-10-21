---
name: Serein
description: Clear surfaces, warm light, and measured movement for a React interface library.
colors:
  clear-canvas: "#FFFFFF"
  mist-surface: "#F6F6F5"
  raised-light: "#FFFFFF"
  field-light: "#FFFFFF"
  flame-wash-light: "#FFF0E8"
  ink-light: "#20211F"
  muted-light: "#60615F"
  boundary-light: "#878984"
  divider-light: "#E3E5E0"
  hover-light: "#ECEDEA"
  active-light: "#E2E4DF"
  flame-light: "#FF681F"
  flame-hover-light: "#F45C14"
  flame-active-light: "#E8540E"
  flame-border-light: "#A83A0A"
  on-flame: "#141414"
  flame-text-light: "#A83A0A"
  success-light: "#28694F"
  success-surface-light: "#E9F7EF"
  error-light: "#B4233C"
  error-surface-light: "#FDECEF"
  warning-light: "#88500B"
  warning-surface-light: "#FFF4DC"
  evening-canvas: "#101113"
  evening-surface: "#191B1D"
  raised-dark: "#202224"
  field-dark: "#16181A"
  flame-wash-dark: "#30251F"
  ink-dark: "#F3F3F0"
  muted-dark: "#B6B8B3"
  boundary-dark: "#747771"
  divider-dark: "#363936"
  hover-dark: "#2A2D2F"
  active-dark: "#34383B"
  flame-dark: "#FF803E"
  flame-hover-dark: "#FF925B"
  flame-active-dark: "#FFA16F"
  flame-border-dark: "#FFAA7D"
  flame-text-dark: "#FF874D"
  success-dark: "#8AD3AC"
  success-surface-dark: "#142820"
  error-dark: "#FF9CAF"
  error-surface-dark: "#32171D"
  warning-dark: "#FFD28A"
  warning-surface-dark: "#332711"
typography:
  display:
    fontFamily: "Plus Jakarta Sans Variable, Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(36px, 3.6vw, 50px)"
    fontWeight: 600
    lineHeight: 1.14
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Plus Jakarta Sans Variable, Plus Jakarta Sans, sans-serif"
    fontSize: "24px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Plus Jakarta Sans Variable, Plus Jakarta Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 650
    lineHeight: 1.4
  body:
    fontFamily: "Plus Jakarta Sans Variable, Plus Jakarta Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Plus Jakarta Sans Variable, Plus Jakarta Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  small: "5px"
  control: "8px"
  popup: "12px"
  panel: "16px"
  dialog: "20px"
components:
  button-primary:
    backgroundColor: "{colors.flame-light}"
    textColor: "{colors.on-flame}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
  button-primary-hover:
    backgroundColor: "{colors.flame-hover-light}"
    textColor: "{colors.on-flame}"
  button-primary-active:
    backgroundColor: "{colors.flame-active-light}"
    textColor: "{colors.on-flame}"
  button-secondary:
    backgroundColor: "{colors.mist-surface}"
    textColor: "{colors.ink-light}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
  text-field:
    backgroundColor: "{colors.field-light}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.control}"
    padding: "11px 14px"
  card:
    backgroundColor: "{colors.raised-light}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.panel}"
    padding: "20px"
  badge:
    backgroundColor: "{colors.mist-surface}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.small}"
    padding: "3px 8px"
  popup:
    backgroundColor: "{colors.raised-light}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.popup}"
    padding: "6px"
  dialog:
    backgroundColor: "{colors.raised-light}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.dialog}"
    padding: "28px"
---

# Design System: Serein

## Overview

**Creative North Star: "Clear Evening Rain"**

Serein takes its character from fine rain in a clear evening sky: calm, precise, and perceptible through small changes in light. White and near-black canvases leave room for content, while one warm orange accent makes the next action unmistakable. The metaphor stays in the material and motion language rather than becoming literal imagery.

The system is restrained and practical. Opaque surfaces layer through closely related neutral fills, controls remain crisp, and movement settles quickly into a stable state. Its astrology-informed foundation remains symbolic through the warm orange action color and dark-text treatment; it does not introduce charts, stars, planets, or other celestial decoration. Existing `--dp-*` custom properties remain the runtime compatibility contract.

**Key Characteristics:**

- Clear white and deep evening canvases with opaque layered surfaces.
- Warm orange actions with dark text and restrained green reserved for real success.
- Soft geometry that becomes progressively rounder from controls to dialogs.
- Plus Jakarta Sans throughout, with compact labels and measured negative tracking in headings.
- Short, settling state changes that retain full meaning without motion.

## Colors

The palette pairs clear neutral planes with a concentrated warm flame accent; semantic colors remain supporting signals rather than decoration.

### Primary

- **Flame:** the filled primary action, selection highlight, progress accent, and text caret. Its darker companion supplies readable inline links and status text on light surfaces.
- **On Flame:** dark text and icon color for filled orange controls in both themes.

### Secondary

- **Restrained Green:** success text and its pale semantic fill only; it never acts as a general accent.
- **Error Rose:** invalid boundaries, error text, and its pale failure fill.
- **Warning Amber:** warning text and its pale semantic fill; it does not replace orange actions.

### Neutral

- **Clear / Evening Canvas:** the page foundation in light and dark themes.
- **Mist / Evening Surface:** quiet hover, alert, and grouped-content layers.
- **Raised Surface:** opaque cards, menus, popovers, and dialogs.
- **Ink:** primary text, focus outlines, and high-emphasis symbols.
- **Muted Ink:** supporting copy, descriptions, placeholders, and inactive navigation.
- **Control Boundary:** interactive borders and scrollbar thumbs.
- **Decorative Divider:** separators and low-emphasis container edges.
- **Hover / Active Planes:** dedicated neutral fills distinguish pointer hover from pressed state without borrowing the orange selection wash.

### Named Rules

**The One Warm Signal Rule.** Orange identifies the next action or current interactive state; do not spread it across large decorative areas.

**The Meaning Before Color Rule.** Labels and status copy carry meaning. Green, orange, and rose reinforce that meaning and never replace it.

## Typography

**Display Font:** Plus Jakarta Sans Variable (with Plus Jakarta Sans and sans-serif fallbacks)

**Body Font:** Plus Jakarta Sans Variable (with Plus Jakarta Sans and sans-serif fallbacks)

**Character:** A single contemporary sans-serif family keeps the library direct and cohesive. Weight, size, line height, and restrained tracking create hierarchy without adding a decorative display face.

### Hierarchy

- **Display:** semibold, fluid, tightly tracked type for the studio's principal statement.
- **Headline:** semibold type for dialogs and major contained headings.
- **Title:** semibold type for card, alert, and section titles.
- **Body:** regular, open-leading type for descriptions and supporting content; long editorial copy stays near 38 characters per line in the studio introduction.
- **Label:** compact semibold type for buttons, field labels, and actions. Inputs use a larger 16px reading size, while help text steps down to 13px.

### Named Rules

**The One Family Rule.** Use Plus Jakarta Sans for every interface role; build hierarchy through scale, weight, and spacing.

**The Measured Tracking Rule.** Negative tracking belongs to large headings and wordmarks and never goes below `-0.04em`.

## Layout

The studio uses a centered container capped at 1360px with fluid horizontal padding from 20px to 64px. Its principal desktop composition is a balanced two-column grid with a fluid 40px to 96px gutter. At 760px and below, the grid becomes one column, the header wraps, and navigation occupies a full row. A 1000px intermediate breakpoint simplifies three-column detail areas before the mobile stack.

Spacing follows an 8px-centered rhythm with deliberate 6px, 10px, and 12px adjustments inside compact controls. Standard controls are at least 48px high; menu options are at least 44px high. Panels commonly use 20px padding, the live studio card scales from 20px to 32px, and dialogs use 28px.

**The Opaque Content Rule.** Forms, cards, fields, popups, and dialogs stay opaque. Optional translucency belongs to one navigation plane and must have an explicit solid fallback.

## Elevation & Depth

Serein uses tonal layering, low-contrast borders, and neutral shadows only where a layer must separate from the page. Cards and grouped surfaces are flat at rest; transient popups become more distinct; dialogs use the deepest tier. Buttons use a small inset highlight and compact drop shadow to feel responsive without becoming glossy. No shadow uses the orange accent as a glow.

### Shadow Vocabulary

- **Surface:** `none` in both themes; cards and grouped surfaces rely on fill and divider relationships.
- **Popup:** `0 2px 6px #20211F0A, 0 12px 32px #20211F14` in light mode; menus, popovers, and toasts.
- **Dialog:** `0 12px 24px #20211F14, 0 32px 80px #20211F26` in light mode; modal separation over the backdrop.
- **Action:** `inset 0 1px 0 #FFFFFF55, 0 2px 3px #7B2E0E14`; primary buttons at rest, deepening slightly on hover.

**The Neutral Depth Rule.** Convey elevation with neutral shadow and opaque tonal layers; never add colored ambient glow.

## Shapes

Corners become rounder as an element separates further from the page: compact items use 5px, controls 8px, popups 12px, panels 16px, and dialogs 20px. Circular avatars and state symbols remain true circles. Interactive boundaries use the stronger boundary color; decorative separators and container edges use the quieter divider color.

**The Progressive Radius Rule.** Keep small controls crisp and reserve the largest curvature for panels and dialogs.

## Components

Serein components feel calm and direct: clear boundaries at rest, modest tonal response on hover, a strong visible focus outline, and brief settling motion.

### Buttons

- **Shape:** softly rounded controls with a 48px minimum height.
- **Primary:** flame fill, dark text, a darker orange boundary, and compact action shadow.
- **Secondary:** quiet neutral fill, ink text, and a soft divider boundary; hover and active use their dedicated neutral state planes.
- **Quiet:** transparent fill and boundary, gaining the same neutral hover and active planes.
- **Hover / Focus:** primary fill darkens through hover and active in light mode and lightens in dark mode; the shadow deepens on hover. All variants receive a 2px ink focus outline offset by 3px. Active buttons move down by 1px. Disabled buttons use a quiet neutral fill and muted text at full opacity, with no press movement. Disabled inputs and selection rows retain their 50% opacity treatment.

### Chips

- **Style:** compact badges are borderless, use a small radius, 12px semibold type, and `3px 8px` padding.
- **State:** neutral, success, error, and warning badges pair explicit text colors with their corresponding subtle surface families; the label remains the primary source of meaning.

### Cards / Containers

- **Corner Style:** panel radius with opaque raised fill.
- **Background:** raised surface in each theme.
- **Shadow Strategy:** none at rest; fill and divider establish the surface, while transient overlays retain elevation shadows.
- **Border:** one-pixel decorative divider.
- **Internal Padding:** 20px by default; compositions may scale to 32px when the container has room.

### Inputs / Fields

- **Style:** opaque field fill, strong one-pixel boundary, control radius, 48px minimum height, and 16px input text.
- **Focus:** the shared 2px ink outline offset by 3px; caret uses readable orange text color.
- **Error / Disabled:** error shifts the boundary and provides explicit message text; disabled inputs use 50% opacity.

### Navigation

Navigation uses compact 13px links with 48px minimum targets. Muted ink indicates rest; the active destination returns to primary ink and gains an orange underline. A navigation surface may use subtle 12px blur or expressive 24px blur on one plane, with opaque solid mode for reduced transparency, increased contrast, or forced colors.

### Popups and Dialogs

Popups use the raised surface, divider border, 12px radius, and popup shadow. Dialogs use a 20px radius, 28px padding, the deepest shadow, and a neutral translucent backdrop. Actions align to the trailing edge and wrap when space is constrained.

### Status Signals

Pending state uses a small rotation and completion settles into a clear mark. State motion describes real work, never delays information, and stops under reduced-motion preferences.

## Do's and Don'ts

### Do:

- **Do** keep orange concentrated on primary actions, active navigation details, and current state.
- **Do** pair every semantic color with explicit words or accessible state information.
- **Do** preserve 48px controls, clear focus outlines, opaque content surfaces, and solid navigation fallbacks.
- **Do** use the existing `--dp-*` custom properties when extending the shipped library so consumers retain compatibility.
- **Do** let motion settle quickly and make the same state legible when animation is removed.

### Don't:

- **Don't** turn the Serein name into rain illustrations, droplets, animated weather, galaxy imagery, stars, or planetary decoration.
- **Don't** add colored ambient glows, decorative gradients, or broad green accent areas.
- **Don't** place translucent material on forms, cards, fields, popups, or dialogs.
- **Don't** infer accessibility certification from automated checks; WCAG 2.2 AA remains the target pending manual review.
- **Don't** describe `@serein-ui/react` as published on npm or its package scope as verified; npm publication is deferred, and the canonical repository is `deepak-hp/serein-ui`.
