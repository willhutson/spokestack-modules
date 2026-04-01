/**
 * Metric Definition Tools (Phase 6C)
 *
 * Custom metric definition and calculation.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createMetricDefinition
// ---------------------------------------------------------------------------

export const createMetricDefinition: ToolDefinition = {
  name: "createMetricDefinition",
  description: "Create a custom metric definition with formula and data source",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Metric name" },
      description: { type: "string", description: "What this metric measures" },
      formula: { type: "string", description: "Calculation formula (e.g., 'revenue / active_users')" },
      unit: { type: "string", description: "Unit of measurement", enum: ["count", "currency", "percent", "duration", "ratio"] },
      dataSource: { type: "string", description: "Data source module", enum: ["finance", "crm", "social-publishing", "analytics", "time-leave"] },
      aggregation: { type: "string", description: "Aggregation method", enum: ["SUM", "AVG", "MIN", "MAX", "COUNT", "LAST"] },
    },
    required: ["orgId", "name", "formula", "unit"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `mdef_${Date.now()}`,
        organizationId: params.orgId,
        name: params.name,
        description: params.description || null,
        formula: params.formula,
        unit: params.unit,
        dataSource: params.dataSource || "analytics",
        aggregation: params.aggregation || "SUM",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// listMetricDefinitions
// ---------------------------------------------------------------------------

export const listMetricDefinitions: ToolDefinition = {
  name: "listMetricDefinitions",
  description: "List custom metric definitions for an organization",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      dataSource: { type: "string", description: "Filter by data source" },
      unit: { type: "string", description: "Filter by unit type" },
    },
    required: ["orgId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: [
        { id: "mdef_001", name: "Revenue Per Client", formula: "total_revenue / active_clients", unit: "currency", dataSource: "finance", status: "ACTIVE" },
        { id: "mdef_002", name: "Engagement Rate", formula: "(likes + comments + shares) / impressions * 100", unit: "percent", dataSource: "social-publishing", status: "ACTIVE" },
        { id: "mdef_003", name: "Team Utilization", formula: "billable_hours / total_hours * 100", unit: "percent", dataSource: "time-leave", status: "ACTIVE" },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// calculateMetric
// ---------------------------------------------------------------------------

export const calculateMetric: ToolDefinition = {
  name: "calculateMetric",
  description: "Calculate the current value of a custom metric definition",
  parameters: {
    type: "object",
    properties: {
      metricDefinitionId: { type: "string", description: "Metric definition ID" },
      startDate: { type: "string", description: "Calculation period start" },
      endDate: { type: "string", description: "Calculation period end" },
      filters: { type: "object", description: "Additional filters (e.g., clientId, teamId)" },
    },
    required: ["metricDefinitionId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        metricDefinitionId: params.metricDefinitionId,
        name: "Revenue Per Client",
        value: 18750,
        unit: "currency",
        periodStart: params.startDate || "2025-07-01T00:00:00Z",
        periodEnd: params.endDate || "2025-07-31T23:59:59Z",
        dataPoints: 45,
        calculatedAt: new Date().toISOString(),
      },
    };
  },
};
