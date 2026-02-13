# CLAUDE.md - Prowl Documentation Site

## Project
This is the Prowl documentation site built with Docusaurus 3.x (TypeScript).
Hosted at docs.prowlqa.dev.

## Tech Stack
- **Framework**: Docusaurus 3.x (classic preset)
- **Language**: TypeScript
- **Styling**: Custom CSS in `src/css/custom.css`
- **Deployment**: Vercel or GitHub Pages

## Content Structure
- All documentation lives in `docs/` as Markdown files
- Sidebar is manually configured in `sidebars.ts`
- Each doc has frontmatter: `sidebar_position`, `slug`, `title`
- Use `:::note`, `:::tip`, `:::warning` for callout boxes (Docusaurus admonitions)

## Design References
When creating or updating pages, follow the visual style of:
- Claude Code docs (code.claude.com/docs) — clean sidebar, tabs, callout boxes, card groups
- Maestro docs (docs.maestro.dev) — sidebar nav, tabbed code, hint boxes
- OpenClaw docs (docs.openclaw.ai) — card-based nav, progressive disclosure, step-by-step guides

## Key Conventions
- Keep docs in sync with the CLI repo (Prowl-qa/prowl) — that's the source of truth for features
- Use tabbed code blocks for shorthand vs explicit syntax examples
- Include practical examples in every reference page
- Keep the sidebar flat (no deeply nested categories)

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
