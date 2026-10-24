# Start an app with Serein

From this library checkout's `trial` directory, using Node 24.19 or later:

```sh
npm ci
npm run create:app -- "../my-app"
cd ../my-app
npm run dev
```

Choose a new directory or an existing empty one. The command refuses nonempty folders (including hidden files), files and direct symlink/junction targets. It never removes existing content. Relative paths are resolved from the directory where you run the command. Quote paths containing spaces.

This is a repository-local command. npm registry publication is deferred; there is no public `npx` installer yet. Installable beta archives are available from [GitHub Releases](https://github.com/deepak-hp/serein-ui/releases/tag/v0.1.0-beta.1).

## What is generated

- A standard React/Vite app with strict TypeScript and production build commands.
- The library's actual npm tarball in `vendor/serein-ui-react.tgz`, installed through a local file dependency.
- Precompiled CSS and the approved font imported once; no StyleX compiler or library source alias.
- Document-wide light/dark themes, preference persistence when storage is available, and a small removable form example with validation.
- `AGENTS.md` and `UI-LIBRARY.md` guiding coding assistants to the installed declarations, tokens, contract and accessibility responsibilities.

No backend, account, deployment, global AI settings or native platform adapter is created. The workspace form is a local preview, not a saved resource.

## Generate without installing

```sh
npm run create:app -- "../my-app" --no-install
```

This still builds and packs the library, then creates the app and archive. Install later inside the generated app with `npm install --ignore-scripts`. If an installation fails, the generated files remain available for inspection and retry. Fix the installation issue and retry there; do not rerun the generator over that now-nonempty folder.

## Copying and updating an app

Keep the generated `vendor` directory with package.json and package-lock.json when copying or checking the app into source control. Its local archive lets it install without the original library checkout. Other dependencies still come from the npm registry/cache. After the first install, use `npm ci --ignore-scripts` for the locked dependency tree.

The generator takes a snapshot of the current library. Library edits do not automatically update generated apps. For an intentional update, build and pack the new library, copy the archive with a new filename into the app's vendor directory, install it with npm, and restart the app's dev server.

## AI integration

Assistants that recognize AGENTS.md can discover the guidance automatically. Others can be explicitly given UI-LIBRARY.md and the installed `ai/llms-full.txt`/`ai/contract.json`. These plain-text files work without a live MCP server. An optional Storybook MCP connection is documented separately; client support and configuration vary.

## Maintainer checks

```sh
npm run test:starter
npm run check:starter
```

The integration check generates a fresh app in `.starter-check`, installs and builds it, checks overwrite refusal, runs browser validation/theme/reflow/axe checks, and stops its temporary preview. Generated check directories are ignored by Git. Screenshots are saved to `.review/starter`. The user's reference workspace on port 5174 is unchanged.
