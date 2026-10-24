# SSR and hydration

The regression fixture renders the compiled library with `react-dom/server`, then hydrates the same component tree with `hydrateRoot`. It includes all 42 components and both hooks in their initial states; it does not exercise every component state or every server framework. Date controls use fixed date-only values and a fixed today; the browser uses America/Los_Angeles to check consistency across time zones.

Apply `data-dp-theme="light"` or `"dark"` to `<html>` and `class="dp-theme"` to `<body>`. This document-wide theme setup lets portalled dialogs, menus, and tooltips inherit the same tokens after hydration.

Run `npm run check:ssr` after `npm run build` to verify the compiled package has no DOM access during server render, hydrates without recoverable errors, keeps generated IDs unique, and supports representative field, Select, and Dialog interactions.

The current check uses Chromium and a light document theme. Streaming, Suspense boundaries, server-component frameworks, and other browsers need separate integration checks. The package preserves a client directive for framework tools; application callbacks and state still belong on the client.
