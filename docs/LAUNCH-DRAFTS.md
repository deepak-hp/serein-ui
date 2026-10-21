# Serein beta announcement and reviewer invitations

Prepared 14 October 2026 and updated for the planned repository rename. **The selected GitHub reviewer call is published as [issue #5](https://github.com/deepak-hp/ritam-ui/issues/5); other channels remain drafts.** The npm package is not published, and the new repository and Pages destinations remain pending external rename and deployment verification. Native accessibility and independent user reviews remain open. This copy describes the React-web beta and invites review; it does not announce a stable production release.

## Planned canonical destinations

- Source: https://github.com/deepak-hp/serein-ui
- Live components: https://deepak-hp.github.io/serein-ui/?view=catalogue
- Design studio: https://deepak-hp.github.io/serein-ui/?view=serein
- Storybook: https://deepak-hp.github.io/serein-ui/storybook/
- Beta feedback form: https://github.com/deepak-hp/serein-ui/issues/new?template=beta_feedback.yml
- Reviewer instructions: https://github.com/deepak-hp/serein-ui/blob/main/docs/BETA-EVALUATION.md
- Private security reports: https://github.com/deepak-hp/serein-ui/security/advisories/new

These are canonical targets, not verified live destinations. Confirm the repository rename and new Pages deployment before publishing or relying on these links.

The owner selected the GitHub repository for the beta announcement on 14 October 2026. GitHub Issues is enabled and Discussions is disabled, so the reviewer call below uses an issue. No LinkedIn/X account or private reviewer contacts have been supplied; those messages remain drafts.

## GitHub reviewer call — selected destination

**Title:** Serein React beta: looking for integration and accessibility reviewers

Serein is an open-source React UI library built around a consistent design language: bright orange actions, clear light and dark surfaces, and restrained motion. It includes 42 typed components, compiled CSS, a component catalogue, Storybook, and structured component guidance for coding assistants.

The source and interactive demos are now public under MIT:

- [Try the components](https://deepak-hp.github.io/serein-ui/?view=catalogue)
- [Explore the design](https://deepak-hp.github.io/serein-ui/?view=serein)
- [Read Storybook](https://deepak-hp.github.io/serein-ui/storybook/)

I’m looking for practical feedback in three areas:

1. **Developers:** install the reviewed local package in a test branch of an existing React application and try a real task, including a failed request and recovery.
2. **Accessibility reviewers:** try complete flows with NVDA/Firefox or VoiceOver/Safari, actual browser zoom, and keyboard-only input. Report what happened and what was announced.
3. **People building with AI:** use the component guidance on your own task and describe where it helped, where it was restrictive, and what still needed manual design work.

Start with the [beta evaluation kit](https://github.com/deepak-hp/serein-ui/blob/main/docs/BETA-EVALUATION.md). npm publication is still pending; the planned prerelease assets and local tarball instructions cover installation. React web is the supported implementation; native mobile and desktop adapters are not included.

Please submit a [beta feedback report](https://github.com/deepak-hp/serein-ui/issues/new?template=beta_feedback.yml) with the candidate version/commit, environment, steps, expected result and actual result once the rename is verified. Use fictional data and keep private code and credentials out of reports. Report security issues through the [private channel](https://github.com/deepak-hp/serein-ui/security/advisories/new).

Automated checks are in place, but independent review is still needed. This beta does not claim WCAG/EAA conformance or a proven improvement in AI-generated design quality. Specific criticism, failed attempts and workarounds are useful feedback.

## LinkedIn draft

I’ve opened the source and demos for Serein, a React UI library with 42 typed components, light and dark themes, and structured guidance for coding assistants.

The problem I’m exploring is familiar: an AI can assemble a screen quickly, but the result still needs clear hierarchy, consistent controls and thoughtful failure states. Serein brings components and composition guidance together so those decisions have a concrete starting point.

This is a beta. I’m looking for developers to try it in an existing React app and accessibility reviewers to test complete flows. The component demo is live; npm publication and independent reviews are still pending.

Try it: https://deepak-hp.github.io/serein-ui/?view=catalogue

Source and review instructions: https://github.com/deepak-hp/serein-ui

If you try it, share the task you attempted and the friction you encountered. I’d rather learn from a specific failure than collect a general thumbs-up.

## X draft

Serein’s React UI beta is open source: 42 typed components, light/dark themes, and guidance for coding assistants. Looking for integration and accessibility feedback. npm release pending.

https://deepak-hp.github.io/serein-ui/?view=catalogue

## Direct reviewer invitation template

**Subject:** Would you review one Serein beta workflow?

I’m preparing Serein, an MIT-licensed React component library, for a stable release. After the planned rename and Pages verification, the beta demo will be available at https://deepak-hp.github.io/serein-ui/?view=catalogue.

Would you be interested in reviewing one task that matches your experience: integrating the local package in a real React app, checking a complete flow with your screen reader, or building a fresh task with the AI guidance?

The [review kit](https://github.com/deepak-hp/serein-ui/blob/main/docs/BETA-EVALUATION.md) explains the candidate, installation and report format. You can choose the task and stop at any point. Please use fictional data and leave confidential application code out of reports. If the scope or time commitment does not suit you, there is no obligation to participate.

The beta has not completed independent accessibility review and is not yet published on npm. I’m interested in failures and friction as well as successes. Feedback will not be quoted as an endorsement without your permission.

## 60-second demonstration script

1. **0–10 seconds:** Open the live catalogue. Show Button, Select and a light/dark theme change. Caption: “Serein — React web beta”.
2. **10–25 seconds:** Open the invoice workflow. Filter records and trigger the clearly labeled simulated failure/retry. Caption: “Examples include failure and recovery”. Do not imply an email was sent.
3. **25–40 seconds:** Show settings validation and successful local persistence. Keep the fictional values visible so the before/after is understandable.
4. **40–50 seconds:** Show the source-derived component contract and one composition recipe. Caption: “Structured guidance for coding assistants”. Do not display a quality score or claim superiority.
5. **50–60 seconds:** End on the catalogue URL and beta feedback form. Caption: “Open source. Reviewers welcome. npm release pending.”

Use captures from the actual application, label simulated services, and keep text legible. A script is not a completed video; no recording or announcement is claimed by this file.

## Publishing and follow-through

- [x] Public source, catalogue, Storybook and feedback destinations identified.
- [x] Beta copy, reviewer invitation and demonstration script prepared.
- [x] Owner selects the GitHub repository for the announcement. No private invitation recipients were selected.
- [x] Publish the selected exact text: [GitHub beta reviewer call #5](https://github.com/deepak-hp/ritam-ui/issues/5), 14 October 2026.
- [ ] Record actual reviewer participation and reports, without interpreting silence as approval.
- [ ] Triage each finding; link its reproduction, fix, and retest before marking it resolved.
- [ ] Review the evidence and npm installation outcome before a separate stable-release announcement.

No direct invitations have been sent, no external feedback has been collected, and no audience or engagement numbers are claimed. The GitHub issue is a public call for reviewers, not evidence that reviews have happened.

## Repository name at launch

The owner requested that the repository name match Serein when ready to launch. Planned target: `deepak-hp/serein-ui`; external rename and Pages deployment are not yet verified. Recheck target availability and the resulting redirects at the actual rename.

- [ ] Once the launch gates are met, rename the repository to `serein-ui` and update the local origin remote.
- [ ] Update active package repository/homepage/bugs metadata, installation examples, site/source/feedback links and announcement copy. Preserve frozen experiment inputs and historical evidence; annotate their old identity rather than rewriting their recorded bytes.
- [ ] Rebuild and deploy Pages under `/serein-ui/`; verify catalogue, Storybook manager navigation, deep links, fonts, CSS and AI assets at the new address. This remains unchecked until external verification.
- [ ] Update the repository homepage and published announcement links after the new deployment is verified.
- [ ] Verify old repository links redirect and document the changed Pages address. Do not assume old Pages links redirect.

[GitHub's rename guidance](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository) distinguishes repository redirects from project-site URLs, which are not automatically redirected. The existing Pages workflows derive the base path from the repository name, but active hardcoded links still need review. No repository rename or new-site deployment is claimed here.
