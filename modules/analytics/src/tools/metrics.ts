import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// defineMetric
// ---------------------------------------------------------------------------
const defineMetricHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: `metric_${Date.now()}`,
      code: params.code,
      name: params.name,
      description: params.description ?? null,
      category: params.category,
      formula: params.formula,
      aggregation: params.aggregation,
      format: params.format ?? "number",
      decimals: params.decimals ?? 2,
      prefix: params.prefix ?? null,
      suffix: params.suffix ?? null,
      higherIsBetter: params.higherIsBetter ?? true,
      isActive: true,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
};

export const defineMetric: ToolDefinition = {
  name: "defineMetric",
  description: "Create a metric definition with a formula, aggregation method, display format, and optional thresholds.",
  parameters: {
    type: "object",
    properties: {
      code: { type: "string", description: "Unique metric code (snake_case)" },
      name: { type: "string", description: "Human-readable metric name" },
      description: { type: "string", description: "Optional description of what this metric measures" },
      category: {
        type: "string",
        description: "Metric category",
        enum: ["REVENUE", "ENGAGEMENT", "PERFORMANCE", "SATISFACTION", "OPERATIONAL"],
      },
      formula: { type: "string", description: "Calculation formula, e.g. 'sum(revenue) / count(deals)'" },
      aggregation: { type: "string", description: "Aggregation method, e.g. 'sum', 'average', 'percentage', 'count', 'score'" },
      format: { type: "string", description: "Display format: 'number', 'currency', 'percentage'" },
      decimals: { type: "number", description: "Decimal places to display", minimum: 0, maximum: 6 },
      prefix: { type: "string", description: "Value prefix, e.g. '$'" },
      suffix: { type: "string", description: "Value suffix, e.g. '%'" },
      higherIsBetter: { type: "boolean", description: "Whether a higher value is positive (for trend arrows)" },
    },
    required: ["code", "name", "category", "formula", "aggregation"],
  },
  handler: defineMetricHandler,
};

// ---------------------------------------------------------------------------
// listMetrics
// ---------------------------------------------------------------------------
const listMetricsHandler: ToolHandler = async (params, _context) => {
  const page = (params.page as number) ?? 1;
  const pageSize = (params.pageSize as number) ?? 20;
  return {
    success: true,
    data: {
      metrics: [
        { id: "metric_001", code: "brief_completion_rate", name: "Brief Completion Rate", category: "PERFORMANCE", formula: "completed_briefs / total_briefs * 100", aggregation: "percentage", format: "percentage", decimals: 1, suffix: "%", higherIsBetter: true, isActive: true, isSystem: true },
        { id: "metric_002", code: "avg_deal_value", name: "Average Deal Value", category: "REVENUE", formula: "sum(deal_value) / count(deals)", aggregation: "average", format: "currency", decimals: 2, prefix: "$", higherIsBetter: true, isActive: true, isSystem: true },
        { id: "metric_003", code: "client_nps_score", name: "Client NPS Score", category: "SATISFACTION", formula: "promoters_pct - detractors_pct", aggregation: "score", format: "number", decimals: 0, higherIsBetter: true, isActive: true, isSystem: true },
      ],
      total: 3,
      page,
      pageSize,
    },
  };
};

export const listMetrics: ToolDefinition = {
  name: "listMetrics",
  description: "List metric definitions, optionally filtered by category or active status.",
  parameters: {
    type: "object",
    properties: {
      category: {
        type: "string",
        description: "Filter by metric category",
        enum: ["REVENUE", "ENGAGEMENT", "PERFORMANCE", "SATISFACTION", "OPERATIONAL"],
      },
      isActive: { type: "boolean", description: "Filter by active status" },
      isSystem: { type: "boolean", description: "Filter by system-defined metrics" },
      page: { type: "number", description: "Page number (1-based)", minimum: 1 },
      pageSize: { type: "number", description: "Results per page", minimum: 1, maximum: 100 },
    },
  },
  handler: listMetricsHandler,
};

// ---------------------------------------------------------------------------
// snapshotMetrics
// ---------------------------------------------------------------------------
const snapshotMetricsHandler: ToolHandler = async (params, _context) => {
  const codes = params.codes as string[];
  return {
    success: true,
    data: codes.map((code) => {
      const mockValues: Record<string, { name: string; value: number; previousValue: number }> = {
        brief_completion_rate: { name: "Brief Completion Rate", value: 87.3, previousValue: 82.1 },
        avg_deal_value: { name: "Average Deal Value", value: 24500.0, previousValue: 22800.0 },
        client_nps_score: { name: "Client NPS Score", value: 72, previousValue: 68 },
      };
      const mock = mockValues[code] ?? { name: code, value: 50.0, previousValue: 48.0 };
      const changePercent = ((mock.value - mock.previousValue) / mock.previousValue) * 100;
      return {
        code,
        name: mock.name,
        value: mock.value,
        previousValue: mock.previousValue,
        changePercent: Math.round(changePercent * 100) / 100,
      };
    }),
  };
};

export const snapshotMetrics: ToolDefinition = {
  name: "snapshotMetrics",
  description: "Get current metric values for a list of metric codes within a date range, including period-over-period change.",
  parameters: {
    type: "object",
    properties: {
      codes: {
        type: "array",
        description: "Array of metric codes to snapshot",
        items: { type: "string" },
      },
      startDate: { type: "string", description: "Start date (ISO 8601)" },
      endDate: { type: "string", description: "End date (ISO 8601)" },
    },
    required: ["codes", "startDate", "endDate"],
  },
  handler: snapshotMetricsHandler,
};

// ---------------------------------------------------------------------------
// getMetricHistory
// ---------------------------------------------------------------------------
const getMetricHistoryHandler: ToolHandler = async (params, _context) => {
  const period = params.period as string;
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const dataPoints: { date: string; value: number }[] = [];
  const baseDate = new Date("2026-03-01");
  const baseValue = 75;

  for (let i = 0; i < days; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    dataPoints.push({
      date: d.toISOString().split("T")[0],
      value: Math.round((baseValue + Math.random() * 20 - 5) * 100) / 100,
    });
  }

  return {
    success: true,
    data: {
      code: params.code,
      period,
      dataPoints,
    },
  };
};

export const getMetricHistory: ToolDefinition = {
  name: "getMetricHistory",
  description: "Get time-series data for a metric code over a 7-day, 30-day, or 90-day period.",
  parameters: {
    type: "object",
    properties: {
      code: { type: "string", description: "Metric code to retrieve history for" },
      period: {
        type: "string",
        description: "Time period for the history data",
        enum: ["7d", "30d", "90d"],
      },
    },
    required: ["code", "period"],
  },
  handler: getMetricHistoryHandler,
};
