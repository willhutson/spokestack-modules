/**
 * CRM Deals Surface
 *
 * Full-page surface for pipeline board and deal management.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const crmDealsSurface: SurfaceDefinition = {
  id: "crm-deals",
  type: "full-page",
  route: "/crm/deals",
  requiredTools: ["listDeals", "createDeal", "updateDeal", "linkContactToDeal"],
};
