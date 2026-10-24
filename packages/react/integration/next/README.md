# Next.js App Router consumer fixture

This internal integration fixture installs `@serein-ui/react@0.1.0-beta.1` from a real npm archive. Default setup builds and packs the current library source; the recorded validation run used the separate frozen reviewed-archive mode. Neither mode uses a source alias, and neither is external beta-adoption evidence.

## Reproduce

Use Node 24. The commands below show the runtime used for the recorded Windows run. Start from the repository root by installing the parent `trial` dependencies, which provide Playwright 1.63.0 and axe-core 4.13.0, then install Chromium into the parent trial's ignored browser directory.

```powershell
$node = 'C:\Users\deepa\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$npm = 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js'
$env:Path = "$(Split-Path $node);$env:Path"
Set-Location trial
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) '.playwright'
& $node $npm ci --ignore-scripts
& $node $npm exec -- playwright install chromium
Set-Location integration\next
& $node $npm run setup
& $node $npm ci --ignore-scripts
& $node $npm run build
& $node scripts\verify.mjs
```

The default setup builds and packs the current `trial` source, writes the archive under ignored `vendor/`, records its commit, dirty state, archive SHA-256, package integrity, and Node version in ignored `vendor/provenance.json`, and updates only the local archive integrity in this fixture's lockfile. This mode is suitable for a fresh clone and intentionally runs through npm so it uses the same Node executable as the fixture command.

To reproduce the recorded frozen-archive run instead, use `& $node $npm run setup -- --frozen [archive-path]`. With no path it reads `trial/.review/beta-review-86926d4/serein-ui-react-0.1.0-beta.1.tgz` and refuses any archive whose SHA-256 is not `e7fefb1a74be80df55384ca446db9995359d7d2ae560676bf94d5c23f53cc470`.

The tracked lockfile records the reviewed frozen archive. Both modes support `npm ci --ignore-scripts` because setup synchronizes the local archive integrity first. A current-source `npm pack` can produce different archive bytes between runs even when the package version and source are unchanged; expect the current-source mode to change the fixture's lockfile integrity, and treat that diff as generated integration evidence rather than a library dependency update. Running frozen setup restores the tracked integrity.

The verifier starts the production server on `127.0.0.1:4319` and stops only that process. Pass another port as the first argument (for example, `& $node scripts\verify.mjs 4337`) or set `SEREIN_NEXT_PORT` to use another isolated port. It checks server-rendered HTML, emitted package CSS, hydration and console errors, a keyboard-only validation/failure/retry flow, duplicate-request guarding, state retention, light and dark themes, a 320-pixel viewport, and axe WCAG 2.0 A/AA, 2.1 AA, and 2.2 AA-tagged rules. This is bounded automated evidence, not a broad accessibility-conformance claim.
