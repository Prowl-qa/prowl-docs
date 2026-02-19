---
sidebar_position: 1
slug: /
title: Getting Started
---

<div className="docs-hero">
  <div>
    <div className="docs-hero__eyebrow">Prowl QA Documentation</div>
    <h1>Deterministic QA Hunts From Your CLI</h1>
    <div className="docs-hero__subtitle">
      Prowl QA turns browser workflows into repeatable hunts you can run locally, in CI, or hand to an AI agent.
      This page gets you from zero to a passing smoke test quickly.
    </div>
    <div className="docs-hero__actions">
      <a className="button button--primary button--lg" href="#install">Start In 60 Seconds</a>
      <a className="button button--secondary button--lg" href="/step-types">Browse Step Types</a>
    </div>
  </div>
  <div className="docs-hero__art">
    <img src="/img/prowl-qa-mascot.png" alt="Prowl QA mascot with magnifying glass" />
  </div>
</div>

<div className="docs-quickstart">
  <p>
    <img src="/img/prowl-qa-logo.png" alt="" aria-hidden="true" className="docs-quickstart__logo" />
    <strong>Before you start:</strong> Node.js 20+, npm, and a runnable web app.
  </p>
</div>

## Outcome

By the end of this guide, you will run one hunt that validates your homepage and produces artifacts under `.prowlqa/runs/`.

## Install

```bash
npm install -g prowlqa
```

Prowl QA uses Playwright under the hood. Install the browser:

```bash
npx playwright install chromium
```

## Initialize

```bash
cd your-project
prowlqa init
```

This creates a `.prowlqa/` directory with a config file and 8 starter hunts:

```
.prowlqa/
├── config.yml              # Target URL, browser settings, guardrails
└── hunts/
    ├── homepage.yml         # Basic page load smoke test
    ├── login-flow.yml       # Email/password authentication
    ├── signup-flow.yml      # Registration with validation
    ├── form-submit.yml      # Form fill and submit
    ├── form-validation.yml  # Validation errors and resubmit
    ├── crud-cycle.yml       # Create, read, update, delete lifecycle
    ├── checkout-flow.yml    # E-commerce checkout
    └── onboarding-wizard.yml # Multi-step SaaS onboarding
```

## Configure

Edit `.prowlqa/config.yml` to point at your app:

```yaml
target:
  url: "http://localhost:3000"
```

If your app uses authentication, capture storage state early with [`prowlqa login`](/auth) so hunts run as an authenticated user.

## Write Your First Hunt

Edit `.prowlqa/hunts/homepage.yml` or create a new file:

```yaml
name: smoke-test
description: "Validates homepage loads correctly"
tags:
  - smoke
steps:
  - navigate: "/"
  - wait: "Welcome"
  - assert:
      visible: "Sign In"
assertions:
  - noConsoleErrors: true
retry:
  maxRetries: 0
  delay: 1000
```

:::note
- **`description`** — a human-readable summary stored in hunt metadata and shown by `prowlqa list`
- **`tags`** — categorize hunts for filtering with `--include-tags` and `--exclude-tags`
- **`retry`** — configure automatic retries on failure (`maxRetries: 0` means no retries)
:::

## Run

```bash
prowlqa run smoke-test
```

```text
  ● Running hunt: smoke-test
    ✓ navigate "/" (120ms)
    ✓ wait "Welcome" (85ms)
    ✓ assert visible "Sign In" (15ms)

  PASS smoke-test (220ms) 3/3 steps
  Artifacts: .prowlqa/runs/2026-02-09_10-30-45
```

You now have a stable smoke test and a run artifact folder you can inspect in CI.

## What's Next

<div className="card-grid">
  <a className="card" href="/assertions">
    <h3>Assertions</h3>
    <p>Fail fast with inline and hunt-level checks</p>
  </a>
  <a className="card" href="/step-types">
    <h3>Step Types</h3>
    <p>All 19 step types available in hunts</p>
  </a>
  <a className="card" href="/configuration">
    <h3>Configuration</h3>
    <p>Tune browser behavior, artifacts, and guardrails</p>
  </a>
  <a className="card" href="/variables">
    <h3>Variables</h3>
    <p>Inject credentials and dynamic runtime values safely</p>
  </a>
</div>
