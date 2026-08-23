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

*No active items.*

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

### {PQD-006} **Document mobile `prowl analyze` + CI recipes once the next CLI release ships**
**Priority**: Medium
**Description**: CLI PROWL-061 is implemented and resolved in the prowl repo but sits in the
*Unreleased* CHANGELOG — not yet in any published npm version, so it was deliberately left out
of the PQD-004 pages (docs track the released CLI). When the next CLI release (0.1.6) ships:
- Document `prowl analyze` for the Android and iOS targets (native routing flags `--app` /
  `--platform` / `--device` / `--udid`, ranked selector candidates per dialect, `--json`) on the
  two target pages and/or the agents page.
- Add the mobile CI recipes (GitHub Actions: Android emulator on ubuntu-latest, iOS simulator
  on macos-* with a cached WDA build) sourced from the CLI README.
- Refresh `docs/ios.md`'s WDA section: 0.1.6 changes the launch path to `xcodebuild
  test-without-building` and loosens `PROWL_WDA_RUNNER` to also accept an `.xctestrun` or
  `Build/Products` directory.
Source from the CLI README + the (by then) released CHANGELOG entry; verify against source.

## Low Priority

*No active items.*

---

## Triage inbox (QA findings)

Validated findings imported from production-QA branches by owner-side triage. IDs continue the
global `PDOC-QA-NNN` sequence (highest previously filed: 008). Findings stay here until promoted
into the priority tiers above.

### {PDOC-QA-009} Feedback widget still targets the pre-rebrand API host

**Severity**: Medium
**Area**: Feedback widget / site configuration
**Environment**: Local Docusaurus dev server, `http://localhost:3000`, Chrome headless via system Google Chrome, 2026-08-23 05:06 UTC
**Observed**: Submitting feedback from the local docs site calls `https://prowl-feedback.prowlqa.dev/api/feedback`; the browser blocks the request with CORS because the API only allows `https://docs.prowl.tools`. The rebrand resolved notes say the expected feedback API host is `prowl-feedback.prowl.tools`, but `docusaurus.config.ts` still sets `feedbackApiUrl` to the old `prowlqa.dev` endpoint.
**Expected**: The widget should submit to the current Prowl-owned feedback API host and either work on production or provide a local/dev-safe behavior that does not produce a silent failed submission during docs QA.
**Reproduction steps**:
1. Run `npm start` in `~/Desktop/prowl-docs`.
2. Open `http://localhost:3000/`.
3. Click "This page was helpful", enter a short comment, and submit.
4. Watch the browser console/network output for the CORS failure against `prowl-feedback.prowlqa.dev`.
**Impact**: Reader feedback may be lost after the rebrand or be harder to validate locally, and the docs runtime produces avoidable console errors during QA.
**Evidence**: `docusaurus.config.ts` currently has `feedbackApiUrl: 'https://prowl-feedback.prowlqa.dev/api/feedback'`; browser QA captured `Access to fetch at 'https://prowl-feedback.prowlqa.dev/api/feedback' from origin 'http://localhost:3000' has been blocked by CORS policy`.
**Likely area**: `docusaurus.config.ts` custom fields plus the deployed feedback API CORS allowlist.
**Suggested fix direction**: Update the docs config to the current `prowl-feedback.prowl.tools` endpoint, confirm the backend route is live, and decide whether localhost should be allowed for non-production QA or whether the widget should be disabled/mocked in local dev.

