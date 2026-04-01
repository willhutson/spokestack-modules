/**
 * CRM Contacts Surface
 *
 * Full-page surface for contact list and management.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const crmContactsSurface: SurfaceDefinition = {
  id: "crm-contacts",
  type: "full-page",
  route: "/crm/contacts",
  requiredTools: ["listContacts", "createContact", "updateContact"],
};
