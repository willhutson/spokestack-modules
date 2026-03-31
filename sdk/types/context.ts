/**
 * Context integration types — how modules interact with
 * the shared ContextEntry graph in spokestack-core.
 *
 * ContextEntry is the universal context layer. Every agent reads
 * the full context graph. Modules write to it when creating/updating
 * entities, enabling cross-module intelligence without direct FKs.
 *
 * Real core schema fields:
 *   entryType: ContextType (ENTITY | PATTERN | PREFERENCE | MILESTONE | INSIGHT)
 *   category: string
 *   key: string (unique per [organizationId, category, key])
 *   value: Json
 *   confidence: float (0-1)
 *   sourceAgentType: AgentType? (ONBOARDING | TASKS | PROJECTS | BRIEFS | ORDERS | MODULE)
 */

/** Matches the ContextType enum from core */
export type ContextEntryType = "ENTITY" | "PATTERN" | "PREFERENCE" | "MILESTONE" | "INSIGHT";

/** Matches the AgentType enum from core */
export type AgentType = "ONBOARDING" | "TASKS" | "PROJECTS" | "BRIEFS" | "ORDERS" | "MODULE";

export interface ContextEntry {
  id: string;
  organizationId: string;
  /** Entry type from ContextType enum */
  entryType: ContextEntryType;
  /** Category grouping, e.g. "crm.contact", "crm.deal" */
  category: string;
  /** Unique key within category, e.g. contact ID or event key */
  key: string;
  /** Structured context data (Json field in Prisma) */
  value: Record<string, unknown>;
  /** Confidence score (0-1) for prioritization */
  confidence: number;
  /** Which agent type created this entry */
  sourceAgentType?: AgentType;
  /** ISO timestamp */
  createdAt: string;
  updatedAt: string;
  /** Optional expiry */
  expiresAt?: string;
}

export interface ContextQuery {
  organizationId: string;
  /** Filter by entry type */
  entryType?: ContextEntryType;
  /** Filter by category */
  category?: string;
  /** Filter by key */
  key?: string;
  /** Minimum confidence score */
  minConfidence?: number;
  /** Time range */
  since?: string;
  until?: string;
  /** Max results */
  limit?: number;
}

/**
 * MilestoneDefinition — declarative milestone that the core
 * milestone engine evaluates. NOT raw SQL.
 */
export interface MilestoneDefinition {
  /** Unique milestone ID within the module */
  id: string;
  /** Human-readable name */
  name: string;
  /** Description shown to user when triggered */
  message: string;
  /** The metric to evaluate */
  metric: MilestoneMetricDefinition;
  /** Threshold value that triggers the milestone */
  threshold: number;
  /** Priority level */
  priority: "low" | "medium" | "high" | "critical";
  /** Minimum days between re-triggers */
  cooldownDays: number;
  /** Optional: only evaluate for specific organization tiers */
  tierFilter?: ("FREE" | "STARTER" | "PRO" | "BUSINESS" | "ENTERPRISE")[];
}

export interface MilestoneMetricDefinition {
  /** Aggregation type */
  type: "count" | "sum" | "avg" | "min" | "max" | "distinct_count" | "time_since";
  /** Entity types to aggregate over (uses module's prefixed models) */
  entityTypes?: string[];
  /** Field to aggregate (for sum/avg/min/max) */
  field?: string;
  /** Specific keys/values to filter on */
  keys?: string[];
  /** Rolling time window */
  window?: {
    unit: "hours" | "days" | "weeks" | "months";
    value: number;
  };
}

/**
 * ContextWriter — helper interface for tools that need to
 * write context entries when creating/updating entities.
 */
export interface ContextWriter {
  write(entry: Omit<ContextEntry, "id" | "createdAt" | "updatedAt">): Promise<ContextEntry>;
  writeMany(entries: Omit<ContextEntry, "id" | "createdAt" | "updatedAt">[]): Promise<ContextEntry[]>;
}
