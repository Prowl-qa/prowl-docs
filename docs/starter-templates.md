---
sidebar_position: 11
slug: /starter-templates
title: Starter Templates
---

# Starter Templates

Prowl ships a library of **starter hunts** inside the `prowl-tools` package — commented,
ready-to-customize YAML for the flows most apps share: login, signup, password reset,
checkout, Stripe, CRUD, onboarding, keyboard navigation, smoke tests, docs sites, and
native macOS apps. Nothing is fetched from the network; the templates are files in the
package you already installed.

```bash
prowl templates list                     # browse the catalog, grouped by category
prowl templates show auth/login-flow     # print a template's YAML
prowl init --template auth/login-flow    # copy it to .prowl/hunts/login-flow.yml
```

## Browse

```bash
prowl templates list
prowl templates list --category auth     # one category
prowl templates list --json              # machine-readable (for agents)
```

Each template has an id of the form `<category>/<name>`:

| Category | Templates |
|---|---|
| `auth` | `login-flow`, `signup-flow`, `password-reset`, `oauth-google` |
| `e-commerce` | `checkout-flow`, `stripe-checkout` (Stripe-hosted Checkout) |
| `forms` | `form-submit`, `form-validation` |
| `admin` | `crud-cycle`, `data-table-filter` |
| `saas` | `onboarding-wizard`, `team-invite` |
| `smoke` | `homepage`, `navigation`, `pagination`, `search-and-filter`, `preview-modal`, `empty-state`, `api-health` |
| `docs` | `content-smoke`, `sidebar-navigation`, `theme-toggle` (docs-site checks) |
| `accessibility` | `keyboard-navigation` |
| `macos` | `app-launch-smoke`, `menu-bar-extra`, `settings-form` — for the [macOS target](/macos-target) |

## Add one to your project

```bash
prowl init --template auth/login-flow
prowl init --template auth/login-flow smoke/homepage    # several at once
```

- On a fresh project this also runs the normal `prowl init` scaffold (config, `hello.yml`,
  `.gitignore`).
- On an already-initialized project it **only adds the hunts** — no `--force` needed.
- `--force` is required only to overwrite an existing hunt with the same file name.
- Every id is resolved before anything is written, so a typo in one id leaves your project
  untouched.
- `prowl init --list-templates` prints the catalog and exits.

The copied file lands at `.prowl/hunts/<name>.yml`. Open it, follow the `Customize:` notes in
its header comment (selectors, paths, `{{VAR}}` placeholders), then run it:

```bash
prowl run login-flow
```

Templates use only generic selectors (`data-testid`, placeholder text, visible button labels)
and `{{VAR}}` placeholders that resolve from your config, `.env`, or CLI flags — see
[Variables](/variables).

## For agents

An agent that needs a hunt for a common flow should reach for the bundled catalog before
writing one from scratch:

```bash
prowl templates list --json          # discover: [{ id, category, name, description, tags }]
prowl templates show <id>            # inspect the YAML
prowl init --template <id>           # install into .prowl/hunts/
prowl run <name> --json              # execute
```

The same catalog is available from the [library API](/agents#library-api-nodejs):

```typescript
import { listTemplates, readTemplate, resolveTemplate } from "prowl-tools";

const candidates = listTemplates().filter((t) => t.tags.includes("auth"));
const yaml = readTemplate("auth/login-flow");        // raw template text
const info = resolveTemplate("auth/login-flow");     // { id, category, name, description, tags, path } | null
```

## Contribute a template

Templates live in the CLI repo at
[`prowl-tools/prowl` → `templates/<category>/<name>.yml`](https://github.com/prowl-tools/prowl/tree/main/templates).
To add one, open a PR that:

1. Adds `templates/<category>/<name>.yml` with a header comment (pattern, what it tests,
   how to customize) — the `name:` field must equal the file name.
2. Uses only generic selectors and `{{VAR}}` placeholders declared in `vars:`; no
   credentials, no app-specific selectors, no URLs beyond localhost / example.com / well-known
   demo sites.
3. Passes `npm test` — `test/templates.test.ts` schema-validates every template, so an
   invalid one cannot ship.

:::note History
Until 2026-08 these templates were hosted on a separate site, Prowl Hub, with a REST API for
agents. That site is retired; the catalog paths map 1:1 onto the CLI ids above
(`auth/login-flow.yml` on the hub is `auth/login-flow` here).
:::

<div className="card-grid">
  <a className="card" href="/agents">
    <h3>Prowl for Agents</h3>
    <p>CLI-first patterns, JSON output, and the library API</p>
  </a>
  <a className="card" href="/step-types">
    <h3>Step Types</h3>
    <p>Every action a hunt can take</p>
  </a>
  <a className="card" href="/variables">
    <h3>Variables</h3>
    <p>How placeholder variables resolve</p>
  </a>
</div>
