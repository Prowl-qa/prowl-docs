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

### {PDOC-QA-010} MDX markup emits React hydration/property errors on docs pages

**Severity**: Medium
**Area**: MDX content markup / reader runtime quality
**Environment**: Local Docusaurus dev server, `http://localhost:3000`, Chrome headless via system Google Chrome, 2026-08-23 05:06 UTC
**Observed**: Browser QA found React console errors on core pages. The Getting Started page renders a nested `<p>` inside another `<p>` in the quickstart callout. The Hub API and macOS Target pages emit `Invalid DOM property 'class'. Did you mean 'className'?` from JSX-style card grids that use `class` attributes.
**Expected**: Published docs pages should hydrate cleanly and avoid React console errors from invalid MDX/JSX markup.
**Reproduction steps**:
1. Run `npm start` in `~/Desktop/prowl-docs`.
2. Open `http://localhost:3000/`, `http://localhost:3000/hub-api`, and `http://localhost:3000/macos-target`.
3. Inspect the browser console.
4. On `/`, inspect `p p` in the DOM; on `/hub-api` and `/macos-target`, inspect the card-grid source markup.
**Impact**: Hydration warnings erode confidence for developers and AI-agent consumers using browser console output as a signal, and invalid MDX can become brittle as Docusaurus/React versions change.
**Evidence**: `/` logged `In HTML, <p> cannot be a descendant of <p>. This will cause a hydration error.` with the nested node under `.docs-quickstart`; `/hub-api` and `/macos-target` logged `Invalid DOM property 'class'. Did you mean 'className'?`. Source inspection found `<div class="card-grid">` blocks in `docs/hub-api.md` and `docs/macos-target.md`.
**Likely area**: `docs/getting-started.md`, `docs/hub-api.md`, and `docs/macos-target.md` MDX/HTML blocks.
**Suggested fix direction**: Convert JSX blocks to `className` consistently and rewrite the Getting Started quickstart callout so MDX does not wrap paragraph content inside another paragraph.

