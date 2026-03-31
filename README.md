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

- **Prisma is the context layer.** One database (39 models + 27 enums). Every agent reads the full context graph.
- **Modules are the interface layer.** Agent tools, UI surfaces, marketplace listings — NOT data boundaries.
- **Agents bridge them.** Module agent definitions are authored here but EXECUTED by ongoing-agent-builder.
- **ContextEntry is the glue.** Cross-module intelligence flows through ContextEntry, not direct foreign keys.

### Core Schema (39 Models)

The core schema is organized into 7 sections:

| Section | Models | Description |
|---------|--------|-------------|
| Foundation (7) | Organization, User, Team, TeamMember, OrgSettings, OrgModule, FeatureFlag | Multi-tenant hierarchy and module activation |
| Billing (4) | BillingAccount, BillingTier, BillingMeterEvent, BillingInvoice | Stripe-backed tiered billing (FREE/STARTER/PRO/BUSINESS/ENTERPRISE) |
| Tasks (4) | TaskList, Task, TaskComment, TaskAttachment | Task management with comments and file attachments |
| Projects (6) | Project, ProjectPhase, ProjectMilestone, WfCanvas, WfCanvasNode, WfCanvasEdge | Project workflows with visual canvas builder |
| Briefs (4) | Brief, BriefPhase, Artifact, ArtifactReview | Creative briefs with versioned artifacts and review workflows |
| Orders (5) | Customer, Order, OrderItem, Invoice, InvoiceItem | Commerce with customers, orders, and invoicing |
| Agent (4) | AgentSession, AgentMessage, ContextEntry, ContextMilestone | Agent intelligence and the shared context graph |
| Infrastructure (5) | Integration, Notification, NotificationPreference, FileAsset, FileVersion | Integrations, notifications, and file storage |

Plus **27 enums** including `BillingTierType`, `ModuleType`, `ContextType`, `AgentType`, `TaskStatus`, `ProjectStatus`, `BriefStatus`, `OrderStatus`, and more.

### ContextEntry — The Shared Context Graph

ContextEntry is the moat. Every agent reads and writes to it. The real schema:

```
entryType:       ContextType (ENTITY | PATTERN | PREFERENCE | MILESTONE | INSIGHT)
category:        String      — grouping key, e.g. "crm.contact", "crm.deal"
key:             String      — unique within [organizationId, category, key]
value:           Json        — structured context data
confidence:      Float       — 0-1 relevance score
sourceAgentType: AgentType?  — ONBOARDING | TASKS | PROJECTS | BRIEFS | ORDERS | MODULE
```

Modules write to ContextEntry when creating or updating entities. Other agents (and other modules) read these entries to build cross-domain intelligence.

### Module Agent Execution

Module agents are defined in this repo as JSON-serializable `ModuleAgent` interfaces. At install time, the marketplace installer:
1. Creates an `OrgModule` record in core (using the `ModuleType` enum)
2. Registers the agent with agent-builder via the multi-tenant API
3. Agent tools execute through agent-builder's CoreToolkit (direct Prisma calls to spokestack-core's Supabase)

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
│   ├── schema.prisma             # 39 models + 27 enums (synced from spokestack-core)
│   ├── version.json              # Core version + schema hash + counts
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
    ├── installer.ts              # Async installation flow (writes to OrgModule)
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
6. **Use `@default(cuid())`** for IDs (matching core convention)

### ContextEntry Writes

When your tools create or update entities, write to ContextEntry using the real core fields:

```typescript
await prisma.contextEntry.create({
  data: {
    organizationId,
    entryType: "ENTITY",              // ENTITY | PATTERN | PREFERENCE | MILESTONE | INSIGHT
    category: "mymodule.thing",       // dot-separated namespace
    key: entity.id,                   // unique within [orgId, category]
    value: { event: "created", ... }, // structured Json
    confidence: 0.8,                  // 0-1
    sourceAgentType: "MODULE",        // always MODULE for marketplace modules
  },
});
```

### Tiers

Manifests declare required tiers using the `BillingTierType` enum from core:

| Tier | Value |
|------|-------|
| Free | `FREE` |
| Starter ($29/mo) | `STARTER` |
| Pro ($59/mo) | `PRO` |
| Business ($149/mo) | `BUSINESS` |
| Enterprise | `ENTERPRISE` |

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
- Tier values match `BillingTierType` enum (`FREE`/`STARTER`/`PRO`/`BUSINESS`/`ENTERPRISE`)
- All schema models prefixed and following rules
- Agent definition is JSON-serializable
- ContextEntry writes use real fields (`entryType`, `category`, `key`, `value`, `confidence`, `sourceAgentType`)
- At least basic test coverage
- Install/uninstall migrations working
- README.md with documentation

### Installation Flow

When a user installs your module from the marketplace:

1. **Synchronous**: Validate manifest, check conflicts, create `OrgModule` record (the core model for module tracking), activate Stripe billing
2. **Async (queued)**: Apply pre-built migration SQL, run `install.ts` seed, register agent with agent-builder, register surfaces, register milestones, activate `OrgModule`, agent announces

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

| Module | Status | Tier | Description |
|--------|--------|------|-------------|
| CRM | Reference | PRO | Contact management, deal pipelines, interaction tracking |
| Social Publisher | Stub | PRO | Social media scheduling and publishing |
| Analytics | Stub | PRO | Business analytics and KPI tracking |
| NPS Surveys | Stub | STARTER | Net Promoter Score and feedback |
| Social Listening | Stub | PRO | Brand monitoring and sentiment |
| Media Buying | Stub | BUSINESS | Ad campaign management |
| LMS | Stub | PRO | Learning management system |
| Video Pipeline | Stub | BUSINESS | Video processing and streaming |
