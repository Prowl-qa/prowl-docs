# Prowl Docs - Resolved Items

### ~~P1.8-001: Documentation Site (docs.prowlqa.dev)~~
**Resolved**: 2026-02-13 (branch: docs-build, pending deployment)
**Description**: Full Docusaurus 3.x documentation site with 9 pages, custom Prowl branding, and polished UI. Raccoon face navbar logo + favicon, full-body mascot in hero section, pixel stickers in footer watermark. Tabbed shorthand/explicit code blocks on step-types page (6 pairs using `<Tabs>`). "What's Next" card grids on getting-started (4 cards), step-types (3 cards), assertions (3 cards). Custom typography (Space Grotesk headings, Source Sans 3 body, JetBrains Mono code). Glassmorphic navbar/sidebar, dot grid background overlay, announcement bar CTA, dark/light mode with `respectPrefersColorScheme`, mobile responsive, `onBrokenLinks: 'throw'`, social card meta image. Build passes with zero errors.

### ~~P1.8-005: Doc feedback widget (frontend)~~
**Resolved**: 2026-02-14 (commit b0749bf, branch: docs-fixes)
**Description**: Added "Was this helpful?" feedback widget to every doc page via swizzled DocItem/Footer. Three emoji buttons (negative/neutral/positive) with animated textarea expansion for optional comments. Submits to feedback API via `customFields.feedbackApiUrl`. CSS modules with dark mode support matching Prowl design system. Build passes.

### ~~P1.8-006: Doc feedback API (homelab backend)~~
**Resolved**: 2026-02-14 (deployed on Beelink)
**Description**: Express API + Postgres 16-alpine deployed on Beelink homelab server. `POST /api/feedback` endpoint with input validation, CORS (docs.prowlqa.dev only), Helmet security headers, in-memory rate limiting (10 req/min per IP). Postgres on port 5436 with `doc_feedback` table storing page_path, sentiment, comment, user_agent, created_at. Fully anonymous — no personal data collected. Multi-stage Docker build, health check endpoint.

### ~~P1.8-007: Cloudflare Tunnel for feedback API~~
**Resolved**: 2026-02-14 (deployed on Beelink)
**Description**: Cloudflare Tunnel container on Beelink exposing the feedback API publicly at `prowl-feedback.prowlqa.dev`. Configured via Cloudflare Zero Trust dashboard with published application route. Routes HTTPS traffic to `http://prowl-feedback-api:3002` over the `prowl_feedback_net` Docker network. Health check and feedback POST verified end-to-end through the tunnel.

### ~~P1.8-008: Add missing step types (hover, scroll, scrollTo) to docs~~
**Resolved**: 2026-02-15 (branch: docs-fixes)
**Description**: Added `hover`, `scroll`, and `scrollTo` step type sections to `docs/step-types.mdx` with tabbed shorthand/explicit examples. Updated step type count from 16 to 19 across step-types.mdx, getting-started.md, and CLAUDE.md. Added entries to the shorthand vs explicit quick reference table.

### ~~P1.8-009: Add missing browser config options (engine, channel, viewport) to docs~~
**Resolved**: 2026-02-15 (branch: docs-fixes)
**Description**: Added `engine`, `channel`, and `viewport` options to the full config YAML example and browser reference table in `docs/configuration.md`. Includes chromium/firefox/webkit engine selection, branded browser channels, and viewport presets (mobile/tablet/desktop) or custom width/height.

### ~~P1.8-010: Add missing CLI flags to docs~~
**Resolved**: 2026-02-15 (branch: docs-fixes)
**Description**: Added `--browser`, `--channel`, `--viewport`, `--include-tags`, and `--exclude-tags` flags to CLI Overrides in `docs/configuration.md`. Added same flags plus `prowlqa list --json`, `prowlqa login --url`, and `prowlqa login --config` to CLI Reference in `docs/troubleshooting.md`.

### ~~P1.8-011: Add missing hunt YAML features to docs~~
**Resolved**: 2026-02-15 (branch: docs-fixes)
**Description**: Added `description`, `tags`, and `retry` fields to the hunt example in `docs/getting-started.md` with an explanatory note covering tag filtering and retry behavior.

### ~~P1.8-012: Fix config/assertion mismatches~~
**Resolved**: 2026-02-15 (branch: docs-fixes)
**Description**: Added `"0.0.0.0"` to `allowedDomains` default in both the YAML example and guardrails table in `docs/configuration.md`. Removed `maxTotalTimeMs` from hunt-level assertions in `docs/assertions.md` (config-only option, already documented in configuration.md).

### ~~P1.8-005: "ProwlQA for Agents" Guide~~
**Resolved**: 2026-02-16 (branch: docs-fixes)
**Description**: Created `docs/agents.md` — dedicated Guides page covering agent-native integration with ProwlQA. Sections: intro with "made for agents, controlled by humans" positioning, agent workflow (Discover → Run → Report) with code examples, CLI integration (`--json` flags with example JSON output shapes for `run` and `ci`), JUnit XML for CI systems, Library API (Node.js) with Core Functions table and Zod schema validation examples, Community Hub link, and What's Next card grid. Registered in sidebar under Guides. Also updated: hero tagline to mention AI agents, announcement bar to link to agents page, tagline to "CLI-first QA testing — made for agents, controlled by humans". Fixed step type errors (hover/scrollTo to explicit-only, scroll to direction/amount), added `junit` artifact config, `--json`/`--junit` CLI flags, full `prowlqa ci` command docs, and watch/login flag expansions.

### ~~P1.8-006: Library API Reference~~
**Resolved**: 2026-02-16 (branch: docs-fixes)
**Description**: Library API documented within the agents page (`docs/agents.md`). Core Functions table covering `runHunt(options)`, `loadConfig()`, `loadHunt(name)`, `listHunts()`. Zod schema exports (`huntSchema`, `configSchema`, `stepSchema`) with validation example. Variable interpolation via `interpolateHunt()` with code example. All public exports from `prowlqa` package documented with descriptions.

### ~~DOCS-001: Update Agents Guide with CLI-First Efficiency Positioning~~
**Resolved**: 2026-02-16 (commit 892bb89, branch: docs-fixes)
**Description**: Added "Why CLI-First, Not MCP" section to `docs/agents.md` with token efficiency comparison table showing 10-15x advantage over MCP-based tools (~1,250 vs ~18,000-23,000 tokens per test cycle). Includes Zero Context Tax bullet points, exit code branching example, and tip callout. Revised page intro with CLI-first framing.

### ~~DOCS-002: Agent API Documentation (Hub Templates)~~
**Resolved**: 2026-02-16 (commit 892bb89, branch: docs-fixes)
**Description**: Expanded the 1-paragraph Community Hub section in `docs/agents.md` into a full "Using Hub Templates" guide. Covers discover → pull → customize → execute workflow with CLI examples (`prowlqa hub list/search/pull`), YAML template with `{{VAR}}` placeholders, and a complete Node.js library API example using `loadHunt → interpolateHunt → runHunt`. Added Community Hub card to What's Next grid.

### ~~P1.8-002: Deploy docs site~~
**Resolved**: 2026-02-16 (branch: hot-fixes)
**Description**: Deployed the Prowl QA documentation site to Vercel with custom domain at docs.prowlqa.dev. Configured Vercel project with Docusaurus preset, added CNAME DNS record via Cloudflare, and SSL provisioned automatically. Auto-deploys from `main` branch on every merge.

### ~~P1.8-003: Favicon generation from mascot~~
**Resolved**: 2026-02-16 (branch: docs-fixes)
**Description**: Generated proper multi-size favicons from the 1024x1024 raccoon face logo PNG. Created `favicon.ico` (7.7KB, embedding 16x16 + 32x32 + 48x48 PNGs), `favicon-16x16.png`, `favicon-32x32.png`, and `apple-touch-icon.png` (180x180). Updated `docusaurus.config.ts` to use `.ico` as primary favicon and added `headTags` with `<link>` elements for sized PNGs and apple-touch-icon. Updated CLAUDE.md branding section.

### ~~PQD-002: Document the MCP server and agent integration (prowlqa 0.1.1)~~
**Resolved**: 2026-06-01 (commit 0be9766, branch: site-updates)
**Description**: Added `docs/mcp.mdx` — a dedicated MCP Server guide covering the `prowlqa mcp` stdio server, PATH/init prerequisites, MCP client configs (generic, Claude Desktop, Cursor, OpenClaw, npx) in tabs, the four tools (`list_hunts`, `run_hunt`, `run_suite`, `list_projects`) with arguments and return shapes, automated bug-logging with the `QA-NNN` response and `logBugs` opt-out, and the multi-project registry (`--projects` / `PROWLQA_PROJECTS` / `~/.prowlqa/projects.yml`). Added to the Guides sidebar and cross-linked from the agents page. Also excluded internal `backlog.md`/`resolved.md` from the production build so the `{PQD-NNN}` syntax no longer breaks MDX compilation.

### ~~PQD-003: Document the `runSuite()` / `updateBacklogFromSuite()` library API (prowlqa 0.1.1)~~
**Resolved**: 2026-06-01 (commit c1dcd77, branch: site-updates)
**Description**: Extended the Library API in `docs/agents.mdx` with `runSuite()`, `updateBacklogFromSuite()`, and `readHistory()`/`readHuntHistory()` — full option tables and return types (`CiResult`, `BugLogSummary`, `HistoryEntry`) plus the automated bug-logging flow for non-CLI consumers. Added a `prowlqa history --json` example and an MCP cross-link. Same commit also backfilled the 9 step types undocumented since 0.1.0–0.1.1 (`copyText`, `waitForDownload`, `if`, `repeat`, `mockRoute`, `unmockRoute`, `evalScript`, `runScript`, `assertScreenshot`; count 19→28), the `{{RANDOM_*}}` built-in variables, `history.maxRuns` config, guardrail substring/`about:`/`data:` semantics, and the `assert visible` prose-as-text note.

### ~~PQD-001 / P1.8-004: "Edit this page" link — keep removed (decision)~~
**Resolved**: 2026-06-01 (branch: site-updates, decision — no code change)
**Description**: Re-evaluated now that `Prowl-qa/prowl-docs` is public. Decided to keep the Docusaurus `editUrl` disabled for now — not inviting community edits to the docs yet — so the "Edit this page" link stays off. To revisit later, re-add `editUrl: 'https://github.com/Prowl-qa/prowl-docs/tree/main/'` to the `docs` preset options in `docusaurus.config.ts`.
