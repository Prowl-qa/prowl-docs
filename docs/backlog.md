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

### {PQD-007} **Document the `assertWithAI` step type once the next CLI release ships**
**Priority**: Medium
**Description**: CLI PROWL-020 added a new `assertWithAI: <string>` step type — an AI-powered
visual assertion (screenshot + a natural-language condition → a vision LLM returns pass/fail with
an explanation). It's implemented and resolved in the prowl repo but sits in the *Unreleased*
CHANGELOG (ships in **0.1.6**); per the docs-track-the-released-CLI convention (same gate as
{PQD-006}), document it when 0.1.6 is published. Add to the **Step Types** reference (and note it
on the Assertions page):
- The step shape `assertWithAI: "<condition>"` with a worked example, and that the model's
  explanation is surfaced in the run report (on pass and fail).
- **BYOK config / env vars**: `PROWL_AI_PROVIDER` (`anthropic` | `openai`), `PROWL_AI_KEY`,
  `PROWL_AI_MODEL` (defaults are vision-capable), and `PROWL_AI_BASE_URL` (override endpoint —
  the forward-compat seam for a future managed-AI path).
- **Determinism caveat (document honestly)**: AI assertions are non-deterministic — the explicit
  exception to Prowl's determinism principle. Note the low-temperature call and that the
  explanation is always recorded for auditability.
- **Graceful degradation**: with no AI provider configured the step **skips with a warning** (a
  non-fatal `warn`/`○` outcome that neither fails the run nor silently passes) — document this so
  CI users understand the behavior when `PROWL_AI_KEY` is unset.
- **Target-agnostic**: works on any target with a screenshot capability (web + the native
  targets), not web-only.
Optionally cross-link that this is the first consumer of Prowl's BYOK AI layer (the managed-credit
path is future). Source from the CLI README + the (by then) released CHANGELOG; verify against
source.

## Low Priority

*No active items.*

## Sunset Work Items

Decision (2026-08-26): Prowl Hub and Prowl Infra Hub are being retired, prowl-review moves to
maintenance mode (its docs site review.prowl.tools goes away), and the CLI becomes the single
product, positioned desktop-first (macOS) with web second. The docs site must stop pointing at
retired properties and should promote the macOS target. Companion items: `prowl` PROWL-072..078,
`prowl-web` PQW-025..027.

### {PQD-008} **Replace the Hub API page with a bundled-templates page; scrub hub links**
**Priority**: High
**Description**: `docs/hub-api.md` documents `hub.prowl.tools/api/hunts` (13 references) and
`docs/agents.mdx` has 6 more; `docusaurus.config.ts` carries 5 nav/footer links to hub /
review / infra properties. Once `prowl` PROWL-072 ships templates inside the CLI, replace
`hub-api.md` with a "Starter templates" page (`prowl init --template`, the category list, how
to contribute a template via PR to `prowl`), rewrite the `agents.mdx` passages that tell AI
agents to fetch from the hub, and remove the hub/review/infra links from the config. Add a
redirect from the old `/hub-api` slug.
**Acceptance**: `grep -ri "hub.prowl\|review.prowl\|infra" docs docusaurus.config.ts` finds
only historical mentions in backlog/resolved; site builds; redirect works.

### {PQD-009} **Promote the macOS target: sidebar position, "experimental" wording, CI guide**
**Priority**: High
**Description**: `macos-target.md` sits at `sidebar_position: 9` under an "Experimental"
banner that tells readers to build a Swift helper from source. When `prowl` PROWL-074 (two-minute
install) ships: move the macOS page directly after Getting Started, rewrite Requirements around
the bundled helper, downgrade the banner from "Experimental" to "Beta" (or remove), and add a
new guide **"Testing a macOS app in CI"** from `prowl` PROWL-076 (runner setup, Accessibility /
Screen Recording permission handling, a ≤20-line hunt, the workflow file). Update the landing
page / intro of the docs site so the first sentence says macOS + web, not "web testing with
Playwright". Keep Android/iOS pages labelled experimental.
**Acceptance**: macOS page is the second item in the sidebar; CI guide published; intro copy
updated; no instruction anywhere requires a source checkout for normal use.

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
**Also seen (triage 2026-08-23)**: `qa-prowl-docs-e2e-20260802` {PDOC-QA-005} — same root cause (config still on `prowlqa.dev` vs the rebrand note), independently validated against `docusaurus.config.ts:29`.

{PDOC-QA-014} **MCP `npx` config uses wrong package name**
   **Severity**: Medium
   **Area**: MCP setup guide
   **Environment**: Local docs dry run
   **Observed**: `docs/mcp.mdx` lines 104-111 use `npx -y prowl mcp`.
   **Expected**: The no-global MCP example should invoke the current npm package. npm metadata shows `prowl-tools` version 0.1.3 exposes bin `prowl`; npm package `prowl` is unrelated/old version 0.0.3.
   **Reproduction steps**:
   1. Read the MCP guide's `npx (no global install)` example.
   2. Compare `npm view prowl` and `npm view prowl-tools`.
   3. The documented package name does not point at the current Prowl package.
   **Impact**: Users can install or invoke the wrong npm package when configuring MCP.
   **Evidence**: 2026-08-02 npm metadata check; `docs/mcp.mdx`.
   **Likely area**: Package rename not fully reflected in MCP docs.
   **Suggested fix direction**: Change the MCP `npx` example to use `prowl-tools`.

{PDOC-QA-015} **Agent quickstart JSON sample does not match current run output**
   **Severity**: Medium
   **Area**: Prowl for Agents / structured JSON examples
   **Environment**: Local docs plus read-only cross-check against `/Users/luciusfox/Desktop/prowl`
   **Observed**: `docs/agents.mdx` lines 30-36 shows `status: "passed"`, numeric `steps`, and string `duration`. Current `RunResult` in `/Users/luciusfox/Desktop/prowl/src/types/index.ts` uses `status: "pass" | "fail"`, `exitCode`, `durationMs`, and detailed `steps` arrays; this weekly run's hunt JSON also emitted `status: "pass"`.
   **Expected**: The first agent-facing JSON sample should match the real `prowl run <hunt> --json` schema because agents may copy its status checks and parse shape directly.
   **Reproduction steps**:
   1. Read the `Quickstart in 60 Seconds` JSON sample on `/agents`.
   2. Compare it against the current `RunResult` type or any `prowlqa run <hunt> --config .prowl/config.yml --json` output from this docs repo.
   3. Note the sample status and field names do not line up with actual machine-readable output.
   **Impact**: Agent consumers can implement the wrong parser or status branch from the first structured-output example they see.
   **Evidence**: 2026-08-09T05:00Z hunt output; `docs/agents.mdx` lines 30-36; `/Users/luciusfox/Desktop/prowl/src/types/index.ts` lines 239-241.
   **Likely area**: Introductory example predates the stabilized `RunResult` schema documented later on the same page.
   **Suggested fix direction**: Replace the quickstart JSON sample with a compact but schema-accurate `status: "pass"`, `exitCode`, `durationMs`, and representative `steps` structure, or explicitly label it as pseudocode.

{PDOC-QA-016} **Announcement bar hunt times out on network idle**
   **Severity**: Medium
   **Area**: Announcement bar / committed docs hunts
   **Environment**: Local docs weekly QA, Docusaurus dev server at `http://localhost:3000`, branch `qa-prowl-docs-weekly-20260815`
   **Observed**: `prowlqa run announcement-bar --config .prowl/config.yml --json` navigated successfully but failed on step 2 with `page.waitForLoadState: Timeout 5000ms exceeded.` The other 7 committed hunts passed when run by hunt name.
   **Expected**: The committed announcement-bar hunt should pass reliably against a freshly started local docs server, or wait for a page-specific selector before asserting announcement content.
   **Reproduction steps**:
   1. Run `npm start` in `/Users/luciusfox/Desktop/prowl-docs`.
   2. Run `prowlqa run announcement-bar --config .prowl/config.yml --json`.
   3. Observe the `waitForNetworkIdle` timeout after navigation.
   **Impact**: Weekly docs regression coverage is noisy; a true announcement bar regression can be hidden by a generic network-idle timeout.
   **Evidence**: Run artifact `.prowl/runs/2026-08-16_00-01-56-674/result.json`; failure screenshot and console/network artifacts were generated under that run directory.
   **Likely area**: `.prowl/hunts/announcement-bar.yml` uses a network-idle wait that can flake against Docusaurus dev-server activity.
   **Suggested fix direction**: Replace or supplement the early network-idle dependency with deterministic waits for the announcement bar element/text and keep broader network checks at assertion level.

{PDOC-QA-017} **Feedback widget is absent on mobile docs pages**
   **Severity**: Low
   **Area**: Feedback widget / mobile docs UX
   **Environment**: Local docs reader QA in Chromium mobile viewport `390x844`
   **Observed**: Desktop pages showed `Was this page helpful?` on every tested docs page, but mobile viewport checks found zero visible feedback labels across Getting Started, Step Types, Assertions, Configuration, Variables, Selectors, Authentication, Watch Mode, Agents, MCP, Hub API, and Troubleshooting. A direct mobile body-text check on Getting Started also did not include the feedback prompt.
   **Expected**: If the feedback widget is intended to collect doc-quality signals for all readers, mobile readers should have an equivalent visible feedback control or an intentionally documented mobile alternative.
   **Reproduction steps**:
   1. Run `npm start`.
   2. Open `http://localhost:3000/` with a 390x844 mobile viewport.
   3. Search visible page text for `Was this page helpful?`.
   4. Repeat on a reference page such as `/step-types` or `/configuration`.
   **Impact**: Mobile readers cannot submit page-level docs feedback, reducing signal from a meaningful portion of docs traffic.
   **Evidence**: 2026-08-16 Playwright mobile reader QA: `feedbackVisible: 0` for all 12 required docs pages; desktop checks returned `feedbackVisible: 1`.
   **Likely area**: Docusaurus mobile doc footer rendering or feedback component placement under `src/theme/DocItem/Footer`.
   **Suggested fix direction**: Verify whether the swizzled feedback component is hidden by Docusaurus mobile layout and move or duplicate it into a doc region rendered on mobile.

## Known non-issues (QA-triaged)

- {hunt execution} `prowl run <file-path>` rejected despite "Hunt name or path" help — NOT A DOCS DEFECT: these docs only teach `prowl run <hunt-name>`; the mismatch is in the CLI repo (`run.ts`/`watch.ts`/`history.ts` help says "Hunt name or path" while `hunt-name.ts` validation forbids dots/extensions — "path" means slash-separated names like `admin/users-crud`). Routed to the CLI repo backlog. Source: `qa-prowl-docs-weekly-20260815` {PDOC-QA-006}, 2026-08-23.
