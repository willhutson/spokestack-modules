/**
 * Timesheet Surface
 *
 * Metadata definition for the timesheet management page.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const timeLeaveTimesheetSurface: SurfaceDefinition = {
  id: "time-leave-timesheet",
  type: "full-page",
  route: "/time-leave/timesheet",
  requiredTools: ["logTime", "getTimesheetSummary", "approveTimeEntry"],
};
