# Apple guidance within Serein

Reviewed 27 September 2026 against Apple's [design hub](https://developer.apple.com/design/), current Human Interface Guidelines and the linked WWDC25 sessions. This is a refinement of our existing design language, not a claim that Apple released these guidelines today.

## Identity stays personal

The approved astrology-informed identity remains the authority for colour roles and character: orange with dark `#141414` labels, white and near-black canvases, Plus Jakarta Sans, clear controls, restrained green for success, and textual error/status feedback. Serein retains `#FF681F` in light mode and uses the brighter `#FF803E` in dark mode. Its current geometry and surfaces are documented in [foundations](FOUNDATIONS.md). Historical palette proposals do not override the implemented tokens. The private chart research remains private. Exact hex values, fonts and geometry are design decisions within that interpretation, not values prescribed by astrology.

Apple's guidance informs interaction and material use within this identity. We do not replace the palette with system blue, substitute San Francisco or SF Symbols, introduce zodiac decoration, or make every control a capsule.

## Source-to-design decisions

| Apple principle | Our application |
| --- | --- |
| Separate navigation and controls from the content; avoid stacked glass. [Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/) | One optional translucent navigation plane. Tables, forms, cards, menus and dialogs retain their current opaque surfaces. |
| Use materials sparingly and preserve legibility. [Materials](https://developer.apple.com/design/human-interface-guidelines/materials) | Dense neutral fills in both finishes; opaque fallback if blur or colour mixing is unsupported. No clear glass over text-heavy content. |
| Keep navigation predictable and show a clear hierarchy. [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles) | Same content, controls and order in every finish. The page's main action remains filled orange. |
| Apply accent colour selectively. [Color](https://developer.apple.com/design/human-interface-guidelines/color) | Orange keeps its existing primary-action/selection roles; neutral navigation lets it remain prominent. |
| Make controls understandable and easy to activate. [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) | Keep labelled controls, visible focus and the existing 44–48 CSS-pixel main control targets. Apple's point-based sizing is native guidance, not a web conformance measure. |
| Support enlargement, contrast preferences and non-colour cues. [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) | Reflow, keyboard checks, opaque high-contrast/transparency fallbacks and a manual Solid choice. Never use blur, tint or motion as the only state signal. |
| Motion should explain an interaction. [Motion](https://developer.apple.com/design/human-interface-guidelines/motion) | Keep existing action/status feedback and reduced-motion behaviour. No looping sheen, parallax, lens distortion or animated blur on the navigation. |

## Two finishes, one system

- **Subtle:** default navigation finish, lightly translucent neutral surface, 12px blur and shallow elevation. The reference app uses an edge-to-edge bar.
- **Expressive:** more visible elevation and 24px blur, with a dense 88% canvas fill. The reference app gives this bar an inset outer frame at every viewport width, including when accessibility settings remove the glass; its controls remain crisp. This is our interpretation, not Apple's native Clear material.
- **Solid:** no translucency, blur or shadow. Available explicitly, even when a browser cannot expose the OS transparency preference.

All choices support light and dark themes. They change the navigation material only. No green, gold or new accent family is introduced. The reference app's Appearance panel lets you compare the same working page; preferences there last for the current session.

The reference app also offers an explicit **Preview glass effects** checkbox, off by default. This demo-only opt-in bypasses reduced transparency for its navigation and adds a solid/glass comparison over identical movable backdrops. It does not change OS settings or the distributed library's defaults. Increased contrast and forced colours still take priority. Turn it off to restore the system preference. The comparison uses the existing expressive fill and blur, not a simulated image or a more transparent production token.

## Use in an app

Import the normal library stylesheet, set `data-dp-theme` on html and `dp-theme` on body as usual, then opt in on a single navigation container:

```tsx
<header className="dp-navigation-surface" data-dp-material="subtle">
  {/* Labelled navigation and controls. */}
</header>
```

`data-dp-material` accepts `subtle`, `expressive` or `solid`; omission uses subtle. This is a CSS utility, not a React component or a prop accepted by every library control. The application owns padding, positioning, geometry and the accessible preference control. Do not nest material surfaces or attach this class to a content table or form.

`prefers-reduced-transparency: reduce`, `prefers-contrast: more` and forced colours override either glass finish with an opaque surface. Browser/OS support for transparency preferences varies; retain a user-selectable Solid mode. Unsupported backdrop filtering or colour mixing falls back to an opaque background. Never weaken the neutral fill without retesting contrast against the content underneath.

Sticky navigation must not obscure focus or consume short screens. In the reference app it becomes ordinary document flow at narrow widths and short viewport heights; anchor spacing protects content on larger screens.

## Boundaries and checks

This is CSS for React web. It does not reproduce Apple's native refraction, automatic content-aware tinting, Dynamic Type, haptics or system material APIs. Native adapters remain separate work.

`npm run check:materials` verifies actual computed styles, accessible preference controls, both themes, opacity fallbacks, extreme-backdrop contrast and narrow reflow in Chromium against the reference app. Storybook contains identical Subtle, Expressive and Solid specimens under Foundations / Navigation material. Automated checks do not establish full WCAG or EAA conformance; Safari/VoiceOver and other manual release checks remain in ACCESSIBILITY.md.
