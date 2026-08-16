---
sidebar_position: 9
slug: /macos-target
title: macOS Target (Experimental)
---

# macOS Target (Experimental)

Prowl can drive **native macOS apps** — including menu bar extras (`NSStatusItem` + `NSMenu`) — through Apple's Accessibility API, in addition to the web. You point `target.type` at `macos`, write the same portable steps you already know, and Prowl runs them against a real app instead of a browser page.

:::warning Experimental and not yet released
This target is experimental **and** unreleased. It is **not** in the published `prowl-tools` npm package (latest is **0.1.3**). To use it today you must run the CLI from a **source checkout** and build the Swift helper locally (see [Requirements](#requirements)). The API, selector dialect, and step coverage may still change.
:::

## Requirements

- **macOS 13 or newer** (the helper's platform target).
- A **Swift toolchain** — Xcode or the Xcode Command Line Tools.
- A **source checkout** of the [`prowl`](https://github.com/prowl-tools/prowl) repository, linked onto your `PATH` with `npm link` (the npm package does not include the macOS code path yet).
- **Accessibility** permission for the terminal that hosts Prowl — and **Screen Recording** permission too, if your hunt takes screenshots. See [Permissions](#permissions).

## Enabling it

### 1. Build the helper

The macOS target is powered by a small Swift helper, `prowl-macdriver`, that talks to the Accessibility API. It is **not** bundled in the npm tarball — you build it once from the source checkout:

```bash
cd macdriver
swift build -c release
```

Prowl looks for the binary in this order:

1. `$PROWL_MACDRIVER_BIN` — an absolute path to a prebuilt binary, if set;
2. `macdriver/.build/release/prowl-macdriver`;
3. `macdriver/.build/debug/prowl-macdriver`.

If none exist, Prowl fails with a clear "build the helper" message rather than crashing. To point at a binary you built elsewhere, export `PROWL_MACDRIVER_BIN`:

```bash
export PROWL_MACDRIVER_BIN="/path/to/prowl-macdriver"
```

### 2. Point your config at a macOS target

```yaml
# .prowl/config.yml
target:
  type: macos
  app: com.example.MyMenuBarApp   # bundle id, or an absolute /path/to/App.app
```

### 3. Grant permission and run

[Grant Accessibility permission](#permissions) to your terminal, then run a hunt exactly as you would for the web:

```bash
prowl run my-macos-hunt
```

## Configuration

The `target` block carries a **discriminant**, `type`:

| `target.type` | Required fields | Notes |
|---|---|---|
| `web` (default) | `url` | The original web target. `type` is optional, so existing `target: { url }` configs are unchanged and keep defaulting to web. |
| `macos` | `app` | A **bundle id** (e.g. `com.example.App`) or an absolute path to an `.app` bundle. `url` is **not** accepted on this target. |

```yaml
target:
  type: macos
  app: com.example.MyMenuBarApp
```

:::note
`url` and `app` are mutually exclusive: the `macos` branch rejects `url`, and a target with neither `url` nor a macOS `app` fails config validation with a union error. Your existing web configs are unaffected — omitting `type` still selects the web target.
:::

### App-launch timeout

`browser.timeout` (default `30000` ms) does double duty on this target: besides bounding page-style operations, it also bounds how long Prowl waits for the target app to **launch and become ready**. Raise it for apps that are slow to start.

### guardrails.allowedApps

`allowedApps` is the native-scope analog of `allowedDomains` — it restricts which app a hunt may drive.

```yaml
guardrails:
  allowedApps:
    - com.example.MyMenuBarApp
  forbiddenSelectors:
    - "Quit"
```

- An **empty or omitted** `allowedApps` list leaves the scope unset, and the target app is implicitly allowed — mirroring the way `allowedDomains` auto-includes the web target's own host.
- When `target.app` is an **app path**, an entry in `allowedApps` may match the exact `.app` path, the bundle **name** (`Example` for `Example.app`), or the bundle **id** read from `Contents/Info.plist` when that file is readable.
- `forbiddenSelectors` still applies on this target, using the same case-sensitive substring semantics as the web target — a handy guard against destructive menu items like `Quit`.

`prowl login` and the `allowedDomains` / URL guardrails do **not** apply on the macOS target.

## Selector dialect

Native selectors address accessibility identifiers, roles, and labels. Prefer `id=` (an accessibility identifier) — it is the native analog of `data-testid`.

| Selector | Matches |
|---|---|
| `id=openSettings` | element whose `AXIdentifier` equals `openSettings` |
| `role=button[name="Save"]` | an `AXButton` whose title / description / value contains `Save` |
| `label="Email"` | element whose accessibility label equals `Email` |
| `text="Save"` or bare `Save` | element whose title / description / value contains the text |
| `statusItem` | opens the app's menu bar status-item menu (and leaves it open) |
| `menu=<title>` | opens the status menu and clicks the item whose title contains the text |

The last two are **menu bar magic selectors**:

- **`statusItem`** presses the app's menu bar extra to open its status menu and leaves it open, so subsequent steps can act on the revealed items.
- **`menu=<title>`** opens the status menu and clicks the item whose title **contains** `<title>` (case-insensitive) — a one-step shortcut for "open the menu, then click this item".

```yaml
# Open the menu bar extra, then click an item by its role/name
- click:
    selector: statusItem
- click:
    selector: role=menuItem[name="Preferences…"]

# Or do both in one step
- click:
    selector: menu=Preferences…
```

## Step compatibility

Portable steps run on **both** targets. Web-only steps are **rejected up front** at validation time on the macOS target — with a friendly error — before anything launches. The same check runs for **sub-hunts** invoked via `runHunt`, so a web-only step buried in a sub-hunt fails fast rather than partway through a run.

| Portable (web **and** macOS) | Web-only (rejected on macOS) |
|---|---|
| `click`, `fill`, `type`, `press` | `navigate`, `waitForUrl`, `waitForNetworkIdle` |
| `wait`, `waitForSelector` | `mockRoute` / `unmockRoute` |
| `assert: visible` / `notVisible` | `evalScript`, `runScript` |
| `screenshot`, `assertScreenshot` | `onDialog`, `select` / `selectOption` |
| `hover`, `scrollTo` | `setInputFiles`, `waitForDownload` |
| `repeat`, `if`, `runHunt`, `copyText` | `scroll` (directional), `assert: urlIncludes` / `urlEquals` |

The error names the offending step, for example:

```text
Step "navigate" is not supported by the macOS target. It is web-only;
use a portable step (click, fill, type, press, wait, assert visible, screenshot, etc.).
```

## Assertions on the macOS target

Use **inline** `assert: visible` / `notVisible` steps for checks on this target. URL assertions (`urlIncludes` / `urlEquals`) are web-only and are rejected. Hunt-level `assertions:` blocks are not supported here — see [Known limitations](#known-limitations).

:::warning Use a recognized engine prefix in assertions
In an `assert: visible` / `notVisible` value, anything **without a recognized selector prefix is treated as text to match**. The recognized prefixes on this path are `text=`, `id=`, and `role=` (plus `css=` / `xpath=`). Notably, **`label=` is _not_ recognized here** — `visible: "label=Email"` is matched as the literal text `label=Email`, not as a label selector.

So in assertions, write `text="Settings"`, `id=statusLabel`, or `role=staticText[name="Settings"]`. Reserve `label=` for interaction steps like `click` and `fill`, where the native selector parser does understand it.
:::

```yaml
# Good — matched as a text selector
- assert:
    visible: text="Settings"

# Also fine — plain prose is matched as text
- assert:
    visible: "Settings"
```

## Known limitations

This is a phase-one implementation. Today:

- **`press` supports `Enter` / `Return` / `Space` only.** These map onto the element's activate action; other keys are unsupported.
- **Hunt-level assertions are not evaluated.** A per-hunt `assertions:` block is rejected up front (use inline `assert: visible` / `notVisible` instead), and config-level assertions such as `noConsoleErrors` / `noNetworkErrors` are simply not evaluated on this path — there is no browser console or network layer to observe.
- **Screenshots are full-screen.** The `screenshot` / `assertScreenshot` steps use macOS `screencapture`, which grabs the **whole screen** (not a window-scoped image), and therefore need **Screen Recording** permission.
- **`hover` moves the real mouse cursor** to the target element, rather than dispatching a synthetic hover.
- App teardown **quits the target app** after the run.

## Permissions

macOS gates Accessibility and Screen Recording behind explicit, per-app permission.

### Accessibility

The **process that hosts** Prowl — your terminal (Terminal, iTerm, VS Code, …) or a CI agent — must be granted Accessibility permission. macOS attributes the grant to the **hosting app**, not to `prowl-macdriver`.

Grant it under **System Settings → Privacy & Security → Accessibility**, then enable your terminal app. You can preflight from the helper itself:

```bash
macdriver/.build/release/prowl-macdriver check   # prints {"trusted": <bool>}; prompts on first run
```

### Screen Recording

The `screenshot` / `assertScreenshot` steps additionally need **Screen Recording** permission for the same hosting app (**System Settings → Privacy & Security → Screen Recording**).

### CI notes (macOS runners)

Headless CI can't click "Allow" in a permission dialog, so the permissions must be **pre-provisioned** before the run:

- Grant Accessibility (and Screen Recording, if you screenshot) to the runner's **host app** ahead of time. The supported route is a **PPPC/TCC configuration profile via MDM** on a self-hosted runner. Some teams instead seed the **TCC database** (`/Library/Application Support/com.apple.TCC/TCC.db`) with `sqlite3` in their runner image — be aware that the `access` table's schema **differs across macOS versions** (a hardcoded `INSERT` from a blog post will break on another release), and **SIP blocks direct writes** to `TCC.db`, so this only works on images with SIP disabled or a shell that has Full Disk Access.

- The **target app must be installed and registered** with Launch Services on the runner so Prowl can launch it by bundle id.

:::note
GitHub-hosted macOS runners do not grant Accessibility, so the macOS target is aimed at **self-hosted / MDM-managed runners** for now.
:::

## Worked example

A minimal menu bar hunt: open the app's status menu, click **Settings**, wait for the settings window's label, and assert it's visible.

```yaml
# .prowl/config.yml
target:
  type: macos
  app: com.example.MyMenuBarApp
guardrails:
  allowedApps:
    - com.example.MyMenuBarApp
  forbiddenSelectors:
    - "Quit"
```

```yaml
# .prowl/hunts/settings-window.yml
name: settings-window
steps:
  - click:
      selector: menu=Settings
  - waitForSelector:
      selector: text="Settings"
      timeout: 10000
  - assert:
      visible: text="Settings"
```

```bash
prowl run settings-window
```

The `menu=Settings` selector opens the menu bar extra and clicks the **Settings** item in one step; `waitForSelector` then waits for the settings window's `Settings` label to appear before the inline assertion confirms it's visible.

## What's Next

<div class="card-grid">
  <a class="card" href="/configuration">
    <h3>Configuration</h3>
    <p>The full <code>target</code>, guardrails, and browser reference</p>
  </a>
  <a class="card" href="/selectors">
    <h3>Selectors</h3>
    <p>Selector strategy for the web target</p>
  </a>
  <a class="card" href="/step-types">
    <h3>Step Types</h3>
    <p>Every step, with shorthand and explicit forms</p>
  </a>
</div>
