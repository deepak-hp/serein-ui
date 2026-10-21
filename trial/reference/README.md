# Reference workspace

A local project workspace built from a local `@serein-ui/react` tarball. It exercises the library's public API and precompiled CSS without source aliases or a StyleX compiler.

## Run

Use the repository's Node 24 runtime. From `trial`:

```sh
npm ci
npm run reference:setup
npm run reference:dev
```

Open http://127.0.0.1:5174. Setup builds the library, packs it into a content-addressed archive in `reference/vendor`, and installs the archive and app dependencies. Run setup again after changing library code. The vendor archive is generated locally and ignored by Git; run setup before installing this app from a fresh checkout.

The app itself is ordinary React/Vite. Its `src` imports components and types from `@serein-ui/react`, imports CSS/font once in `main.tsx`, and sets document-wide theme attributes so portals inherit the theme. There is no custom build transform for library styles.

Setup deliberately updates this app's package manifest and lockfile to the generated tarball hash. This makes a changed local library install as a new artifact even when its local version number stays the same. Generated archives remain in the ignored vendor directory.

## Try the workflow

- Search projects by name or client; filter by status or due-date range, sort and move between pages.
- Create or edit a project, correct validation errors and save. Reload to verify local persistence.
- Open Demo controls and enable the next-save failure. Your failed save should retain its draft; retry to complete it.
- Archive a project after confirmation, then find it in Archived.
- Switch light/dark theme and use the keyboard to navigate controls and dismiss the editor.

## Data boundaries

Projects are fictional samples. Changes are stored only in localStorage under `ritam-ui.reference.projects.v1` for this browser and origin. Existing pre-rename data is read from its legacy key only when the Ritam key is absent; new saves use the Ritam key. There is no backend, authentication or cross-device sync. Avoid sensitive data. Clearing browser storage removes saved changes. A malformed or unsupported storage envelope is reported rather than overwritten with samples.

Loading/saving delay and the failure switch are explicitly demo behaviour. A successful save means the browser storage write succeeded. Storage access failures remain visible and can be retried.

## Verify

From `trial`, after setup:

```sh
npm run reference:test
npm run reference:build
npm run check:reference
npm run check:reference-accessibility
```

The last command requires the app running on port 5174 and the repository Playwright browser installed (`npm run test:browser-install`). It uses an isolated browser context and fictional data. Screenshots go to `trial/.review/reference`. Tests are automated evidence; manual screen-reader, forced-colour and zoom audits remain part of release work.

Both browser checks require the running app. The accessibility check adds keyboard-only editing, 320px reflow, text-spacing overrides, simulated 200% text enlargement, forced-colour emulation and reduced-motion checks. Its screenshots and machine-readable results go to `trial/.review/reference-accessibility`. See [the manual test protocol](ACCESSIBILITY-REVIEW.md) for the remaining assistive-technology and native zoom checks.

After running setup to install an updated library, restart the app's dev server so Vite reloads the dependency styles.
