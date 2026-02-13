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
  forbiddenSelectors:                  # selectors that steps cannot use
    - "[data-danger]"
    - ".delete-btn"

# Auth state from `prowl login`
auth:
  storageStatePath: ".prowl/auth-state.json"
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
| `allowedDomains` | `string[]` | `["localhost", "127.0.0.1"]` | Domains the browser can navigate to |
| `forbiddenSelectors` | `string[]` | `[]` | Selectors that steps cannot target |

:::warning
Forbidden selectors use substring matching. Forbidding `"delete"` will also forbid selectors containing `"undelete"` or `"delete-history"`.
:::

### auth

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storageStatePath` | `string` | `".prowl/auth-state.json"` | Path to saved auth state from `prowl login` |

## CLI Overrides

Several config options can be overridden from the command line:

```bash
prowl run <hunt> --headed          # Override headless: false
prowl run <hunt> --trace           # Capture Playwright trace
prowl run <hunt> --slow-mo 500     # Override slowMo
prowl run <hunt> --url <override>  # Override target.url
prowl run <hunt> --config <path>   # Use different config file
```
