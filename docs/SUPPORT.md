# Support and compatibility

Serein `0.1.0-beta.1` is a prerelease React web component library. Support covers the packaged JavaScript, type declarations, compiled CSS and documented React APIs. It does not cover React Native, native mobile or desktop widgets, other UI frameworks, an application backend, or the accessibility of a consuming product's complete process.

The reviewed GitHub prerelease archive is available from [v0.1.0-beta.1](https://github.com/deepak-hp/serein-ui/releases/tag/v0.1.0-beta.1); verify its checksum and use the procedure in [BETA-EVALUATION.md](BETA-EVALUATION.md). npm publication remains deferred, with local tarballs available as a fallback.

## Package and toolchain

The lockfile currently resolves the following versions:

| Layer | Version or range | Support status |
| --- | --- | --- |
| Node.js for repository build and checks | `>=24 <25`; aggregate release and cross-browser checks executed on `24.19.0`; documentation-site assembly executed on `24.11.1` | Supported build runtime; both recorded Node 24 environments passed their stated checks |
| npm in recorded release run | `10.8.1` | Tested |
| React / React DOM peer | `^19.3.0`; lockfile `19.3.0` | Supported consumer peer |
| Base UI | `1.8.0` | Bundled implementation dependency |
| StyleX | `0.19.1` | Styling dependency; consumers use precompiled CSS and need no StyleX compiler |
| TypeScript | `6.0.3` | Tested declarations/build toolchain |
| Vite | `8.3.5` | Tested library/reference lockfiles and release gate; library/reference minimum `^8.3.3`, generated starter pins `8.3.3` |
| Next.js App Router | `16.4.0` | Internal installed-package production build, SSR/hydration and bounded Chromium workflow checks; see [consumer validation](validation/2026-10-14-next-consumer.md) |
| Storybook | `10.6.0` | Documentation/development tool only |
| Playwright | `1.63.0` | Automated browser-check driver |

Node 22, Node 26, React 18, prerelease React builds, CommonJS `require`, alternate styling compilers and bundlers outside the tested Vite and Next.js fixtures have no recorded release qualification. The Next.js evidence applies to the pinned App Router fixture, not every Next.js version, router, deployment platform or consuming application. Report a concrete consumer reproduction if another configuration is important to your application; beta support will be based on evidence rather than an assumed framework label.

## Browser evidence

The release checks exercise rendered behavior, keyboard paths, both themes, narrow layouts, failure recovery and axe rules. They are engine checks and do not establish support for every branded browser or native assistive-technology pairing.

| Environment | Recorded evidence | Beta status and limitation |
| --- | --- | --- |
| Chromium `153.0.8010.12` via Playwright on Windows | Complete release gate passed with Node `24.19.0` and npm `10.8.1`; `browser.version()` captured the executed engine version | Automated engine evidence; current branded Chrome/Edge native review still requested |
| Firefox `155.0` via Playwright on Windows | Rebuilt installed-package workflows passed 18 route/theme/viewport audits, 8 state/theme audits, 3 text-spacing checks and 3 keyboard paths; `browser.version()` captured the executed engine version | Automated engine evidence; NVDA pairing is Pending |
| WebKit `26.6` via Playwright on Windows | Same rebuilt workflow matrix passed; `browser.version()` captured the executed engine version | Automated engine evidence only; this is not Safari, macOS, iOS or VoiceOver evidence |
| Safari on macOS | No native run recorded | Pending; required for stable 1.0 consideration |
| Safari on iOS/iPadOS | No native run recorded | Unqualified during beta |
| Firefox `157.0.1` with NVDA `2026.2` on Windows | Installed and signatures verified; [setup and native automation blocker](validation/2026-10-14-windows-setup.md) recorded; no native flow completed | Pending; installation is not compatibility evidence |
| Safari with VoiceOver on macOS | Protocol prepared; no native run recorded | Pending |
| Mobile Chromium/Android assistive technology | No native run recorded | Unqualified during beta |

For reproducibility, Playwright `1.63.0` launched Chromium `153.0.8010.12`, Firefox `155.0` and WebKit `26.6`; a post-run metadata command captured each value from `browser.version()`. The workflow result JSON does not yet embed those version strings or the Windows build, so future release automation should retain both directly with its result files.

The beta target is current stable Chromium, Firefox and Safari for standards-based React web applications. A target becomes a supported version only after its exact native version and relevant complete flows are recorded. Internet Explorer and legacy EdgeHTML are out of scope.

## Accessibility and user preferences

Automated checks cover selected keyboard behavior, semantic states, axe rules, text spacing, 320 CSS-pixel reflow, forced-color emulation and reduced-motion behavior. They supplement human review. The [accessibility review protocol](../packages/react/reference/ACCESSIBILITY-REVIEW.md) focuses native review on Serein's styling, wrappers, custom components and composed flows, retaining bounded Base UI integration checks. Native screen-reader runs, actual 200%/400% browser zoom, measured rendered contrast, native Windows contrast themes and target-size assessment remain pending for those paths. Consuming applications own their content and complete-process evaluation.

Serein does not carry an accessibility certification or a WCAG/EAA conformance claim. Component behavior cannot establish conformance for a consuming application's content, routes, authentication, services, errors or support process.

## Server rendering and data behavior

The release gate includes DOM-free server rendering and Chromium hydration of all public exports on Node 24. Serein does not provide a backend, authentication, data storage or cross-device synchronization. Reference-app `localStorage`, latency and failure controls are demonstration behavior; consumers must test their actual service, persistence and recovery paths.

## Beta changes and reports

Prerelease APIs may change when beta evidence reveals a defect. Changes should remain focused, typed and documented; breaking changes require release notes and a migration path before stable 1.0. Pin the exact beta version or tarball checksum in evaluated applications.

Use the repository's bug form for a reproducible defect and the [beta feedback form](../.github/ISSUE_TEMPLATE/beta_feedback.yml) for integration observations. Suspected vulnerabilities and reports containing sensitive details must use the private channel documented in [SECURITY.md](../SECURITY.md), not a public issue. Never include credentials, customer data, personal birth information or proprietary source in a report.
