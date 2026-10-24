# Documentation hosting

The documentation site is the static Storybook build, deployed to GitHub Pages at `https://deepak-hp.github.io/serein-ui/`. It contains the Start here guides, Foundations (colour, typography, spacing and motion, icons), every component's docs and stories, and the patterns. Storybook also serves the AI material at `/ai/llms.txt`, `/ai/llms-full.txt` and `/ai/contract.json`.

The earlier catalogue and reference app (`?view=catalogue`, `/storybook/` subpath) were retired when the repository became the Serein monorepo; Storybook is now the single documentation destination.

## Local build

From the repository root, with Node 22+ and pnpm:

```sh
pnpm install
pnpm build
pnpm --filter @serein-ui/react build:storybook
```

The output is the ignored `packages/react/storybook-static` directory. Storybook uses relative asset URLs, so the same artifact works at the repository base path or a custom domain. Serve it locally (for example `npx http-server packages/react/storybook-static`) and check:

1. The manager loads, a component story and its docs page render without missing assets, in both themes.
2. Foundations pages show the token tables and icons.
3. `/ai/llms-full.txt` and `/ai/contract.json` return the current files.
4. Browser developer tools show no 404 responses.

## GitHub Pages setup and release gate

Pages uses **GitHub Actions** as its source, and the `github-pages` environment is restricted to `main`. The **Deploy documentation site** workflow starts only after **Release checks** succeeds for a `main` commit, checks out that exact SHA, builds the Storybook site and deploys it. A manual rerun from `main` is rejected unless Release checks succeeded for that SHA.

After a deployment, record the workflow run URL, deployed commit SHA and Pages URL in the release evidence, and re-run the four checks above against the live site.

The workflow follows GitHub's custom Pages flow: `actions/configure-pages`, `actions/upload-pages-artifact` and `actions/deploy-pages`, with `contents: read`, `pages: write` and `id-token: write`. See [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
