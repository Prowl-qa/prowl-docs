---
sidebar_position: 6
slug: /selectors
title: Selectors
---

# Selectors

Prowl uses Playwright's selector engine. Choose selectors based on stability and maintainability.

## Selector Priority (Best to Worst)

### 1. data-testid (best)

Explicit test hooks that don't change with UI refactors.

```yaml
- click:
    selector: "[data-testid='submit']"
```

### 2. Accessible roles

Semantic and resilient to styling changes.

```yaml
- click:
    selector: "role=button[name='Submit']"
```

### 3. Labels / Placeholders

Via shorthand, Prowl resolves these automatically.

```yaml
- fill:
    "Email": "user@test.com"
```

### 4. Text content

Via shorthand click, good for buttons and links.

```yaml
- click: "Sign In"
```

### 5. CSS selectors (last resort)

Fragile — avoid class names that change.

```yaml
- click:
    selector: ".btn-primary"   # Avoid if possible
```

## Shorthand Resolution

When you use shorthand syntax, Prowl resolves selectors using Playwright's built-in locators:

| Shorthand | Resolution Strategy |
|-----------|-------------------|
| `click: "Sign In"` | `role=button[name="Sign In"]` first, then `text=Sign In` fallback |
| `fill: { "Email": "val" }` | Playwright label matching, then placeholder matching |
| `select: { "State": "FL" }` | Label, aria-label, or placeholder matching on `<select>` elements |

:::note
Shorthand `click` uses **substring matching** on button names. `click: "Save"` will match a button labeled "Save & New". For exact matching, use the explicit form: `click: { selector: 'button:text-is("Save")' }`.
:::

## Forbidden Selectors

Configure selectors that steps cannot target, as a safety guardrail:

```yaml
# .prowl/config.yml
guardrails:
  forbiddenSelectors:
    - "[data-danger]"
    - ".delete-btn"
    - "#nuclear-option"
```

:::warning
Forbidden selectors use substring matching. Forbidding `"delete"` will also forbid `"undelete"` or `"delete-history"`.
:::

## Tips

- **Ask your team to add `data-testid` attributes** to key interactive elements. This is the most reliable strategy.
- **Use `--headed` and `--slow-mo 1000`** to watch the browser in real time and verify your selectors.
- **Use `--trace`** and view with `npx playwright show-trace` for detailed selector diagnostics.
- **Check for iframes** — elements inside iframes need frame-specific handling.
- **Check for dynamic content** — add `waitForNetworkIdle` or `waitForSelector` before interacting with elements that load asynchronously.
