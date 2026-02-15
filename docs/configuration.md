---
sidebar_position: 4
slug: /configuration
title: Configuration
---

# Configuration

Prowl QA configuration lives at `.prowlqa/config.yml`. All options with their defaults:

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

# Auth state from `prowlqa login`
auth:
  storageStatePath: ".prowlqa/auth-state.json"
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
| `forbiddenSelectors` | `string[]` | `[]` | Selectors that steps cannot target |

:::warning
Forbidden selectors use substring matching. Forbidding `"delete"` will also forbid selectors containing `"undelete"` or `"delete-history"`.
:::

### auth

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storageStatePath` | `string` | `".prowlqa/auth-state.json"` | Path to saved auth state from `prowlqa login` |

## CLI Overrides

Several config options can be overridden from the command line:

```bash
prowlqa run <hunt> --headed          # Override headless: false
prowlqa run <hunt> --trace           # Capture Playwright trace
prowlqa run <hunt> --slow-mo 500     # Override slowMo
prowlqa run <hunt> --url <override>  # Override target.url
prowlqa run <hunt> --config <path>   # Use different config file
prowlqa run <hunt> --browser chromium  # Override browser engine
prowlqa run <hunt> --channel chrome    # Override browser channel
prowlqa run <hunt> --viewport 1920x1080  # Override viewport size
prowlqa run <hunt> --include-tags smoke  # Only run hunts with tag
prowlqa run <hunt> --exclude-tags slow   # Skip hunts with tag
```
