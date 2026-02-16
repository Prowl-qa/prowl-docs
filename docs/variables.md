---
sidebar_position: 5
slug: /variables
title: Variables
---

# Variables

Use `{{VAR_NAME}}` to inject dynamic values into your hunts.

## Variable Sources

Variables are resolved in this precedence order (highest to lowest):

1. **Hunt vars** — defined in the hunt's `vars:` block
2. **Environment variables** — from `process.env`
3. **`.env` file** — loaded from the same directory as the resolved `config.yml` (default: `.prowlqa/.env`)

```yaml
# .prowlqa/hunts/login-flow.yml
vars:
  EMAIL: "{{TEST_EMAIL}}"     # References env var TEST_EMAIL
  TIMEOUT: "5000"             # Static value

steps:
  - fill:
      "Email": "{{EMAIL}}"    # Resolves to the value of TEST_EMAIL
```

## .env File

Create `.prowlqa/.env` for secrets and environment-specific values (or place `.env` next to your custom `--config` file):

```env
TEST_EMAIL=user@example.com
TEST_PASSWORD=secret123
```

:::warning
Add your active config-directory `.env` file to `.gitignore` to avoid committing secrets. The `prowlqa init` command generates `.prowlqa/.gitignore` including `.env` by default.
:::

## Interpolation in Steps

Variables can be used in any string value within steps:

```yaml
steps:
  - navigate: "/users/{{USER_ID}}"
  - fill:
      "Email": "{{EMAIL}}"
  - wait: "Welcome, {{USERNAME}}"
  - waitForUrl:
      value: "/dashboard/{{ORG_ID}}"
```

## Nested Variable References

Hunt vars can reference environment variables:

```yaml
vars:
  EMAIL: "{{TEST_EMAIL}}"        # Resolved from env/dotenv
  PASSWORD: "{{TEST_PASSWORD}}"  # Resolved from env/dotenv
  URL_SUFFIX: "/dashboard"       # Static value
```

The `vars` block is pre-interpolated against environment variables before being merged into the variable lookup map.

## Automatic Redaction

Any `fill` or `type` step whose value came from a `{{VAR}}` interpolation is automatically redacted in reports:

```
# In summary.md and result.json:
fill "[data-testid='email']" → [REDACTED]
```

This prevents credentials from leaking into artifacts, CI logs, or screenshots.

## Variable Overrides in runHunt

When using `runHunt` with variable overrides, the passed variables take highest precedence within the sub-hunt:

```yaml
- runHunt:
    name: "login-flow"
    vars:
      EMAIL: "admin@test.com"
      PASSWORD: "{{ADMIN_PASSWORD}}"
```
