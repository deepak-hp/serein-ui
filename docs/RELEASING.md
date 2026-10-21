# Release guide

Serein `0.1.0-beta.1` is licensed under MIT and configured as a public npm package under the `beta` tag. npm publication is deferred at the owner's request on 21 October 2026. The procedure below distributes a verified package archive through a GitHub prerelease; it does not publish to the registry.

## Local release gate

Use Node 24 and a clean dependency install in `trial`:

```sh
npm ci
npm run test:browser-install
npm run check:release
```

The gate checks source tests, types, library and playground builds, tarball contents, a strict consumer, SSR/hydration, generated AI material and freshness, Storybook interactions, the installed reference workspace, starter generation, live Storybook documentation and UI checks, and reference/catalogue/workflow/material checks. It starts its own Storybook and reference preview on available loopback ports and stops those children on success or failure. It never kills an existing user server. Browser installation is separate so local users can choose when to download it; the script sets the same local Playwright path used by the checks.

`npm run reference:setup` builds a fresh package tarball, installs it into the reference app, and updates the tracked reference manifest and lockfile hash. The generated `reference/vendor` archive is untracked. Every fresh clone must run setup before `npm run reference:build` or reference checks.

## Owner checklist

1. Review `git status`, `CHANGELOG.md`, package metadata, package manifest output, and current audit results. Run `npm audit` from `trial`; the last inventory found zero findings across 401 dependencies, which must be rechecked rather than assumed.
2. Run the local release gate and complete the manual accessibility and browser review recorded in `docs/RELEASE-READINESS.md`.
3. Confirm the root and packaged MIT licenses are identical, the package contains `THIRD_PARTY_NOTICES.md`, and the package guard accepts only the approved beta version, public access, `beta` tag, license and attribution files.
4. Verify private vulnerability reporting remains enabled and `SECURITY.md` links to the repository's private reporting form. Keep npm authentication and trusted-publishing setup deferred with npm publication; no registry credentials are needed for this GitHub beta workflow.
5. Use the non-npm beta distribution procedure below: prepare from a clean Node 24 source checkout, create the reviewed GitHub prerelease assets, attach them to the exact tested `main` tag, and publish the prerelease only after the release gate passes.
6. Re-download the prerelease tarball, verify `SHA256SUMS`, inspect unsigned `SOURCE.json`, and run the strict consumer check with `SEREIN_PACKAGE_TARBALL` set to that absolute tarball path before any announcement.
7. Keep npm publication as a later, separately authorized procedure. Do not publish to npm or announce a stable release from this workflow. Keep rollback material: the prior package version, tag, changelog, and documented deprecation or remediation plan.

The **Release checks** workflow validates changes but does not publish packages, deploy Pages, use registry secrets, or change repository settings. The separate **Deploy documentation site** workflow performs the gated Pages deployment described below.

## Non-npm beta distribution

The first beta is available as [GitHub prerelease v0.1.0-beta.1](https://github.com/deepak-hp/serein-ui/releases/tag/v0.1.0-beta.1); see [the delivery receipt](validation/2026-10-21-beta-distribution.md). The commands below document its preparation process. For a later release, choose a new version and update the version-specific package guard, tests and filenames before preparing assets; never recreate this tag or overwrite its files.

From a clean checkout of the reviewed `main` commit, using Node 24:

```sh
git status --short
npm --prefix trial ci
npm --prefix trial run check:release
npm --prefix trial run release:prepare
```

Commit any reviewed reference-lockfile or generated-document changes from the gate, and verify that exact revision before preparation. `release:prepare` requires clean source, builds/checks the package, then writes the tarball, `SHA256SUMS` and unsigned `SOURCE.json` into a new `trial/.review/beta-release-<commit>` directory. Set `SEREIN_PACKAGE_TARBALL` to the absolute path of that exact tarball and run the strict consumer check:

```sh
SEREIN_PACKAGE_TARBALL=/absolute/path/to/serein-ui-react-0.1.0-beta.1.tgz npm --prefix trial run check:consumer
```

On PowerShell:

```powershell
$env:SEREIN_PACKAGE_TARBALL = (Resolve-Path .\serein-ui-react-0.1.0-beta.1.tgz).Path
npm --prefix trial run check:consumer
```

After the exact `main` commit passes hosted release checks and the consumer check, create the annotated tag for the new version and a **draft prerelease**. Attach the tarball, checksum and source metadata before publishing the prerelease. Never move an already published tag or replace released bytes. Re-download those exact assets, verify the checksum and source commit, and rerun the consumer check against the downloaded tarball before updating the authorized GitHub reviewer announcement. `SOURCE.json` records source metadata; it is not a signed provenance attestation.

For the optional AI review packet, run `node trial/scripts/export-review-packet.mjs trial/.review/reviewer-packet-<commit>` from the repository root. It verifies frozen inputs and rebuilds playback without rescoring them. Inspect the export, smoke-test all four candidates, then ZIP only that directory as `serein-reviewer-packet-0.1.0-beta.1.zip`. Include its SHA-256 alongside the package archive in the release checksum file. The packet's internal checksum file covers its own files. Keep the original experiment untouched and distinguish playback checks from independent human review.

The npm publication procedure remains deferred. If later authorized, authenticate through the owner-controlled npm account, publish the exact reviewed tag under the `beta` tag, verify registry metadata and a clean consumer install, and update installation documentation only after those checks pass.

## Serein publication access — 13 October 2026

The current registry check returned HTTP 401 for `npm whoami`; an anonymous lookup found no public `@serein-ui/react` package (HTTP 404). A missing package does not establish ownership of the `@serein-ui` scope. Before the first publication, the owner must authenticate through `npm login --registry=https://registry.npmjs.org` and confirm publish access to that scope. Do not paste tokens or one-time codes into an issue, commit, or chat.

Use the reviewed release tag and the existing package checks before a first manual beta publication. After publication, verify `npm view @serein-ui/react@0.1.0-beta.1 dist --json`, inspect the `beta` tag, and install that exact registry version in a clean consumer. Keep tarball instructions until those checks succeed.

For subsequent automated releases, prefer [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) over stored write tokens. npm requires CLI 11.5.1 or newer and Node 22.14.0 or newer; the repository's Node 24 policy meets the runtime requirement, but the recorded npm 10.8.1 CLI must be upgraded for that publishing path. Configure only the actual repository, workflow filename and protected release environment in the package's trusted-publisher settings. No npm trust relationship is configured or claimed by these instructions.

The separate [documentation-site workflow](HOSTING.md) deploys only a verified revision after successful release checks. Source visibility, a documentation deployment, npm publication and stable 1.0 approval remain distinct outcomes. Use the [beta evaluation kit](BETA-EVALUATION.md) and [support matrix](SUPPORT.md) for the human review gates.
