---
sidebar_position: 9
slug: /troubleshooting
title: Troubleshooting
---

# Troubleshooting

## "Could not find .prowlqa/config.yml"

Run `prowlqa init` in your project root to create the `.prowlqa/` directory.

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
2. Is it set in your `.prowlqa/.env` file?
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
prowlqa run <hunt-name>
prowlqa run <hunt-name> --headed          # Show browser window
prowlqa run <hunt-name> --trace           # Capture Playwright trace
prowlqa run <hunt-name> --slow-mo 500     # Slow down actions (ms)
prowlqa run <hunt-name> --url <override>  # Override target URL
prowlqa run <hunt-name> --config <path>   # Custom config path
prowlqa run <hunt-name> --browser chromium  # Override browser engine
prowlqa run <hunt-name> --channel chrome    # Override browser channel
prowlqa run <hunt-name> --viewport 1920x1080  # Override viewport size
prowlqa run <hunt-name> --include-tags smoke  # Only run hunts with tag
prowlqa run <hunt-name> --exclude-tags slow   # Skip hunts with tag

# Watch mode — re-runs on file changes
prowlqa watch <hunt-name>

# Auth — capture login state interactively
prowlqa login
prowlqa login --url <target>              # Override target URL for login
prowlqa login --config <path>             # Use custom config path

# Initialize — create .prowlqa directory with examples
prowlqa init
prowlqa init --force                      # Overwrite existing

# List available hunts
prowlqa list
prowlqa list --json                       # Output as JSON
```

## Artifacts

Every hunt run generates artifacts in `.prowlqa/runs/<timestamp>/`:

```
.prowlqa/runs/2026-02-09_10-30-45/
├── summary.md           # Human-readable report
├── result.json          # Machine-readable results
├── console.log          # Browser console output
├── screenshots/
│   ├── final.png        # Final page state
│   └── failure_step_3.png  # Screenshot on failure (if any)
├── trace.zip            # Playwright trace (if --trace)
└── network.har          # Network activity (if networkHar: true)
```

### Viewing Traces

```bash
npx playwright show-trace .prowlqa/runs/2026-02-09_10-30-45/trace.zip
```
