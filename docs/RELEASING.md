# Release guide

Serein `0.1.0` is the first npm release. All six `@serein-ui/*` packages are MIT-licensed (the bundled fonts are OFL-1.1) and publish publicly on the default `latest` tag. The owner publishes from their own npm account. CI checks every change but never publishes.

## npm release

Run these steps once the release pull request is merged and the **Release checks** run on that exact `main` commit has passed.

1. **Account and scope (first release only).** Sign in at npmjs.com with two-factor authentication turned on. Then create the free organization `serein-ui` at https://www.npmjs.com/org/create, so you own the `@serein-ui` scope. If that name is taken, stop: every package name and import would have to change.
2. **Sign in from the terminal.** Run `npm login --registry=https://registry.npmjs.org`, then `npm whoami`. Never paste tokens or one-time codes into an issue, commit or chat.
3. **Start from the exact commit.**
   ```sh
   git checkout main && git pull --ff-only
   git status --short            # must print nothing
   pnpm install --frozen-lockfile
   pnpm build && pnpm test
   pnpm --filter @serein-ui/react check:package
   ```
4. **Rehearse.** Run `pnpm -r publish --dry-run`. It must list exactly six packages, all at `0.1.0`, and the root workspace must not appear.
5. **Publish.** Run `pnpm -r publish`. pnpm rewrites `workspace:` ranges and skips any version already on the registry, so a rerun after a partial failure is safe. With two-factor authentication it asks for a one-time code. You can also pass `--otp <code>`, but a code expires in about 30 seconds, so be ready to rerun.
6. **Verify the registry.**
   ```sh
   npm view @serein-ui/react@0.1.0 dist-tags version
   npm view @serein-ui/tokens@0.1.0 version
   ```
   Install the published archive in a clean consumer:
   ```sh
   cd packages/react && npm pack @serein-ui/react@0.1.0
   SEREIN_PACKAGE_TARBALL="$PWD/serein-ui-react-0.1.0.tgz" pnpm check:consumer
   ```
7. **Tag and announce.** Create the annotated tag `v0.1.0` on the published commit and push it. Then create a GitHub release from the `0.1.0` section of `CHANGELOG.md`. Never move a published tag.

**Rollback.** npm allows `npm unpublish` only within 72 hours and only when nothing depends on the version. Prefer `npm deprecate @serein-ui/<name>@0.1.0 "<reason>"` and a fixed `0.1.1`.

Later releases follow the same steps. Add a changeset with each change (`pnpm changeset`), then run `pnpm changeset version` on a release branch and update the approved version in `packages/react/scripts/check-package.mjs` and `prepare-beta-release.mjs`. For automated publishing, prefer [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) over stored write tokens; none is configured yet.

## Local release gate

Use Node 24 and a clean dependency install in `packages/react`:

```sh
pnpm install --frozen-lockfile
pnpm --filter @serein-ui/react test:browser-install
pnpm --filter @serein-ui/react check:release
```

The gate checks source tests, types, the library build, tarball contents, a strict consumer, SSR/hydration, generated AI material and freshness, Storybook interactions and accessibility, the Storybook build, starter generation, and live Storybook documentation and UI checks. It starts its own Storybook on an available loopback port and stops it on success or failure. It never kills an existing user server. Browser installation is separate so local users can choose when to download it; the script sets the same local Playwright path used by the checks. The repository-wide `pnpm test` also runs the token contrast tests and spec validation.

## Owner checklist

Before the npm steps above:

1. Review `git status`, `CHANGELOG.md`, package metadata and the dry-run file lists. Then run `pnpm audit --prod` from the repository root, and record any finding rather than assuming the last inventory still holds.
2. Run the local release gate. Record any manual accessibility or browser checks you performed, and any review gates still open, in `docs/RELEASE-READINESS.md`. A pre-1.0 release may keep manual or human gates open as long as they are disclosed. It must not be described as stable or conformant on that basis.
3. Confirm that the package guard accepts only the approved version on public access and the default tag. Every package must carry its licence: MIT, or OFL plus a pointer for fonts. The React package also needs `THIRD_PARTY_NOTICES.md`.
4. Confirm that private vulnerability reporting is still enabled and that `SECURITY.md` links to the repository's private reporting form.
5. Keep rollback material ready: the previous version, its tag, the changelog, and a deprecation or remediation plan.

The **Release checks** workflow validates changes but does not publish packages, deploy Pages, use registry secrets, or change repository settings. The separate **Deploy documentation site** workflow performs the gated Pages deployment described below.

## GitHub archive distribution (used for 0.1.0-beta.1)

The first beta is available as [GitHub prerelease v0.1.0-beta.1](https://github.com/deepak-hp/serein-ui/releases/tag/v0.1.0-beta.1); see [the delivery receipt](validation/2026-10-21-beta-distribution.md). The commands below document its preparation process. For a later release, choose a new version and update the version-specific package guard, tests and filenames before preparing assets; never recreate this tag or overwrite its files.

From a clean checkout of the reviewed `main` commit, using Node 24:

```sh
git status --short
pnpm install --frozen-lockfile
pnpm --filter @serein-ui/react check:release
pnpm --filter @serein-ui/react release:prepare
```

Commit any reviewed reference-lockfile or generated-document changes from the gate, and verify that exact revision before preparation. `release:prepare` requires clean source, builds/checks the package, then writes the tarball, `SHA256SUMS` and unsigned `SOURCE.json` into a new `packages/react/.review/release-<version>-<commit>` directory. Set `SEREIN_PACKAGE_TARBALL` to the absolute path of that exact tarball and run the strict consumer check:

```sh
SEREIN_PACKAGE_TARBALL=/absolute/path/to/serein-ui-react-0.1.0-beta.1.tgz pnpm --filter @serein-ui/react check:consumer
```

On PowerShell:

```powershell
$env:SEREIN_PACKAGE_TARBALL = (Resolve-Path .\serein-ui-react-0.1.0-beta.1.tgz).Path
pnpm --filter @serein-ui/react check:consumer
```

After the exact `main` commit passes hosted release checks and the consumer check, create the annotated tag for the new version and a **draft prerelease**. Attach the tarball, checksum and source metadata before publishing the prerelease. Never move an already published tag or replace released bytes. Re-download those exact assets, verify the checksum and source commit, and rerun the consumer check against the downloaded tarball before updating the authorized GitHub reviewer announcement. `SOURCE.json` records source metadata; it is not a signed provenance attestation.

For the optional AI review packet, run `node packages/react/scripts/export-review-packet.mjs packages/react/.review/reviewer-packet-<commit>` from the repository root. It verifies frozen inputs and rebuilds playback without rescoring them. Inspect the export, smoke-test all four candidates, then ZIP only that directory as `serein-reviewer-packet-0.1.0-beta.1.zip`. Include its SHA-256 alongside the package archive in the release checksum file. The packet's internal checksum file covers its own files. Keep the original experiment untouched and distinguish playback checks from independent human review.

## History: publication access check, 13 October 2026

The current registry check returned HTTP 401 for `npm whoami`; an anonymous lookup found no public `@serein-ui/react` package (HTTP 404). A missing package does not establish ownership of the `@serein-ui` scope. Before the first publication, the owner must authenticate through `npm login --registry=https://registry.npmjs.org` and confirm publish access to that scope. Do not paste tokens or one-time codes into an issue, commit, or chat.

Use the reviewed release tag and the existing package checks before a first manual beta publication. After publication, verify `npm view @serein-ui/react@0.1.0-beta.1 dist --json`, inspect the `beta` tag, and install that exact registry version in a clean consumer. Keep tarball instructions until those checks succeed.

For automated releases, prefer [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) over stored write tokens. npm requires CLI 11.5.1 or newer and Node 22.14.0 or newer; the repository's Node 24 policy meets the runtime requirement, but the recorded npm 10.8.1 CLI must be upgraded for that publishing path. Configure only the actual repository, workflow filename and protected release environment in the package's trusted-publisher settings. No npm trust relationship is configured or claimed by these instructions.

The separate [documentation-site workflow](HOSTING.md) deploys only a verified revision after successful release checks. Source visibility, a documentation deployment, npm publication and stable 1.0 approval remain distinct outcomes. Use the [beta evaluation kit](BETA-EVALUATION.md) and [support matrix](SUPPORT.md) for the human review gates.
