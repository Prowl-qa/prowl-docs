---
sidebar_position: 1
slug: /
title: Getting Started
---

# Getting Started

Get up and running with Prowl in under a minute.

## Install

```bash
npm install -g prowlai
```

Prowl uses Playwright under the hood. Install the browser:

```bash
npx playwright install chromium
```

## Initialize

```bash
cd your-project
prowl init
```

This creates a `.prowl/` directory with a config file and 8 example hunts:

```
.prowl/
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

Edit `.prowl/config.yml` to point at your app:

```yaml
target:
  url: "http://localhost:3000"
```

## Write Your First Hunt

Edit `.prowl/hunts/homepage.yml` or create a new file:

```yaml
name: smoke-test
steps:
  - navigate: "/"
  - wait: "Welcome"
  - assert:
      visible: "Sign In"
assertions:
  - noConsoleErrors: true
```

## Run

```bash
prowl run smoke-test
```

```
  ● Running hunt: smoke-test
    ✓ navigate "/" (120ms)
    ✓ wait "Welcome" (85ms)
    ✓ assert visible "Sign In" (15ms)

  PASS smoke-test (220ms) 3/3 steps
  Artifacts: .prowl/runs/2026-02-09_10-30-45
```

That's it. You're testing.

:::tip What's next?
- Learn about all [Step Types](/step-types) available in hunts
- Set up [Variables](/variables) for dynamic values and credentials
- Configure [Assertions](/assertions) for automated checks
:::
