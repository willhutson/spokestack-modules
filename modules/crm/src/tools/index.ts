/**
 * CRM Tools — barrel export
 *
 * All CRM tools conforming to the SDK ToolDefinition type.
 * Tool handlers are stubs for Phase 2; real data layer is Phase 3.
 */

export { createContact, listContacts, updateContact } from "./contacts";
export { createDeal, updateDeal, listDeals, linkContactToDeal } from "./deals";

import { createContact, listContacts, updateContact } from "./contacts";
import { createDeal, updateDeal, listDeals, linkContactToDeal } from "./deals";
import type { ToolDefinition } from "../../../../sdk/types/index";

/** All CRM tools as an array for registration */
export const allCrmTools: ToolDefinition[] = [
  createContact,
  listContacts,
  updateContact,
  createDeal,
  updateDeal,
  listDeals,
  linkContactToDeal,
];

/** Tool names for manifest and agent definition reference */
export const CRM_TOOL_NAMES = allCrmTools.map((t) => t.name);
