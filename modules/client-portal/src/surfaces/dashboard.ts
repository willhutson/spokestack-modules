import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const portalOverviewSurface: SurfaceDefinition = {
  id: "portal-overview",
  type: "full-page",
  route: "/portal/overview",
  requiredTools: ["listPortalUsers", "listBriefRequests"],
};
