/**
 * Finance Home Surface
 *
 * Metadata definition — tells spokestack-core's dashboard renderer
 * where to load the finance overview widget.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const financeHomeSurface: SurfaceDefinition = {
  id: "finance-home",
  type: "full-page",
  route: "/finance",
  requiredTools: ["getFinancialSummary", "getBudgetSummary"],
};
