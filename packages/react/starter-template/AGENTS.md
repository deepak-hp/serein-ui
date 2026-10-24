# Building this app with Serein

For screen layout, read `node_modules/@serein-ui/react/ai/COMPOSITION.md`. Establish the user's task and content priority, choose an appropriate recipe, and review the rendered result for hierarchy, responsive behavior and interaction completeness. Reuse the design language without forcing every screen into the same template.

Read UI-LIBRARY.md and the installed package's `node_modules/@serein-ui/react/ai/llms-full.txt` before implementing UI. Use `node_modules/@serein-ui/react/ai/contract.json` and TypeScript declarations to verify exact components and props. Do not invent APIs or assume another UI library's prop names.

Reuse the library's exported controls and tokens. Preserve visible labels, keyboard behaviour, error associations, focus, and reduced-motion preferences. Keep the theme on html and `dp-theme` on body so portals inherit it. Import CSS and the font once, as main.tsx does.

The current app is React web, uses a local package tarball, and has no backend. Do not claim native support or saved data unless actually implemented. Do not claim WCAG/EAA compliance based on automated checks alone.

Run `npm run build` after changes, then check the affected keyboard, validation, light/dark and responsive states. Add meaningful tests when changing behaviour. Avoid edits to node_modules, global AI settings or the bundled contract; update the local library package intentionally when needed.
