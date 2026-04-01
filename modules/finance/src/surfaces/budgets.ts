/**
 * Finance Budgets Surface
 *
 * Metadata definition — tells spokestack-core's dashboard renderer
 * where to load the budget management page.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const financeBudgetsSurface: SurfaceDefinition = {
  id: "finance-budgets",
  type: "full-page",
  route: "/finance/budgets",
  requiredTools: ["setBudget", "listBudgets", "getBudgetSummary"],
};
