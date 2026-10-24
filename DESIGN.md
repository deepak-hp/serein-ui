---
name: Serein
description: A precise, calm design language built like an instrument - fine graduations, exact readouts and one vivid signal.
source: tokens/ (W3C DTCG 2025.10), built by @serein-ui/tokens. This file summarises it; the token files win on any difference.
colors:
  surface-light: "#f3f3f1"
  surface-raised-light: "#ffffff"
  surface-sunken-light: "#e9e9e6"
  surface-overlay-light: "#ffffff"
  surface-hover-light: "#f1f1ee"
  surface-pressed-light: "#e6e6e2"
  ink-light: "#0b0c0e"
  ink-muted-light: "#575d66"
  line-light: "#dfe0dd"
  line-strong-light: "#868c95"
  focus-light: "#0b0c0e"
  signal-light: "#ff5a1f"
  signal-hover-light: "#ff7440"
  signal-pressed-light: "#e94d12"
  signal-edge-light: "#b5350a"
  on-signal: "#160600"
  signal-ink-light: "#b5350a"
  signal-soft-light: "#ffe6db"
  success-light: "#127a3e"
  success-soft-light: "#dff3e6"
  warning-light: "#8a5800"
  warning-soft-light: "#fbefd2"
  danger-light: "#c2185b"
  danger-soft-light: "#fbe1ea"
  surface-dark: "#0b0c0e"
  surface-raised-dark: "#131518"
  surface-sunken-dark: "#07080a"
  surface-overlay-dark: "#1a1d21"
  surface-hover-dark: "#1c1f23"
  surface-pressed-dark: "#24282d"
  ink-dark: "#f3f4f6"
  ink-muted-dark: "#9aa1ab"
  line-dark: "#24282e"
  line-strong-dark: "#5f6773"
  focus-dark: "#f3f4f6"
  signal-dark: "#ff6a2c"
  signal-hover-dark: "#ff8752"
  signal-pressed-dark: "#ffa077"
  signal-ink-dark: "#ff8752"
  signal-soft-dark: "#2e140a"
  success-dark: "#46d17f"
  success-soft-dark: "#0f2618"
  warning-dark: "#ffb224"
  warning-soft-dark: "#2b2009"
  danger-dark: "#ff5c8a"
  danger-soft-dark: "#2e0f19"
typography:
  readout-xl: { fontFamily: "Anek Latin", fontSize: "88px", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.035em", fontStretch: "88%" }
  readout-l: { fontFamily: "Anek Latin", fontSize: "60px", fontWeight: 300, lineHeight: 1.0667, letterSpacing: "-0.03em", fontStretch: "88%" }
  readout-m: { fontFamily: "Anek Latin", fontSize: "32px", fontWeight: 400, lineHeight: 1.125, letterSpacing: "-0.02em", fontStretch: "88%" }
  title: { fontFamily: "Anek Latin", fontSize: "28px", fontWeight: 500, lineHeight: 1.2143, letterSpacing: "-0.015em" }
  heading: { fontFamily: "Anek Latin", fontSize: "17px", fontWeight: 600, lineHeight: 1.4118 }
  body: { fontFamily: "Anek Latin", fontSize: "15px", fontWeight: 400, lineHeight: 1.4667 }
  label: { fontFamily: "Anek Latin", fontSize: "13px", fontWeight: 500, lineHeight: 1.3846 }
  measure: { fontFamily: "Chivo Mono", fontSize: "12px", fontWeight: 400, lineHeight: 1.3333 }
rounded:
  tag: "4px"
  control: "8px"
  key: "12px"
  popup: "12px"
  panel: "14px"
  sheet: "22px"
spacing: "4px grid, nine steps: 4, 8, 12, 16, 24, 32, 48, 64, 96"
motion:
  fast: "100ms"
  base: "180ms"
  slow: "320ms"
  standard: "cubic-bezier(0.2, 0, 0, 1)"
  settle: "cubic-bezier(0.16, 1, 0.3, 1)"
components:
  button-primary:
    backgroundColor: "{colors.signal-light}"
    textColor: "{colors.on-signal}"
    border: "1px solid {colors.signal-edge-light}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "48px"
---

# Serein

Serein is a precise, calm design language built like an instrument: **fine graduations, exact readouts, and one vivid signal**, quiet enough to read like fine rain from a clear evening sky.

## Principles

1. **Measure, don't decorate.** Every line is a graduation, a boundary or data.
2. **One signal.** One vivid vermilion marks the one action per view, plus needles and today's value. Everything else is ink on a ground.
3. **The figure is the hero.** Money and key numbers are instrument readouts: large, light, tabular. Labels and units are small and exact.
4. **Settle, don't bounce.** Motion travels to a reading and stops.
5. **Accessible by construction.** WCAG 2.2 AA in every theme, enforced by token tests.

## Origins

Serein draws on two precision instruments: the **rain gauge** and **Jantar Mantar**, the observatories built for Jyotish, whose engraved scales measure the sky. They give Serein its graduations, readouts, Tape and Gauge. The vermilion signal comes from sindoor and from Mars (Mangala), the red planet linked with decisive action, and doubles as an instrument's signal orange. The nine spacing steps echo the nine grahas. None of this appears as imagery: no stars, moons, zodiac wheels or galaxies. Personal chart details are not part of the project.

## Colour

Roles, never raw values. Grounds (`surface`, `surface-raised`, `surface-sunken`, `surface-overlay`, plus hover and pressed) carry the screen; `ink` and `ink-muted` carry content; `line` is decorative and `line-strong` marks control boundaries. `signal` fills the one primary action with near-black `on-signal` text in both themes. Status colours (`success`, `warning`, `danger`, with `-soft` grounds) always come with a word or icon; danger is rose so it never reads as the signal. Focus is neutral. Dark leads the brand; light is a full equal.

## Typography

**Anek Latin** (Ek Type, India) sets every word and figure; readouts narrow its width axis to 88% and use tabular figures. **Chivo Mono** is only for measurements: units, axis labels, references, timestamps. One `readout-xl` per screen; nothing below 12px; no eyebrow labels. Metadata sits right-aligned on the heading's row.

## Geometry, materials and motion

Machined corners (4/8/12/14/22px), never pills; scales and gauges stay square. Materials are solid: panels are raised with a hairline, keys have a machined edge, overlays get a real shadow. No gradients, glass, glows or noise. Motion is fast and exact and settles; reduced motion removes travel, and every outcome is announced.

## Signature components

`Readout` (money as an instrument display), `Tape` (an amount ruler under a fixed needle), `Gauge` and `Meter` (graduated budget and quota), `RainChart` (daily values as precipitation bars), `Keypad` (machined keys for money entry) and `Drizzle` (loading as graduations filling in turn).

## Never

Gradients, glass, glows, emoji, decorative illustration, celestial imagery, eyebrow labels, section numbers, more than one signal element per region, cards inside cards, coloured side borders, or hero-metric templates nobody asked for.
