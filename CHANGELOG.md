# Changelog

All notable changes are recorded here. Each package also has a generated `CHANGELOG.md`.

## 0.1.0 — first npm release

The first registry release of all six packages, on the default `latest` tag: `@serein-ui/react`, `@serein-ui/tokens`, `@serein-ui/css`, `@serein-ui/fonts`, `@serein-ui/format` and `@serein-ui/icons`. Pre-1.0: minor versions may change the API, and changes are recorded here. This is not a WCAG conformance claim. The manual screen-reader, zoom and disabled-user reviews in [the release checklist](docs/RELEASE-CHECKLIST.md) are still open.

Changes since `0.1.0-beta.1`:

- Every web component now follows the Serein design language in both themes. See the [design alignment audit](docs/audits/2026-10-25-design-alignment.md).
  - Type follows the Serein scale.
  - Selection marks are ink, and segmented controls are a raised key on a sunken track.
  - The vermilion signal is kept for actions, needles and today.
  - Drizzle replaces the spinners, focus rings sit 2px off, and machined corners replace pills.
- New `color.scrim` token for modal backdrops.
- Upgraded `@base-ui/react` to 1.9.0.
- Added publish metadata, READMEs and licence files to the tokens, css, fonts, format and icons packages.
- The package check compares licence text regardless of line endings.
- The Next.js consumer fixture follows the library's declared version.

The Serein foundations merge, listed below, also ships in this release.

## Serein foundations merge

- **Breaking (beta):** new visual language, "precision instrument": vermilion signal with dark text, Anek Latin and Chivo Mono (bundled, OFL), machined corners, solid materials. Plus Jakarta Sans is no longer used.
- **Breaking (beta):** theme API is `data-theme` on `<html>` (system preference when omitted) and `sr-theme` on `<body>`; every `--dp-*` variable and `dp-*` class is now `--sr-*` / `sr-*`. Import `@serein-ui/react/fonts.css` before `styles.css`.
- The repository is a pnpm monorepo: `trial/` moved to `packages/react`, and new `@serein-ui/tokens` (DTCG 2025.10 source in `tokens/`, contrast-tested; CSS, JS, JSON, Tailwind v4, Swift, Kotlin), `@serein-ui/fonts`, `@serein-ui/css`, `@serein-ui/icons` and `@serein-ui/format` packages.
- New measurement components: Readout, Tape, Gauge, Meter, RainChart, Keypad and Drizzle, with a Send money pattern.
- Storybook is the single documentation site, with new Foundations pages. The reference app, design studio, catalogue site and evaluation runs were retired (kept in git history).
- Navigation surface materials are always opaque (no blur).
- Dependencies are pinned exactly; installs honour a 14-day minimum release age.

## 0.1.0-beta.1 — 21 October 2026 (GitHub beta)

Published as a [GitHub prerelease](https://github.com/deepak-hp/serein-ui/releases/tag/v0.1.0-beta.1) from `c5c6e4f`. npm publication remains deferred.

- Added guarded GitHub beta archive preparation, checksum/source metadata and exact-archive consumer verification while npm publication is deferred.
- Added a portable, condition-label-hidden human review packet with a local server, frozen evidence, integrity checks and explicit study limitations.
- Renamed the repository to `deepak-hp/serein-ui` and migrated active source and documentation URLs; historical evidence and persisted browser keys retain their original identity.
- Raised active Vite tooling to patched versions for the launch-editor advisories: library/reference minimum `8.3.3` (locks resolve `8.3.5`), starter `8.3.3`.
- Added optional `Checkbox hideLabel` for compact row selection, preserving its required accessible label and a 48px label target; added a wrapping-row example and layout checks.
- Added a production Next.js consumer fixture, focused accessibility checks across three browser engines, and a fresh four-attempt AI comparison with separate agent visual review and preserved original evidence.
- Expanded composition guidance for selection labels, text contrast, mobile clipping, recoverable batch decisions and completed queues.
- Renamed the active library to Serein and the package to `@serein-ui/react`; existing `dp-*` style hooks and demo storage keys remain stable.
- Refined shared light/dark surfaces, primary and secondary states, typography, corners, status fills, and keyboard focus; added the Serein design studio.
- Removed redundant table frames and scroll wrappers, collapsed joined NumberField seams, and corrected Accordion borders and hover corners.
- Added a gated catalogue/Storybook hosting workflow, native accessibility review procedures, a real-application beta feedback kit, and an explicit support matrix.
- Corrected the production contrast verifier to understand minified three-digit CSS hex colours.
- Added release governance, package manifest validation, and a local/CI release gate.
- Added catalogue and workflow guidance and release-readiness evidence.
- Prepared `@serein-ui/react@0.1.0-beta.1` for public beta publication under the MIT License.
- Included the package license and third-party attribution in the npm archive.
- Corrected clean-checkout verification to build the library before type-checking installed-output playground imports.
- Updated the development tooling lockfile to patched `source-map-js@1.2.2` for [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q).
