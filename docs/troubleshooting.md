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
2. Is it set in your `.prowl/.env` file?
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

# Watch mode — re-runs on file changes
prowl watch <hunt-name>

# Auth — capture login state interactively
prowl login

# Initialize — create .prowl directory with examples
prowl init
prowl init --force                      # Overwrite existing

# List available hunts
prowl list
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
└── network.har          # Network activity (if networkHar: true)
```

### Viewing Traces

```bash
npx playwright show-trace .prowl/runs/2026-02-09_10-30-45/trace.zip
```
