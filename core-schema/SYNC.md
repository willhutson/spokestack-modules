# Core Schema Sync Process

This directory contains a **read-only mirror** of the Prisma schema from `spokestack-core`.

## Current State

- **39 models** organized into 7 sections (Foundation, Billing, Tasks, Projects, Briefs, Orders, Agent, Infrastructure)
- **27 enums** (BillingTierType, ModuleType, ContextType, AgentType, TaskStatus, etc.)
- **IDs use `@default(cuid())`** — not uuid
- **No `@@map()` directives** — Prisma defaults for table names
- **ContextEntry** uses `@@unique([organizationId, category, key])` constraint

## Why a Mirror?

Modules need to reference core models during development (for type generation, mock testing, and schema composition at publish time) without depending on a live core database.

## Sync Process

1. **Automated**: CI runs nightly to diff `spokestack-core/prisma/schema.prisma` against this mirror
2. **On change**: A PR is opened bumping `version.json` with new `coreVersion` and `schemaHash`
3. **Module authors**: Run `pnpm sdk validate` to check if their module is compatible with the latest core schema
4. **Schema hash**: SHA-256 of the normalized schema content, used by modules to declare compatibility

## Manual Sync

```bash
# From repo root
curl -s https://raw.githubusercontent.com/willhutson/spokestack-core/main/prisma/schema.prisma \
  > core-schema/schema.prisma

# Regenerate hash
sha256sum core-schema/schema.prisma | awk '{print $1}' > /tmp/hash
node -e "
  const v = require('./core-schema/version.json');
  const fs = require('fs');
  v.schemaHash = 'sha256:' + fs.readFileSync('/tmp/hash', 'utf8').trim();
  fs.writeFileSync('./core-schema/version.json', JSON.stringify(v, null, 2));
"
```

## Key Models for Module Authors

| Model | Why It Matters |
|-------|----------------|
| `Organization` | Every module record has `organizationId` — this is the ONLY FK into core |
| `OrgModule` | Core tracks installed modules here (with `ModuleType` enum). The marketplace installer writes to this. |
| `ContextEntry` | The shared context graph. Modules write here when creating/updating entities. Fields: `entryType`, `category`, `key`, `value`, `confidence`, `sourceAgentType` |
| `ContextMilestone` | Marketplace flywheel triggers. Core evaluates these to recommend module installations. |
| `BillingAccount` | Has `tier` field (`BillingTierType` enum) — used for module tier gating |
| `Notification` | Requires `userId`, `type` (NotificationType enum), `channel` (NotificationChannel enum) |

## ContextEntry Field Reference

```
entryType:       ContextType enum — ENTITY | PATTERN | PREFERENCE | MILESTONE | INSIGHT
category:        String           — dot-separated namespace, e.g. "crm.contact"
key:             String           — unique per [organizationId, category, key]
value:           Json             — structured data payload
confidence:      Float            — 0 to 1 relevance score
sourceAgentType: AgentType enum?  — ONBOARDING | TASKS | PROJECTS | BRIEFS | ORDERS | MODULE
```

## Rules

- **Never edit `schema.prisma` directly** — always sync from core
- Module schemas must not redefine or modify core models
- Module schemas connect to core **only** via `organizationId` FK
- Cross-model references go through `ContextEntry`, not direct FKs
- Use `@default(cuid())` for IDs to match core convention
