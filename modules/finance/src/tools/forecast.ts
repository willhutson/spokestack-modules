/**
 * Finance Tools — Revenue Forecasting
 *
 * Tools for generating revenue forecasts, retrieving metrics, and scenario planning.
 * Handlers are stubs for Phase 2; real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// forecastRevenue
// ---------------------------------------------------------------------------

const forecastRevenueHandler: ToolHandler = async (_params, _context) => {
  return {
    success: true,
    data: {
      forecastPeriod: "Q2 2025",
      projectedRevenue: 180000,
      confidence: "HIGH",
      breakdown: {
        retainerRevenue: 120000,
        pipelineRevenue: 60000,
      },
      byMonth: [
        { month: "April 2025", projected: 58000 },
        { month: "May 2025", projected: 62000 },
        { month: "June 2025", projected: 60000 },
      ],
    },
  };
};

export const forecastRevenue: ToolDefinition = {
  name: "forecastRevenue",
  description:
    "Generate a revenue forecast for upcoming months based on retainers and pipeline",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      months: {
        type: "number",
        description: "Number of months to forecast (1-12)",
        minimum: 1,
        maximum: 12,
      },
      includeRetainers: {
        type: "string",
        description: "Whether to include retainer revenue in forecast (true/false)",
      },
      includePipeline: {
        type: "string",
        description: "Whether to include pipeline revenue in forecast (true/false)",
      },
    },
    required: ["orgId"],
  },
  handler: forecastRevenueHandler,
};

// ---------------------------------------------------------------------------
// getRevenueMetrics
// ---------------------------------------------------------------------------

const getRevenueMetricsHandler: ToolHandler = async (_params, _context) => {
  return {
    success: true,
    data: {
      totalRevenue: 145000,
      mrr: 48000,
      arr: 576000,
      churnRate: 0.03,
      avgDealSize: 12500,
      newRevenue: 25000,
      expansionRevenue: 8000,
    },
  };
};

export const getRevenueMetrics: ToolDefinition = {
  name: "getRevenueMetrics",
  description:
    "Get actual revenue metrics including MRR, ARR, churn rate, and deal size",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      startDate: {
        type: "string",
        description: "Start date for metrics period in ISO 8601 format",
      },
      endDate: {
        type: "string",
        description: "End date for metrics period in ISO 8601 format",
      },
    },
    required: ["orgId", "startDate", "endDate"],
  },
  handler: getRevenueMetricsHandler,
};

// ---------------------------------------------------------------------------
// listForecastScenarios
// ---------------------------------------------------------------------------

const listForecastScenariosHandler: ToolHandler = async (
  _params,
  _context,
) => {
  return {
    success: true,
    data: {
      conservative: {
        revenue: 150000,
        confidence: "HIGH",
        assumptions: "Current clients only, no new deals",
      },
      base: {
        revenue: 180000,
        confidence: "MEDIUM",
        assumptions: "Current pipeline at 50% close rate",
      },
      optimistic: {
        revenue: 220000,
        confidence: "LOW",
        assumptions: "Full pipeline close + expansion",
      },
    },
  };
};

export const listForecastScenarios: ToolDefinition = {
  name: "listForecastScenarios",
  description:
    "Get conservative, base, and optimistic revenue forecast scenarios",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      months: {
        type: "number",
        description: "Number of months to forecast (1-12)",
        minimum: 1,
        maximum: 12,
      },
    },
    required: ["orgId"],
  },
  handler: listForecastScenariosHandler,
};
