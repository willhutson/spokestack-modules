import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const portalUsersSurface: SurfaceDefinition = {
  id: "portal-users",
  type: "full-page",
  route: "/portal/users",
  requiredTools: ["createPortalUser", "listPortalUsers", "deactivatePortalUser"],
};
