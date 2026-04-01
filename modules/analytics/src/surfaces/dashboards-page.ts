import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const analyticsDashboardsSurface: SurfaceDefinition = {
  id: "analytics-dashboards",
  type: "full-page",
  route: "/analytics/dashboards",
  requiredTools: ["listDashboards", "getDashboard", "createDashboard"],
};
