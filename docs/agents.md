---
sidebar_position: 7
slug: /agents
title: ProwlQA for Agents
---

# ProwlQA for Agents

Prowl QA is agent-native by design. Hunts are deterministic YAML files that any AI agent can discover, run, and parse without wrangling browser automation APIs directly.

**Made for agents, controlled by humans.** You write the hunts, review the results, and set the guardrails. Agents handle the execution loop — discovering what to test, running the hunts, and reporting structured results back to your workflow.

## Agent Workflow: Discover, Run, Report

Every agent integration follows the same three-step pattern:

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

## Community Hub

The [Prowl QA Community Hub](https://github.com/Prowl-qa/prowl-hub) provides pre-built hunt templates that agents can pull from — common patterns like login flows, CRUD cycles, checkout funnels, and onboarding wizards. Fork a template, customize the selectors for your app, and run.

<div className="card-grid">
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
