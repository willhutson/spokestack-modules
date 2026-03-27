# SpokeStack Modules

> The module SDK and marketplace for SpokeStack — an agent-native business infrastructure platform.

## Architecture

SpokeStack is composed of four repositories:

| Repo | Role | Runtime |
|------|------|---------|
| **spokestack-core** | Product shell — dashboard, API, CLI, billing | Vercel |
| **ongoing-agent-builder** | Agent runtime — all agent intelligence | Railway |
| **agentvbx** | Delivery layer — WhatsApp, desktop, mobile | Railway |
| **spokestack-modules** (this repo) | Module ecosystem — SDK, marketplace, modules | — |

### Key Principles

- **Prisma is the context layer.** One database. Every agent reads the full context graph.
- **Modules are the interface layer.** Agent tools, UI surfaces, marketplace listings — NOT data boundaries.
- **Agents bridge them.** Module agent definitions are authored here but EXECUTED by ongoing-agent-builder.
- **ContextEntry is the glue.** Cross-module intelligence flows through ContextEntry, not direct foreign keys.

### Module Agent Execution

Module agents are defined in this repo as JSON-serializable `ModuleAgent` interfaces. At install time, they're registered with agent-builder via `POST /agents/register`. Agent tools execute through agent-builder's CoreToolkit (direct Prisma calls to spokestack-core's Supabase).

## Repository Structure

```
spokestack-modules/
├── sdk/                          # Module SDK
│   ├── types/                    # TypeScript type definitions
│   │   ├── manifest.ts           # ModuleManifest type
│   │   ├── agent.ts              # ModuleAgent interface (JSON-serializable)
│   │   ├── surface.ts            # Surface registration types
│   │   └── context.ts            # ContextEntry + MilestoneDefinition types
│   ├── create-module/            # npx create-spokestack-module scaffolder
│   ├── testing/                  # Mock core + test runner
│   │   ├── mock-core.ts          # In-memory Prisma mock (all 39 core models)
│   │   ├── test-runner.ts        # Module test harness
│   │   └── fixtures/             # Shared test fixtures
│   └── cli/                      # CLI tools
│       ├── validate.ts           # Module validation
│       ├── test.ts               # Test runner
│       ├── package.ts            # Package for publishing
│       └── publish.ts            # Publish to marketplace
│
├── core-schema/                  # Read-only mirror of core's Prisma schema
│   ├── schema.prisma             # 39 core models
│   ├── version.json              # Core version + schema hash
│   └── SYNC.md                   # Sync process documentation
│
├── modules/                      # Module implementations
│   ├── crm/                      # CRM (full reference implementation)
│   ├── social-publisher/         # Social media publishing (stub)
│   ├── analytics/                # Business analytics (stub)
│   ├── nps-surveys/              # NPS surveys (stub)
│   ├── social-listening/         # Social monitoring (stub)
│   ├── media-buying/             # Ad campaign management (stub)
│   ├── lms/                      # Learning management (stub)
│   └── video-pipeline/           # Video processing (stub)
│
└── marketplace/                  # Marketplace infrastructure
    ├── registry.ts               # Module registry + discovery
    ├── installer.ts              # Async installation flow
    ├── validator.ts              # Pre-install validation
    ├── billing.ts                # Per-module Stripe metered billing
    └── composer.ts               # Schema composition at publish time
```

## Developer Guide

### Creating a New Module

```bash
# Scaffold a new module
npx create-spokestack-module my-module
npx create-spokestack-module my-module --template full

# Or manually create in modules/
mkdir -p modules/my-module/{prisma,agent,surfaces/pages,migrations,tests}
```

### Module Structure

Every module must include:

| File | Purpose |
|------|---------|
| `manifest.json` | Complete module declaration (name, schema, agent, surfaces, pricing) |
| `prisma/schema.prisma` | Module-specific Prisma models (all prefixed) |
| `agent/definition.ts` | Agent definition (system prompt, tools, intents) |
| `agent/tools.ts` | Tool implementations (each writes to ContextEntry) |
| `surfaces/registry.ts` | Dashboard widgets and page registrations |
| `migrations/install.ts` | Seed defaults, create initial ContextEntry records |
| `migrations/uninstall.ts` | Soft-delete records, deregister agent |

### Schema Rules

1. **All models must be prefixed** with your module prefix (e.g., `crm_Contact`)
2. **`organizationId` is the ONLY FK** into core models
3. **Cross-model links** go through `ContextEntry`, not direct FKs
4. **`deletedAt` on every model** for soft deletes
5. **No modifications** to core models

### Agent Definition

Agent definitions must be JSON-serializable (no functions, no class instances):

```typescript
import type { ModuleAgent } from "@spokestack/module-sdk";

export const myAgent: ModuleAgent = {
  name: "my-module-agent",
  slug: "my-module-agent",
  intentPatterns: ["(?i)(my|module)\\b"],
  systemPrompt: "You are the my-module assistant...",
  tools: [/* AgentToolDefinition[] */],
  contextContributions: [/* ContextContribution[] */],
};
```

### Testing

```bash
# Run module tests
cd modules/my-module
pnpm test

# Validate module structure
pnpm sdk validate ./modules/my-module
```

The SDK provides a mock Prisma client (`createMockPrismaClient`) with in-memory stores for all 39 core models plus any module-specific models. Tests run without a real database.

### Publishing

```bash
# Validate
pnpm sdk validate ./modules/my-module

# Package
pnpm sdk package ./modules/my-module

# Publish to marketplace
pnpm sdk publish ./modules/my-module
```

## Marketplace Submission

### Requirements

- Valid `manifest.json` with all required fields
- All schema models prefixed and following rules
- Agent definition is JSON-serializable
- At least basic test coverage
- Install/uninstall migrations working
- README.md with documentation

### Installation Flow

When a user installs your module from the marketplace:

1. **Synchronous**: Validate manifest, check conflicts, create `ModuleInstallation` record (status: `provisioning`), activate Stripe billing
2. **Async (queued)**: Apply pre-built migration, run `install.ts` seed, register agent with agent-builder, register surfaces, register milestones, update status to `active`, agent announces

### Pricing Models

| Model | Description |
|-------|-------------|
| `free` | No charge |
| `flat` | Fixed monthly price |
| `metered` | Per-unit usage billing |
| `tiered` | Volume-based pricing tiers |

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test

# Validate all modules
pnpm validate
```

## Available Modules

| Module | Status | Description |
|--------|--------|-------------|
| CRM | Reference | Contact management, deal pipelines, interaction tracking |
| Social Publisher | Stub | Social media scheduling and publishing |
| Analytics | Stub | Business analytics and KPI tracking |
| NPS Surveys | Stub | Net Promoter Score and feedback |
| Social Listening | Stub | Brand monitoring and sentiment |
| Media Buying | Stub | Ad campaign management |
| LMS | Stub | Learning management system |
| Video Pipeline | Stub | Video processing and streaming |
