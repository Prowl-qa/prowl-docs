---
sidebar_position: 7
slug: /auth
title: Authentication
---

# Authentication

For hunts that require authentication, use `prowlqa login` to capture browser state.

## Capturing Auth State

```bash
prowlqa login
prowlqa login --url <target>              # Override target URL for login
prowlqa login --config <path>             # Use custom config path
```

This opens a headed Chromium window. Log in manually, then close the browser. Prowl QA saves cookies, localStorage, and sessionStorage to `.prowlqa/auth-state.json`.

All subsequent `prowlqa run` commands will load this auth state, so your hunts start already logged in.

## Configuration

Auth state is loaded automatically from the path in `config.yml`:

```yaml
auth:
  storageStatePath: ".prowlqa/auth-state.json"
```

No changes to your hunts are needed — auth state is applied before the first step executes.

## Refreshing Auth

If your session expires, run `prowlqa login` again to re-capture.

:::tip
For CI environments where interactive login isn't possible, you can generate the auth state file programmatically (e.g., via API login) and place it at the configured path.
:::

## Security

The auth state file contains session cookies and storage data. Keep it out of version control:

```gitignore
# .gitignore
.prowlqa/auth-state.json
.prowlqa/.env
```

The `prowlqa init` command generates a `.gitignore` that includes these exclusions by default.
