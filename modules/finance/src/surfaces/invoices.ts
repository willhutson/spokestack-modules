/**
 * Finance Invoices Surface
 *
 * Metadata definition — tells spokestack-core's dashboard renderer
 * where to load the invoices management page.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const financeInvoicesSurface: SurfaceDefinition = {
  id: "finance-invoices",
  type: "full-page",
  route: "/finance/invoices",
  requiredTools: ["createInvoice", "listInvoices", "getInvoice"],
};
