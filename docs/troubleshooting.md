---
sidebar_position: 9
slug: /troubleshooting
title: Troubleshooting
---

# Troubleshooting

## "Could not find .prowl/config.yml"

Run `prowl init` in your project root to create the `.prowl/` directory.

## "Navigation to disallowed domain"

Add the domain to `guardrails.allowedDomains` in your config:

```yaml
guardrails:
  allowedDomains:
    - "localhost"
    - "your-domain.com"
```

## "Forbidden selector"

The selector matches a pattern in `guardrails.forbiddenSelectors`. Either change the selector or update the guardrails config.

## "Missing variable: VAR_NAME"

The `{{VAR_NAME}}` in your hunt couldn't be resolved. Check:

1. Is it defined in the hunt's `vars:` block?
2. Is it set in the `.env` file next to your active `config.yml`? (default: `.prowl/.env`)
3. Is it set as an environment variable?

## Selectors Not Finding Elements

- Use `--headed` and `--slow-mo 1000` to watch the browser in real time
- Check if the element is inside an iframe
- Check if the element appears after a network request (add `waitForNetworkIdle` before)
- Use `--trace` and view with `npx playwright show-trace` for detailed diagnostics

## Hunt Running Slowly

- Check `browser.timeout` in your config — lower it for faster failures
- Add `waitForNetworkIdle` only where needed (it waits for ALL requests)
- Use `waitForSelector` with a specific element instead of `waitForNetworkIdle`

## CLI Reference

```bash
# Run a hunt
prowl run <hunt-name>
prowl run <hunt-name> --headed          # Show browser window
prowl run <hunt-name> --trace           # Capture Playwright trace
prowl run <hunt-name> --slow-mo 500     # Slow down actions (ms)
prowl run <hunt-name> --url <override>  # Override target URL
prowl run <hunt-name> --config <path>   # Custom config path
prowl run <hunt-name> --browser chromium  # Override browser engine
prowl run <hunt-name> --channel chrome    # Override browser channel
prowl run <hunt-name> --viewport 1920x1080  # Override viewport size
prowl run <hunt-name> --include-tags smoke  # Only run hunts with tag
prowl run <hunt-name> --exclude-tags slow   # Skip hunts with tag
prowl run <hunt-name> --json            # Machine-readable JSON output
prowl run <hunt-name> --junit           # Generate JUnit XML report

# CI mode — run all hunts with combined result
prowl ci
prowl ci --include-tags smoke           # Only run hunts with tag
prowl ci --exclude-tags slow            # Skip hunts with tag
prowl ci --json                         # Machine-readable JSON output
prowl ci --junit                        # Generate JUnit XML reports
prowl ci --browser firefox --viewport 1920x1080
prowl ci --url <override> --headed --slow-mo 500 --trace --config <path>
prowl ci --channel chrome
# Exit codes: 0 = pass, 1 = fail, 2 = no hunts or all skipped

# Watch mode — re-runs on file changes
prowl watch <hunt-name>
prowl watch <hunt-name> --headed        # Show browser window
prowl watch <hunt-name> --slow-mo 500   # Slow down actions (ms)
prowl watch <hunt-name> --trace         # Capture Playwright trace
prowl watch <hunt-name> --url <override>  # Override target URL
prowl watch <hunt-name> --config <path>   # Custom config path

# Auth — capture login state interactively
prowl login
prowl login --url <target>              # Override target URL for login
prowl login --config <path>             # Use custom config path

# Initialize — create .prowl directory with examples
prowl init
prowl init --force                      # Re-create config and starter hunts

# List available hunts
prowl list
prowl list --json                       # Output as JSON
```

## Artifacts

Every hunt run generates artifacts in `.prowl/runs/<timestamp>/`:

```
.prowl/runs/2026-02-09_10-30-45/
├── summary.md           # Human-readable report
├── result.json          # Machine-readable results
├── console.log          # Browser console output
├── screenshots/
│   ├── final.png        # Final page state
│   └── failure_step_3.png  # Screenshot on failure (if any)
├── trace.zip            # Playwright trace (if --trace)
├── network.har          # Network activity (if networkHar: true)
└── junit.xml            # JUnit XML report (if --junit or junit: true)
```

`prowl ci` writes a combined summary file to `.prowl/runs/ci-<timestamp>/ci-result.json`.  
When `--junit` is passed, each hunt run directory still gets its own `junit.xml` (there is no merged JUnit file yet).

### Viewing Traces

```bash
npx playwright show-trace .prowl/runs/2026-02-09_10-30-45/trace.zip
```
