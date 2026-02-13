---
sidebar_position: 8
slug: /watch-mode
title: Watch Mode
---

# Watch Mode

Watch mode re-runs a hunt automatically when files change. It's useful during hunt authoring for rapid feedback.

## Usage

```bash
prowl watch <hunt-name>
```

## How It Works

1. Prowl runs the hunt immediately on startup
2. It watches the hunt YAML file, `config.yml`, and `.env` for changes
3. On any file save, the hunt re-runs automatically
4. Rapid saves are debounced (300ms) to avoid unnecessary runs
5. Press `Ctrl+C` to stop

## Watched Files

- `.prowl/hunts/<hunt-name>.yml` — the hunt file itself
- `.prowl/config.yml` — configuration changes
- `.prowl/.env` — environment variable changes

## Tips

- Combine with `--headed` to watch the browser in real time: save the hunt file and see the browser replay instantly
- Use watch mode to iteratively build and debug selectors
- Watch mode respects all config options (guardrails, assertions, artifacts)
