# CLAUDE.md — Prowl CLI Documentation Site

> Workspace-wide conventions (mission, branding, repo map, stack baseline, git/backlog policy)
> live in the **workspace `CLAUDE.md`** (`../../CLAUDE.md`) and load automatically. This file
> covers only what is specific to `prowl-docs`.

## Project
Documentation site for the **Prowl CLI**, built with Docusaurus 3.x (TypeScript). Hosted at
**docs.prowl.tools**. Keep in sync with the CLI repo (`prowl-tools/prowl`) — that's the source of
truth for features. (Prowl Review has its own docs site, `prowl-code-review-docs`.)

## Tech Stack
- **Framework**: Docusaurus 3.x (classic preset, v4 future flag enabled)
- **Language**: TypeScript
- **Styling**: custom CSS in `src/css/custom.css` (Space Grotesk headings, Source Sans 3 body,
  JetBrains Mono code)
- **Deployment**: Vercel or GitHub Pages (not yet configured)

## Content Structure
- Docs live in `docs/` as `.md`/`.mdx` files
- Sidebar is manually configured in `sidebars.ts` (three categories: Reference, Targets, Guides)
- Each doc has frontmatter: `sidebar_position`, `slug`, `title`
- Use `:::note` / `:::tip` / `:::warning` for callouts (Docusaurus admonitions)
- Use `<Tabs>` / `<TabItem>` from `@theme/Tabs` for shorthand vs explicit code examples (`.mdx`)
- Use `<div className="card-grid">` with `<a className="card">` for "What's Next" navigation sections
  (use `className`, not `class` — `.md`/`.mdx` are JSX-processed, so `class` emits React DOM warnings)

## Pages (15 total)
- **Reference**: `step-types.mdx` (all 28 step types, tabbed examples, step↔target compatibility
  matrix), `assertions.md`, `configuration.md`, `variables.md`, `selectors.md` (web + native
  selector dialects).
- **Targets** (experimental native execution targets): `macos-target.md`, `android.md`, `ios.md`.
- **Guides**: `auth.md`, `watch-mode.md`, `agents.mdx` (agent-first integration: library API,
  `--json`, CI, hub templates), `mcp.mdx`, `hub-api.md`.
- Plus `getting-started.md` (hero, install/init/run quickstart) and `troubleshooting.md`.

## Branding
- **Navbar logo**: `static/img/prowl-logo.png` (raccoon face, transparent bg)
- **Favicon**: `img/favicon.ico` (16/32/48) + `img/apple-touch-icon.png` (180x180)
- **Mascot**: `static/img/prowl-mascot.png` (full-body raccoon with magnifying glass, hero)
- **Stickers**: `static/img/prowl-stickers-1.png` (pixel-art set, footer watermark)
- **Social card**: `img/prowl-stickers-1.png` (via `themeConfig.image`)
- **Announcement bar**: Quickstart CTA banner at top of site

## Custom CSS Components
`.docs-hero` (gradient hero with mascot + CTAs, getting-started only), `.docs-quickstart`
(prerequisite callout with logo), `.card-grid` / `.card` (grid nav cards), `.navbar__logo img`
(circular logo with drop shadow), `.main-wrapper::before` (dot-grid overlay), `.footer`
(relative positioning).

## Design References
Follow the visual style of: Claude Code docs (code.claude.com/docs), Maestro docs
(docs.maestro.dev), OpenClaw docs (docs.openclaw.ai) — clean sidebar, tabbed code, callouts,
card-based nav, progressive disclosure.

## Key Conventions
- Keep docs in sync with the CLI repo (source of truth for features)
- Use tabbed code blocks for shorthand vs explicit syntax
- Include practical examples on every reference page; add "What's Next" card grids on key pages
- Keep the sidebar flat (no deeply nested categories)
- Keep commits atomic: commit only the files you touched, listing each path explicitly. Tracked
  files: `git commit -m "<scoped message>" -- path/to/file1 path/to/file2`. New files:
  `git restore --staged :/ && git add "path1" "path2" && git commit -m "<msg>" -- path1 path2`

## Commands
```bash
npm start       # Dev server on localhost:3000
npm run build   # Production build
npm run serve   # Serve production build locally
```
