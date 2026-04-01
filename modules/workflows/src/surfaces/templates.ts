/**
 * Workflows Templates Surface
 *
 * Metadata definition for the workflow templates management page.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const workflowsTemplatesSurface: SurfaceDefinition = {
  id: "workflows-templates",
  type: "full-page",
  route: "/workflows/templates",
  requiredTools: ["createWorkflow", "listWorkflowTemplates", "publishWorkflow"],
};
