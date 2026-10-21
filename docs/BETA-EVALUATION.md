# Serein beta evaluation kit

Serein `0.1.0-beta.1` needs feedback from real people integrating the React web package into real applications. The repository's reference app, automated tests and frozen AI comparison are internal evidence; they are not external adoption, usability or accessibility validation.

The 14 October maintainer work adds [focused browser accessibility checks](validation/2026-10-14-accessibility.md), a [separate Next.js consumer](validation/2026-10-14-next-consumer.md), and a [fresh four-attempt AI task](validation/2026-10-14-ai-trial.md). Reviewers can use these reproductions as background; they do not satisfy the external-reviewer or native-device criteria below.

## Candidate installation

The npm package is not published. Do not run `npm install @serein-ui/react` until registry publication has been independently verified. The [GitHub prerelease page](https://github.com/deepak-hp/serein-ui/releases/tag/v0.1.0-beta.1) provides `serein-ui-react-0.1.0-beta.1.tgz`, `SHA256SUMS`, and unsigned `SOURCE.json` source metadata. These files are release metadata and a checksum, not a signed attestation; download them from the same prerelease and retain the source commit in the evaluation record. The downloaded archive matched the prepared SHA-256 and passed the supplied consumer check.

For a local fallback, a maintainer can build a candidate from source:

```sh
cd trial
npm ci
npm run build
npm pack
```

For the downloaded prerelease, verify `serein-ui-react-0.1.0-beta.1.tgz` against `SHA256SUMS` before installing the exact file. On PowerShell:

```powershell
$expected = ((Select-String .\SHA256SUMS -Pattern 'serein-ui-react-0.1.0-beta.1.tgz').Line -split '\s+')[0]
$actual = (Get-FileHash .\serein-ui-react-0.1.0-beta.1.tgz -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected.ToLowerInvariant()) { throw "SHA-256 mismatch" }
```

On Linux or macOS:

```sh
sha256sum -c SHA256SUMS --ignore-missing
# macOS alternative:
shasum -a 256 -c SHA256SUMS
```

In a test branch of the consuming application, install the exact verified file:

```sh
npm install /absolute/path/to/serein-ui-react-0.1.0-beta.1.tgz
```

The consuming application must use React and React DOM `^19.3.0` (React 19.3 or later within major version 19). Import `@serein-ui/react/styles.css` once at the application entry point, and follow the package README for document theme attributes. Keep the tarball filename, checksum, `SOURCE.json`, source commit, lockfile change and install command in the evaluation record so every result identifies the exact reviewed candidate. Do not describe the package as published on npm until registry publication has been independently verified.

An optional human-review packet may be downloaded as `serein-reviewer-packet-0.1.0-beta.1.zip`. Extract it and run `node serve.mjs` with Node 24, then open the displayed loopback address; no npm installation is needed. Delivered-packet playback passed all 16/16 checks. Record observations against each opaque candidate ID before inspecting the historical evidence or repository sources. Condition labels are hidden, but appearance can reveal identity and the candidate order is fixed. The packet is not a fully blind study and distributing it does not count as completed external review.

Use a development or staging environment with fictional or sanitized data. Do not submit credentials, customer records, personal birth information or other sensitive data in an issue, screenshot, recording or fixture.

## Real-application tasks

Use the application's own routes, content, state management and service boundary. Reproducing the Serein reference examples unchanged does not count as a real-application evaluation. A reviewer may cover one task deeply; the beta cohort must cover all three task families and their failure/recovery paths.

### Invoices or comparable records

Build or migrate a real list-detail task with search, a status filter, a semantic data table, an empty result and a detail action. Connect the action to the application's test API or service stub. Exercise a paid/ineligible state, a successful action, a service failure that preserves context, and a retry. Confirm loading prevents duplicate submission and that success does not overstate what the service completed.

### Settings or comparable editable preferences

Build or migrate grouped settings with a required text field, a selection and a boolean preference. Connect save to the application's test persistence layer. Exercise invalid submission, correction, successful save and reload, unsaved reset, service or storage failure, retained edits and retry. Confirm errors identify a recovery action and stale errors disappear after correction.

### Onboarding or comparable multi-step setup

Build or migrate a multi-step setup with progress, back navigation, review and completion. Connect completion to the application's test service or persistence layer. Exercise an empty required value, back/forward state retention, completion failure with retained choices, retry, reload after success and restart or equivalent recovery. Confirm the user's position and saved outcome remain understandable throughout.

For every task, use keyboard-only input at desktop and narrow widths, light and dark themes, and at least one browser named in [SUPPORT.md](SUPPORT.md). If the reviewer uses assistive technology, follow the result fields in the [native accessibility protocol](../trial/reference/ACCESSIBILITY-REVIEW.md); do not infer accessibility support from an automated scan.

## What to record

Submit one [beta feedback issue](https://github.com/deepak-hp/serein-ui/issues/new?template=beta_feedback.yml) per task or defect. The form opens in the public Serein repository; omit private application data and use the [private security channel](https://github.com/deepak-hp/serein-ui/security/advisories/new) for vulnerabilities:

- reviewer role and organization type, without personal identifiers;
- consuming application's purpose and whether it is a prototype, staging system or production-bound system;
- candidate commit, tarball filename and checksum;
- OS, browser, Node, React, React DOM, bundler and Serein versions;
- task attempted, starting state, exact steps and expected outcome;
- actual outcome, time or friction, workarounds and whether the task was completed;
- failure injected or encountered, whether user input survived, and whether retry recovered;
- keyboard, zoom, screen-reader or other access method used;
- smallest reproduction and sanitized evidence;
- suggested API, behavior or documentation change.

Maintainers should acknowledge each report, reproduce it against the exact candidate, assign severity and disposition, and link any fix and retest. Keep unsuccessful attempts and unresolved disagreements in the record.

## Proposed maintainer exit criteria for stable 1.0

The maintainers propose considering the beta for `1.0.0` only when all of these are true. These numerical cohort thresholds are internal release criteria, not externally established requirements or prior commitments:

1. The reviewed package is published, registry metadata and provenance are verified, and a clean external consumer can install it by version without repository access.
2. At least three external reviewers from at least two independently maintained consuming applications complete evaluations. Across the cohort, each of the invoices/records, settings/preferences and onboarding/setup task families has at least two recorded completions, including a real service or persistence failure and successful recovery.
3. Feedback includes at least one Windows/Firefox and one macOS/Safari native-device run. The pending NVDA/Firefox, VoiceOver/Safari, actual 200%/400% zoom, contrast, reduced-motion, target-size and keyboard/focus-obscuration rows in the accessibility protocol are completed with evidence.
4. No unresolved release-blocking defect remains: data loss, unrecoverable task failure, keyboard trap, inaccessible required action, incorrect package contents, security vulnerability, or documented API behavior that the implementation does not provide.
5. Every public component used by the evaluated tasks has stable typed API documentation, an example, keyboard guidance and an explicit limitation where applicable. Planned breaking API changes are completed or deferred in a published compatibility policy.
6. Supported environments in [SUPPORT.md](SUPPORT.md) match the tested matrix. CI, packed-consumer, SSR/hydration and clean-install release checks pass on the exact proposed `1.0.0` commit.
7. All external reports have a recorded disposition and retest where a fix was required. The release notes describe breaking changes, known limitations, migration steps and support channels without claiming WCAG/EAA conformance or universal AI-quality improvement.

These thresholds are release gates, not evidence that Serein works for every application or user. The consuming product remains responsible for its content, workflows, services and applicable legal assessment.
