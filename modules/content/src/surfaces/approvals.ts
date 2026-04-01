/**
 * Content Studio Approvals Surface
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const contentApprovalsSurface: SurfaceDefinition = {
  id: "content-approvals",
  type: "full-page",
  route: "/content/approvals",
  requiredTools: ["listPendingReviews", "reviewContent"],
};
