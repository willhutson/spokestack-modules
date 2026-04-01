/**
 * Campaign Tools (Phase 6C)
 *
 * Ad campaign management for the media buying module.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createCampaign
// ---------------------------------------------------------------------------

export const createCampaign: ToolDefinition = {
  name: "createCampaign",
  description: "Create a new ad campaign with budget and targeting settings",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Client ID" },
      name: { type: "string", description: "Campaign name" },
      objective: { type: "string", description: "Campaign objective", enum: ["AWARENESS", "TRAFFIC", "ENGAGEMENT", "LEADS", "CONVERSIONS", "SALES"] },
      platform: { type: "string", description: "Ad platform", enum: ["META", "GOOGLE", "TIKTOK", "LINKEDIN", "TWITTER", "PROGRAMMATIC"] },
      budget: { type: "number", description: "Total campaign budget in cents" },
      startDate: { type: "string", description: "Campaign start date" },
      endDate: { type: "string", description: "Campaign end date" },
    },
    required: ["orgId", "name", "objective", "platform", "budget"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `camp_${Date.now()}`,
        organizationId: params.orgId,
        clientId: params.clientId || null,
        name: params.name,
        objective: params.objective,
        platform: params.platform,
        budget: params.budget,
        spent: 0,
        startDate: params.startDate || null,
        endDate: params.endDate || null,
        status: "DRAFT",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// listCampaigns
// ---------------------------------------------------------------------------

export const listCampaigns: ToolDefinition = {
  name: "listCampaigns",
  description: "List ad campaigns with optional filters",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Filter by client" },
      platform: { type: "string", description: "Filter by platform" },
      status: { type: "string", description: "Filter by status", enum: ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"] },
    },
    required: ["orgId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: [
        { id: "camp_001", name: "Summer Sale - Meta", platform: "META", objective: "CONVERSIONS", budget: 5000000, spent: 3245000, status: "ACTIVE", roas: 3.2 },
        { id: "camp_002", name: "Brand Awareness - Google", platform: "GOOGLE", objective: "AWARENESS", budget: 3000000, spent: 1890000, status: "ACTIVE", roas: 1.8 },
        { id: "camp_003", name: "Lead Gen - LinkedIn", platform: "LINKEDIN", objective: "LEADS", budget: 2000000, spent: 2000000, status: "COMPLETED", roas: 4.1 },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// updateCampaign
// ---------------------------------------------------------------------------

export const updateCampaign: ToolDefinition = {
  name: "updateCampaign",
  description: "Update campaign settings, budget, or status",
  parameters: {
    type: "object",
    properties: {
      campaignId: { type: "string", description: "Campaign ID" },
      name: { type: "string", description: "Updated name" },
      budget: { type: "number", description: "Updated budget" },
      status: { type: "string", description: "Updated status", enum: ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"] },
      endDate: { type: "string", description: "Updated end date" },
    },
    required: ["campaignId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: params.campaignId,
        ...params,
        updatedAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// getCampaignPerformance
// ---------------------------------------------------------------------------

export const getCampaignPerformance: ToolDefinition = {
  name: "getCampaignPerformance",
  description: "Get performance metrics for a campaign including impressions, clicks, and conversions",
  parameters: {
    type: "object",
    properties: {
      campaignId: { type: "string", description: "Campaign ID" },
      startDate: { type: "string", description: "Metrics start date" },
      endDate: { type: "string", description: "Metrics end date" },
      granularity: { type: "string", description: "Time granularity", enum: ["HOURLY", "DAILY", "WEEKLY", "MONTHLY"] },
    },
    required: ["campaignId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        campaignId: params.campaignId,
        campaignName: "Summer Sale - Meta",
        period: { start: params.startDate || "2025-07-01", end: params.endDate || "2025-07-21" },
        metrics: {
          impressions: 1245000,
          clicks: 34500,
          ctr: 2.77,
          conversions: 890,
          conversionRate: 2.58,
          spend: 3245000,
          revenue: 10384000,
          roas: 3.2,
          cpc: 94,
          cpm: 2606,
          costPerConversion: 3646,
        },
        daily: [
          { date: "2025-07-20", impressions: 62500, clicks: 1725, conversions: 44, spend: 162250 },
          { date: "2025-07-21", impressions: 58900, clicks: 1630, conversions: 41, spend: 153100 },
        ],
      },
    };
  },
};
