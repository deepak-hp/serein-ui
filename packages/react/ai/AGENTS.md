# Consuming Serein

For screen design, read `ai/COMPOSITION.md`: establish the task, select a relevant recipe, compose with the documented controls, then inspect desktop/narrow and light/dark. Preserve the design identity while adapting layout to the actual content. These recipes are not library exports.

Read the package's `ai/llms-full.txt` before implementing UI. If the Serein MCP server is connected, discover its documentation tools and inspect component APIs and stories. Use `ai/contract.json` and declaration files as a fallback. Do not invent props or infer them from another library.

Reuse the exported components, shared tokens, document-level themes and reduced-motion defaults. Keep accessible labels, error descriptions, keyboard behaviour and focus. See `ai/README.md` for setup and `docs/ACCESSIBILITY.md` for validation requirements. Do not claim WCAG or EAA compliance solely from passing automated checks.

Use `docs/FOUNDATIONS.md` for Serein's surface, corner, colour, elevation and type roles. Preserve its warm orange primary actions and opaque content layers. Do not translate the name into weather graphics or apply glass to every component.

Keep resting cards flat, secondary actions tonal, and shadows for transient overlays. Use each status's semantic text/surface pair; reserve green for actual success. Preserve accessible field boundaries and distinguish selected, hovered, and keyboard-focused rows.

Let each component own its frame and scrolling. DataTable already provides a border, horizontal scroll region, accessible name, and keyboard focus; do not add another bordered, scrolling, or focusable wrapper around it. Keep dividers between items, not against a container's existing outer edge.

After a change, rebuild the package, run affected tests, and inspect its story. Add a relevant state/interaction story for new behaviour.
