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

*No active items.*

## Low Priority

*No active items.*

## QA Findings - Archy / Woz

Run context evidence: 2026-08-08 weekly run on branch `qa-prowl-docs-weekly-20260808`; `npm run typecheck` passed, `npm run build` passed with the existing stale Browserslist warning, and all 8 committed hunts passed when run with normalized hunt names plus `--config .prowl/config.yml --json`. Browser reader QA used local Docusaurus at `http://localhost:3000` in desktop Chrome and mobile viewport checks.

{PDOC-QA-006} **Getting Started renders invalid nested paragraph markup**
   **Severity**: Medium
   **Area**: Getting Started / docs runtime markup
   **Environment**: Local docs, Docusaurus dev server, Chrome desktop and mobile QA
   **Observed**: Loading `/` logs a React hydration warning: `In HTML, <p> cannot be a descendant of <p>`. The warning points at the `.docs-quickstart` block in `docs/getting-started.md` lines 25-29.
   **Expected**: The Getting Started page should hydrate without invalid HTML warnings so automated browser QA and user sessions start from a clean console.
   **Reproduction steps**:
   1. Start the docs site with `npm start`.
   2. Open `http://localhost:3000/` in Chrome with the console visible.
   3. Observe the React hydration warning for nested paragraph markup in the quickstart callout.
   **Impact**: Console noise can hide real runtime issues and may produce hydration edge cases on the highest-traffic onboarding page.
   **Evidence**: 2026-08-09T05:00Z browser QA console output; `docs/getting-started.md` lines 25-29.
   **Likely area**: MDX rendering of the `<p>` wrapper inside the custom `.docs-quickstart` HTML block.
   **Suggested fix direction**: Replace the inner paragraph wrapper with a `div` or fully JSX-compatible markup that does not let MDX synthesize a nested `<p>`.

{PDOC-QA-007} **Hub API card grid uses HTML `class` attributes in MDX**
   **Severity**: Low
   **Area**: Hub API / docs runtime markup
   **Environment**: Local docs, Docusaurus dev server, Chrome desktop QA
   **Observed**: Loading the docs during reader QA logs `Invalid DOM property class. Did you mean className`. `docs/hub-api.md` lines 224-233 use `class="card-grid"` and `class="card"` inside JSX-like MDX markup.
   **Expected**: MDX/React markup should use `className` so the page renders without React property warnings.
   **Reproduction steps**:
   1. Start the docs site with `npm start`.
   2. Open `http://localhost:3000/hub-api` in Chrome with the console visible.
   3. Observe the React invalid DOM property warning.
   **Impact**: Low user-facing impact, but it adds avoidable console noise for QA runs and agent-driven browser diagnostics.
   **Evidence**: 2026-08-09T05:00Z browser QA console output; `docs/hub-api.md` lines 224-233.
   **Likely area**: Raw HTML copied into an MDX page after card-grid patterns elsewhere use JSX attributes.
   **Suggested fix direction**: Change the Hub API card-grid attributes from `class` to `className`.

{PDOC-QA-008} **Agent quickstart JSON sample does not match current run output**
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
