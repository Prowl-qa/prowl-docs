# Prowl Docs - Product Backlog

**Repo**: `Prowl-qa/prowl-docs`
**Local path**: `~/Desktop/prowl-docs`
**Stack**: Docusaurus 3.x (TypeScript)
**Hosting**: Vercel or GitHub Pages at docs.prowlqa.dev
**Branch**: `docs-build`

---

## Active

### P1.8-004: "Edit this page" link removed — re-evaluate later
**Priority**: Low
**Description**: Removed the Docusaurus `editUrl` config that rendered a "Edit this page" link at the bottom of every doc page (below the "What's Next" card grid). The link pointed to `https://github.com/Prowl-qa/prowl-docs/tree/main/`. To re-enable, add `editUrl: 'https://github.com/Prowl-qa/prowl-docs/tree/main/'` back to `docs` preset options in `docusaurus.config.ts`. Consider re-adding once the repo is public and community contributions are welcome.

![Edit this page button position](research/edit-this-page-button.png)

