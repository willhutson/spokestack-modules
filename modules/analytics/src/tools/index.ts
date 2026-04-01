import type { ToolDefinition } from "../../../../sdk/types/index";

export { createDashboard, listDashboards, getDashboard, updateDashboard, deleteDashboard, saveDashboardLayout } from "./dashboards";
export { addWidget, updateWidget, removeWidget, listWidgets } from "./widgets";
export { defineMetric, listMetrics, snapshotMetrics, getMetricHistory } from "./metrics";
export { createSnapshot, getSnapshotHistory, compareSnapshots } from "./snapshots";
export { createMetricDefinition, listMetricDefinitions, calculateMetric } from "./metric-definitions";

import { createDashboard, listDashboards, getDashboard, updateDashboard, deleteDashboard, saveDashboardLayout } from "./dashboards";
import { addWidget, updateWidget, removeWidget, listWidgets } from "./widgets";
import { defineMetric, listMetrics, snapshotMetrics, getMetricHistory } from "./metrics";
import { createSnapshot, getSnapshotHistory, compareSnapshots } from "./snapshots";
import { createMetricDefinition, listMetricDefinitions, calculateMetric } from "./metric-definitions";

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
  // Snapshots
  createSnapshot,
  getSnapshotHistory,
  compareSnapshots,
  // Metric Definitions
  createMetricDefinition,
  listMetricDefinitions,
  calculateMetric,
];

export const ANALYTICS_TOOL_NAMES: string[] = allAnalyticsTools.map((t) => t.name);

export const allToolNames: string[] = ANALYTICS_TOOL_NAMES;
