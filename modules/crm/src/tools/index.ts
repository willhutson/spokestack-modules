/**
 * CRM Tools — barrel export (Phase 6B refactored)
 *
 * Removed: clients.ts (Client is now a core model; manageClients/trackClientActivity moved to core)
 * Removed: manageRetainerPeriods (moved to finance module)
 * Added: feedback.ts (handleComplaint moved here + listComplaints, getComplaintDetails)
 */

export { createContact, listContacts, updateContact } from "./contacts";
export { createDeal, updateDeal, listDeals, linkContactToDeal } from "./deals";
export { managePipeline, logInteraction, searchCRM, exportContacts } from "./pipeline";
export { manageDealContacts, manageDealProducts, trackDealCompetitors, getDealStageHistory } from "./enhanced-deals";
export { manageContactNotes, manageContactActivities, manageCRMTasks } from "./contacts-enhanced";
export { manageProducts, manageCompetitors, manageCRMCampaigns } from "./crm-catalog";
export { handleComplaint, listComplaints, getComplaintDetails } from "./feedback";

import { createContact, listContacts, updateContact } from "./contacts";
import { createDeal, updateDeal, listDeals, linkContactToDeal } from "./deals";
import { managePipeline, logInteraction, searchCRM, exportContacts } from "./pipeline";
import { manageDealContacts, manageDealProducts, trackDealCompetitors, getDealStageHistory } from "./enhanced-deals";
import { manageContactNotes, manageContactActivities, manageCRMTasks } from "./contacts-enhanced";
import { manageProducts, manageCompetitors, manageCRMCampaigns } from "./crm-catalog";
import { handleComplaint, listComplaints, getComplaintDetails } from "./feedback";
import type { ToolDefinition } from "../../../../sdk/types/index";

/** All CRM tools as an array for registration */
export const allCrmTools: ToolDefinition[] = [
  // Contacts
  createContact, listContacts, updateContact,
  // Deals
  createDeal, updateDeal, listDeals, linkContactToDeal,
  // Pipeline & search
  managePipeline, logInteraction, searchCRM, exportContacts,
  // Enhanced deals
  manageDealContacts, manageDealProducts, trackDealCompetitors, getDealStageHistory,
  // Enhanced contacts
  manageContactNotes, manageContactActivities, manageCRMTasks,
  // Catalog & campaigns (retainers moved to finance)
  manageProducts, manageCompetitors, manageCRMCampaigns,
  // Feedback (moved from clients.ts + new)
  handleComplaint, listComplaints, getComplaintDetails,
];

/** Tool names for manifest and agent definition reference */
export const CRM_TOOL_NAMES = allCrmTools.map((t) => t.name);

/** Alias for test compatibility */
export const allToolNames = CRM_TOOL_NAMES;
