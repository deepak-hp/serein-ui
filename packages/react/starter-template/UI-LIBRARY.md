# UI library integration

Package: `@serein-ui/react`, installed from the vendored `vendor/serein-ui-react.tgz` archive. npm publication is deferred. This is a React web library with precompiled styles; native mobile and desktop components are not included.

## Read before generating UI

After installation, these local files are the source of truth for any coding assistant:

- `node_modules/@serein-ui/react/ai/llms-full.txt`: usage guide, all public declarations and tokens.
- `node_modules/@serein-ui/react/ai/contract.json`: machine-readable inventory and API fingerprint.
- `node_modules/@serein-ui/react/docs/API-CONTRACTS.md`: controlled values, overlays, forms and package boundaries.
- `node_modules/@serein-ui/react/docs/ACCESSIBILITY.md`: implementation and application responsibilities.

Give an assistant this prompt: “Read AGENTS.md and UI-LIBRARY.md, then the installed library contract. Build this feature with exported components, preserve the tokens and keyboard behaviour, and verify the result. Identify missing capabilities instead of inventing props.”

Tools that do not discover AGENTS.md automatically can read this file when explicitly provided. No single instruction-file convention is supported by every AI product.

## Optional live Storybook connection

If the library checkout's Storybook is running locally, its MCP endpoint is `http://127.0.0.1:6006/mcp`. Use your client's supported Streamable HTTP setup, discover its tools, then read component docs/examples. Client configuration formats differ. A cloud-only client cannot reach this machine's localhost. The installed offline files remain usable without Storybook or MCP.

## Theme and component rules

Keep Serein's tokens and fonts (Anek Latin; Chivo Mono only for measurements). The vermilion signal is the one primary action per view and uses dark text. Theme belongs on html; body has `sr-theme`, including portal content. `src/theme.ts` remembers an explicit preference when browser storage is available.

Selection controls use controlled values and callbacks. Date picker values are ISO date-only strings; ranges must preserve a partial first selection. Overlays expose controlled open state, but confirm callbacks do not await your asynchronous work automatically. Read the actual contracts before composing a save flow.

## Updating the local package

Build and pack an intentional library version in its checkout. Copy the new archive into this app's vendor directory and install it with npm so the manifest/lock record its integrity. Use a new filename for a changed archive to avoid stale same-version caches. Restart the dev server after updating dependencies. Never run the starter generator over an existing app.
