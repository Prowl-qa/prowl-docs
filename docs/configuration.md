---
sidebar_position: 4
slug: /configuration
title: Configuration
---

# Configuration

Prowl configuration lives at `.prowl/config.yml`. All options with their defaults:

```yaml
# The base URL for all hunt navigation
target:
  url: "http://localhost:3000"        # Required

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

# Auth state from `prowl login`
auth:
  storageStatePath: ".prowl/auth-state.json"

# Run history retention
history:
  maxRuns: 100                         # keep the last N runs per hunt
```

## Section Reference

### target

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string` | (required) | Base URL for all relative navigation |

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
| `allowedDomains` | `string[]` | `["localhost", "127.0.0.1", "0.0.0.0"]` | Domains the browser can navigate to |
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
