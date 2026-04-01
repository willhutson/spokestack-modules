import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const analyticsMetricsSurface: SurfaceDefinition = {
  id: "analytics-metrics",
  type: "full-page",
  route: "/analytics/metrics",
  requiredTools: ["listMetrics", "defineMetric", "snapshotMetrics"],
};
