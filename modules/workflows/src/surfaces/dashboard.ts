/**
 * Workflows Home Surface
 *
 * Metadata definition — tells spokestack-core's dashboard renderer
 * where to load the workflows home page.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const workflowsHomeSurface: SurfaceDefinition = {
  id: "workflows-home",
  type: "full-page",
  route: "/workflows",
  requiredTools: ["listWorkflowTemplates", "listActiveWorkflows"],
};
