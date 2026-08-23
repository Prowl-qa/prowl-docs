---
sidebar_position: 11
slug: /ios
title: iOS Simulator Target
---

# iOS Simulator Target (Experimental)

Prowl can drive **native iOS apps** on a **booted iOS Simulator**, in addition to the web. You point `target.type` at `ios`, write the same portable steps you already know, and Prowl runs them against a real app in the simulator instead of a browser page.

It follows the same "external agent + JSON protocol" shape as the [macOS](/macos-target) and [Android](/android) targets: `xcrun simctl` handles simulator lifecycle and screenshots, and the on-simulator [WebDriverAgent](https://github.com/appium/WebDriverAgent) (Apache-2.0) handles UI interaction over its W3C-shaped HTTP/JSON API driven with raw `fetch`.

:::warning Experimental — simulators only
The iOS target shipped in Prowl **0.1.5** and is **experimental**. Its API, selector dialect, and step coverage may still change. **Real iOS devices are out of scope** (tracked as PROWL-062 in the CLI repo) — the target drives **booted simulators only**.
:::

## Requirements

- **macOS with a full Xcode** (not just the command-line tools) installed and selected (`xcode-select -p`), so `xcrun simctl` and `xcodebuild` are available.
- At least one **booted simulator** — check with `xcrun simctl list devices | grep Booted`, or boot one with `xcrun simctl boot <udid>` (or from Xcode).

### The one-time WebDriverAgent build

UI interaction is handled by [WebDriverAgent](https://github.com/appium/WebDriverAgent) (Apache-2.0). Its runner app is built **once** from the `appium-webdriveragent` npm dependency with `xcodebuild build-for-testing`, then cached under:

```text
~/.prowl/wda/<wda-version>-xcode<xcode-version>/
```

The cache key includes the WDA **and** Xcode versions, so the build is reused across runs and rebuilt only when either changes. The first run prints a one-time "building WebDriverAgent…" notice and can take a few minutes. Simulators need **no code signing**.

To skip the build entirely — for example in CI with a cached runner — set `PROWL_WDA_RUNNER` to a prebuilt `WebDriverAgentRunner-Runner.app`:

```bash
export PROWL_WDA_RUNNER="/path/to/WebDriverAgentRunner-Runner.app"
```

### The on-simulator agent

The runner above is the [`appium-webdriveragent`](https://github.com/appium/WebDriverAgent) npm dependency. As of Prowl 0.1.5 it is an **`optionalDependency`** (pinned to `appium-webdriveragent@16.4.0`). Default `npm install -g prowl-tools` installs it, so the iOS target works out of the box. A lean, web-only install can skip it:

```bash
npm install -g prowl-tools --omit=optional   # skips the mobile agents
```

If an iOS hunt runs without the agent present, Prowl fails with a clear message and the exact command to restore it:

```bash
# Global install (matches `npm install -g prowl-tools`):
npm install -g appium-webdriveragent

# Local project install:
npm install appium-webdriveragent
```

## Enabling it

Point your config at an iOS target:

```yaml
# .prowl/config.yml
target:
  type: ios
  app: "com.example.App"          # a bundle id, or a path to a built .app to install
  # udid: "ABCD-1234"             # optional; required only when several simulators are booted
  # coldStart: true               # optional; uninstall+reinstall before launch (requires a .app path)
guardrails:
  allowedApps:                    # optional scope; empty = allow the target app
    - "com.example.App"
```

Then run a hunt exactly as you would for the web:

```bash
prowl run my-ios-hunt
```

On launch Prowl selects the booted simulator (failing with an actionable error, **listing candidates**, if several are booted and no `udid` is set), installs the app (when given a `.app`, reading its bundle id from the bundle's **root** `Info.plist`), builds/caches and installs the WebDriverAgent runner, launches it on a **dynamically allocated** port (passed via `SIMCTL_CHILD_USE_PORT` so parallel sessions and CI jobs don't collide), launches the target app, and waits for WDA to report ready. Everything is torn down (WDA session, `simctl terminate` of the runner and the app) after the run.

## Configuration

The `target` block carries a **discriminant**, `type`. On the iOS target:

| Option | Type | Required | Description |
|---|---|---|---|
| `type` | `"ios"` | yes | Selects the iOS simulator target. |
| `app` | `string` | yes | A **bundle id** (e.g. `com.example.App`) or a path to a **built `.app`** to install. |
| `udid` | `string` | no | The simulator UDID. **Required only when several simulators are booted** — selection otherwise fails with an error listing the candidates. |
| `coldStart` | `boolean` | no (default `false`) | When `true`, **uninstall + reinstall** before launch for a deterministic start. **Requires the `.app` path** (a bare bundle id cannot be reinstalled). |

`url` is **not** accepted on this target. Omitting `type` still selects the web target, so existing web configs are unchanged.

:::note `.app` path vs bundle id
A bare `target.app` ending in `.app` is treated as a **bundle id** unless a directory of that name exists on disk, so bundle ids like `com.company.app` are not mistaken for paths.
:::

### guardrails.allowedApps

`allowedApps` is the native-scope analog of `allowedDomains` — it restricts which app a hunt may drive.

```yaml
guardrails:
  allowedApps:
    - "com.example.App"           # a bundle id…
    - "/abs/path/to/App.app"      # …or a .app path
```

- An **empty or omitted** `allowedApps` list leaves the scope unset, and the target app is implicitly allowed — mirroring the way `allowedDomains` auto-includes the web target's own host.
- Entries are **iOS bundle ids** or **`.app` paths**. A `.app` path is authorized by its path, its bundle **name**, or the **bundle id** read from the bundle's root `Info.plist`.
- `forbiddenSelectors` still applies, using the same case-sensitive substring semantics as the web target.

`prowl login` and the `allowedDomains` / URL guardrails do **not** apply on the iOS target.

## Selector dialect

Native selectors address accessibility ids, labels, visible text, and element type. Semantics match the macOS and Android targets, so a selector means the same thing across native targets. Prefer `id=` (set `accessibilityIdentifier` in your app — the native analog of `data-testid`).

| Selector | Matches |
|---|---|
| `id=save` | element whose accessibility id (`accessibilityIdentifier`) is `save` |
| `label="Submit"` | element whose `accessibilityLabel` equals `Submit` (exact — compiles to a `label ==` NSPredicate) |
| `role=XCUIElementTypeButton` | element of that type (shorthand `role=Button` works too) |
| `role=Button[name="Save"]` | that type whose visible `label`/`value` contains `Save` |
| `text="Save"` or bare `Save` | element whose `label` or `value` contains the text (substring) |
| `:focus` | the element with keyboard focus (`hasKeyboardFocus == 1`) |

Text/label/role+name selectors compile to WDA NSPredicate strings (quotes and backslashes are escaped). `forbiddenSelectors` still applies on this target.

## Step compatibility

Portable steps run on the iOS target; web-only steps are **rejected up front** at validation time — before anything launches — with a clear, iOS-labelled error. The same check runs for sub-hunts invoked via `runHunt`.

| Portable (iOS) | Not supported on iOS |
|---|---|
| `click`, `fill`, `type`, `press` | `navigate`, `waitForUrl`, `waitForNetworkIdle` |
| `wait`, `waitForSelector` | `mockRoute` / `unmockRoute`, `evalScript`, `runScript` |
| `assert: visible` / `notVisible` | `onDialog`, `select` / `selectOption`, `setInputFiles` |
| `screenshot`, `assertScreenshot` | `waitForDownload`, `scroll`, `assert: urlIncludes` / `urlEquals` |
| `repeat`, `if`, `runHunt`, `copyText` | `hover`, `scrollTo` (no touch equivalent yet) |

The web-only rejection names the offending step, for example:

```text
Step "navigate" is not supported by the iOS target. It is web-only;
use a portable step (click, fill, type, press, wait, assert visible, screenshot, etc.).
```

Notes:

- **`type` and `fill`** set text on the focused / matched field via WDA's `element/value`.
- **`press`** supports a small, honest key set and rejects other keys with the supported-keys message:
  - `enter` / `return` and `delete` / `backspace` / `del` — sent through WDA's key endpoint to the focused element;
  - `home` — returns to the springboard.
- **Screenshots are captured with `simctl`** (not WDA), so `screenshot` / `assertScreenshot` artifacts still work even if the agent wedges.
- **`hover` and `scrollTo`** have no touch equivalent yet and are rejected with a clear message; scroll-gesture support is a follow-up. (On the macOS target these two are portable — the rejection is specific to touch targets.)
- URL assertions (`urlIncludes` / `urlEquals`) are web-only; use inline `assert: visible` / `notVisible` steps for checks on this target.

## Worked example

Open the iOS Settings app, assert a known row is visible, type into search, and screenshot:

```yaml
# .prowl/config.yml
target:
  type: ios
  app: "com.apple.Preferences"
guardrails:
  allowedApps:
    - "com.apple.Preferences"
```

```yaml
# .prowl/hunts/settings-smoke.yml
name: settings-smoke
steps:
  - waitForSelector:
      selector: label="General"
      timeout: 10000
  - assert:
      visible: label="General"
  - screenshot: settings-home
```

```bash
prowl run settings-smoke
```

## What's Next

<div class="card-grid">
  <a class="card" href="/android">
    <h3>Android Target</h3>
    <p>Drive native Android apps on an emulator or device</p>
  </a>
  <a class="card" href="/selectors">
    <h3>Selectors</h3>
    <p>Selector strategy across web and native targets</p>
  </a>
  <a class="card" href="/configuration">
    <h3>Configuration</h3>
    <p>The full <code>target</code> and guardrails reference</p>
  </a>
  <a class="card" href="/step-types">
    <h3>Step Types</h3>
    <p>Every step, and which targets each one runs on</p>
  </a>
</div>
