import type { ToolDefinition } from "../../../../sdk/types/index";

export { createDashboard, listDashboards, getDashboard, updateDashboard, deleteDashboard, saveDashboardLayout } from "./dashboards";
export { addWidget, updateWidget, removeWidget, listWidgets } from "./widgets";
export { defineMetric, listMetrics, snapshotMetrics, getMetricHistory } from "./metrics";

import { createDashboard, listDashboards, getDashboard, updateDashboard, deleteDashboard, saveDashboardLayout } from "./dashboards";
import { addWidget, updateWidget, removeWidget, listWidgets } from "./widgets";
import { defineMetric, listMetrics, snapshotMetrics, getMetricHistory } from "./metrics";

export const allAnalyticsTools: ToolDefinition[] = [
  // Dashboard tools
  createDashboard,
  listDashboards,
  getDashboard,
  updateDashboard,
  deleteDashboard,
  saveDashboardLayout,
  // Widget tools
  addWidget,
  updateWidget,
  removeWidget,
  listWidgets,
  // Metric tools
  defineMetric,
  listMetrics,
  snapshotMetrics,
  getMetricHistory,
];

export const ANALYTICS_TOOL_NAMES: string[] = allAnalyticsTools.map((t) => t.name);

export const allToolNames: string[] = ANALYTICS_TOOL_NAMES;
