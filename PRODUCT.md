<!-- impeccable:product-schema: 1 -->
# Serein

## Platform
web

## Purpose and users
An MIT-licensed design system for Deepak's future apps and the open-source community: shared tokens for web, mobile and desktop, with a React web component library first (public beta prepared, not yet on npm). Developers and coding assistants need reliable components, readable contracts and realistic examples.

## Capabilities and constraints
A pnpm monorepo: `@serein-ui/react` (components and hooks on Base UI, compiled CSS, Storybook as the documentation site, offline/live AI documentation) plus foundation packages for tokens (CSS, JS, Tailwind, Swift, Kotlin), fonts, base CSS, icons and money formatting. React Native is the next platform; native SwiftUI/Compose component kits only on demand. AI workflow examples are reviewed client-side demonstrations, not evidence of general AI improvement.

## Brand commitments
The user chose the "precision instrument" direction (October 2026) after rejecting softer, template-like looks: fine graduations, exact readouts, one vivid **vermilion** signal with dark text, Anek Latin (Chivo Mono for measurements only), machined corners, solid materials, dark-led with light as an equal. The astrology-informed foundation is symbolic and structural (Jantar Mantar scales, the rain gauge), never celestial imagery; personal chart details stay private. DESIGN.md and the `tokens/` source record the implementation.

## Evidence on hand
Source tokens in `tokens/` (built by @serein-ui/tokens, contrast-tested), component stories, packages/react/docs/VERIFICATION.md. Sample names and amounts in stories and examples are fictional.

## Product principles

Coding assistants receive task-oriented composition recipes in `packages/react/ai/COMPOSITION.md`, a generated contract and live Storybook MCP. Use existing public APIs. Make every visible control work. Expose actionable recovery states. Document limits honestly. Keep integration simple and compiler-free for consumers.

Apple HIG informs hierarchy, navigation and accessibility within Serein; materials stay solid (no translucency). See packages/react/docs/APPLE-DESIGN.md.

## Accessibility and inclusion
WCAG 2.2 AA is the target. Automated tests are evidence, not conformance certification; manual assistive-technology and applicable EAA review remain open.
