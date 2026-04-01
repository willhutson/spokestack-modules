import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// addWidget
// ---------------------------------------------------------------------------
const addWidgetHandler: ToolHandler = async (params, _context) => {
  const id = `wdg_${Date.now()}`;
  return {
    success: true,
    data: {
      id,
      dashboardId: params.dashboardId,
      name: params.name,
      type: params.type,
      chartType: params.chartType ?? null,
      size: params.size ?? "medium",
      position: params.position ?? { x: 0, y: 0, w: 6, h: 4 },
      metric: params.metric,
      dimensions: params.dimensions ?? [],
      filters: params.filters ?? {},
      timeRange: params.timeRange ?? "last_30d",
      refreshInterval: params.refreshInterval ?? 300,
      thresholds: params.thresholds ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
};

export const addWidget: ToolDefinition = {
  name: "addWidget",
  description: "Add a widget to a dashboard with chart type, metric, dimensions, and filters.",
  parameters: {
    type: "object",
    properties: {
      dashboardId: { type: "string", description: "Dashboard to add the widget to" },
      name: { type: "string", description: "Widget display name" },
      type: {
        type: "string",
        description: "Widget type",
        enum: ["METRIC", "CHART", "TABLE", "LIST", "SUMMARY"],
      },
      chartType: {
        type: "string",
        description: "Chart visualization type (required when type is CHART)",
        enum: ["LINE", "BAR", "PIE", "DONUT", "AREA", "SCATTER"],
      },
      size: {
        type: "string",
        description: "Widget size on the dashboard grid",
        enum: ["small", "medium", "large"],
      },
      position: { type: "object", description: "Grid position { x, y, w, h }" },
      metric: { type: "string", description: "Metric code this widget displays" },
      dimensions: {
        type: "array",
        description: "Dimension fields to group by",
        items: { type: "string" },
      },
      filters: { type: "object", description: "Widget-level filter overrides" },
      timeRange: { type: "string", description: "Time range for the widget data" },
      refreshInterval: { type: "number", description: "Auto-refresh interval in seconds", minimum: 30 },
      thresholds: { type: "object", description: "Threshold configuration for alerts or color coding" },
    },
    required: ["dashboardId", "name", "type", "metric"],
  },
  handler: addWidgetHandler,
};

// ---------------------------------------------------------------------------
// updateWidget
// ---------------------------------------------------------------------------
const updateWidgetHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.widgetId,
      name: params.name ?? "Updated Widget",
      type: params.type ?? "CHART",
      chartType: params.chartType ?? "LINE",
      size: params.size ?? "medium",
      position: params.position ?? { x: 0, y: 0, w: 6, h: 4 },
      metric: params.metric ?? "avg_deal_value",
      dimensions: params.dimensions ?? [],
      filters: params.filters ?? {},
      timeRange: params.timeRange ?? "last_30d",
      refreshInterval: params.refreshInterval ?? 300,
      thresholds: params.thresholds ?? null,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const updateWidget: ToolDefinition = {
  name: "updateWidget",
  description: "Update any field of a widget by its widget ID.",
  parameters: {
    type: "object",
    properties: {
      widgetId: { type: "string", description: "Widget ID to update" },
      name: { type: "string", description: "New widget name" },
      type: {
        type: "string",
        description: "New widget type",
        enum: ["METRIC", "CHART", "TABLE", "LIST", "SUMMARY"],
      },
      chartType: {
        type: "string",
        description: "New chart type",
        enum: ["LINE", "BAR", "PIE", "DONUT", "AREA", "SCATTER"],
      },
      size: {
        type: "string",
        description: "New widget size",
        enum: ["small", "medium", "large"],
      },
      position: { type: "object", description: "New grid position { x, y, w, h }" },
      metric: { type: "string", description: "New metric code" },
      dimensions: {
        type: "array",
        description: "New dimension fields",
        items: { type: "string" },
      },
      filters: { type: "object", description: "New filter overrides" },
      timeRange: { type: "string", description: "New time range" },
      refreshInterval: { type: "number", description: "New refresh interval in seconds", minimum: 30 },
      thresholds: { type: "object", description: "New threshold configuration" },
    },
    required: ["widgetId"],
  },
  handler: updateWidgetHandler,
};

// ---------------------------------------------------------------------------
// removeWidget
// ---------------------------------------------------------------------------
const removeWidgetHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.widgetId,
      removed: true,
    },
  };
};

export const removeWidget: ToolDefinition = {
  name: "removeWidget",
  description: "Remove a widget from a dashboard by its widget ID.",
  parameters: {
    type: "object",
    properties: {
      widgetId: { type: "string", description: "Widget ID to remove" },
    },
    required: ["widgetId"],
  },
  handler: removeWidgetHandler,
};

// ---------------------------------------------------------------------------
// listWidgets
// ---------------------------------------------------------------------------
const listWidgetsHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      widgets: [
        { id: "wdg_001", dashboardId: params.dashboardId, name: "Revenue Trend", type: "CHART", chartType: "LINE", metric: "avg_deal_value", size: "medium" },
        { id: "wdg_002", dashboardId: params.dashboardId, name: "Client NPS", type: "METRIC", chartType: null, metric: "client_nps_score", size: "small" },
        { id: "wdg_003", dashboardId: params.dashboardId, name: "Brief Completion", type: "CHART", chartType: "BAR", metric: "brief_completion_rate", size: "large" },
      ],
    },
  };
};

export const listWidgets: ToolDefinition = {
  name: "listWidgets",
  description: "List all widgets for a given dashboard.",
  parameters: {
    type: "object",
    properties: {
      dashboardId: { type: "string", description: "Dashboard ID to list widgets for" },
    },
    required: ["dashboardId"],
  },
  handler: listWidgetsHandler,
};
