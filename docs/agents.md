---
sidebar_position: 10
slug: /agents
title: ProwlQA for Agents
---

# ProwlQA for Agents

Prowl QA is CLI-first and agent-native by design. One CLI command replaces ten tool calls. Structured JSON output, deterministic exit codes, and a fraction of the tokens — everything an AI agent needs to discover, run, and report on browser tests without wrangling automation APIs directly.

**Made for agents, controlled by humans.** You write the hunts, review the results, and set the guardrails. Agents handle the execution loop — discovering what to test, running the hunts, and reporting structured results back to your workflow.

Jump to the [Library API](#library-api-nodejs) for programmatic Node.js integration or [Using Hub Templates](#using-hub-templates) for pre-built community hunt templates.

## Why CLI-First, Not MCP

Most agent-tool integrations use MCP or similar RPC protocols that inject tool schemas into every conversation. Prowl QA takes a different approach: a plain CLI that agents call like any other shell command.

### Zero Context Tax

- **No tool manifest.** MCP injects its full schema into every conversation turn; the Prowl QA CLI is invisible until called.
- **Declarative, not imperative.** A 10-step hunt is a single `prowlqa run` call — not 10+ individual tool invocations the agent has to reason through.
- **Pay-per-use.** Zero tokens when idle. MCP manifests cost ~2-3k tokens just to sit in context.

### Token Efficiency Comparison

| | Prowl QA CLI | MCP-Based Tool |
|---|---|---|
| Discovery | `prowlqa list --json` ~150 tokens | Tool manifest + list call ~2,500 tokens |
| 10-step test | `prowlqa run <hunt> --json` ~800-1,200 tokens | 10+ individual tool calls ~15,000-20,000 tokens |
| Result parsing | Exit code check — 0 tokens | Parse nested responses ~500-1,000 tokens |
| Idle cost | 0 tokens | ~2,000-3,000 tokens (manifest always loaded) |
| **Total per cycle** | **~1,250 tokens** | **~18,000-23,000 tokens** |

That's a 10-15x difference per test cycle, compounding across every conversation.

### Exit Codes Enable Branching

Agents don't need to parse response bodies to decide what to do next. A zero exit code means pass, non-zero means fail — standard shell semantics that every agent framework already understands.

```bash
prowlqa ci --json && echo "All hunts passed" || echo "Failures detected"
```

:::tip
Prowl QA is agent-ready out of the box. No MCP server, no tool manifest, no per-step reasoning. Install, run, parse.
:::

## Agent Workflow: Discover, Run, Report

Every agent integration follows the same three-step pattern — each step is a single CLI call with structured output:

### 1. Discover

List available hunts and their metadata:

```bash
prowlqa list --json
```

```json
[
  { "name": "smoke-test", "description": "Validates homepage loads", "tags": ["smoke"] },
  { "name": "login-flow", "description": "Email/password login", "tags": ["auth", "critical"] },
  { "name": "checkout-flow", "description": "E-commerce checkout", "tags": ["e2e"] }
]
```

Agents can filter by tags to select the right hunts for the context (e.g., run only `smoke` hunts on every PR, run `e2e` hunts nightly).

### 2. Run

Execute a single hunt or all hunts:

```bash
# Single hunt
prowlqa run smoke-test --json

# All hunts (CI mode)
prowlqa ci --json
```

### 3. Report

Parse the structured JSON output and check exit codes:

| Exit Code | Meaning |
|-----------|---------|
| `0` | All hunts passed |
| `1` | One or more hunts failed |
| `2` | No hunts found or all skipped |

## CLI Integration (`--json` flags)

### `prowlqa run <hunt> --json`

Returns a single hunt result:

```json
{
  "status": "pass",
  "hunt": "smoke-test",
  "durationMs": 220,
  "steps": [
    { "type": "navigate", "target": "/", "status": "pass", "durationMs": 120 },
    { "type": "wait", "target": "Welcome", "status": "pass", "durationMs": 85 },
    { "type": "assert", "target": "visible:Sign In", "status": "pass", "durationMs": 15 }
  ],
  "assertions": {
    "noConsoleErrors": "pass",
    "noNetworkErrors": "pass",
    "maxTotalTimeMs": "pass"
  }
}
```

### `prowlqa ci --json`

Returns a combined result for all hunts:

```json
{
  "status": "fail",
  "totalHunts": 3,
  "passed": 2,
  "failed": 1,
  "skipped": 0,
  "hunts": [
    { "name": "smoke-test", "status": "pass", "durationMs": 220 },
    { "name": "login-flow", "status": "pass", "durationMs": 1450 },
    { "name": "checkout-flow", "status": "fail", "durationMs": 3200, "error": "Assertion failed: visible \"Order Confirmed\"" }
  ]
}
```

### JUnit XML

For CI systems that consume JUnit XML (GitHub Actions, GitLab CI, Jenkins, CircleCI), pass `--junit`:

```bash
prowlqa ci --junit
```

The report is written to the artifacts directory as `junit.xml`.

## Library API (Node.js)

For deeper integration, import Prowl QA as a library:

```typescript
import { runHunt, loadConfig, listHunts, loadHunt } from "prowlqa";
```

### Core Functions

| Function | Description |
|----------|-------------|
| `runHunt(options)` | Run a hunt programmatically and get a typed `RunResult` |
| `loadConfig()` | Load and validate `.prowlqa/config.yml` |
| `loadHunt(name)` | Load and parse a single hunt file |
| `listHunts()` | List all available hunts with metadata |

### Schemas

Prowl QA exports Zod schemas for validation:

```typescript
import { huntSchema, configSchema, stepSchema } from "prowlqa";

// Validate a hunt file an agent generated
const result = huntSchema.safeParse(agentGeneratedHunt);
if (!result.success) {
  console.error(result.error.issues);
}
```

### Variable Interpolation

```typescript
import { interpolateHunt } from "prowlqa";

const hunt = await loadHunt("login-flow");
const interpolated = interpolateHunt(hunt, {
  EMAIL: "test@example.com",
  PASSWORD: process.env.TEST_PASSWORD,
});
```

## Using Hub Templates

The [Prowl QA Community Hub](https://github.com/Prowl-qa/prowl-hub) is a collection of pre-built hunt templates — common patterns like login flows, CRUD cycles, checkout funnels, and onboarding wizards. Agents can discover templates, pull them into a project, customize variables, and execute — all through the CLI or library API.

:::note
The `prowlqa hub` CLI is coming in a future release. In the meantime, browse and download templates directly from the [Prowl QA Community Hub](https://github.com/Prowl-qa/prowl-hub).
:::

### Discover Templates

Search and list available templates:

```bash
# List all templates
prowlqa hub list --json

# Search by keyword
prowlqa hub search "auth" --json
```

```json
[
  { "name": "login-flow", "description": "Email/password login with error handling", "tags": ["auth", "critical"] },
  { "name": "oauth-google", "description": "Google OAuth sign-in flow", "tags": ["auth", "oauth"] },
  { "name": "password-reset", "description": "Forgot password and reset flow", "tags": ["auth", "email"] }
]
```

### Pull and Customize

Pull a template into your project and customize it with variables:

```bash
prowlqa hub pull login-flow
```

This creates a hunt file with `{{VAR}}` placeholders ready for customization:

```yaml
name: login-flow
description: Email/password login with error handling
baseUrl: "{{BASE_URL}}"
steps:
  - navigate: "{{BASE_URL}}/login"
  - fill: "[name='email']"
    value: "{{EMAIL}}"
  - fill: "[name='password']"
    value: "{{PASSWORD}}"
  - click: "button[type='submit']"
  - wait: "Welcome"
```

Variables are resolved from your config, environment, or CLI flags. See [Variables](/variables) for interpolation precedence.

### Execute and Report

Run the customized template like any other hunt:

```bash
prowlqa run login-flow --json
```

The output format is identical to any other hunt run — see [CLI Integration](#cli-integration---json-flags) for the full JSON schema.

### Library API for Templates

Use the library API to pull, customize, and run templates programmatically:

```typescript
import { loadHunt, interpolateHunt, runHunt } from "prowlqa";

// Load the template
const hunt = await loadHunt("login-flow");

// Customize variables
const customized = interpolateHunt(hunt, {
  BASE_URL: "https://staging.example.com",
  EMAIL: "test@example.com",
  PASSWORD: process.env.TEST_PASSWORD,
});

// Execute and get structured results
const result = await runHunt({ hunt: customized, json: true });

if (result.status === "pass") {
  console.log(`Login flow passed in ${result.durationMs}ms`);
} else {
  console.error("Login flow failed:", result.steps.filter(s => s.status === "fail"));
}
```

:::note
Browse all templates and contribute your own at the [Prowl QA Community Hub](https://github.com/Prowl-qa/prowl-hub).
:::

<div className="card-grid">
  <a className="card" href="https://github.com/Prowl-qa/prowl-hub" target="_blank">
    <h3>Community Hub</h3>
    <p>Pre-built hunt templates for common test patterns</p>
  </a>
  <a className="card" href="/configuration">
    <h3>Configuration</h3>
    <p>Browser settings, timeouts, guardrails, and artifacts</p>
  </a>
  <a className="card" href="/step-types">
    <h3>Step Types</h3>
    <p>All 19 step types available in hunts</p>
  </a>
  <a className="card" href="/troubleshooting">
    <h3>Troubleshooting</h3>
    <p>CLI reference, artifacts, and common issues</p>
  </a>
</div>
