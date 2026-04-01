/**
 * CRM Dashboard Surface
 *
 * Metadata definition — tells spokestack-core's dashboard renderer
 * where to load the CRM pipeline overview widget.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const crmDashboardSurface: SurfaceDefinition = {
  id: "crm-dashboard",
  type: "dashboard",
  requiredTools: ["listDeals", "listContacts"],
};
