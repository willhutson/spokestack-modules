/**
 * Media Buying — Tool Barrel Export
 *
 * Aggregates all tools from campaign, ad set, creative, and spend domain files.
 */

// Campaigns
export { createCampaign, listCampaigns, updateCampaign, getCampaignPerformance } from "./campaigns";

// Ad Sets
export { createAdSet, updateAdSet, pauseAdSet, getAdSetMetrics } from "./ad-sets";

// Creatives
export { uploadCreative, listCreatives, linkCreativeToAdSet } from "./creatives";

// Spend
export { trackSpend, getBudgetUtilization, getROAS, exportSpendReport } from "./spend";

// ---------------------------------------------------------------------------
// Aggregated imports for array + names
// ---------------------------------------------------------------------------

import { createCampaign, listCampaigns, updateCampaign, getCampaignPerformance } from "./campaigns";
import { createAdSet, updateAdSet, pauseAdSet, getAdSetMetrics } from "./ad-sets";
import { uploadCreative, listCreatives, linkCreativeToAdSet } from "./creatives";
import { trackSpend, getBudgetUtilization, getROAS, exportSpendReport } from "./spend";

import type { ToolDefinition } from "../../../../sdk/types/index";

export const allMediaBuyingTools: ToolDefinition[] = [
  // Campaigns
  createCampaign, listCampaigns, updateCampaign, getCampaignPerformance,
  // Ad Sets
  createAdSet, updateAdSet, pauseAdSet, getAdSetMetrics,
  // Creatives
  uploadCreative, listCreatives, linkCreativeToAdSet,
  // Spend
  trackSpend, getBudgetUtilization, getROAS, exportSpendReport,
];

export const MEDIA_BUYING_TOOL_NAMES = allMediaBuyingTools.map((t) => t.name);

export const allToolNames = MEDIA_BUYING_TOOL_NAMES;
