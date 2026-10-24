# Serein release goal

## End goal

A professional, openly licensed React UI library that developers and coding assistants can install, understand and use to build purposeful applications. Release only with reproducible checks, documented accessibility evidence, honest support limits and complete examples. Preserve the approved Flame & Ink identity. Popularity is an aspiration, not an acceptance test.

This is the durable source of scope and progress. Checked items require evidence. Unchecked items are not silently dropped when this conversation ends.

## 1. Preserve the design system

- [x] Serein name and `@serein-ui/react` package identity established.
- [x] Approved Indian-astrology-inspired Flame & Ink direction implemented; private birth research excluded from Git.
- [x] Orange filled primary actions, dark button text, white/near-black canvases, Plus Jakarta Sans, restrained success green.
- [x] Subtle meaningful status motion and reduced-motion support implemented.
- [x] Apple-informed optional navigation materials with opaque accessibility fallbacks implemented.
- [x] Catalogue documents these foundations and their correct roles with live examples (846eb1d).
- [x] Review new surfaces in light/dark and mobile/desktop without introducing a competing visual identity (independent catalogue/workflow reviews).

## 2. Component and installation quality

- [x] 42 React components and 2 hooks implemented with typed contracts.
- [x] Compiled CSS, local tarball installation, starter generator and SSR/hydration checks exist.
- [x] Rerun full component, package, consumer and SSR checks on the release candidate.
- [x] Verify a fresh generated app, installed-package reference and static documentation build.
- [x] Verify a separate Next.js App Router consumer against an installed beta tarball: production build, SSR/hydration, keyboard validation, failed save/retry, themes and narrow layout. This is internal integration evidence, not external adoption; see [the consumer record](validation/2026-10-14-next-consumer.md).
- [x] Add package metadata, repeatable release checks and CI.
- [x] Observe hosted Linux CI passing: [run 37526475891](https://github.com/deepak-hp/ritam-ui/actions/runs/37526475891) on `cd7280a`. Subsequent changes require their own passing run before merge.
- [x] Audit direct/transitive dependency findings and document actionable residual risks.
- [x] Establish versioning, changelog, supported environments and upgrade policy.
- [ ] Publish a versioned npm package after ownership/authentication and release gates are satisfied. Deferred at the owner's request on 21 October 2026; do not retry authentication or publication meanwhile.
- [x] Distribute the beta through a [GitHub prerelease](https://github.com/deepak-hp/serein-ui/releases/tag/v0.1.0-beta.1) with an exact-source archive, checksum and unsigned source metadata; the fresh download passed checksum and clean-consumer verification. See [the delivery receipt](validation/2026-10-21-beta-distribution.md).

## 3. Professional discovery and examples

- [x] Searchable catalogue covering every public component, with preview, source/API access and usage guidance (846eb1d; 84 component/theme browser audits).
- [x] Clear installation, foundations, AI integration and accessibility entry points (catalogue; nested static-path checks passed).
- [x] Complete invoice workflow: filtering, details, explicit simulated follow-up, pending/failure/retry/success.
- [x] Complete settings workflow: meaningful groups, validation, save/reset, persisted local data and failure recovery.
- [x] Complete onboarding workflow: steps, validation, review, completion, restart and honest local-only behavior.
- [x] Verify all three flows with keyboard, responsive layouts, both themes and automated accessibility checks (26 browser audits; 15 reference tests).
- [x] Publish catalogue/Storybook hosting with a main-only deployment environment and passing release gate ([first deployment](https://github.com/deepak-hp/ritam-ui/actions/runs/38417887319), 13 October 2026).

## 4. AI integration that improves composition

- [x] Versioned generated component contract, offline AI text, starter instructions and Storybook MCP integration exist.
- [x] Composition brief, recipes and honest A/B pilot exist; no demonstrated general improvement claimed.
- [x] Connect reviewed workflow source and guidance to the catalogue and AI documentation.
- [x] Keep generated documentation fresh with build/CI checks.
- [x] Document supported integration paths and validate artifact access without requiring a particular assistant.
- [x] Design a reproducible multi-task evaluation with human review; don't fabricate results or promise universal model support.
- [x] Generate and retain twelve independent in-domain attempts comparing plain React/CSS with the then-current Ritam package plus guidance, with compiler records, original and supplemental browser results, and a label-hidden review packet. These frozen artifacts predate the Serein rename. See [pilot observations](../trial/evaluation/RESULTS.md).
- [x] Generate four fresh file-review attempts with frozen inputs and equal authored-line limits, retain initial/final compiler and browser records, and prepare another label-hidden review packet. A documented supplemental verifier corrects a pending-label lookup defect; original results remain preserved. See [the fresh trial](validation/2026-10-14-ai-trial.md).
- [ ] Obtain independent human review and evaluate fresh tasks before claiming improved AI-generated design quality. The pilot's overlapping examples, small sample and corrected harness do not establish general superiority.
- [x] Distribute a portable playback packet for the four frozen file-review candidates, preserving original and supplemental results; all 56 downloaded files verified and 16 playback checks passed. Playback checks do not count as human review; see [the delivery receipt](validation/2026-10-21-beta-distribution.md).

## 5. Accessibility and inclusion

Base UI supplies the underlying keyboard, ARIA and focus primitives. Serein's release review tests what our styling, wrappers and compositions add or could break; it does not reproduce Base UI's entire upstream platform matrix. DayPicker, native inputs and Serein's custom components require their own integration coverage.

**Serein-owned automated checks**

- [x] Document the WCAG 2.2 AA target, ownership boundaries and application-level/EAA responsibilities.
- [x] Maintain checks for light/dark token contrast, enabled-control boundaries, visible focus, compact targets, reflow/text spacing, reduced motion and optional-material/forced-colour fallbacks.
- [x] Maintain wrapper checks for names, labels, descriptions, invalid/error wiring, disabled options and focus restoration, including nested Drawer/Dialog composition.
- [x] Maintain custom-component checks for table semantics/sorting, date/range adapters, status feedback and async cancellation/retry; keep distinct Projects, Invoices, Settings and Onboarding outcomes covered.
- [x] Publish the [criterion/evidence matrix](../trial/docs/ACCESSIBILITY-EVIDENCE.md) and [representative native review protocol](../trial/reference/ACCESSIBILITY-REVIEW.md). Retain existing cross-engine integration regressions.
- [x] Refresh the focused customization checks on the unchanged runtime at `0b9a6c4`: 87 library tests, 15 reference tests, 564 story cases, 18 cross-engine wrapper scenarios, compact controls, styling/materials and three-engine workflows passed on 24 October. See [commands, results and limits](validation/2026-10-24-customization-accessibility.md). Future candidates need their own results.

**Representative native checks — deferred while work must remain in the background**

- [x] Install native Firefox `157.0.1` and NVDA `2026.2` on Windows and verify executable signatures. See [setup evidence and automation blocker](validation/2026-10-14-windows-setup.md); installation is not a flow pass.
- [ ] NVDA + Firefox: review Serein's composed labels/errors/status announcements, custom table/date interaction, and nested-layer/validation/recovery focus using the representative protocol. Windows first, once desktop interaction is permitted.
- [ ] VoiceOver + Safari: review the same Serein-owned risks on macOS later; headless WebKit does not complete this item.
- [ ] Actual 200%/400% zoom, native contrast/reduced-motion settings and visual focus-obscuration review on the representative layouts in both themes. Headless viewport/CSS/media emulation remains supporting evidence only.

**Human feedback and consuming-product responsibilities**

- [ ] Obtain usability feedback from disabled users on representative Serein flows; record findings and retests separately from automated results.
- [ ] Each consuming product must assess its own content, localization, complete processes and applicable EAA obligations before making a conformance claim. Library checks cannot sign off an unrelated application.

Reuse a recorded observation only for the same wrapper, composition and environment; keep distinct custom flow outcomes covered. Recheck affected paths after styling, wrapper, workflow or dependency changes. The public beta remains available with these documented limits; pending native/human work is not silently marked complete.

## 6. Open-source and launch readiness

- [x] Contribution guide, security reporting instructions, issue/PR templates, CI and maintenance policy.
- [x] Apply the approved MIT license and package third-party attribution (7 October 2026).
- [x] Verify GitHub administration access and review source/history for private research and credential patterns before public-source publication (13 October 2026; bounded scan, not a guarantee).
- [x] Make the reviewed source public and enable a verified private vulnerability-reporting channel (GitHub settings verified 13 October 2026).
- [ ] Confirm npm scope ownership and publication authentication (last identity check: HTTP 401). Deferred with npm publication on 21 October 2026.
- [x] Release notes, installation guide and rollback/release procedure.
- [x] Prepare truthful README pitch, launch post drafts and demonstration outline.
- [x] Update beta announcements and reviewer invitations with verified public destinations and current limits. The owner-selected GitHub call is published; other channels remain drafts. See [launch materials](LAUNCH-DRAFTS.md).
- [x] Owner approves/applies license and authorizes public package/site publication when release gates are met ("go ahead finish all", 7 October 2026). Authentication and actual publication remain separate open gates above.
- [x] Publish the explicitly authorized [GitHub beta reviewer announcement](https://github.com/deepak-hp/serein-ui/issues/5), 14 October 2026; update it with verified beta downloads and Serein links on 21 October. No users, benchmarks or endorsements are claimed; no other channel has been posted.
- [x] Rename `deepak-hp/ritam-ui` to `deepak-hp/serein-ui`, update active metadata/links and the origin remote, and verify the new Pages deployment (21 October 2026). The old repository resolves to the new identity; the old Pages URL returns 404, so use the new links. See the [rename checklist](LAUNCH-DRAFTS.md#repository-name-at-launch). Frozen historical evidence retains its original identity.

## 7. Longer-term commitments (retained, not claimed for React release)

- [ ] Framework-independent token distribution and documented adapter contract.
- [ ] Native mobile adapters with platform-appropriate behavior and testing.
- [ ] Desktop integration examples and supported-host matrix.
- [ ] Figma parity with maintained components/tokens and version mapping.
- [ ] Localization/RTL coverage and broader framework integrations backed by tests.
- [ ] Evaluate advanced modules against real needs: charts, tree view, rich-text editing, upload transport and virtualized/editable data grids; current component docs explicitly exclude them.
- [ ] More complete workflows driven by real usage, contribution feedback and accessibility review.

## Status and evidence

Completed local implementation plan: [release readiness](superpowers/plans/2026-09-28-release-readiness.md).
Fresh evidence: [release candidate record](RELEASE-READINESS.md). Historical and current results: [verification](../trial/docs/VERIFICATION.md).

Release status: **MIT-licensed React-web beta source, documentation and verified GitHub downloads public; npm publication deferred**. Local verification, revision-specific hosted checks and deployment evidence are recorded in the evidence document. npm publication access and manual/human gates remain open. No accessibility conformance or stable production-release claim is made.
