# Serein non-npm beta delivery

> **For agentic workers:** Use independent scoped tasks and review each change before integration.

**Goal:** Make the existing beta accessible to external testers through a verified GitHub download, complete the requested Serein repository branding, and make the frozen AI review reproducible without publishing to npm.

**Architecture:** Retain the current React package and release/Pages gates. Produce an allowlisted package archive with a checksum and source metadata from a clean tested revision. Export only rendered AI review candidates and neutral reviewer materials; frozen experiment inputs/results remain unchanged.

**Tech stack:** Existing Node 24/npm tooling, GitHub CLI and Actions, Playwright, and the installed Windows computer-use integration when permitted.

**Scope:** User request on 21 October 2026 to do the remaining release work while deferring npm. Existing release checklist and beta evaluation protocol remain the acceptance criteria for stable release; this delivery is a beta, not stable 1.0.

## Constraints

- Do not run npm login/publish or change registry credentials.
- Keep `0.1.0-beta.1`, MIT licensing, public APIs, visual tokens, `dp-*` hooks and persisted storage keys unchanged.
- Never modify frozen files under `trial/evaluation/` or `trial/evaluation-next/`.
- No human, native accessibility, external-adoption or AI-superiority result without actual evidence.
- Native Windows input requires the pending explicit approval after automatic review rejected Firefox launch. Do not bypass that rejection.
- macOS review remains deferred; there is no available Mac device.
- Existing GitHub reviewer call is the selected announcement channel; no private invitations or social posting.

## Task 1: Canonical repository identity

- [ ] Update active repo/source/Pages URLs to `deepak-hp/serein-ui`, preserving historical records and storage compatibility.
- [ ] Update expected generated Storybook source links and verify build/site tests at the new Pages prefix.
- [ ] Prepare and test all source changes before the external rename; verify the renamed repository, origin, Pages deployment, and old repository redirect afterwards.

## Task 2: Downloadable beta package

- [ ] Add `trial/scripts/prepare-beta-release.mjs` and meaningful tests. It builds/checks an exact clean source revision, creates the npm archive without publishing, and emits `SHA256SUMS` and `SOURCE.json`.
- [ ] Extend the packed consumer verifier to accept an existing archive without deleting that supplied archive, retaining the current default path.
- [ ] Validate checksum/metadata and install the exact candidate archive in an isolated consumer; run type/bundle checks.
- [ ] After exact main CI passes, create a beta GitHub release from that commit, attach the package/checksum/source metadata, and verify a fresh download and install.

## Task 3: Obtain useful human AI review

- [ ] Export the existing frozen file-review candidates into an isolated downloadable reviewer folder with a dependency-free local server and instructions.
- [ ] Include the rubric, empty observation template, and separately identified primary/supplemental evidence. Exclude condition keys, generator prompts/manifests, source maps, and private materials.
- [ ] Verify frozen hashes before replay/export; keep all four candidates and original failures visible. Test normal routes, path traversal rejection and missing files.
- [ ] Smoke-test each candidate in a headless browser, report playback checks separately from historical measurement, and distribute the packet with the beta release.

## Task 4: Evidence, review and release

- [ ] Update README, release/beta instructions and master checklist with verified download paths and honest open gates.
- [ ] Run focused unit tests, package verification and relevant build checks; receive an independent code review.
- [ ] Open/attach a PR, wait for successful hosted CI, merge only the tested head, and verify main CI and Pages deployment.
- [ ] Update the existing GitHub reviewer call with tested beta installation/review instructions after assets and links are verified.
- [ ] Keep npm publishing, native/human accessibility, actual independent reviewers, and stable-release approval open when unavailable.

## Native attempt

On 21 October the current Windows tool initialized and listed installed Firefox. Automatic approval review rejected Firefox launch because the prior no-interruption instruction remained active. A concise permission question is pending; no workaround, window input, speech, settings change, or native test was performed.
