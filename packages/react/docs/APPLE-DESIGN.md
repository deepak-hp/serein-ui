# Platform guidance within Serein

Apple's Human Interface Guidelines (reviewed against the [design hub](https://developer.apple.com/design/) and the WWDC25 material sessions) inform hierarchy, navigation and accessibility in Serein. They refine the design language; they do not replace it. Serein's identity (one vermilion signal with dark labels, Anek Latin and Chivo Mono, machined corners, solid materials) stays the authority. Exact values live in [foundations](FOUNDATIONS.md).

We do not adopt system blue, San Francisco, SF Symbols, capsule-shaped controls everywhere, or translucent glass.

## Source-to-design decisions

| Apple principle | Serein application |
| --- | --- |
| Separate navigation and controls from content. [Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/) | One navigation plane (`.sr-navigation-surface`) set apart by tone and a hairline, not by translucency. |
| Use materials sparingly and preserve legibility. [Materials](https://developer.apple.com/design/human-interface-guidelines/materials) | All surfaces are opaque. Early Liquid Glass betas measured text contrast as low as 1.5:1; Serein avoids that class of failure entirely. |
| Keep navigation predictable with a clear hierarchy. [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles) | Same content, controls and order in every finish. The page's one primary action stays the vermilion signal. |
| Apply accent colour selectively. [Color](https://developer.apple.com/design/human-interface-guidelines/color) | The signal marks only the primary action, needles and today's value; status never borrows it. |
| Make controls easy to activate. [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) | Labelled controls, visible focus, 48px standard and 36px compact targets. |
| Support contrast preferences and non-colour cues. [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) | Reflow, keyboard checks, forced-colour support. Never use tint or motion as the only state signal. |
| Motion should explain an interaction. [Motion](https://developer.apple.com/design/human-interface-guidelines/motion) | Short, settling motion with announced outcomes; no looping sheen, parallax or animated blur. |

## Navigation surface

Opt in on a single navigation container:

```tsx
<header className="sr-navigation-surface" data-sr-material="subtle">
  {/* Labelled navigation and controls. */}
</header>
```

- **Subtle** (default): the page surface with a hairline edge.
- **Expressive:** the raised surface with the resting shadow, for an inset or floating bar.
- **Solid:** the page surface with no shadow.

All three are opaque in both themes. Increased contrast strengthens the edge to `--sr-color-line-strong`; forced colours use system colours. This is a CSS utility, not a React component or a prop on every control. The application owns padding, positioning and geometry. Do not nest navigation surfaces or attach this class to content tables or forms.

Sticky navigation must not obscure focus (WCAG 2.4.11) or consume short screens.

## Boundaries

This is CSS for React web. It does not reproduce native refraction, Dynamic Type, haptics or system material APIs. Native adapters remain separate work.
