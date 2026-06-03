---
sidebar_position: 7
slug: /auth
title: Authentication
---

# Authentication

For hunts that require authentication, use `prowl login` to capture browser state.

## Capturing Auth State

```bash
prowl login
prowl login --url <target>              # Override target URL for login
prowl login --config <path>             # Use custom config path
```

This opens a headed Chromium window. Log in manually, then close the browser. Prowl saves cookies, localStorage, and sessionStorage to `.prowl/auth-state.json`.

All subsequent `prowl run` commands will load this auth state, so your hunts start already logged in.

## Configuration

Auth state is loaded automatically from the path in `config.yml`:

```yaml
auth:
  storageStatePath: ".prowl/auth-state.json"
```

No changes to your hunts are needed — auth state is applied before the first step executes.

## Refreshing Auth

If your session expires, run `prowl login` again to re-capture.

:::tip
For CI environments where interactive login isn't possible, you can generate the auth state file programmatically (e.g., via API login) and place it at the configured path.
:::

## Security

The auth state file contains session cookies and storage data. Keep it out of version control:

```gitignore
# .gitignore
.prowl/auth-state.json
.prowl/.env
```

The `prowl init` command generates a `.gitignore` that includes these exclusions by default.
