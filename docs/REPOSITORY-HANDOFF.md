# Repository handoff

Display name: **Serein**. GitHub prerelease package: `@serein-ui/react@0.1.0-beta.1`; npm publication remains deferred. Repository: [deepak-hp/serein-ui](https://github.com/deepak-hp/serein-ui).

The active library and package were renamed from Ritam UI and `@ritam-ui/react` to Serein and `@serein-ui/react` on 13 October 2026. The repository is now `deepak-hp/serein-ui`; frozen evaluation materials and earlier verification entries retain the old name so their evidence remains accurate.

No trademark, domain, npm scope ownership or package-name availability is guaranteed. The GitHub prerelease package, imports, examples and generated apps use the Serein identity.

## Ready before push

- The user supplied `https://github.com/deepak-hp/ritam-ui.git` for the initial push on 28 September 2026. The remote was empty when checked.
- Root `.gitignore` excludes `.research/` and `design-system/`, which contain private chart research and outdated design drafts. They remain on disk.
- Existing nested ignores exclude dependencies, generated builds, browser profiles, local package archives and verification captures.
- Use `packages/react/README.md` for the actual build/setup commands. Rebuild the local tarball with `reference:setup` after cloning; the reference app's vendor archive is intentionally not committed.
- The committed reference lockfile names a local archive generated from this source. Run `reference:setup` before installing/running that app; do not start with `npm ci` inside `reference`.
- Before the first push, inspect the staged file list and contents for secrets/private data, confirm the intended remote and run the relevant checks. Do not force-push or overwrite existing remote history.
- The MIT license is now applied. npm publication, scope ownership and the documented release accessibility review remain separate open gates. A source push does not publish to npm or certify accessibility.

The repository is a source handoff with a GitHub prerelease archive. Pushing it to GitHub does not publish an npm package.

## Release candidate handoff — 28 September 2026

The reviewed work is pushed on [codex/release-readiness](https://github.com/deepak-hp/ritam-ui/tree/codex/release-readiness). The complete local release command passed. See the [master checklist](RELEASE-CHECKLIST.md) and [verification record](RELEASE-READINESS.md) for delivered scope and remaining gates.

The GitHub connector returned HTTP 404 when asked to create a draft pull request, although Git transport successfully pushed the branch. No pull request was created and no hosted CI result was observed. The branch can be reviewed through [GitHub's comparison page](https://github.com/deepak-hp/ritam-ui/compare/main...codex/release-readiness). Main was not merged or force-pushed.

## Public beta work — 7 October 2026

GitHub connector access now works and [PR #1](https://github.com/deepak-hp/ritam-ui/pull/1) is attached to this work. The repository is still private. MIT licensing and `0.1.0-beta.1` package metadata are committed. A clean Linux run exposed a build-order issue, fixed by building the library before type-checking its playground consumers.

The current npm identity check returns 401; registry publication and scope ownership have not been verified. The connected hosting account returned no teams. No public URL or npm installation is claimed. See the master checklist for remaining gates and current verification evidence.
