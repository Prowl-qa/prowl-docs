---
sidebar_position: 4
slug: /configuration
title: Configuration
---

# Configuration

Prowl configuration lives at `.prowl/config.yml`. All options with their defaults:

```yaml
# Execution target. Defaults to the web target; existing web configs work unchanged.
target:
  type: "web"                          # "web" (default) | "macos" | "android" | "ios" (native ones experimental)
  url: "http://localhost:3000"        # Required for the web target
  # Native targets set `app` instead of `url` (see the notes below the table):
  # app: "com.example.App"            # macos: bundle id or .app path
  #                                   # android: package name or .apk path
  #                                   # ios: bundle id or built .app path
  # deviceSerial: "emulator-5554"     # android only; required with several devices attached
  # udid: "ABCD-1234"                 # ios only; required with several simulators booted
  # coldStart: false                  # android (`pm clear`) / ios (uninstall+reinstall) only

# Browser settings
browser:
  headless: true                       # false = show the browser window
  slowMo: 0                           # ms delay between actions (debugging)
  timeout: 30000                       # default page operation timeout
  engine: "chromium"                    # chromium | firefox | webkit
  channel: null                         # chrome, msedge, etc.
  viewport:                             # or preset: "mobile" | "tablet" | "desktop"
    width: 1280
    height: 720

# What gets saved per run
artifacts:
  screenshots: "on-failure"           # "on-failure" or "all"
  networkHar: false                    # save network activity as HAR
  console: true                        # save browser console output
  junit: false                         # generate JUnit XML report

# Hunt-level assertions (applied to every hunt)
assertions:
  noConsoleErrors: true                # fail on console.error
  noNetworkErrors: true                # fail on HTTP >= 400
  maxTotalTimeMs: 30000                # max total time for all steps
  networkIgnorePatterns: []            # URL substrings to ignore

# Safety guardrails
guardrails:
  maxSteps: 50                         # max steps per hunt
  allowedDomains:                      # only navigate to these domains
    - "localhost"
    - "127.0.0.1"
    - "0.0.0.0"
  forbiddenSelectors:                  # selectors that steps cannot use
    - "[data-danger]"
    - ".delete-btn"
  allowedApps: []                      # native targets only: which app(s) a hunt may drive;
                                       #   empty = allow the target app (analog of allowedDomains)

# Auth state from `prowl login`
auth:
  storageStatePath: ".prowl/auth-state.json"

# Run history retention
history:
  maxRuns: 100                         # keep the last N runs per hunt
```

## Section Reference

### target

The `target` block carries a discriminant, `type`, that selects the execution target. It is **optional and defaults to `"web"`**, so existing `target: { url }` configs are unchanged.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | `"web" \| "macos" \| "android" \| "ios"` | `"web"` | Execution target. `"web"` drives a browser; the native targets (`macos`, `android`, `ios`) are **experimental** |
| `url` | `string` | (required for `web`) | Base URL for all relative navigation. **Web target only** — not accepted on native targets |
| `app` | `string` | (required for native) | The target app. **`macos`**: bundle id or absolute `.app` path. **`android`**: package name or `.apk` path. **`ios`**: bundle id or built `.app` path. Not accepted on `web` |
| `deviceSerial` | `string` | — | **`android` only.** The `adb` serial (e.g. `emulator-5554`); required only when several devices are attached |
| `udid` | `string` | — | **`ios` only.** The simulator UDID; required only when several simulators are booted |
| `coldStart` | `boolean` | `false` | **`android`/`ios` only.** A deterministic fresh start — Android runs `pm clear`; iOS does uninstall+reinstall (needs the `.app` path) |

:::note
The native targets are **experimental** (shipped in Prowl 0.1.5). Each has its own selector dialect, step-compatibility matrix, and setup:

- **[Android Target](/android)** — `adb`, the on-device `appium-uiautomator2-server` agent, `deviceSerial` / `coldStart`.
- **[iOS Simulator Target](/ios)** — Xcode, the WebDriverAgent build, `udid` / `coldStart` (simulators only).
- **[macOS Target](/macos-target)** — the Accessibility API and permission setup.
:::

### browser

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `headless` | `boolean` | `true` | Run browser in headless mode |
| `slowMo` | `number` | `0` | Milliseconds to wait between each action |
| `timeout` | `number` | `30000` | Default timeout for page operations |
| `engine` | `"chromium" \| "firefox" \| "webkit"` | `"chromium"` | Browser engine to use |
| `channel` | `string \| null` | `null` | Browser channel (e.g. `"chrome"`, `"msedge"`) |
| `viewport` | `object \| string` | `{ width: 1280, height: 720 }` | Viewport size or preset (`"mobile"`, `"tablet"`, `"desktop"`) |

### artifacts

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `screenshots` | `"on-failure" \| "all"` | `"on-failure"` | When to capture screenshots |
| `networkHar` | `boolean` | `false` | Save network activity as HAR file |
| `console` | `boolean` | `true` | Save browser console output |
| `junit` | `boolean` | `false` | Generate JUnit XML report |

### assertions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `noConsoleErrors` | `boolean` | `true` | Fail hunts on `console.error` |
| `noNetworkErrors` | `boolean` | `true` | Fail hunts on HTTP >= 400 |
| `maxTotalTimeMs` | `number` | `30000` | Max total execution time in ms |
| `networkIgnorePatterns` | `string[]` | `[]` | URL substrings to ignore for network error checks |

### guardrails

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxSteps` | `number` | `50` | Maximum steps per hunt |
| `allowedDomains` | `string[]` | `["localhost", "127.0.0.1", "0.0.0.0"]` | Domains the browser can navigate to (web target) |
| `allowedApps` | `string[]` | `[]` | Which app(s) a **native target** ([macOS](/macos-target), [Android](/android), [iOS](/ios)) may drive; empty allows the target app. Entries are bundle ids, package IDs, or `.app`/`.apk` paths. Native analog of `allowedDomains` |
| `forbiddenSelectors` | `string[]` | `["[data-danger]", ".delete-btn"]` | Selectors that steps cannot target |

:::warning
**`forbiddenSelectors`** and **`assertions.networkIgnorePatterns`** use case-sensitive substring matching (`includes()`). A pattern of `"Delete"` matches `"Delete History"`, but `"delete"` does not — and `".delete-btn"` also matches `".undelete-btn"` because the substring is present. Prefer exact-enough patterns over broad fragments.

**`allowedDomains`** is enforced only for `http:` and `https:` navigations. The `about:` and `data:` protocols (for example `about:blank`) bypass the allowlist by design, so hunts can interact with browser-internal pages.
:::

### auth

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storageStatePath` | `string` | `".prowl/auth-state.json"` | Path to saved auth state from `prowl login` |

### history

Every `prowl run` and `prowl ci` appends an entry to `.prowl/history.json` (hunt name, status, start time, duration, and run directory). Retention is capped **per hunt** — once a hunt exceeds the cap, its oldest entries are dropped on the next write; other hunts are unaffected.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxRuns` | `number` | `100` | Number of runs to keep per hunt |

Inspect history with `prowl history <hunt-name>` (add `--json` for machine-readable output, `--limit <n>` to change the slice — default 20):

```bash
prowl history smoke-test
prowl history smoke-test --limit 50 --json
```

## CLI Overrides

Several config options can be overridden from the command line:

```bash
prowl run <hunt> --headed          # Override headless: false
prowl run <hunt> --trace           # Capture Playwright trace
prowl run <hunt> --slow-mo 500     # Override slowMo
prowl run <hunt> --url <override>  # Override target.url
prowl run <hunt> --config <path>   # Use different config file
prowl run <hunt> --browser chromium  # Override browser engine
prowl run <hunt> --channel chrome    # Override browser channel
prowl run <hunt> --viewport 1920x1080  # Override viewport size
prowl run <hunt> --include-tags smoke  # Only run hunts with tag
prowl run <hunt> --exclude-tags slow   # Skip hunts with tag
prowl run <hunt> --json            # Machine-readable JSON output
prowl run <hunt> --junit           # Generate JUnit XML report
```
