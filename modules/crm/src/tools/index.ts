/**
 * CRM Tools — barrel export
 *
 * All CRM tools conforming to the SDK ToolDefinition type.
 * Tool handlers are stubs for Phase 2; real data layer is Phase 3.
 */

export { createContact, listContacts, updateContact } from "./contacts";
export { createDeal, updateDeal, listDeals, linkContactToDeal } from "./deals";
export { manageClients, trackClientActivity, handleComplaint } from "./clients";
export { managePipeline, logInteraction, searchCRM, exportContacts } from "./pipeline";
export { manageDealContacts, manageDealProducts, trackDealCompetitors, getDealStageHistory } from "./enhanced-deals";
export { manageContactNotes, manageContactActivities, manageCRMTasks } from "./contacts-enhanced";
export { manageProducts, manageCompetitors, manageCRMCampaigns, manageRetainerPeriods } from "./crm-catalog";

import { createContact, listContacts, updateContact } from "./contacts";
import { createDeal, updateDeal, listDeals, linkContactToDeal } from "./deals";
import { manageClients, trackClientActivity, handleComplaint } from "./clients";
import { managePipeline, logInteraction, searchCRM, exportContacts } from "./pipeline";
import { manageDealContacts, manageDealProducts, trackDealCompetitors, getDealStageHistory } from "./enhanced-deals";
import { manageContactNotes, manageContactActivities, manageCRMTasks } from "./contacts-enhanced";
import { manageProducts, manageCompetitors, manageCRMCampaigns, manageRetainerPeriods } from "./crm-catalog";
import type { ToolDefinition } from "../../../../sdk/types/index";

/** All CRM tools as an array for registration */
export const allCrmTools: ToolDefinition[] = [
  // Phase 1 — contacts & deals
  createContact,
  listContacts,
  updateContact,
  createDeal,
  updateDeal,
  listDeals,
  linkContactToDeal,
  // Phase 2 — clients
  manageClients,
  trackClientActivity,
  handleComplaint,
  // Phase 2 — pipeline & search
  managePipeline,
  logInteraction,
  searchCRM,
  exportContacts,
  // Phase 2 — enhanced deals
  manageDealContacts,
  manageDealProducts,
  trackDealCompetitors,
  getDealStageHistory,
  // Phase 2 — enhanced contacts
  manageContactNotes,
  manageContactActivities,
  manageCRMTasks,
  // Phase 2 — catalog & campaigns
  manageProducts,
  manageCompetitors,
  manageCRMCampaigns,
  manageRetainerPeriods,
];

/** Tool names for manifest and agent definition reference */
export const CRM_TOOL_NAMES = allCrmTools.map((t) => t.name);

/** Alias for test compatibility */
export const allToolNames = CRM_TOOL_NAMES;
