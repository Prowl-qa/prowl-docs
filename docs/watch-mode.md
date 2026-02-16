---
sidebar_position: 8
slug: /watch-mode
title: Watch Mode
---

# Watch Mode

Watch mode re-runs a hunt automatically when files change. It's useful during hunt authoring for rapid feedback.

## Usage

```bash
prowlqa watch <hunt-name>
```

## How It Works

1. Prowl QA runs the hunt immediately on startup
2. It watches the hunt YAML file, the resolved `config.yml`, and `.env` in that same config directory (default: `.prowlqa/config.yml` and `.prowlqa/.env`)
3. On any file save, the hunt re-runs automatically
4. Rapid saves are debounced (300ms) to avoid unnecessary runs
5. Press `Ctrl+C` to stop

## Watched Files

- `.prowlqa/hunts/<hunt-name>.yml` — the hunt file itself
- `.prowlqa/config.yml` — configuration changes
- `.prowlqa/.env` — environment variable changes

## Flags

Watch mode supports this subset of `prowlqa run` flags:

```bash
prowlqa watch <hunt-name> --headed        # Show browser window
prowlqa watch <hunt-name> --slow-mo 500   # Slow down actions (ms)
prowlqa watch <hunt-name> --trace         # Capture Playwright trace
prowlqa watch <hunt-name> --url <override>  # Override target URL
prowlqa watch <hunt-name> --config <path>   # Custom config path
```

When `--config <path>` is used, watch mode tracks that resolved `config.yml` and the `.env` file next to it.

## Tips

- Combine with `--headed` to watch the browser in real time: save the hunt file and see the browser replay instantly
- Use watch mode to iteratively build and debug selectors
- Watch mode respects all config options (guardrails, assertions, artifacts)
