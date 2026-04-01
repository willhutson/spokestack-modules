/**
 * CRM Overview Surface
 *
 * Full-page surface for the CRM module landing page with stats and quick actions.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const crmOverviewSurface: SurfaceDefinition = {
  id: "crm-overview",
  type: "full-page",
  route: "/crm",
  requiredTools: ["listContacts", "listDeals"],
};
