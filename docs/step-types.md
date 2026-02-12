---
sidebar_position: 2
slug: /step-types
title: Step Types
---

# Step Types

Prowl supports 16 step types. Most have both a **shorthand** form (concise, readable) and an **explicit** form (full control over selectors).

## navigate

Navigate to a URL (relative to your `target.url` or absolute).

```yaml
- navigate: "/"
- navigate: "/login"
- navigate: "https://example.com/page"
```

## click

Click an element. Shorthand finds buttons by text, then falls back to any matching text.

```yaml
# Shorthand — finds by button role, then text
- click: "Sign In"

# Explicit — use any Playwright selector
- click:
    selector: "[data-testid='submit-btn']"
```

:::note
Shorthand `click` uses substring matching on button names. `click: "Save"` will match a button labeled "Save & New". For exact matching, use `click: { selector: 'button:text-is("Save")' }`.
:::

## fill

Fill an input field. Shorthand finds inputs by label or placeholder text.

```yaml
# Shorthand — finds by label, then placeholder
- fill:
    "Email": "user@example.com"

# Explicit — use any selector
- fill:
    selector: "input[name='email']"
    value: "user@example.com"
```

## type

Type into the currently focused element. Useful after clicking into a field.

```yaml
- click: "Message"
- type: "Hello, I have a question."
```

## press

Press a keyboard key on a specific element.

```yaml
- press:
    selector: "input[name='search']"
    key: "Enter"
```

## select / selectOption

Select a dropdown value. Shorthand finds by label, explicit uses a selector.

```yaml
# Shorthand — finds <select> by label, aria-label, or placeholder
- select:
    "State": "FL"

# Explicit
- selectOption:
    selector: "select[name='state']"
    value: "FL"
```

## assert

Mid-flow assertions. Fails the hunt immediately if the assertion fails.

```yaml
- assert:
    visible: "Welcome back"

- assert:
    notVisible: "Error"

- assert:
    urlIncludes: "/dashboard"

- assert:
    urlEquals: "https://example.com/dashboard"
```

See the [Assertions](/assertions) page for the full reference.

## wait

Wait for text to appear on the page.

```yaml
# Simple — wait for text with default timeout
- wait: "Loading complete"

# With custom timeout
- wait:
    for: "Loading complete"
    timeout: 10000
```

:::note
`wait` uses exact text matching (`text="X"`). It won't match substrings. For substring matching, use `waitForSelector` with `text=X` (without quotes).
:::

## waitForSelector

Wait for any Playwright selector to appear.

```yaml
- waitForSelector:
    selector: "[data-testid='results-table']"
    timeout: 5000
```

## waitForUrl

Wait for the URL to contain a substring.

```yaml
- waitForUrl:
    value: "/dashboard"
    timeout: 10000
```

## waitForNetworkIdle

Wait for all network requests to complete.

```yaml
- waitForNetworkIdle:
    timeout: 5000
```

## onDialog

Handle browser-native dialogs (alert, confirm, prompt). Register the handler **before** the action that triggers the dialog.

```yaml
- onDialog:
    action: accept    # or "dismiss"
- click: "Delete"     # this triggers the confirm dialog
```

## setInputFiles

Set files on `<input type="file">` elements. Paths are relative to `.prowl/`.

```yaml
# Single file
- setInputFiles:
    selector: "[data-testid='avatar-upload']"
    files: "fixtures/avatar.png"

# Multiple files
- setInputFiles:
    selector: "[data-testid='attachments']"
    files:
      - "fixtures/doc1.pdf"
      - "fixtures/doc2.pdf"
```

## runHunt

Execute another hunt file inline. Enables reusable sub-flows like login.

```yaml
# Simple — run the hunt as-is
- runHunt: "login-flow"

# With variable overrides
- runHunt:
    name: "login-flow"
    vars:
      EMAIL: "admin@test.com"
      PASSWORD: "{{ADMIN_PASSWORD}}"
```

Circular dependencies are detected automatically (`A → B → A` will error).

## screenshot

Capture a screenshot at any point.

```yaml
- screenshot:
    name: "after-login"
```

## Shorthand vs Explicit Quick Reference

| Shorthand | Explicit Equivalent |
|-----------|-------------------|
| `click: "Sign In"` | `click: { selector: 'button:has-text("Sign In")' }` |
| `fill: { "Email": "val" }` | `fill: { selector: 'input[placeholder="Email"]', value: "val" }` |
| `type: "text"` | `fill: { selector: ':focus', value: "text" }` |
| `select: { "State": "FL" }` | `selectOption: { selector: 'select[name="state"]', value: "FL" }` |
| `wait: "Welcome"` | `waitForSelector: { selector: 'text="Welcome"' }` |
| `runHunt: "login"` | `runHunt: { name: "login" }` |
