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

## Low Priority

*No active items.*
