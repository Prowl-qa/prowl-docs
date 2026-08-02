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

Run context evidence: 2026-08-02 dry run on branch `qa-prowl-docs-e2e-20260802`; `npm ci` completed cleanly, `npm run typecheck` passed, and `npm run build` passed with a stale Browserslist warning. All 8 committed hunts passed when run with `prowlqa run <hunt> --config .prowl/config.yml --json`; internal routes returned 200.

{PDOC-QA-001} **Getting Started first-run path is stale**
   **Severity**: High
   **Area**: Getting Started / first-run onboarding
   **Environment**: Local docs dry run
   **Observed**: `docs/getting-started.md` lines 62 and 91-119 say `init` creates 8 starter hunts, tells users to edit `homepage.yml`, then run `prowl run smoke-test`.
   **Expected**: The quickstart should match the current CLI init output and runnable starter command. Current CLI source at `/Users/luciusfox/Desktop/prowl/src/cli/commands/init.ts` lines 60-67 copies example hunts, and `/Users/luciusfox/Desktop/prowl/examples/hunts/hello.yml` line 6 says to run `prowl run hello`.
   **Reproduction steps**:
   1. Read the Getting Started `Initialize`, `Write Your First Hunt`, and `Run` sections.
   2. Compare the documented hunt names and run command against current `prowl init` source/examples.
   3. Follow the documented path after init; the generated starter path does not line up with `smoke-test`.
   **Impact**: New users can follow a quickstart path that no longer matches the current init output.
   **Evidence**: 2026-08-02 dry run; `docs/getting-started.md`; `/Users/luciusfox/Desktop/prowl/src/cli/commands/init.ts`; `/Users/luciusfox/Desktop/prowl/examples/hunts/hello.yml`.
   **Likely area**: Stale quickstart content after init behavior changed.
   **Suggested fix direction**: Update the Getting Started first-run flow to match the current generated example hunt names and command sequence.

{PDOC-QA-002} **Hub/agent workflow saves `.yaml` but loader resolves `.yml`**
   **Severity**: High
   **Area**: Hub API / agent template workflow
   **Environment**: Local docs dry run
   **Observed**: `docs/hub-api.md` line 207 tells agents to save `.prowl/hunts/login-flow.yaml`, then line 215 runs `prowl run login-flow`.
   **Expected**: The documented file extension should match what the CLI can resolve. Current CLI loader at `/Users/luciusfox/Desktop/prowl/src/config/loader.ts` lines 215 and 226 resolves `${huntName}.yml`.
   **Reproduction steps**:
   1. Follow the Hub API page and save the generated hunt as `.prowl/hunts/login-flow.yaml`.
   2. Run `prowl run login-flow`.
   3. The loader looks for `.prowl/hunts/login-flow.yml`, not `.yaml`.
   **Impact**: Agents following the docs can save a hunt file that the CLI cannot find.
   **Evidence**: 2026-08-02 source check; `docs/hub-api.md`; `/Users/luciusfox/Desktop/prowl/src/config/loader.ts`.
   **Likely area**: Documentation/runtime extension mismatch.
   **Suggested fix direction**: Align the documented generated filename with loader behavior, or document `.yaml` only after the CLI supports it.

{PDOC-QA-003} **Hub/Agents templates include unsupported top-level `baseUrl`**
   **Severity**: High
   **Area**: Hub API / Agents copy-paste templates
   **Environment**: Local docs dry run
   **Observed**: `docs/hub-api.md` line 192 and `docs/agents.mdx` line 330 include top-level `baseUrl`.
   **Expected**: Copy-paste templates should validate under the current strict hunt schema. `/Users/luciusfox/Desktop/prowl/src/config/schema.ts` lines 415-430 permits `name`, `description`, `tags`, `vars`, `steps`, `assertions`, and `retry`.
   **Reproduction steps**:
   1. Copy the documented `login-flow` YAML from Hub API or Agents.
   2. Save it as a hunt file.
   3. Run the hunt; schema validation rejects the unsupported top-level `baseUrl`.
   **Impact**: Copy-paste templates can fail schema validation for users and agents.
   **Evidence**: 2026-08-02 source check; `docs/hub-api.md`; `docs/agents.mdx`; `/Users/luciusfox/Desktop/prowl/src/config/schema.ts`.
   **Likely area**: Template examples drifted from the strict hunt schema.
   **Suggested fix direction**: Remove or relocate `baseUrl` in the documented templates to a schema-supported config or variable pattern.

{PDOC-QA-004} **MCP `npx` config uses wrong package name**
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

{PDOC-QA-005} **Feedback API config conflicts with rebrand note**
   **Severity**: Medium
   **Area**: Feedback widget / production docs config
   **Environment**: Local docs dry run
   **Observed**: `docusaurus.config.ts` line 29 uses `https://prowl-feedback.prowlqa.dev/api/feedback`.
   **Expected**: Config and project notes should agree on the approved production feedback endpoint. `docs/resolved.md` line 77 says the rebrand changed the feedback API to `prowl-feedback.prowl.tools`.
   **Reproduction steps**:
   1. Search the repo for `prowl-feedback`.
   2. Compare `docusaurus.config.ts` against the rebrand note in `docs/resolved.md`.
   3. The runtime config still points at the older `prowlqa.dev` endpoint.
   **Impact**: Production feedback routing or brand consistency may be wrong.
   **Evidence**: 2026-08-02 source check; `docusaurus.config.ts`; `docs/resolved.md`.
   **Likely area**: Rebrand follow-through / endpoint configuration.
   **Suggested fix direction**: Confirm the intended production feedback endpoint, then align config and docs to the approved domain.
