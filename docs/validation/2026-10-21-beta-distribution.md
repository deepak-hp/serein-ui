# Non-npm beta distribution — 21 October 2026

The owner deferred npm publication and requested continued background work. This delivery prepares a GitHub beta archive, canonical Serein repository links and a portable human-review packet. It does not approve stable 1.0, close native accessibility gates or claim external adoption.

## Tooling verification

Node 24.19.0 passed all 18 focused site, package-preparation and reviewer-packet tests, with no skips. Coverage includes refusing dirty source, version metadata, non-overwrite behavior, symlink/junction escapes, Windows path-case aliases, preservation of a supplied package archive, frozen-experiment integrity, retained failed builds, source/evidence allowlists, and HTTP traversal/missing-file behavior. The local-server checks required loopback access outside the restricted filesystem/network sandbox.

Independent code review identified two archive-path problems and documentation contradictions. They were repaired before integration and the corresponding regression cases passed. Final review found no remaining material finding within this scope. This is code review by another agent, not independent human product or accessibility review.

The preliminary portable packet contained all four frozen file-review candidates. Sixteen headless Chromium 153.0.8010.12 playback checks passed: four candidates, two themes and 1280/320px widths. Each loaded populated content with no missing assets, page errors or nonlocal requests. These are delivery smoke checks; they do not rerun or replace historical measurements. The final distributed archive must be re-exported from its recorded source revision and checked separately.

## Integrity and review limits

A fresh dependency audit found Vite's bundled development-server editor integration affected by [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm), [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv), and [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw). The active library/reference minimum was raised to `8.3.3` (both locks resolve `8.3.5`) and the generated starter pins `8.3.3`. Only Vite's dependency graph changed. Refreshed lockfile audits reported zero findings for the library and reference app. Frozen experiment locks remain preserved as historical inputs. The release gate must pass again with installed patched dependencies; the earlier successful run does not validate that update.

- The package preparer builds/checks a clean source revision and emits the package archive, SHA-256 and unsigned `SOURCE.json`. This metadata is not an attestation.
- The consumer verifier accepts an absolute supplied archive and leaves that archive intact.
- The packet exporter verifies all 48 frozen input hashes and the final candidate source identities before replay. It refuses writes inside frozen experiment directories and leaves their tracked bytes unchanged.
- The packet includes opaque IDs, an empty observation template, licenses, primary reports and separately identified supplemental reports. It excludes the condition key, generation prompts, manifests and source maps. Appearance or bundled code can still reveal identity; order is fixed, so this is not a fully blind or randomized study.
- Primary results remain 10/12 passing interactions and 10/16 passing renders. The separately documented supplemental method passed 12/12 interactions; renders remained 10/16. Neither result establishes a design-quality winner.
- No human scores, independent application feedback or disabled-user evaluation has been received by this work.

## External delivery gates

At preparation time, the external rename, exact-revision hosted checks, new Pages deployment, GitHub prerelease publication, fresh-download checksum/install check and existing reviewer-announcement update remain pending. Record each actual outcome before marking the master checklist complete. npm authentication and publication remain deferred.

The [Windows attempt](2026-10-14-windows-setup.md#background-work-retry--21-october-2026) was blocked by automatic approval review because the earlier no-interruption instruction remained active. No native accessibility result was obtained. VoiceOver/Safari remains deferred to a Mac device.
