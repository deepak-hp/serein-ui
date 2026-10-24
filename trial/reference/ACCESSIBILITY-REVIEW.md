# Accessibility review protocol

## Automated evidence — 27 September 2026

Run `npm run check:reference-accessibility` from `trial` with the reference app on port 5174. The test uses a fresh Chromium context and fictional projects. It checks:

- A 320 × 256 CSS-pixel viewport: page reflow, editor overflow, keyboard reachability of Save, validation focus and focus return. This is the viewport equivalent described in [W3C's reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), not a native browser zoom interaction.
- Text spacing: line height 1.5, paragraph spacing 2em, letter spacing 0.12em and word spacing 0.16em; see [W3C's text-spacing guidance](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html).
- Text enlargement: computed font sizes doubled through injected test CSS at a 640px viewport. This is a stress test, not a replacement for browser text zoom.
- Forced-colour emulation: system button text, visible control borders, current-page outline, and usable editor controls. Native Windows contrast themes still require review.
- Keyboard only: skip navigation, open a project, edit its name, save, and restore focus to its trigger. Focus hit-testing checks that the current control is not entirely obscured; see [W3C's focus-not-obscured guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).
- Error recovery: corrected fields stop reporting stale errors; attempted dismissal focuses Keep editing; discarding returns focus to the opener.
- Reduced motion: the skip link appears without a transition.

The separate `check:reference` flow covers search, date/status filtering, persistence, simulated save failures and archive recovery, with axe checks in light/dark and the editor error state. Both checks pass after the fixes recorded in VERIFICATION.md.

## Manual checks still pending

### Customization scope and selection

Base UI owns its upstream keyboard, ARIA and focus primitives. Serein owns wrapper contracts and label/error wiring, composed focus flows, custom DataTable and status behavior, motion, calendar/date adapters, colours, targets, reflow, visible focus and optional materials when enabled. Retain bounded integration keyboard regressions, but do not repeat Base UI's upstream baseline across every component/device permutation.

For native library review, select representative Serein-owned risk paths from the full scripts below:

- Projects: nested Drawer and discard decision, calendar/date selection and return focus, custom table semantics, archive/restore and their resulting focus/status.
- Invalid → corrected → failed → retry/success: error associations, retained context, pending/failure/success announcements and focus. Include distinct inline-details, completion/restart and storage-recovery outcomes where their behavior differs; one successful form does not cover them.
- Actual zoom/reflow, rendered light/dark themes, Windows contrast themes, visible/unobscured focus, measured colours/targets and reduced motion on the selected compositions; include enabled optional materials.

Reuse an observation for identical wrappers only with the same candidate, environment, configuration and state. Record the original evidence and exactly which identical uses it supports. Expand the selection when behavior, source or dependencies change, a distinct composition adds risk, or a failure suggests wider impact. Do not mark an untested distinct flow or environment passed by analogy.

Native Windows/assistive-technology and actual-zoom work is deferred during the owner's background-only work restriction. Mac/VoiceOver review follows later. No native result is added by this scope update. The source decision record is [customization accessibility scope](../../docs/validation/2026-10-24-customization-accessibility.md).

Disabled-user usability input is a separate human activity. Consuming-app content, localization, complete processes and product/EAA applicability review remain separate product responsibilities. Neither those reviews nor EAA certification are automated by this protocol.

Record browser/OS/assistive-technology versions, expected behaviour, actual result and any evidence for every row. Do not mark a row passed based on the automated script.

| Environment and flow | Expected result | Status |
| --- | --- | --- |
| NVDA + Firefox: navigate heading, search/status/date filters and table | Meaningful names, correct selected/sorted state, understandable results and table navigation | Pending |
| NVDA + Firefox: invalid submit, correction, failed save, retry | Field error association and useful announcements without stale errors or duplicate interruptions | Pending |
| VoiceOver + Safari: create/edit, dirty dismissal and archive confirmation | Modal boundary, reading order, decision focus and return focus are understandable | Pending |
| Browser text zoom 200% | Content and controls remain readable, operable and untruncated | Pending |
| Browser zoom 400% from a 1280px-wide window | Ordinary content reflows; only the data table needs horizontal scrolling; all editor actions remain reachable | Pending |
| Windows contrast themes, including dark and light themes | Text, checked/selected states, validation, disabled controls and focus remain distinguishable | Pending |
| Keyboard and screen reader: Due dates popup | Month/day navigation, partial range and completed selection are understandable; focus returns to the date trigger | Pending |
| Dynamic storage failure and recovery | The Projects error is announced, corrupt stored data remains untouched, and **Retry loading** has an understandable outcome; Settings and Onboarding recovery uses **Allow replacement on next save** | Pending |

This protocol covers the reference workspace. Each consuming app still needs complete-page and complete-process evaluation, including its own content and services. No WCAG or EAA conformance claim follows from these checks.

## Native review setup

Use the release candidate installed from its npm tarball, not a source alias. From `trial`, with the repository's Node 24 runtime:

```sh
npm ci
npm run reference:setup
npm run reference:dev
```

Open `http://127.0.0.1:5174` on the device under review. Use only fictional data and do not enter personal birth information, credentials, customer records or other sensitive data. Before each run, clear this origin's site data so saved state from an earlier run cannot hide a first-use defect.

The default route `/` opens **Projects**. Use `?view=invoices`, `?view=settings` and `?view=onboarding` for the other native review flows. The catalogue and composition links are `?view=catalogue` and `?view=composition`.

Create one result record per environment. Record exact versions from the applications' About screens; “latest” is not a version.

```text
Reviewer:
Date and time zone:
Candidate commit and tarball filename/SHA-256:
Device and OS version:
Browser and version:
Assistive technology and version:
Input used (keyboard, touch, pointer):
Display size/scaling and starting window size:
Flow and step:
Expected result:
Actual result, including announced words where relevant:
Status: Pending | Pass | Fail | Blocked
Evidence link or issue URL:
Notes and follow-up owner:
```

Start every unperformed record at **Pending**. Use **Blocked** only when setup or the environment prevents the check, and state the blocker. Record selected scope and any observation reused under the rules above. A pass in one browser, theme, zoom level or assistive-technology pairing does not pass another row.

## Common task script

The complete Projects, Invoices, Settings and Onboarding scripts below are retained as reproducible references. Apply the selection rules above to native library review and record selected steps plus any explicit reuse; the consumer's complete-process review uses its own full flows. For each selected path, put the mouse or trackpad aside, move in both directions, activate controls, dismiss any popup with Escape, and confirm that the visible focus indicator is never fully covered by sticky content or an open layer. The focus check follows [W3C's focus-not-obscured guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).

### Projects

1. Open `/` and navigate the **Projects** heading, filters, table and controls. Confirm the table's sortable headers announce their sorted state; this sorting expectation applies to Projects, not the invoice table.
2. Open a project in the **Edit ...** Drawer, change a field, then dismiss it with **Cancel**, its close control or Escape. Confirm the **Discard unsaved changes?** decision initially focuses **Keep editing**; that action returns focus to **Project name**. Dismiss again and confirm **Discard changes** closes the Drawer without saving and returns focus to the opener.
3. Activate **Archive**. In the confirmation, confirm **Cancel** and Escape leave the project unchanged; confirm **Archive project** succeeds, announces the result, and moves focus to `#project-workspace`. In archived view, repeat with **Restore** and **Restore project**.
4. Open **Due dates** and use keyboard navigation to move between months and days, set a partial range, complete the range, and dismiss the popup. Confirm the selection is understandable and focus returns to the **Due dates** trigger.
5. Trigger the Projects storage error. Confirm **Retry loading** has an understandable outcome and the existing saved data remains untouched.

### Invoices

1. Open `?view=invoices` and navigate by landmarks, headings and controls. Confirm the result count is announced after filters change.
2. Search for `no-client`, reach the no-results message, activate **Reset filters**, then choose **Paid** in **Invoice status**.
3. Open `INV-1044`, confirm that its paid state and lack of reminder action are understandable, then close the inline details section. Its heading receives focus when opened, and **Close details** returns focus to `INV-1044`.
4. Set **Invoice status** to **All**, open `INV-1042`, select **Fail the next reminder**, and activate **Simulate reminder**. Confirm the pending state, failure alert and retained context are understandable.
5. Activate **Retry reminder**, confirm success is announced and no email is claimed to have been sent, then close the inline details section. Focus must return to `INV-1042`.

### Settings

1. Open `?view=settings`, clear **Display name**, and activate **Save settings**. Confirm focus moves to the field and its `Enter a name.` error is associated and announced once.
2. Enter `Accessibility reviewer`, choose a different time zone, expand **Try a save failure**, select **Fail the next save**, and save.
3. Confirm controls are unavailable only while the save is pending. After failure, confirm the alert explains recovery and the entered name and time zone remain intact.
4. Activate **Retry save**, confirm success is announced, reload the page and confirm the saved values return.
5. Change the name without saving, activate **Reset changes**, and confirm the last saved values return and focus moves to **Display name**.

For a separate unreadable-storage scenario, the recovery action is **Allow replacement on next save**. It permits replacement by the next successful save; it does not retry the simulated save failure above.

### Onboarding

1. Open `?view=onboarding` and activate **Continue** with an empty name. Confirm focus moves to **Workspace name** and its error is associated and announced once.
2. Enter `Cedar Studio`, continue, change the weekly-summary preference, go **Back**, and confirm the name remains. Continue to the review step and confirm the progress and review content are understandable.
3. Expand **Try a completion failure**, select **Fail the next completion**, and finish. Confirm the pending state, failure alert, retained choices and retry action are understandable.
4. Activate **Retry completion**, confirm the completion heading receives focus, reload and confirm the completion state remains.
5. Activate **Restart setup** and confirm a blank first step returns. Focus must move to **Workspace name**.

For a separate unreadable-storage scenario, confirm **Allow replacement on next save** explains the permission to replace the saved record. It is distinct from **Retry completion**.

## NVDA with Firefox

Use a current stable desktop Firefox and NVDA on Windows, and record both exact versions. Start NVDA before Firefox. Keep browse mode on for page reading and let NVDA switch modes for form controls; record any manual mode change needed to recover.

1. Read the page title, landmarks and headings, then use `H`, `D`, `F`, `B` and `T` navigation where applicable. Use `NVDA+F7` to inspect elements and confirm the task can be understood without visual position.
2. Complete the selected common-script paths with Tab, Shift+Tab, Enter, Space, arrow keys and Escape. In a selected invoice-table check, confirm headers and cell context are announced and the horizontal-scroll hint does not replace table semantics.
3. For every validation, pending, failure and success state, record the words NVDA announces, whether it interrupts unrelated speech, whether it repeats, and whether stale error text is announced after correction.
4. Review the selected visual risks in light and dark themes, and selected failure/focus-return risks at actual 200% and 400% browser zoom. Record which states were exercised; do not multiply identical wrapper checks without a distinct risk.

Status: **Pending**. No native NVDA/Firefox run has been performed for this candidate.

## VoiceOver with Safari

Use a current stable Safari and the built-in VoiceOver version supplied with the recorded macOS version. Turn VoiceOver on before opening the page. Apple documents the web rotor and `VO+U` in its [VoiceOver rotor guide](https://support.apple.com/guide/voiceover/voiceover-rotor-mchlp2719/mac).

1. Use the rotor to inspect landmarks, headings, form controls, links and tables. Confirm the page structure and current step can be understood without visual position.
2. Complete the selected common-script paths using VoiceOver navigation plus Tab, Shift+Tab, Space, Return, arrow keys and Escape. Record whether Quick Nav is on and any step that only works after changing it.
3. Confirm popup boundaries, dialog context, expanded/collapsed state, selected options, validation, pending status, failure alerts, completion headings and return focus are announced in a useful order.
4. Review selected visual risks in both themes and selected failure/focus-return risks at actual 200% and 400% page zoom. Record the exercised states and any same-setup wrapper observation reused.

Status: **Pending**. No macOS/Safari/VoiceOver device run has been performed for this candidate. Playwright WebKit results on Windows are not Safari or VoiceOver evidence.

## Actual zoom, keyboard and visual checks

These checks use the browser's own zoom command. Do not substitute DevTools viewport emulation, CSS transforms or the automated doubled-font test.

1. Set the desktop browser window so its content area is 1280 CSS pixels wide at 100% zoom. Record the physical display, OS scaling, window size and browser zoom shown in the browser UI.
2. Increase browser zoom to **200%**. Complete the selected common-script paths and visual risks in both themes. Record clipped or overlapping text, lost content, two-dimensional page scrolling, obscured focus, unreachable actions and popups that extend outside the viewport.
3. Return to 100%, restore the 1280 CSS-pixel starting width, then increase browser zoom to **400%**. Repeat the selected composition/failure/recovery risks. Ordinary page content must reflow to one dimension; data tables may scroll horizontally inside their labeled regions. The page itself, forms and editor actions must not require horizontal scrolling. This procedure exercises the relationship described in [W3C's reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).
4. At 100%, 200% and 400%, Tab and Shift+Tab through the interactive elements in those paths. Confirm logical order, a visible focus indicator, no keyboard trap, Escape behavior, and that focused controls are not completely covered.
5. With a pointer, inspect Serein-owned target sizes and spacing at 100% zoom, reusing identical wrapper observations under the selection rules. Record rendered size and spacing when a non-inline control appears smaller than 24 by 24 CSS pixels; assess exceptions using [W3C's target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
6. In both themes, measure text contrast and the boundaries or indicators needed to identify controls, selected state, validation and focus for the selected custom styles and states, including enabled optional materials. Record colors, ratio, tool and result. Use the applicable text requirement and [W3C's non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html); visual inspection alone is not a contrast measurement.
7. Enable the operating system's Reduce Motion preference before launching the browser. Repeat navigation, popup, save, error and completion interactions. Record any non-essential spatial movement or loss of status feedback. W3C describes interaction-triggered motion and preference support in its [animation guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).
8. On Windows, repeat both themes with a light and a dark native contrast theme. Confirm text, control boundaries, selected/checked state, validation, disabled state and focus remain distinguishable. Record the exact OS theme names.

All actual 200%/400% zoom, contrast-theme, measured contrast, target-size, reduced-motion and complete keyboard/focus-obscuration records remain **Pending** until a person performs and records them.

## Result summary

Copy a row for each selected environment, theme and zoom level, recording selected paths and explicit reuse. The pairing rows below are unperformed reference slots, not a requirement to test the full script in every permutation. Link failures to the beta feedback form or a bug issue; do not overwrite a failed result after a fix—add a dated retest row.

| Pairing or check | Candidate | Reviewer/date | Result | Evidence or issue |
| --- | --- | --- | --- | --- |
| NVDA + Firefox, common task script, light | Unassigned | Unassigned | Pending | — |
| NVDA + Firefox, common task script, dark | Unassigned | Unassigned | Pending | — |
| VoiceOver + Safari, common task script, light | Unassigned | Unassigned | Pending | — |
| VoiceOver + Safari, common task script, dark | Unassigned | Unassigned | Pending | — |
| Firefox actual zoom 200% and 400% | Unassigned | Unassigned | Pending | — |
| Safari actual zoom 200% and 400% | Unassigned | Unassigned | Pending | — |
| Windows native light/dark contrast themes | Unassigned | Unassigned | Pending | — |
| Measured text/non-text contrast and targets | Unassigned | Unassigned | Pending | — |
| Reduced motion and keyboard/focus obscuration | Unassigned | Unassigned | Pending | — |
