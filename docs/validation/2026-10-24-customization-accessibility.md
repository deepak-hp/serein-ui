# Serein customization accessibility check — 24 October 2026

## Scope and ownership

The owner requested a checklist focused on Serein's customizations, continued background checks, and deferred npm publication. This review keeps Base UI's upstream keyboard/ARIA/focus behavior as the foundation and retains bounded regression tests where Serein integrates it. It does not attempt to reproduce Base UI's entire upstream platform matrix.

| Owner | Review scope |
| --- | --- |
| Base UI / DayPicker | Upstream primitives and calendar behavior; preserve their contracts when composing them |
| Serein | Theme/state contrast, visible focus, target sizes, responsive layout, motion and material fallbacks; wrapper labels/errors/disabled state; custom tables/status/date adapters; nested layers and distinct workflow recovery/focus outcomes |
| Consuming product | Its content, localization, actual services and complete processes; applicable legal obligations and any conformance claim |

The [master checklist](../RELEASE-CHECKLIST.md), [evidence matrix](../../trial/docs/ACCESSIBILITY-EVIDENCE.md), [support policy](../SUPPORT.md) and [native protocol](../../trial/reference/ACCESSIBILITY-REVIEW.md) now use this division. Native review selects representative Serein-owned risks and records exact paths and any reuse. Different wrappers, compositions, states or environments cannot be passed by analogy. Full task scripts and historical evidence are retained.

## Candidate and environment

- Runtime/source baseline: `0b9a6c4d85af0b60ed8b1c189a6f00783f5af884`; this change updates documentation only, with no component, token, dependency or test changes.
- Windows build `10.0.26300.0`, Node `24.19.0`, Base UI `1.8.0`, Vitest `4.1.11`, Playwright `1.63.0`, axe-core `4.13.0`.
- Headless Chromium `153.0.8010.12`, Playwright Firefox `155.0`, WebKit `26.6`.
- Fresh library build, local package installation and reference production build. No source alias was used for the reference checks.
- Tested local archive: `serein-ui-react-58471e805a0b.tgz`, SHA-256 `58471e805a0b31cd39732a0f5254bcbd2561d91963dee60b84f471c6f2da6d9f`. This is a test artifact, not a replacement for the published beta asset.
- Successful run: 09:44:33–09:48:06 UTC (15:14:33–15:18:06 Asia/Calcutta), 24 October 2026; all 15 command groups exited `0`.
- No native window, desktop focus, screen-reader audio or OS preference was changed. npm authentication and publication were not attempted. Frozen evaluation directories and the published beta tag/assets were not changed.

## Executed checks

| Serein risk / check | Result |
| --- | --- |
| `npm test` | 87 tests in 16 files passed, including wrapper semantics, date adapters, custom feedback and async state/cancellation behavior |
| `reference:setup`, `reference:build`, `reference:test` | Fresh packed-library reference build and all 15 reference tests passed |
| `test:stories` | 141 stories in each light/dark × full/reduced-motion combination: 564 cases passed, with browser interaction and axe assertions |
| `check-accessibility-gaps.mjs` in Chromium, Firefox and WebKit | Six scenarios per engine: 18 passes, zero failures. Disabled wrapper options, nested Drawer/Dialog focus, error correction/live-status DOM semantics, bounded targets/text spacing and forced-colour focus |
| `check-compact-checkbox.mjs` | Four theme/width cases passed at 320/1280 px: 48 × 48 px label targets, edge activation, disabled state, long-label layout, zero recorded axe violations and no page overflow |
| `check:reference-accessibility` in Chromium | Five scenarios passed: 320 px reflow, text spacing, injected doubled-font stress, forced-colour emulation and keyboard-only editing with validation/discard/save focus recovery |
| `check:materials` in Chromium | Three finishes in both themes, keyboard/sticky-focus checks, 320 px reflow, axe and three opaque media-preference fallbacks per theme passed; minimum text contrast in the tested navigation/backdrop combinations was 4.72:1 |
| `check:serein` in Chromium | Eight theme/viewport axe audits plus token/state contrast, pointer/keyboard focus distinction, unclipped accordion focus, async/cancellation and full/reduced-motion checks passed |
| `check:workflows` in Chromium, Firefox and WebKit | Per engine: 18 route/theme/width and 8 state/theme axe/overflow audits, three text-spacing checks and three keyboard paths passed. Invalid input, retry, persistence and storage recovery retained; zero recorded axe violations, page overflow or browser errors in those audited states |

The first sandboxed unit invocation stopped before executing tests because Vitest could not rename a cache file (`EPERM`). The permitted background rerun completed the unit suite; no test or runtime configuration was weakened. The existing jsdom canvas notice means unit axe does not measure colour contrast; rendered token/material checks provide separate bounded evidence. Storybook's existing preview-annotation warning was non-blocking.

## Reproduction and evidence

From `trial` with Node 24, installed lockfile dependencies and the recorded Playwright engines:

```sh
npm test
npm run reference:setup
npm run reference:build
npm run reference:test
npm run test:stories
node scripts/check-accessibility-gaps.mjs chromium
node scripts/check-accessibility-gaps.mjs firefox
node scripts/check-accessibility-gaps.mjs webkit
node scripts/check-compact-checkbox.mjs
```

Run a headless-safe Vite preview of `reference/dist` on a free loopback port without `--open`. Supply that address as `REFERENCE_URL` for `npm run check:reference-accessibility`, `npm run check:materials` and `npm run check:serein`. Run `npm run check:workflows` separately with `BROWSER=chromium`, `firefox` and `webkit`; that script serves its own static fixture when `REFERENCE_URL` is unset. Stop only the preview process started for these checks.

Ignored local logs and command exit records are under `trial/.review/customization-2026-10-24/`. Result JSON and screenshots are under `trial/.review/accessibility-gaps/{chromium,firefox,webkit}`, `compact-checkbox`, `reference-accessibility`, `materials` and `workflows` (engine subdirectories for Firefox/WebKit); Serein studio results are under `.impeccable/review/serein-results.json`. These local artifacts supplement this committed record; future candidates must rerun the checks. Incidental reference-manifest tarball hashes are restored after the run, keeping the documentation change independent of generated package names.

## Still pending

- Native NVDA/Firefox review of representative Serein labels, announcements, table/date interaction and composed focus/recovery paths; deferred under the background-only instruction. Mac VoiceOver/Safari follows later.
- Actual browser zoom and native contrast/reduced-motion/visual-focus review on the selected layouts in both themes. Viewport changes, injected CSS, DOM status semantics and headless WebKit are not substitutes for these observations.
- Disabled-user usability feedback, independent human AI-design review, and consuming-product content/full-process/EAA assessment. None is marked complete by this run.
- npm ownership/authentication and publication remain deferred.

These checks support the public React-web beta. They do not establish accessibility conformance, native assistive-technology support or a stable production-release claim.
