# Non-npm beta distribution — 21 October 2026

The owner deferred npm publication and requested continued background work. This delivery publishes a verified GitHub beta archive, canonical Serein repository links and a portable human-review packet. It does not approve stable 1.0, close native accessibility gates or claim external adoption.

## Tooling verification

Node 24.19.0 passed all 18 focused site, package-preparation and reviewer-packet tests, with no skips. Coverage includes refusing dirty source, version metadata, non-overwrite behavior, symlink/junction escapes, Windows path-case aliases, preservation of a supplied package archive, frozen-experiment integrity, retained failed builds, source/evidence allowlists, and HTTP traversal/missing-file behavior. The local-server checks required loopback access outside the restricted filesystem/network sandbox.

Independent code review identified two archive-path problems and documentation contradictions. They were repaired before integration and the corresponding regression cases passed. Final review found no remaining material finding within this scope. This is code review by another agent, not independent human product or accessibility review.

The portable packet contains all four frozen file-review candidates. Sixteen headless Chromium 153.0.8010.12 playback checks passed: four candidates, two themes and 1280/320px widths. Each loaded populated content with no missing assets, page errors or nonlocal requests. These are delivery smoke checks; they do not rerun or replace historical measurements. The final packet was re-exported from the recorded clean source revision and separately checked after download, as recorded below.

## Integrity and review limits

A fresh dependency audit found Vite's bundled development-server editor integration affected by [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm), [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv), and [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw). The active library/reference minimum was raised to `8.3.3` (both locks resolve `8.3.5`) and the generated starter pins `8.3.3`. Only Vite's dependency graph changed. Refreshed lockfile audits reported zero findings for the library and reference app. Frozen experiment locks remain preserved as historical inputs. The complete local release gate was rerun with installed patched dependencies and passed (`trial/non-npm-patched-release.log`, exit 0); hosted verification for the final revision is recorded below.

- The package preparer builds/checks a clean source revision and emits the package archive, SHA-256 and unsigned `SOURCE.json`. This metadata is not an attestation.
- The consumer verifier accepts an absolute supplied archive and leaves that archive intact.
- The packet exporter verifies all 48 frozen input hashes and the final candidate source identities before replay. It refuses writes inside frozen experiment directories and leaves their tracked bytes unchanged.
- The packet includes opaque IDs, an empty observation template, licenses, primary reports and separately identified supplemental reports. It excludes the condition key, generation prompts, manifests and source maps. Appearance or bundled code can still reveal identity; order is fixed, so this is not a fully blind or randomized study.
- Primary results remain 10/12 passing interactions and 10/16 passing renders. The separately documented supplemental method passed 12/12 interactions; renders remained 10/16. Neither result establishes a design-quality winner.
- No human scores, independent application feedback or disabled-user evaluation has been received by this work.

## External delivery gates

The repository rename, hosted checks, new Pages deployment, GitHub prerelease, fresh-download verification and existing reviewer-announcement update are complete. npm authentication/publication, native accessibility and independent human review remain open. The [master checklist](../RELEASE-CHECKLIST.md) keeps those gates separate from this beta delivery.

The [Windows attempt](2026-10-14-windows-setup.md#background-work-retry--21-october-2026) was blocked by automatic approval review because the earlier no-interruption instruction remained active. No native accessibility result was obtained. VoiceOver/Safari remains deferred to a Mac device.

## Distribution receipt — post-rename follow-up

The repository is now `deepak-hp/serein-ui`; `origin` was updated, and the old repository API resolves to the new identity. GitHub private vulnerability reporting remains enabled. PR [#9](https://github.com/deepak-hp/serein-ui/pull/9) merged. Hosted PR run `39629944076` passed on `5f40d9c`, and post-rename run `39631681188` passed on the same head. The full local release gate also passed with Vite `8.3.5`. Fresh root and reference dependency audits reported zero findings across inventories of 401 and 69 dependencies.

The merged-source package was prepared from clean commit `c5c6e4f`. Its SHA-256 is `edbb1fbcf45ed4b78bc6695bb0985f86b6a6e76130b6f6ac616cb41d461513d1`, and the supplied consumer check passed against that archive. The final reviewer packet contains 56 files; all 48 frozen input hashes verified, and all 16/16 headless playback checks passed. Candidate sources and historical failures remain preserved.

### Public delivery

- [Main CI 39633424831](https://github.com/deepak-hp/serein-ui/actions/runs/39633424831) passed on `c5c6e4feca7bfca3579a02ac1f93964ccde66717`, including the complete release gate, additional Firefox/WebKit workflows, focused accessibility, compact Checkbox, Next.js consumer and assembled documentation checks.
- [Pages run 39634992982](https://github.com/deepak-hp/serein-ui/actions/runs/39634992982) passed for the same revision; deployment `7231357980` reports success at `https://deepak-hp.github.io/serein-ui/`.
- Public headless checks passed catalogue navigation/permalink reload, Storybook manager catalogue-to-Button navigation and story/docs rendering, license/AI/metadata assets, compact Checkbox keyboard toggling in both themes at 320px, and Serein studio content/styles/local fonts. No page errors, missing assets or same-origin requests outside `/serein-ui/` were observed. Ignored result: `trial/.review/live-serein-c5c6e4f/results.json`.
- The old repository API resolves to `deepak-hp/serein-ui`. The old Pages address `https://deepak-hp.github.io/ritam-ui/` returned HTTP 404; it does not redirect. Active documentation and the reviewer announcement use the new address.
- Annotated tag `v0.1.0-beta.1` resolves to the full source commit above. The [GitHub prerelease](https://github.com/deepak-hp/serein-ui/releases/tag/v0.1.0-beta.1) was published at `2026-10-21T16:29:51Z`, with `isDraft: false` and `isPrerelease: true`.
- All five freshly downloaded assets matched the prepared bytes: the installable `.tgz`, `SOURCE.json`, `SHA256SUMS`, reviewer ZIP and `REVIEW-PLAYBACK.json`. All four entries in the release checksum manifest verified. Source metadata remains unsigned and is not an attestation.
- The exact downloaded package passed `npm run check:consumer`: strict public types, accessible-name contract and a compiler-free JS/CSS consumer bundle. Its hash remained unchanged afterwards. Ignored log: `trial/non-npm-downloaded-consumer.log`.
- The downloaded ZIP extracted to exactly 56 allowlisted files; all file hashes verified. Its source metadata identifies `c5c6e4f` and 48 verified frozen input hashes. All 16 extracted-packet playback checks passed again. Ignored result: `trial/.review/downloaded-packet-playback-c5c6e4f/playback.json`. No candidate, original failure or historical measurement was changed.
- [Reviewer announcement #5](https://github.com/deepak-hp/serein-ui/issues/5) was updated and read back at `2026-10-21T16:31:07Z`, with verified release/site links and explicit open review gates. No other channel was posted.

The versioned beta assets describe source `c5c6e4f`; this subsequent documentation receipt does not replace those assets. npm publication, native accessibility checks and independent human review remain open.
