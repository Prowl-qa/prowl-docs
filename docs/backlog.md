# Prowl Docs - Product Backlog

**Repo**: `Prowl-qa/prowl-docs`
**Local path**: `~/Desktop/prowl-docs`
**Stack**: Docusaurus 3.x (TypeScript)
**Hosting**: Vercel or GitHub Pages at docs.prowlqa.dev
**Branch**: `docs-build`

---

## High Priority

{PQD-002} **Document the MCP server and agent integration (shipped in prowlqa 0.1.1)**
   The `prowlqa mcp` command and its multi-project support shipped in CLI 0.1.1 but are not yet on the docs site. Source of truth is the CLI repo's `README.md` "MCP Server (AI Agent Integration)" section — mirror it into the Docusaurus structure.

**Acceptance Criteria**:
- Page covering starting the stdio server (`prowlqa mcp`) and configuring an MCP client (Claude Desktop, Cursor, OpenClaw, etc.), including the install/PATH prerequisite and that the project must be initialized (`.prowlqa/` with hunts)
- The four tools — `list_hunts`, `run_hunt`, `run_suite`, `list_projects` — with arguments and return shapes (notably the `run_suite` response: pass/fail/skip counts + created `QA-NNN` ticket ids)
- Automated bug-logging: failing hunts logged to the target repo's `docs/backlog.md` (new / already-open / regression) with the `logBugs` opt-out
- The multi-project registry: `--projects` / `PROWLQA_PROJECTS` / `~/.prowlqa/projects.yml`, the registry YAML shape, and the optional `project` argument on tools

{PQD-003} **Document the `runSuite()` / `updateBacklogFromSuite()` library API (0.1.1)**
   The library now exports `runSuite`, `updateBacklogFromSuite`, and related types alongside `runHunt`. Add/extend the programmatic-usage page covering these and the automated bug-logging flow for non-CLI consumers.

## Medium Priority

*No active items.*

## Low Priority

{PQD-001} **P1.8-004: "Edit this page" link removed — re-evaluate later**
   Removed the Docusaurus `editUrl` config that rendered a "Edit this page" link at the bottom of every doc page (below the "What's Next" card grid). The link pointed to `https://github.com/Prowl-qa/prowl-docs/tree/main/`. To re-enable, add `editUrl: 'https://github.com/Prowl-qa/prowl-docs/tree/main/'` back to `docs` preset options in `docusaurus.config.ts`. Consider re-adding once the repo is public and community contributions are welcome.

![Edit this page button position](research/edit-this-page-button.png)
