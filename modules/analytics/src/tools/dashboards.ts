import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createDashboard
// ---------------------------------------------------------------------------
const createDashboardHandler: ToolHandler = async (params, _context) => {
  const id = `dash_${Date.now()}`;
  return {
    success: true,
    data: {
      id,
      name: params.name,
      type: params.type,
      description: params.description ?? null,
      isPublic: params.isPublic ?? false,
      ownerId: params.ownerId ?? _context.userId ?? null,
      defaultFilters: params.defaultFilters ?? {},
      layout: [],
      widgets: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
};

export const createDashboard: ToolDefinition = {
  name: "createDashboard",
  description: "Create a new analytics dashboard with a name, type, and optional default filters.",
  parameters: {
    type: "object",
    properties: {
      name: { type: "string", description: "Dashboard display name" },
      type: {
        type: "string",
        description: "Dashboard category",
        enum: ["OVERVIEW", "SALES", "MARKETING", "OPERATIONS", "FINANCIAL", "CUSTOM"],
      },
      description: { type: "string", description: "Optional dashboard description" },
      isPublic: { type: "boolean", description: "Whether the dashboard is visible to all org members" },
      ownerId: { type: "string", description: "Owner user ID (defaults to current user)" },
      defaultFilters: { type: "object", description: "Default filter key-value pairs applied to all widgets" },
    },
    required: ["name", "type"],
  },
  handler: createDashboardHandler,
};

// ---------------------------------------------------------------------------
// listDashboards
// ---------------------------------------------------------------------------
const listDashboardsHandler: ToolHandler = async (params, _context) => {
  const page = (params.page as number) ?? 1;
  const pageSize = (params.pageSize as number) ?? 20;
  return {
    success: true,
    data: {
      dashboards: [
        { id: "dash_001", name: "Overview", type: "OVERVIEW", isPublic: true, ownerId: "user_001", widgetCount: 4, createdAt: "2025-12-01T00:00:00Z" },
        { id: "dash_002", name: "Sales Pipeline", type: "SALES", isPublic: false, ownerId: "user_002", widgetCount: 6, createdAt: "2025-12-05T00:00:00Z" },
        { id: "dash_003", name: "Marketing Performance", type: "MARKETING", isPublic: true, ownerId: "user_001", widgetCount: 3, createdAt: "2025-12-10T00:00:00Z" },
      ],
      total: 3,
      page,
      pageSize,
    },
  };
};

export const listDashboards: ToolDefinition = {
  name: "listDashboards",
  description: "List analytics dashboards for the organization, optionally filtered by type, visibility, or owner.",
  parameters: {
    type: "object",
    properties: {
      type: {
        type: "string",
        description: "Filter by dashboard type",
        enum: ["OVERVIEW", "SALES", "MARKETING", "OPERATIONS", "FINANCIAL", "CUSTOM"],
      },
      isPublic: { type: "boolean", description: "Filter by public visibility" },
      ownerId: { type: "string", description: "Filter by owner user ID" },
      page: { type: "number", description: "Page number (1-based)", minimum: 1 },
      pageSize: { type: "number", description: "Results per page", minimum: 1, maximum: 100 },
    },
  },
  handler: listDashboardsHandler,
};

// ---------------------------------------------------------------------------
// getDashboard
// ---------------------------------------------------------------------------
const getDashboardHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.dashboardId,
      name: "Overview",
      type: "OVERVIEW",
      description: "High-level agency performance overview",
      isPublic: true,
      ownerId: "user_001",
      defaultFilters: { dateRange: "last_30d" },
      layout: [
        { widgetId: "wdg_001", x: 0, y: 0, w: 6, h: 4 },
        { widgetId: "wdg_002", x: 6, y: 0, w: 6, h: 4 },
      ],
      widgets: [
        { id: "wdg_001", name: "Revenue Trend", type: "CHART", chartType: "LINE", metric: "avg_deal_value", size: "medium" },
        { id: "wdg_002", name: "Client NPS", type: "METRIC", metric: "client_nps_score", size: "small" },
      ],
      createdAt: "2025-12-01T00:00:00Z",
      updatedAt: "2026-01-15T00:00:00Z",
    },
  };
};

export const getDashboard: ToolDefinition = {
  name: "getDashboard",
  description: "Get a single dashboard by ID, including all its widgets and layout.",
  parameters: {
    type: "object",
    properties: {
      dashboardId: { type: "string", description: "Dashboard ID to retrieve" },
    },
    required: ["dashboardId"],
  },
  handler: getDashboardHandler,
};

// ---------------------------------------------------------------------------
// updateDashboard
// ---------------------------------------------------------------------------
const updateDashboardHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.dashboardId,
      name: params.name ?? "Overview",
      description: params.description ?? null,
      layout: params.layout ?? [],
      defaultFilters: params.defaultFilters ?? {},
      isPublic: params.isPublic ?? true,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const updateDashboard: ToolDefinition = {
  name: "updateDashboard",
  description: "Update a dashboard's name, description, layout, default filters, or visibility.",
  parameters: {
    type: "object",
    properties: {
      dashboardId: { type: "string", description: "Dashboard ID to update" },
      name: { type: "string", description: "New dashboard name" },
      description: { type: "string", description: "New description" },
      layout: { type: "object", description: "Updated layout configuration" },
      defaultFilters: { type: "object", description: "Updated default filters" },
      isPublic: { type: "boolean", description: "Updated visibility" },
    },
    required: ["dashboardId"],
  },
  handler: updateDashboardHandler,
};

// ---------------------------------------------------------------------------
// deleteDashboard
// ---------------------------------------------------------------------------
const deleteDashboardHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.dashboardId,
      deleted: true,
    },
  };
};

export const deleteDashboard: ToolDefinition = {
  name: "deleteDashboard",
  description: "Soft-delete a dashboard by ID.",
  parameters: {
    type: "object",
    properties: {
      dashboardId: { type: "string", description: "Dashboard ID to delete" },
    },
    required: ["dashboardId"],
  },
  handler: deleteDashboardHandler,
};

// ---------------------------------------------------------------------------
// saveDashboardLayout
// ---------------------------------------------------------------------------
const saveDashboardLayoutHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: `layout_${Date.now()}`,
      userId: params.userId,
      name: params.name ?? "My Layout",
      layout: params.layout,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
};

export const saveDashboardLayout: ToolDefinition = {
  name: "saveDashboardLayout",
  description: "Save or update a personalized dashboard layout for a specific user.",
  parameters: {
    type: "object",
    properties: {
      userId: { type: "string", description: "User ID to save the layout for" },
      name: { type: "string", description: "Layout name" },
      layout: { type: "object", description: "Layout configuration with widget positions and sizes" },
    },
    required: ["userId", "layout"],
  },
  handler: saveDashboardLayoutHandler,
};
