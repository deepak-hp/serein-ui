# Serein customization accessibility review plan

> **For agentic workers:** Use subagent-driven-development or executing-plans to implement this plan task-by-task. Preserve the evidence limits below.

**Goal:** Focus the accessibility checklist on Serein-owned risks and refresh the checks possible without desktop interaction.

**Architecture:** Reuse the existing integration suites against a freshly built library and an installed-package reference. Distinguish upstream Base UI behavior, Serein styling/wrappers/custom flows, and consuming-product responsibilities. Keep native review pending with a representative, risk-based protocol.

**Tech Stack:** React 19, Base UI 1.8, StyleX, Node 24, Vitest, Playwright, axe-core.

**Spec:** Owner's 24 October request: update the checklist to focus on Serein's customizations, continue background checks, and defer npm publication.

## Constraints

- Background work only: no native windows, desktop focus, screen-reader audio or OS preference changes.
- No npm authentication or publication; local builds, tarballs and installed-package tests are permitted.
- Preserve frozen evaluation artifacts and the published beta tag/assets.
- Do not equate headless engines, DOM semantics or CSS stress tests with native assistive technology, actual browser zoom, human review or legal conformance.
- Change only documentation unless a fresh test exposes a reproducible product defect.

## Tasks

- [x] Map Serein ownership and existing evidence in `docs/RELEASE-CHECKLIST.md`, `trial/docs/ACCESSIBILITY.md`, `trial/docs/ACCESSIBILITY-EVIDENCE.md` and `trial/reference/ACCESSIBILITY-REVIEW.md`. Retain wrapper/composition keyboard regressions, without cloning Base UI's upstream matrix.
- [x] Run `npm test`, `npm run reference:setup`, `npm run reference:build` and `npm run reference:test` from `trial` using Node 24. Setup builds and installs a fresh local tarball; restore incidental generated reference manifest hashes after verification. Also run `test:stories` in both themes and motion settings.
- [x] Run `node scripts/check-accessibility-gaps.mjs <engine>` for Chromium, Firefox and WebKit, then `node scripts/check-compact-checkbox.mjs`. These scripts own their temporary fixture servers and launch headless engines.
- [x] Serve `reference/dist` on an ephemeral loopback port with Vite preview, without opening a browser window. Set `REFERENCE_URL` to that server for `check:reference-accessibility`, `check:materials` and `check:serein`. Stop only the server started by this task.
- [x] Run `check:workflows` for each engine against its self-hosted installed-package reference build. Inspect result JSON, not only exit codes.
- [x] Record exact environment, source revision, commands, coverage and limitations in `docs/validation/2026-10-24-customization-accessibility.md`; link it from the checklist and release-readiness record. Review the documentation diff and validate links.

**Delivery rule:** Submit the scoped documentation change for hosted checks and record delivery status in the pull request. Merge only after checks for the exact reviewed head pass, then verify main CI and deployment. npm and native/human work remain pending independently of that delivery.

**Done means:** Serein-owned risks have explicit checks and evidence; all executed checks have recorded results; no unperformed manual or publication item is marked complete.
