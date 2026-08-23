---
sidebar_position: 6
slug: /selectors
title: Selectors
---

# Selectors

Prowl uses Playwright's selector engine. Choose selectors based on stability and maintainability.

:::note
This page covers the **web target**, which uses Playwright's selector engine. The experimental **native targets** use their own accessibility-based dialects — see [Native selector dialects](#native-selector-dialects) below and the [macOS](/macos-target), [Android](/android), and [iOS](/ios) target pages.
:::

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

## Native selector dialects

The sections above describe the **web target**. The experimental native targets ([macOS](/macos-target), [Android](/android), [iOS](/ios)) do **not** use Playwright — they address the platform accessibility tree instead. The four core prefixes carry the **same meaning across all three native targets**, so a selector reads the same everywhere; only what each maps to on the platform differs. Prefer `id=` — the native analog of `data-testid`.

| Prefix | Android | iOS |
|--------|---------|-----|
| `id=` | `resource-id` — a bare name is auto-qualified with the app's package (`id=save` → `com.pkg:id/save`); other namespaces use the full form (`id=android:id/title`) | accessibility id (`accessibilityIdentifier`) |
| `label=` | `content-desc` (exact) | `accessibilityLabel` (exact — a `label ==` NSPredicate) |
| `text=` or bare | visible text (substring) | `label` / `value` (substring) |
| `role=` | widget class (e.g. `role=android.widget.Button`); add `[name="…"]` for a visible-text substring | `XCUIElementType…` class (shorthand `role=Button`); add `[name="…"]` for a `label`/`value` substring |

- **iOS** additionally supports `:focus` — the element with keyboard focus (`hasKeyboardFocus == 1`).
- **Android (Jetpack Compose):** test tags only surface as `resource-id` when the app sets `Modifier.testTag(...)` **and** enables `testTagsAsResourceId = true`; otherwise match Compose UI with `text=` or `label=`.
- **macOS** uses the same `id=` / `label=` / `role=` / `text=` prefixes plus menu-bar magic selectors (`statusItem`, `menu=`) — see the [macOS target](/macos-target) page.
- `forbiddenSelectors` applies on native targets too, with the same case-sensitive substring semantics.

See the [Android](/android) and [iOS](/ios) target pages for the full dialect, worked examples, and step compatibility.

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
