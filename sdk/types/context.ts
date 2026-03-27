/**
 * Context integration types — how modules interact with
 * the shared ContextEntry graph in spokestack-core.
 *
 * ContextEntry is the universal context layer. Every agent reads
 * the full context graph. Modules write to it when creating/updating
 * entities, enabling cross-module intelligence without direct FKs.
 */

export interface ContextEntry {
  id: string;
  organizationId: string;
  /** Source module identifier, e.g. "crm", "analytics" */
  source: string;
  /** Entry type key, e.g. "crm.contact.created" */
  type: string;
  /** The entity this context relates to */
  entityType: string;
  entityId: string;
  /** Structured context data */
  data: Record<string, unknown>;
  /** Relevance score (0-1) for prioritization */
  relevance: number;
  /** ISO timestamp */
  createdAt: string;
  /** Optional expiry */
  expiresAt?: string;
}

export interface ContextQuery {
  organizationId: string;
  /** Filter by source module */
  source?: string;
  /** Filter by entry type */
  type?: string;
  /** Filter by entity */
  entityType?: string;
  entityId?: string;
  /** Minimum relevance score */
  minRelevance?: number;
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
  tierFilter?: string[];
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
  write(entry: Omit<ContextEntry, "id" | "createdAt">): Promise<ContextEntry>;
  writeMany(entries: Omit<ContextEntry, "id" | "createdAt">[]): Promise<ContextEntry[]>;
}
