/**
 * Time & Leave Home Surface
 *
 * Metadata definition — tells spokestack-core's dashboard renderer
 * where to load the Time & Leave overview.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const timeLeaveHomeSurface: SurfaceDefinition = {
  id: "time-leave-home",
  type: "full-page",
  route: "/time-leave",
  requiredTools: ["listTimeEntries", "listLeaveRequests"],
};
