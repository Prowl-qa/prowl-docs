# Prowl Docs - Product Backlog

**Repo**: `prowl-tools/prowl-docs`
**Local path**: `~/Desktop/prowl-docs`
**Stack**: Docusaurus 3.x (TypeScript)
**Hosting**: Vercel or GitHub Pages at docs.prowl.tools
**Branch**: `docs-build`

---

## High Priority

### PQD-004: Android & iOS target documentation pages
**Priority**: High
**Description**: Prowl v0.1.5 (released 2026-08-21) shipped two experimental mobile targets, and
the docs site doesn't mention them — a cross-repo duty from the workspace rules (CLI feature →
prowl-docs). Add two pages mirroring the macOS target page's structure, sourced from the CLI
README's "Android Target" / "iOS Target" sections and the v0.1.5 CHANGELOG:
- **Android**: `target: { type: "android", app }` (package name or `.apk`), prerequisites (adb
  on PATH, booted emulator/USB device, `aapt` for `.apk` package resolution), the
  auto-installed `appium-uiautomator2-server` agent (optional dependency — include the
  `--omit=optional` note and restore commands), selector dialect (`id=` auto-qualified with the
  app package; `label=` → content-desc exact; `text=` substring; `role=` widget class; Jetpack
  Compose `testTagsAsResourceId` caveat), `deviceSerial`/`coldStart`, guardrails
  (`allowedApps`), and unsupported steps (web-only rejections; `hover`/`scrollTo`).
- **iOS Simulator**: `target: { type: "ios", app }` (bundle id or `.app`), prerequisites (macOS,
  full Xcode, a booted simulator), the one-time WebDriverAgent build + `~/.prowl/wda/` cache and
  `PROWL_WDA_RUNNER` override, selector dialect, `udid`/`coldStart` (needs `.app` path), `press`
  key subset, real devices explicitly out of scope.
Also update the step-compatibility matrix / selectors page for the two new dialects and add both
pages to the sidebar. CI recipes and `prowl analyze` for mobile are tracked in the CLI repo
(PROWL-061) — link forward once shipped, don't document ahead of the implementation.

## Medium Priority

### PQD-005: Document the library API as the YAML escape hatch
**Priority**: Medium
**Description**: Referenced by the CLI repo's competitive-positioning item (PROWL-037 / GTM-002):
the answer to "YAML starts feeling like a cage" is Prowl's graduation path — `runHunt`
composition, `if`/`repeat`, runtime vars, `evalScript`/`runScript`, and ultimately the **library
API** for writing gnarly flows in TypeScript. The docs currently cover hunt YAML but don't teach
that progression. Add a page (or extend the getting-started flow) that walks the escalation
ladder from YAML → composition/control-flow → script steps → library API, with a worked example
of the same test at two rungs. Keep it honest about when plain Playwright is the better tool.

## Low Priority

*No active items.*
