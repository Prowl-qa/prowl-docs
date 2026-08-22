---
sidebar_position: 99
slug: /backlog
title: Product Backlog
---

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

### {PQD-005} **"Beyond YAML" guide — graduating complex flows to the library API**
   Practitioner research (Maestro users: *"YAML starts feeling like a cage when I need more
control on tricky stuff"*) shows the YAML-cage complaint is the sharpest criticism aimed at
YAML-first tools, and Prowl already has the answer but never documents the path. Write a guide
showing when and how to graduate: YAML for the 90% case → `runHunt` composition, `if`/`repeat`,
runtime vars (`copyText`, `{{RANDOM_*}}`), `evalScript`/`runScript` → the **library API**
(`runHunt()`/`analyzePage()` from TS) for flows that outgrow declarative steps, including mixing
both in one suite. Note honestly that `evalScript`/`runScript` are web-only, so on the macOS
target the library API is the only escape hatch.

**Found during**: Competitive/practitioner research in the prowl repo (2026-08-16); cross-linked
from prowl GTM-002 ({PROWL-037})
**Deliverable**: A Guides page ("Beyond YAML" or similar) with a worked example of the same flow
at each level of escalation, cross-linked from the step-types and macOS-target pages.

## Low Priority

*No active items.*
