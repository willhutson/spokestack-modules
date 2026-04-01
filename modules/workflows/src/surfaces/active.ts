/**
 * Workflows Active Instances Surface
 *
 * Metadata definition for the active workflow instances page.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const workflowsActiveSurface: SurfaceDefinition = {
  id: "workflows-active",
  type: "full-page",
  route: "/workflows/active",
  requiredTools: ["listActiveWorkflows", "getWorkflowStatus"],
};
