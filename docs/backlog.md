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

Run context evidence: 2026-08-15 weekly run on branch `qa-prowl-docs-weekly-20260815`; `npm ci` completed, `npm run typecheck` passed, and `npm run build` passed with the existing stale Browserslist warning. Local Docusaurus ran at `http://localhost:3000`. Committed hunts were run individually with `--config .prowl/config.yml --json`; 7 passed and 1 failed after accepted hunt-name invocation. Reader QA covered Getting Started, Step Types, Assertions, Configuration, Variables, Selectors, Authentication, Watch Mode, Agents, MCP, Hub API, Troubleshooting, navbar/footer links, announcement bar, pagination, tabbed examples, feedback widget behavior, mobile basics, and agent-readability.

{PDOC-QA-006} **Hunt path invocation is rejected despite path-style CLI help**
   **Severity**: Medium
   **Area**: Prowl hunt execution docs / agent-readability
   **Environment**: Local docs weekly QA, `prowlqa@0.1.0` global CLI, local docs repo `.prowl/hunts/`
   **Observed**: Running committed hunts by filesystem path, for example `prowlqa run .prowl/hunts/homepage-smoke.yml --config .prowl/config.yml --json`, failed before browser execution with `Invalid hunt name: ".prowl/hunts/homepage-smoke.yml". Use only letters, numbers, hyphens, underscores, and forward slashes.` Removing the leading dot incorrectly produced `prowl/hunts/...` and failed the same validation. Running by committed hunt name, for example `prowlqa run homepage-smoke --config .prowl/config.yml --json`, executed.
   **Expected**: The documented/help text says the argument accepts a hunt name or path, so committed hunt file paths should either work or docs/help should clearly instruct users and agents to pass extensionless hunt names from `prowlqa list`.
   **Reproduction steps**:
   1. Start local docs with `npm start`.
   2. Run `prowlqa run .prowl/hunts/homepage-smoke.yml --config .prowl/config.yml --json`.
   3. Compare with `prowlqa list --config .prowl/config.yml` and `prowlqa run homepage-smoke --config .prowl/config.yml --json`.
   **Impact**: Agents following the workflow literally from committed file paths can report all hunts failed before executing any browser QA.
   **Evidence**: 2026-08-16 05:01 UTC run output; current local CLI source `/Users/luciusfox/Desktop/prowl/src/config/hunt-name.ts` validates names with no dot/extension even though run command help says `Hunt name or path`.
   **Likely area**: CLI hunt-name validation and/or docs/help text for accepted hunt identifiers.
   **Suggested fix direction**: Either support `.prowl/hunts/*.yml` paths in the runner or update docs/help/workflows to use names returned by `prowl list`.

{PDOC-QA-007} **Announcement bar hunt times out on network idle**
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

{PDOC-QA-008} **Getting Started markup causes hydration warnings**
   **Severity**: Medium
   **Area**: Getting Started / React hydration / browser console quality
   **Environment**: Local docs reader QA in Chromium desktop and mobile
   **Observed**: Loading Getting Started produced React console errors: `In HTML, <p> cannot be a descendant of <p>. This will cause a hydration error.` The warning traces to `.docs-quickstart`, and source shows `docs/getting-started.md` wraps an `<img>` and Markdown paragraph content inside an explicit `<p>`. Reader QA also captured `Invalid DOM property class. Did you mean className`, with source examples in `docs/hub-api.md` using raw `class` attributes in JSX-like card markup.
   **Expected**: Docs pages should hydrate without React DOM warnings so `noConsoleErrors` can be meaningful and readers avoid dev-mode UI instability.
   **Reproduction steps**:
   1. Run `npm start`.
   2. Open `http://localhost:3000/` in Chromium dev mode.
   3. Inspect the browser console for React hydration warnings.
   4. Compare the warning trace with `docs/getting-started.md` and raw `class` attributes in `docs/hub-api.md`.
   **Impact**: Console noise reduces trust in docs examples and can mask real client-side regressions, especially for automated docs QA and agent consumers.
   **Evidence**: 2026-08-16 Playwright reader QA console output on desktop and mobile; `docs/getting-started.md` lines 25-30; `docs/hub-api.md` card-grid markup.
   **Likely area**: MDX/HTML markup using nested paragraph tags and `class` instead of `className`.
   **Suggested fix direction**: Convert the quickstart wrapper to non-paragraph block markup and replace JSX-style raw `class` attributes with `className` where Docusaurus MDX treats markup as JSX.

{PDOC-QA-009} **Feedback widget is absent on mobile docs pages**
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
