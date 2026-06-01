---
sidebar_position: 3
slug: /assertions
title: Assertions
---

# Assertions

Prowl QA supports two kinds of assertions: **inline assertions** (mid-flow checks as steps) and **hunt-level assertions** (evaluated after all steps complete).

## Inline Assertions

Use `assert` steps anywhere in your hunt for mid-flow checks. The hunt fails immediately if an inline assertion fails.

### visible

Assert that text is visible on the page.

```yaml
- assert:
    visible: "Welcome back"
```

:::note
`visible` and `notVisible` accept either plain text or a CSS selector. Prose values — including those with punctuation like `"Name:"` or a sentence ending in `.` — are matched as **text**. Values with a clear selector signature (a leading `.`, `#`, or `[`, an attribute bracket, or an engine prefix like `css=` / `xpath=` / `text=`) are matched as **selectors**, e.g. `visible: "img[alt='Logo']"`.
:::

### notVisible

Assert that text is NOT visible on the page.

```yaml
- assert:
    notVisible: "Error"
```

### urlIncludes

Assert the current URL contains a substring.

```yaml
- assert:
    urlIncludes: "/dashboard"
```

### urlEquals

Assert the current URL matches exactly.

```yaml
- assert:
    urlEquals: "https://example.com/dashboard"
```

## Hunt-Level Assertions

These run after all steps complete. Define them in the `assertions` block at the top level of your hunt YAML.

```yaml
name: smoke-test
steps:
  - navigate: "/"
assertions:
  - selectorExists: "h1"
  - noConsoleErrors: true
  - noNetworkErrors: true
```

### selectorExists

Assert that an element matching the selector exists on the page.

```yaml
assertions:
  - selectorExists: "h1"
  - selectorExists: "[data-testid='main-content']"
```

### selectorNotExists

Assert that no element matching the selector exists on the page.

```yaml
assertions:
  - selectorNotExists: ".error-banner"
  - selectorNotExists: "[data-testid='error-message']"
```

### urlIncludes / urlEquals

Same as inline versions, but evaluated after all steps complete.

```yaml
assertions:
  - urlIncludes: "/dashboard"
  - urlEquals: "https://example.com/"
```

### noConsoleErrors

Fail if any `console.error` messages were logged during the hunt.

```yaml
assertions:
  - noConsoleErrors: true
```

### noNetworkErrors

Fail if any HTTP responses with status >= 400 were received during the hunt.

```yaml
assertions:
  - noNetworkErrors: true
```

:::tip
Use `networkIgnorePatterns` in your config to exclude known noisy endpoints (analytics, third-party scripts) from network error checks.

```yaml
# .prowlqa/config.yml
assertions:
  networkIgnorePatterns:
    - "analytics.google.com"
    - "hotjar.com"
```
:::

## What's Next

<div className="card-grid">
  <a className="card" href="/variables">
    <h3>Variables</h3>
    <p>Dynamic values, credentials, and env vars</p>
  </a>
  <a className="card" href="/configuration">
    <h3>Configuration</h3>
    <p>Browser settings, timeouts, and guardrails</p>
  </a>
  <a className="card" href="/troubleshooting">
    <h3>Troubleshooting</h3>
    <p>Common issues and debugging tips</p>
  </a>
</div>
