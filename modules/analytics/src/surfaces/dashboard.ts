import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const analyticsHomeSurface: SurfaceDefinition = {
  id: "analytics-home",
  type: "full-page",
  route: "/analytics",
  requiredTools: ["listDashboards", "listMetrics"],
};
