# Windows accessibility setup — 14 October 2026

## Result

Native Firefox and NVDA are installed and their executable signatures are valid. **No native screen-reader test has passed.** Native browser automation stopped because its Windows browser URL-policy enforcement is unsupported. Subsequent work is background-only at the owner's request; it does not operate desktop windows, produce NVDA speech or change system settings.

The candidate source is `ac565b6b3804a892051ba3e73a0e10609fd3e61f`. Host Windows build is `26300.9550`, display version `26H2`. The macOS/Safari/VoiceOver review is deferred at the owner's request.

## Verified installation

Both pinned installations completed through `winget` using its community source and official vendor downloads. Winget verified each installer hash. A subsequent read-only check inspected the installed files' version information, SHA-256 hashes and Authenticode signatures.

| Application | Installed version | Authenticode signer | Result |
| --- | --- | --- | --- |
| Mozilla Firefox | Product/file `157.0.1` | Mozilla Corporation | Valid |
| NVDA | Product `2026.2`; file `2026.2.0.57664` | NV Access Limited | Valid |

Installed executable SHA-256 values:

```text
Firefox: F029827EC8841DFD36E75ACB95343F2669EB86C296EEDD49F0E48D80C2A7D514
NVDA:    226B0315113D0A7F089044BAAF049FA9BA694B2260DDE8746ECCB13881C7FF6A
```

The install commands were:

```powershell
rtk proxy winget install --id Mozilla.Firefox --exact --version 157.0.1 --source winget --silent --accept-package-agreements --accept-source-agreements --disable-interactivity
rtk proxy winget install --id NVAccess.NVDA --exact --version 2026.2 --source winget --silent --override "--install-silent --enable-start-on-logon=False" --accept-package-agreements --accept-source-agreements --disable-interactivity
```

NVDA's installer was instructed not to enable start at Windows sign-in. The Welcome screen also showed its start-after-sign-in checkbox unchecked. Firefox was not made the default browser and no data import was performed. Installation does not establish accessibility compatibility with Serein.

## Native attempt and blocker

NVDA opened its Welcome screen. The desktop tool could not dismiss it; the owner subsequently replied “ready”, and a later window inventory no longer showed the Welcome dialog. No speech transcript was captured.

Inspection of native Firefox then stopped with the tool message:

> Computer Use has been stopped for this turn because browser URL policy enforcement is not yet supported for the current Windows browser.

No alternate desktop automation was used to bypass that stop. Later, at the owner's request, the player window was returned to the front. Native testing remains blocked independently of the owner's current request to avoid interruptions.

| Check | Status | Evidence still needed |
| --- | --- | --- |
| Install and verify Firefox/NVDA | Complete | Versions and signatures recorded above |
| NVDA + Firefox, light and dark complete flows | Blocked | A supported native control path, or a person operating Firefox/NVDA and recording actual speech, modes and focus |
| Actual Firefox 200%/400% zoom | Pending | Browser UI zoom and complete-flow observations |
| Windows native light/dark contrast themes | Pending | Named OS themes and complete-flow observations |
| VoiceOver + Safari | Deferred | A later macOS device review |

Use the [native review protocol](../../trial/reference/ACCESSIBILITY-REVIEW.md) for the next run. Record a tarball hash, exact versions, theme, zoom, expected/actual results and announced words. Keep every native release gate open until that evidence exists. The headless follow-up in the [automated audit](2026-10-14-accessibility.md#background-keyboard-follow-up) does not close these gates.

## Background-work retry — 21 October 2026

The Windows computer-use integration initialized and listed the installed Firefox application as not running. Automatic approval review rejected launching it because the earlier request to avoid interrupting the owner's viewing remained active. A question requesting explicit permission for desktop focus and screen-reader audio is pending. No window opened, no input or NVDA speech was produced, and no alternate automation was used. This attempt provides no native accessibility result; all native review rows remain open.
