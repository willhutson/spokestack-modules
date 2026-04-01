import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const portalRequestsSurface: SurfaceDefinition = {
  id: "portal-requests",
  type: "full-page",
  route: "/portal/requests",
  requiredTools: ["listBriefRequests", "reviewBriefRequest", "convertBriefRequest"],
};
