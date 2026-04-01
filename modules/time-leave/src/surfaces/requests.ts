/**
 * Leave Requests Surface
 *
 * Metadata definition for the leave requests management page.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const timeLeaveRequestsSurface: SurfaceDefinition = {
  id: "time-leave-requests",
  type: "full-page",
  route: "/time-leave/requests",
  requiredTools: ["requestLeave", "listLeaveRequests", "approveLeave"],
};
