/**
 * ModuleManifest — the complete declaration of a SpokeStack module.
 * Lives as manifest.json in every module root.
 */

export interface ModuleManifest {
  /** Package name, e.g. "@spokestack/crm" */
  name: string;
  /** Human-readable name for marketplace listing */
  displayName: string;
  /** Short description (max 280 chars) */
  description: string;
  /** Semver version */
  version: string;
  /** Author / publisher info */
  author: ModuleAuthor;
  /** Core compatibility requirements */
  compatibility: ModuleCompatibility;
  /** Required SpokeStack tier */
  tier: ModuleTier;
  /** Pricing model for marketplace billing */
  pricing: ModulePricing;
  /** Database schema additions */
  schema: ModuleSchema;
  /** Agent definition reference */
  agent: ModuleAgentRef;
  /** UI surface registrations */
  surfaces: ModuleSurfaces;
  /** Milestone definitions for proactive agent behavior */
  milestones: MilestoneRef[];
  /** Core model read/write permissions */
  permissions: ModulePermissions;
  /** Module names this conflicts with (cannot co-install) */
  conflicts: string[];
  /** Module names this enhances (optional cross-module integration) */
  enhances: string[];
}

export interface ModuleAuthor {
  name: string;
  email?: string;
  url?: string;
}

export interface ModuleCompatibility {
  /** Minimum spokestack-core version required */
  coreVersion: string;
  /** SHA256 hash of core schema this was built against */
  schemaHash: string;
}

export interface ModuleTier {
  /** Minimum tier required to install */
  minimum: "starter" | "growth" | "scale" | "enterprise";
  /** Recommended tier for full functionality */
  recommended: "starter" | "growth" | "scale" | "enterprise";
}

export interface ModulePricing {
  model: "free" | "flat" | "metered" | "tiered";
  /** Price in smallest currency unit (cents) */
  price: number;
  currency: string;
  /** Free trial period in days */
  trialDays: number;
}

export interface ModuleSchema {
  /** Prisma model definitions this module adds */
  models: string[];
  /** Table prefix, e.g. "crm_" */
  prefix: string;
  /** Other module schemas this depends on */
  dependsOn: string[];
}

export interface ModuleAgentRef {
  /** Agent name as registered with agent-builder */
  name: string;
  /** Agent personality description */
  personality: string;
  /** Tool function names the agent can invoke */
  tools: string[];
  /** Context types this agent contributes to the shared graph */
  contextContributions: string[];
}

export interface ModuleSurfaces {
  /** Dashboard widget registrations */
  dashboard: DashboardWidget[];
  /** Full page registrations */
  pages: PageRegistration[];
  /** Agent card definitions */
  agentCards: AgentCard[];
}

export interface DashboardWidget {
  id: string;
  title: string;
  component: string;
  defaultSize: "small" | "medium" | "large";
  refreshInterval?: number;
}

export interface PageRegistration {
  path: string;
  title: string;
  component: string;
  icon?: string;
  navSection?: string;
}

export interface AgentCard {
  id: string;
  title: string;
  trigger: string;
  component: string;
}

export interface MilestoneRef {
  id: string;
  metric: MilestoneMetric;
  threshold: number;
  message: string;
  priority: "low" | "medium" | "high" | "critical";
  cooldownDays: number;
}

export interface MilestoneMetric {
  type: "count" | "sum" | "avg" | "min" | "max" | "distinct_count" | "time_since";
  entityTypes?: string[];
  field?: string;
  keys?: string[];
  window?: MilestoneWindow;
}

export interface MilestoneWindow {
  unit: "hours" | "days" | "weeks" | "months";
  value: number;
}

export interface ModulePermissions {
  /** Core models this module can read */
  coreRead: string[];
  /** Core models this module can write */
  coreWrite: string[];
  /** Whether the module can manage its own prefixed models */
  ownModels: boolean;
}
