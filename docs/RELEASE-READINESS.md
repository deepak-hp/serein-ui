# Serein release candidate

Current Serein work is recorded in [the redesign and frame audit](SEREIN-REDESIGN.md) and [the beta release plan](superpowers/plans/2026-10-13-serein-beta-release.md). Historical results below apply to their named revisions, not automatically to later changes.

This record accompanies the [master checklist](RELEASE-CHECKLIST.md). The current milestone is a React-web beta with public MIT-licensed source, deployed documentation and verified GitHub downloads. npm publication is deferred and manual accessibility/human evaluation remains open; these deliveries do not establish a stable production release.

## Customization review — 24 October 2026

The accessibility checklist now separates Base UI's upstream primitives, Serein's styling/wrappers/custom compositions, and consuming-product responsibilities. Representative native review retains distinct custom recovery and focus outcomes without repeating every upstream component/device permutation.

Fresh background checks passed on the unchanged runtime at `0b9a6c4`: library/reference tests, all four theme/motion story combinations, focused wrappers in three engines, compact checkbox targets, rendered theme/material checks, and invoice/settings/onboarding workflows in Chromium, Firefox and WebKit. See the [dated commands, environment and bounded results](validation/2026-10-24-customization-accessibility.md). No runtime fix was needed. npm publication, native screen readers/actual zoom and human review remain pending.

## Delivered scope

- Searchable catalogue for all 42 components, with live previews, typed source, API links, themes and keyboard navigation.
- Complete invoice, settings and onboarding demonstrations, including pending states, validation, failures, retries and local persistence where appropriate. Operations are explicitly simulated; no email, payment or account service is connected.
- Reviewed workflow source distributed with the AI contract, composition recipes and assistant-neutral offline guidance. Freshness checks distinguish real source changes from Windows/Linux line endings.
- Foundations preserve Flame & Ink: orange primary actions, white/near-black surfaces, Plus Jakarta Sans, restrained success green, crisp controls and optional navigation materials.
- Accessibility evidence and a reproducible AI evaluation protocol. Automated checks do not establish WCAG/EAA conformance or prove that AI-generated designs improve.

## Review and verification

This section records the **28 September 2026 baseline**. The dated updates below record subsequent tests, hosted CI and deployment; these historical counts and setup limits are not the current release status.

The catalogue, workflows, AI guidance and release tooling received independent reviews, followed by a whole-branch review. No material findings remain. Review fixes include recovery-button focus return and cross-platform AI fingerprint stability. Integration also corrected an assertion that checked focus before popup removal and two legacy browser checks that ignored the release runner's server address.

Verification environment: Windows, Node 24.19.0, npm 10.8.1 and Chromium. On 28 September 2026, the complete `npm run check:release` command finished with exit code **0**, including the live MCP checks and all browser audits. The final run reused cached dependency downloads; the separate clean-source install verified the lockfile from an empty dependency directory. Raw local output: `packages/react/release-final-pass.log`.

| Area | Verified coverage |
| --- | --- |
| Library | 84 unit tests; strict type check; compiled library and playground builds |
| Distribution | Tarball allowlist and stale-file regression; strict fresh consumer without StyleX compiler; server rendering, hydration and focus |
| Starter and reference | 8 starter unit tests, fresh generated-app installation/build/browser check; 15 reference unit tests; installed-package reference build |
| Storybook | 140 stories in four theme/motion combinations (560 cases); static build; live documentation, icon motion and responsive layout checks |
| AI | Current declarations, tokens and six source mirrors; LF/CRLF regression; actual MCP discovery and typed metadata for all 42 components |
| Catalogue | 84 component/theme audits; all previews at 1440/390/320px; search, history, keyboard, clipboard fallback and nested static assets |
| Workflows | 18 route/theme/viewport plus 8 state/theme accessibility and overflow audits; validation, focus, failures, retries and storage recovery |
| Existing experiences | Project workspace operations; five accessibility scenarios; three navigation finishes in both themes; 16 composition cases and keyboard/forced-colours checks |

These are distinct coverage counts, not an aggregate quality score. Repeated verification runs are not counted as additional tests. Local logs and browser captures are ignored artifacts under `packages/react` and `packages/react/.review`; CI uses the same release command.

An independent Git source export with no preinstalled dependencies passed `npm ci`, library build, package manifest checks, AI freshness, fresh reference setup and the reference production build. The missing vendor archive was successfully regenerated from source. The dependency audit reported zero known vulnerabilities; this is a point-in-time registry result, not a security guarantee.

Known non-blocking tooling notices at that baseline: Storybook preview annotation/docgen and documentation chunk-size warnings; npm emitted an optional-package cleanup warning during the Windows clean install, which still completed successfully. Hosted Linux CI was configured but had not yet been observed running. Successful hosted runs are recorded in the later dated updates.

## Decisions retained

- Work used a dedicated branch in the existing checkout to retain installed dependencies and the live reference app.
- The user's unattended instruction authorized reversible implementation decisions without an interview pause.
- The invoice example uses Serein's exported DataTable so the canonical AI recipe demonstrates component reuse.
- The owner subsequently approved MIT licensing, applied on 7 October 2026. Public source/documentation and the GitHub beta reviewer call are recorded below; npm publication remains pending.

## External release gates

- Verify the applied MIT license and dependency notices on each release candidate.
- Confirm npm scope ownership and publication authentication, then publish and verify the exact beta in a clean registry consumer. The owner deferred npm work on 21 October 2026; use verified GitHub beta archives or local tarballs meanwhile.
- Perform representative native NVDA/Firefox and VoiceOver/Safari checks and actual browser zoom for Serein's styling, wrappers, custom components and composed flows using the [scoped protocol](../packages/react/reference/ACCESSIBILITY-REVIEW.md). Native review remains deferred during background-only work. Consuming products separately own complete-process evaluation and applicable EAA review.
- Run the multi-task AI evaluation with independent human review before making improvement claims.
- Recheck active release/site links for each future launch using the [launch checklist](LAUNCH-DRAFTS.md#repository-name-at-launch). The Serein rename, new Pages deployment and authorized GitHub announcement update are verified below; additional announcement destinations still require owner authorization.

Native adapters, desktop examples, Figma parity, RTL/localization and advanced modules remain visible in the master checklist. They are not represented as implemented React-release capabilities.

## Beta verification — 7 October 2026

The owner approved the proposed public beta sequence. MIT licensing is applied at the repository and package level; `@serein-ui/react@0.1.0-beta.1` is configured for public access under the `beta` tag, but has not been published.

The first hosted Linux run found that a clean checkout type-checked playground imports before building `dist`. The aggregate check now builds the library first. [Linux run 37526475891](https://github.com/deepak-hp/ritam-ui/actions/runs/37526475891) passed the complete release gate on `cd7280a`. The same complete local gate passed for the beta working tree (`packages/react/beta-release.log`, exit 0), including 84 unit tests, 560 story cases, package/consumer/SSR checks, reference/starter checks, live MCP, catalogue, workflows and existing experiences. Later changes still require their own hosted checks before merge.

The rebuilt beta reference workflows also passed in Firefox and WebKit, with the same 18 route/theme/viewport and 8 state/theme audits, plus three text-spacing checks and three keyboard paths per engine. Chromium passed these within the integrated gate. Browser-engine checks do not replace native NVDA, VoiceOver, browser zoom or human review. See [the evidence matrix](../packages/react/docs/ACCESSIBILITY-EVIDENCE.md).

The development lockfiles now resolve `source-map-js@1.2.2` for [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). Fresh registry audits of both lockfiles returned zero findings. This is a point-in-time result, not a security guarantee. Public static builds retain the full Plus Jakarta Sans OFL text and project MIT text; both reference and Storybook output hashes matched their source copies at the recorded revision.

Publication access is not complete: npm identity lookup returned 401, the connected hosting account returned no teams, and the repository remains private. The license approval is resolved; actual distribution, native assistive-technology review, independent human AI evaluation and public promotion remain open.

The [twelve-attempt AI pilot](../packages/react/evaluation/RESULTS.md) is preserved in the repository, including frozen inputs, initial/final outputs and both original and supplemental test evidence. Final outputs all compiled; the corrected supplemental verifier passed 28 scripted interaction scenarios and reported 21 failures among 48 render checks. Those bounded observations do not establish a quality winner. Independent review confirmed that test-harness corrections and provenance limits are disclosed. The condition-label-hidden review packet is ready for actual human evaluation.

The final source review has no unresolved material findings within its scope. The latest-head GitHub status and integration state are recorded on [PR #1](https://github.com/deepak-hp/ritam-ui/pull/1); earlier green runs do not attest later commits. Local packaging produces a 49-file beta archive with licensing, compiled library, AI guidance and public docs; experiment candidates are excluded.

[Linux run 37528468167](https://github.com/deepak-hp/ritam-ui/actions/runs/37528468167) passed the integrated gate and the additional Firefox and WebKit workflow checks on `a851552`. A subsequent run exposed an intermittent alert-dialog test assertion before asynchronous initial focus completed. The affected test now waits for initial and restored focus; all seven overlay tests and all 84 unit tests passed locally after the repair. The final revision still requires a green hosted run before integration.

Run 37530520023 then exposed an unnamed MultiSelect listbox during the full-motion story audit. MultiSelect and the related Combobox now explicitly name their option lists from the existing field label. Regression assertions check the names while the lists are open; accessibility rules remain enabled. The complete local gate passed again after this repair (`packages/react/beta-final-release.log`), as did rebuilt-reference Firefox and WebKit checks (`packages/react/beta-final-firefox.log`, `packages/react/beta-final-webkit.log`). Final hosted verification is tracked on PR #1. The AI pilot retains its earlier frozen package snapshot and is not silently rerun against this repair.

## Serein candidate verification — 13 October 2026

The full local `npm run check:release` gate passed after the Serein rename, visual refinement and frame audit. It includes 84 unit tests, 560 Storybook cases, packed consumer and SSR/hydration checks, generated AI and live MCP checks, starter/reference builds and tests, catalogue/workflow audits, and the new Serein studio checks. Raw ignored log: `packages/react/serein-release.log`.

The fresh aggregate run executed on Windows with Node `24.19.0` and npm `10.8.1` and exited `0`. Its Chromium workflow used Playwright engine `153.0.8010.12`. Separate rebuilt-package workflow runs exited `0` with Firefox `155.0` and WebKit `26.6`; each covered 18 route/theme/viewport audits, 8 additional state/theme accessibility and overflow audits, text spacing and keyboard paths for all three complete workflows, and the interaction and recovery cases recorded by the workflow verifier. The browser versions were captured by launching each installed engine and reading `browser.version()` after the checks.

The first production run found a verifier defect: Vite minifies six-digit CSS hex colours to three digits where possible, while the contrast helper only parsed pairs of digits. The helper now expands shorthand before computing luminance. Production colours and contrast thresholds were unchanged; the corrected complete gate passed. Independent source review found no additional material issue in the Serein candidate and deployment preparation.

Fresh npm audits of both package and reference lockfiles reported zero findings. A targeted scan of working source and all local Git-history blobs found no matching credential patterns, exact private birth details, or tracked private research paths. This bounded review is not a guarantee against all possible undiscovered secrets.

The combined documentation site was assembled separately with Node `24.11.1` for the repository base path `/ritam-ui/`. All five site-builder tests passed, followed by the complete reference and Storybook build and the browser smoke check of the assembled subpath. The local artifact verifies catalogue, Storybook and required asset routing under that base path; it is not evidence of a deployed GitHub Pages site or a hosted CI result for the final revision.

Npm authentication still returns HTTP 401; a public package lookup returns HTTP 404 and does not prove scope ownership. Native NVDA/Firefox, VoiceOver/Safari and actual zoom review remain pending. The [review protocol](../packages/react/reference/ACCESSIBILITY-REVIEW.md), [real-application beta evaluation kit](BETA-EVALUATION.md) and [support matrix](SUPPORT.md) record these limits. No external reviewer feedback, npm publication, accessibility certification or stable 1.0 approval is claimed.

The reviewed candidate was committed as `72a6de4` and opened in [PR #2](https://github.com/deepak-hp/ritam-ui/pull/2). After the privacy review and complete local release gate passed, the repository was made public and GitHub private vulnerability reporting was enabled; API reads confirmed `PUBLIC` and `enabled: true`. Pages is configured for Actions and its deployment environment permits only the `main` branch. Actual hosted checks and deployment must still pass independently of those settings. The assembled Storybook manager was also opened locally at `/ritam-ui/storybook/`; its Button navigation, documentation and rendered examples loaded correctly.

## First public Serein deployment — 13 October 2026

[PR #2](https://github.com/deepak-hp/ritam-ui/pull/2) merged after [release checks on `d2e9cb9`](https://github.com/deepak-hp/ritam-ui/actions/runs/38415009134) passed. The merged revision `3809c26` then passed its own [complete Linux release check](https://github.com/deepak-hp/ritam-ui/actions/runs/38416528961), followed by the [Pages build, smoke check and deployment](https://github.com/deepak-hp/ritam-ui/actions/runs/38417887319). GitHub deployment `7041958190` reports success.

Public browser verification confirmed the catalogue redirect, working Button specimen, Checkbox navigation and permalink reload, both themes, and the Serein design studio. HTTPS reads of `site-metadata.json`, the MIT license and AI reference each returned 200 with expected content. Storybook's manager and sidebar Button documentation loaded, but this additional inspection exposed a separate defect in the Markdown catalogue cross-links: they duplicated the `?path=` prefix and escaped the hosted Storybook path. The initial smoke test covered story/docs iframes and therefore missed that manager navigation.

The follow-up fixes generated catalogue links and the workspace example link using Storybook route paths. It also preserves the hosting prefix in Link/Breadcrumbs examples and adapts three source-document links for the hosted Apple/accessibility documentation without changing package Markdown. The rebuilt site passed an expanded Chromium check that clicks the actual catalogue Button link, asserts the manager URL remains under `/ritam-ui/storybook/`, and waits for Button documentation. The five site tests and AI-document freshness check passed as well. These are local results for the follow-up patch; its hosted CI and public deployment must pass independently before that revision is considered published.

Public destinations: [catalogue](https://deepak-hp.github.io/ritam-ui/?view=catalogue), [design studio](https://deepak-hp.github.io/ritam-ui/?view=serein), [Storybook](https://deepak-hp.github.io/ritam-ui/storybook/), and [AI reference](https://deepak-hp.github.io/ritam-ui/catalogue-assets/ai/llms-full.txt).

The navigation follow-up merged in [PR #3](https://github.com/deepak-hp/ritam-ui/pull/3). Revision `d8f8c547cfaa08552ca3d88b54b338692ed62836` passed [the complete hosted release check](https://github.com/deepak-hp/ritam-ui/actions/runs/38421506095) and [the subsequent Pages build, smoke check and deployment](https://github.com/deepak-hp/ritam-ui/actions/runs/38422901572). Deployment `7042789921` reports success; the deployed Storybook catalogue-to-Button link was also exercised in the browser.

## Beta review preparation — 14 October 2026

The [announcement and reviewer-invitation drafts](LAUNCH-DRAFTS.md) now point to the public catalogue, Storybook and working feedback form. They distinguish the available React-web beta from pending npm publication and independent review. GitHub Issues is enabled and Discussions is disabled; no social account or reviewer contacts have been selected. No announcement, invitation, human review or external adoption is implied by preparing these materials.

The [focused accessibility audit](validation/2026-10-14-accessibility.md) passed six scripted scenarios in each of Chromium, Firefox and WebKit. A [separate installed-package Next.js consumer](validation/2026-10-14-next-consumer.md) passed a production build and SSR/hydration, keyboard validation, first-save failure/retry, pending protection, theme, 320px layout and axe checks. These are internal checks; the native-device and external-reviewer gates remain open.

The [fresh file-review trial](validation/2026-10-14-ai-trial.md) retains four initial/final generated attempts. All four compiled without corrections. Primary browser records contain 10/12 passing scripted interactions and 10/16 passing initial renders. A separately documented label-lookup correction produced 12/12 passing interactions; render results remained 10/16, with contrast violations in the six failing cases. The original inputs, sources and results are preserved.

Separate [agent visual observations](../packages/react/evaluation-next/AGENT-VISUAL-REVIEW.md) found mobile checkbox/text collisions in all four candidates, despite zero recorded page overflow. Both Serein attempts passed the bounded automated checks but still had material visual problems. This exposes the limits of the checks rather than establishing a design-quality winner. The follow-up adds an opt-in compact Checkbox label API and more explicit composition guidance; it does not repair or rescore the frozen candidates. Human review remains unperformed.

## Non-npm distribution receipt — 21 October 2026

PR [#9](https://github.com/deepak-hp/serein-ui/pull/9) merged into the renamed `deepak-hp/serein-ui` repository. The local `origin` now targets that repository, and the old repository API resolves to the new identity. GitHub private vulnerability reporting is enabled. Hosted PR run `39629944076` passed on `5f40d9c`; post-rename run `39631681188` passed on the same head. The full local release gate passed with Vite `8.3.5`. Fresh root and reference dependency audits reported zero findings across 401 and 69 dependencies.

The merged-source package was prepared from clean commit `c5c6e4f`; the supplied archive SHA-256 is `edbb1fbcf45ed4b78bc6695bb0985f86b6a6e76130b6f6ac616cb41d461513d1`, and its supplied consumer check passed. The final reviewer packet contains 56 files, verifies 48 frozen input hashes, and passed all 16/16 headless playback checks. Candidate sources and historical failures remain preserved.

[Main CI 39633424831](https://github.com/deepak-hp/serein-ui/actions/runs/39633424831) and [Pages run 39634992982](https://github.com/deepak-hp/serein-ui/actions/runs/39634992982) passed on the merged revision. Deployment `7231357980` reports success. Public headless checks passed catalogue, Storybook navigation/story/docs, metadata/license/AI assets, compact Checkbox keyboard behavior in both themes and the Serein studio. Use `https://deepak-hp.github.io/serein-ui/`; the old Pages URL returns 404.

The [GitHub beta](https://github.com/deepak-hp/serein-ui/releases/tag/v0.1.0-beta.1) is published with five assets. All freshly downloaded bytes matched the prepared files and all checksum entries verified. The exact downloaded `.tgz` passed the isolated consumer check without changing its hash. The downloaded reviewer ZIP verified all 56 files and passed 16/16 playback checks. [Reviewer announcement #5](https://github.com/deepak-hp/serein-ui/issues/5) now links the verified destinations. See [the complete delivery receipt](validation/2026-10-21-beta-distribution.md).

The beta tag and published assets identify `c5c6e4f`; subsequent documentation does not replace them. npm publication, native accessibility checks and independent human review remain open. The packet does not count as completed human review.

## 0.1.0 npm candidate — 26 October 2026

This was prepared on branch `release/0.1.0` at the owner's request. All six `@serein-ui/*` packages are at `0.1.0`, with `publishConfig.access` set to `public` on the default `latest` tag. The checks below ran locally on Windows with Node 26.3.1 and pnpm 10.33.2. Hosted CI on Node 24 must pass on the merged `main` commit before anything is published.

- `pnpm build`, `pnpm typecheck` and `pnpm test` pass: React 101, tokens 73, format 54, icons 6 and css 4 tests.
- `check:release` passes everything in one run:
  - package and consumer checks, SSR and hydration
  - AI contract and freshness
  - 170 Storybook tests with axe in each of the four runs (light and dark, reduced motion on and off)
  - the Storybook build and the starter app
  - live docs and MCP checks
  - layout, search and date-layout specimens

  The first attempt had two story files fail to load ("Failed to fetch dynamically imported module", in the reduced-motion run). Neither was an assertion failure, and the immediate full re-run passed.
- The Next.js App Router fixture, installed from the packed `0.1.0` tarball, passes the production build and verification: SSR, CSS, hydration, keyboard form flow, retry, themes, narrow viewport and axe.
- `pnpm -r publish --dry-run` lists exactly the six packages. Each carries its licence (fonts: an OFL pointer plus `OFL.txt`), and the `workspace:` peer range in `@serein-ui/css` is rewritten to `^0.1.0`.
- `pnpm audit --prod` finds no known vulnerabilities. The development tooling has 11 advisories: Storybook 10.6.0 dev server, `@vitest/mocker` and jsdom's `undici`. None ship in a package or affect the built Storybook site. The patched versions are still inside the 14-day install cooldown (Storybook 10.6.2 clears on 26 October, Vitest 4.1.12 and undici 8.12.2 on 29 October). The Next.js fixture's pinned `next@16.4.0` has a known advisory; it is test-only, and 16.4.1 clears on 28 October.

Native screen-reader, zoom and disabled-user reviews remain open. `0.1.0` makes no stability or conformance claim beyond pre-1.0 semver.

## 0.1.0 npm publication — 26 October 2026

- **Publication:** the owner created the `serein-ui` npm organization and ran `pnpm -r publish` as `deepakhp`, with two-factor authentication required for writes. They published from a clean checkout of `main` at `edc6cb5`, whose Release checks and Pages deployment had passed. The dry run beforehand listed exactly the six packages.
- **Registry:** `npm view` shows `@serein-ui/react`, `tokens`, `css`, `fonts`, `format` and `icons` at `0.1.0`, all with `dist-tags.latest = 0.1.0`. The packages took a few minutes to become publicly visible.
- **Integrity:** the registry tarball for `@serein-ui/react` matches the integrity value reported at publication (`sha512-i5ldO/qG…uxU71DhrRA8Yw==`). With `SEREIN_PACKAGE_TARBALL` set to that downloaded archive, `check:consumer` passed: strict public types, the accessible-name contract and a compiler-free JS/CSS bundle.
- **New-user install:** a fresh Vite 8 / React 19.3 app ran `npm install @serein-ui/react` and used only the README's imports and theme classes.
  - The strict TypeScript build passed (`skipLibCheck: false`), and the fonts were bundled.
  - Chromium rendered it correctly in light and dark, following the system theme, with no console errors.
  - axe flagged only the test page's own missing `<h1>`.
- **Tag and release:** the annotated tag `v0.1.0` points at `edc6cb5`, and the [GitHub release v0.1.0](https://github.com/deepak-hp/serein-ui/releases/tag/v0.1.0) is marked latest.
