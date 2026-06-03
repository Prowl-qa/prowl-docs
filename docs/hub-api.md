---
sidebar_position: 11
slug: /hub-api
title: Hub API
---

# Hub API

The [Prowl Community Hub](https://hub.prowl.tools) has two interfaces: a website for humans and a REST API for agents. The website lets you browse, preview, and copy templates. The API lets agents do the same thing programmatically — search for relevant templates, fetch hunt content, and pipe it directly into their workflow without manual intervention.

**Base URL:** `https://hub.prowl.tools`

## Agent Discovery

Agents can discover the Hub API through two machine-readable entry points:

| Resource | URL | Purpose |
|----------|-----|---------|
| `llms.txt` | [`/llms.txt`](https://hub.prowl.tools/llms.txt) | Plain-text overview of the API for LLM agents — describes available endpoints and how to use them |
| OpenAPI Spec | [`/api/openapi.json`](https://hub.prowl.tools/api/openapi.json) | Full OpenAPI 3.0.3 specification with request/response schemas for tool-use integrations |

If your agent supports tool discovery via OpenAPI, point it at `/api/openapi.json`. For agents that consume plain-text context, `/llms.txt` provides a concise summary they can reason over.

## Endpoints

### `GET /api/hunts`

Returns the full catalog of published hunts with their content included.

```bash
curl https://hub.prowl.tools/api/hunts
```

**Response:** `200 OK` — Array of [`HuntRecord`](#huntrecord) objects.

---

### `GET /api/hunts/search`

Search and filter hunts by keyword, category, or tags.

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | `string` | Free-text search across hunt names, descriptions, and content |
| `category` | `string` | Filter by category (e.g., `auth`, `e-commerce`, `onboarding`) |
| `tags` | `string` | Comma-separated tag filter (e.g., `login,critical`) |
| `limit` | `number` | Max results to return (default: `20`) |
| `offset` | `number` | Pagination offset (default: `0`) |

```bash
# Search for login-related templates
curl "https://hub.prowl.tools/api/hunts/search?q=login&category=auth&limit=5"
```

**Response:** `200 OK` — Array of [`HuntSummary`](#huntsummary) objects.

---

### `GET /api/hunts/{id}`

Fetch a single hunt by its ID, including the full YAML content.

```bash
curl https://hub.prowl.tools/api/hunts/login-flow
```

**Response:** `200 OK` — A single [`HuntRecord`](#huntrecord) object.

**Error:** `404 Not Found` if the hunt ID doesn't exist.

---

### `GET /api/hunts/file`

Download the raw YAML file for a hunt template.

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | **Required.** File path of the hunt (from the `filePath` field in hunt records) |
| `preview` | `1` | Optional. Skip download tracking (useful for previewing content) |

```bash
# Download the raw YAML
curl "https://hub.prowl.tools/api/hunts/file?path=hunts/auth/login-flow.yaml"

# Preview without tracking
curl "https://hub.prowl.tools/api/hunts/file?path=hunts/auth/login-flow.yaml&preview=1"
```

**Response:** `200 OK` — Raw YAML content (`text/yaml`).

---

### `GET /api/openapi.json`

Returns the full OpenAPI 3.0.3 specification for the Hub API.

```bash
curl https://hub.prowl.tools/api/openapi.json
```

**Response:** `200 OK` — OpenAPI JSON document.

## Response Schemas

### `HuntSummary`

Returned by search results and list endpoints.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique hunt identifier (e.g., `login-flow`) |
| `name` | `string` | Display name |
| `description` | `string` | Short description of what the hunt tests |
| `category` | `string` | Category grouping (e.g., `auth`, `e-commerce`) |
| `tags` | `string[]` | Tags for filtering and discovery |
| `filePath` | `string` | Path used with `/api/hunts/file` |
| `downloads` | `number` | Total download count |

### `HuntRecord`

Full hunt object returned by `/api/hunts` and `/api/hunts/{id}`. Includes all `HuntSummary` fields plus:

| Field | Type | Description |
|-------|------|-------------|
| `content` | `string` | Full YAML content of the hunt template |
| `steps` | `number` | Number of steps in the hunt |
| `variables` | `string[]` | List of `{{VAR}}` placeholders used in the template |
| `contributor` | `string` | Author or contributor name |
| `createdAt` | `string` | ISO 8601 timestamp |
| `updatedAt` | `string` | ISO 8601 timestamp |

## Rate Limits

All endpoints are rate-limited per IP address. Limits reset on a rolling 60-second window.

| Endpoint | Limit |
|----------|-------|
| `GET /api/hunts` | 30 req / 60s |
| `GET /api/hunts/search` | 60 req / 60s |
| `GET /api/hunts/{id}` | 60 req / 60s |
| `GET /api/hunts/file` | 30 req / 60s |
| `GET /api/openapi.json` | 30 req / 60s |

**Rate limit headers** are included in every response:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Max requests allowed in the window |
| `X-RateLimit-Remaining` | Requests remaining in the current window |
| `X-RateLimit-Reset` | Unix timestamp when the window resets |

When the limit is exceeded, the API returns `429 Too Many Requests` with a `Retry-After` header indicating how many seconds to wait.

## Agent Workflow Example

Here's a realistic pipeline showing how an agent discovers, fetches, and runs a hub template:

### Step 1: Search for a relevant template

The agent knows it needs to test a login flow. It searches the hub:

```bash
curl "https://hub.prowl.tools/api/hunts/search?q=login&category=auth&limit=3"
```

```json
[
  {
    "id": "login-flow",
    "name": "Login Flow",
    "description": "Email/password login with error handling",
    "category": "auth",
    "tags": ["login", "critical"],
    "filePath": "hunts/auth/login-flow.yaml",
    "downloads": 142
  }
]
```

The agent picks the best match based on the description and tags.

### Step 2: Fetch the full template

```bash
curl "https://hub.prowl.tools/api/hunts/file?path=hunts/auth/login-flow.yaml"
```

```yaml
name: login-flow
description: Email/password login with error handling
baseUrl: "{{BASE_URL}}"
steps:
  - navigate: "{{BASE_URL}}/login"
  - fill:
      selector: "[name='email']"
      value: "{{EMAIL}}"
  - fill:
      selector: "[name='password']"
      value: "{{PASSWORD}}"
  - click: "button[type='submit']"
  - wait: "Welcome"
```

### Step 3: Save to the local hunts directory

The agent writes the YAML to `.prowl/hunts/login-flow.yaml` in the project.

### Step 4: Run the hunt

```bash
BASE_URL=https://staging.example.com \
EMAIL=test@example.com \
PASSWORD=$TEST_PASSWORD \
prowl run login-flow --json
```

The agent reads the JSON output, checks the exit code, and reports the result — all without a human ever opening the hub website.

:::tip
Agents that support OpenAPI tool-use can import `/api/openapi.json` directly and call these endpoints as native tools — no custom integration code needed.
:::

<div class="card-grid">
  <a class="card" href="/agents">
    <h3>Prowl for Agents</h3>
    <p>CLI integration, library API, and agent workflow patterns</p>
  </a>
  <a class="card" href="https://hub.prowl.tools" target="_blank">
    <h3>Community Hub</h3>
    <p>Browse and download pre-built hunt templates</p>
  </a>
  <a class="card" href="/variables">
    <h3>Variables</h3>
    <p>Interpolation, precedence, and redaction</p>
  </a>
</div>
