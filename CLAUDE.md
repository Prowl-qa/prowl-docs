# CLAUDE.md - Prowl QA Documentation Site

## Project
This is the Prowl QA documentation site built with Docusaurus 3.x (TypeScript).
Hosted at docs.prowlqa.dev.

## Tech Stack
- **Framework**: Docusaurus 3.x (classic preset, v4 future flag enabled)
- **Language**: TypeScript
- **Styling**: Custom CSS in `src/css/custom.css` (Space Grotesk headings, Source Sans 3 body, JetBrains Mono code)
- **Deployment**: Vercel or GitHub Pages (not yet configured)

## Content Structure
- Documentation lives in `docs/` as `.md` or `.mdx` files
- Sidebar is manually configured in `sidebars.ts` (two categories: Reference, Guides)
- Each doc has frontmatter: `sidebar_position`, `slug`, `title`
- Use `:::note`, `:::tip`, `:::warning` for callout boxes (Docusaurus admonitions)
- Use `<Tabs>` / `<TabItem>` from `@theme/Tabs` for shorthand vs explicit code examples (requires `.mdx`)
- Use `<div class="card-grid">` with `<a class="card">` for "What's Next" navigation sections

## Pages (10 total)
- `getting-started.md` — hero section, install/init/run quickstart, card grid
- `step-types.mdx` — all 19 step types with tabbed shorthand/explicit examples, card grid
- `assertions.md` — inline + hunt-level assertion reference, card grid
- `configuration.md` — all config options with defaults
- `variables.md` — interpolation, precedence, redaction
- `selectors.md` — Playwright selector best practices
- `auth.md` — authentication setup guide
- `watch-mode.md` — watch mode guide
- `agents.mdx` — agent-first integration guide (library API, --json output, CI, hub templates)
- `troubleshooting.md` — common issues and debugging

## Branding
- **Navbar logo**: `static/img/prowl-qa-logo.png` (raccoon face, transparent bg)
- **Favicon**: `img/favicon.ico` (multi-size .ico: 16x16, 32x32, 48x48) + `img/apple-touch-icon.png` (180x180)
- **Mascot**: `static/img/prowl-qa-mascot.png` (full-body raccoon with magnifying glass, used in hero)
- **Stickers**: `static/img/prowl-qa-stickers-1.png` (pixel art set, used in footer watermark)
- **Social card**: `img/prowl-qa-stickers-1.png` (set via `themeConfig.image`)
- **Announcement bar**: Quickstart CTA banner at top of site

## Custom CSS Components
- `.docs-hero` — gradient hero section with mascot art and CTA buttons (getting-started only)
- `.docs-quickstart` — prerequisite callout box with logo
- `.card-grid` / `.card` — CSS grid navigation cards for "What's Next" sections
- `.navbar__logo img` — circular logo with drop shadow
- `.main-wrapper::before` — subtle dot grid background overlay
- `.footer` — relative positioning for footer content

## Design References
When creating or updating pages, follow the visual style of:
- Claude Code docs (code.claude.com/docs) — clean sidebar, tabs, callout boxes, card groups
- Maestro docs (docs.maestro.dev) — sidebar nav, tabbed code, hint boxes
- OpenClaw docs (docs.openclaw.ai) — card-based nav, progressive disclosure, step-by-step guides

## Key Conventions
- Keep docs in sync with the CLI repo (Prowl-qa/prowl) — that's the source of truth for features
- Use tabbed code blocks (`<Tabs>`) for shorthand vs explicit syntax examples
- Include practical examples in every reference page
- Add "What's Next" card grids at the bottom of key pages for progressive discovery
- Keep the sidebar flat (no deeply nested categories)
- Keep commits atomic: commit only the files you touched and list each path explicitly. For tracked files run `git commit -m "<scoped message>" -- path/to/file1 path/to/file2`. For brand-new files, use the one-liner `git restore --staged :/ && git add "path/to/file1" "path/to/file2" && git commit -m "<scoped message>" -- path/to/file1 path/to/file2`

## Commands
```bash
npm start       # Dev server on localhost:3000
npm run build   # Production build
npm run serve   # Serve production build locally
```

## Related Repos
- **CLI**: Prowl-qa/prowl — source of truth for features and step types
- **Landing page**: Prowl-qa/prowl-web — marketing site at prowlqa.dev
- **Community hub**: Prowl-qa/prowl-hub — community hunt templates
