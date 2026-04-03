/**
 * Influencer Management Tools — all tool definitions
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

export const addInfluencer: ToolDefinition = {
  name: "addInfluencer",
  description: "Add an influencer to the database with platform, followers, and rate card.",
  parameters: {
    type: "object" as const,
    properties: {
      name: { type: "string", description: "Influencer's full name" },
      handle: { type: "string", description: "Social media handle" },
      platform: { type: "string", description: "Primary platform", enum: ["instagram", "tiktok", "youtube", "twitter", "snapchat", "linkedin"] },
      followers: { type: "number", description: "Follower count" },
      engagementRate: { type: "number", description: "Engagement rate as percentage (e.g. 3.5)" },
      niche: { type: "string", description: "Content niche (e.g. fashion, food, tech, travel)" },
      location: { type: "string", description: "Influencer location" },
      rateCard: { type: "number", description: "Rate per post in AED" },
    },
    required: ["name", "handle", "platform", "followers", "engagementRate", "niche", "location"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `inf_${Date.now()}`,
        name: params.name,
        handle: params.handle,
        platform: params.platform,
        followers: params.followers,
        engagementRate: params.engagementRate,
        niche: params.niche,
        location: params.location,
        rateCard: params.rateCard || null,
        tier: params.followers > 500000 ? "macro" : params.followers > 50000 ? "mid" : params.followers > 10000 ? "micro" : "nano",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const searchInfluencers: ToolDefinition = {
  name: "searchInfluencers",
  description: "Search influencers by platform, niche, location, and follower count.",
  parameters: {
    type: "object" as const,
    properties: {
      platform: { type: "string", description: "Filter by platform" },
      niche: { type: "string", description: "Filter by niche" },
      location: { type: "string", description: "Filter by location" },
      minFollowers: { type: "number", description: "Minimum follower count" },
      maxRateCard: { type: "number", description: "Maximum rate card in AED" },
    },
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        influencers: [
          { id: "inf_001", name: "Huda Al-Rashid", handle: "@huda.lifestyle", platform: params.platform || "instagram", followers: 320000, engagementRate: 4.2, niche: params.niche || "lifestyle", location: "Dubai", rateCard: 8000, tier: "mid" },
          { id: "inf_002", name: "Omar Sayed", handle: "@omar.eats", platform: params.platform || "tiktok", followers: 150000, engagementRate: 6.8, niche: params.niche || "food", location: "Abu Dhabi", rateCard: 4500, tier: "mid" },
          { id: "inf_003", name: "Layla Mahmoud", handle: "@layla.tech", platform: params.platform || "youtube", followers: 85000, engagementRate: 3.1, niche: params.niche || "technology", location: "Dubai", rateCard: 6000, tier: "mid" },
          { id: "inf_004", name: "Khalid Bin Nasser", handle: "@khalid.travel", platform: params.platform || "instagram", followers: 520000, engagementRate: 2.9, niche: params.niche || "travel", location: "Riyadh", rateCard: 12000, tier: "macro" },
        ],
        total: 4,
      },
    };
  },
};

export const createInfluencerCampaign: ToolDefinition = {
  name: "createInfluencerCampaign",
  description: "Create an influencer marketing campaign with budget and target reach.",
  parameters: {
    type: "object" as const,
    properties: {
      clientId: { type: "string", description: "Client ID" },
      name: { type: "string", description: "Campaign name" },
      budget: { type: "number", description: "Total campaign budget in AED" },
      targetReach: { type: "number", description: "Target audience reach" },
      influencerIds: { type: "array", description: "Array of influencer IDs", items: { type: "string" } },
    },
    required: ["clientId", "name", "budget", "targetReach", "influencerIds"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `camp_${Date.now()}`,
        clientId: params.clientId,
        name: params.name,
        budget: params.budget,
        targetReach: params.targetReach,
        influencerIds: params.influencerIds,
        influencerCount: params.influencerIds?.length || 0,
        status: "planning",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const createDeliverable: ToolDefinition = {
  name: "createDeliverable",
  description: "Create a deliverable task for an influencer in a campaign.",
  parameters: {
    type: "object" as const,
    properties: {
      campaignId: { type: "string", description: "Campaign ID" },
      influencerId: { type: "string", description: "Influencer ID" },
      platform: { type: "string", description: "Platform for the deliverable" },
      contentType: { type: "string", description: "Content type", enum: ["post", "story", "reel", "video", "blog", "live"] },
      dueDate: { type: "string", description: "Due date (ISO)" },
    },
    required: ["campaignId", "influencerId", "platform", "contentType", "dueDate"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `del_${Date.now()}`,
        campaignId: params.campaignId,
        influencerId: params.influencerId,
        platform: params.platform,
        contentType: params.contentType,
        dueDate: params.dueDate,
        status: "pending",
        engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const createInfluencerContract: ToolDefinition = {
  name: "createInfluencerContract",
  description: "Create a contract for influencer fees in a campaign.",
  parameters: {
    type: "object" as const,
    properties: {
      campaignId: { type: "string", description: "Campaign ID" },
      clientId: { type: "string", description: "Client ID" },
      influencerFees: {
        type: "array",
        description: "Array of influencer fee objects",
        items: {
          type: "object",
        },
      },
    },
    required: ["campaignId", "clientId", "influencerFees"],
  },
  handler: async (params: any) => {
    const totalFees = (params.influencerFees || []).reduce((sum: number, f: any) => sum + (f.amount || 0), 0);
    return {
      success: true,
      data: {
        id: `ord_${Date.now()}`,
        campaignId: params.campaignId,
        clientId: params.clientId,
        influencerFees: params.influencerFees,
        totalAmount: totalFees,
        currency: "AED",
        status: "pending_approval",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const calculateROI: ToolDefinition = {
  name: "calculateROI",
  description: "Calculate return on investment for an influencer campaign.",
  parameters: {
    type: "object" as const,
    properties: {
      campaignId: { type: "string", description: "Campaign ID" },
    },
    required: ["campaignId"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        campaignId: params.campaignId,
        totalSpend: 45000,
        currency: "AED",
        totalReach: 1250000,
        totalEngagement: 87500,
        costPerEngagement: 0.51,
        costPerThousandReach: 36,
        roi: 3.2,
        benchmarkROI: 2.5,
        performanceVsBenchmark: "+28%",
      },
    };
  },
};

export const trackEngagement: ToolDefinition = {
  name: "trackEngagement",
  description: "Track engagement metrics for a deliverable.",
  parameters: {
    type: "object" as const,
    properties: {
      deliverableId: { type: "string", description: "Deliverable ID" },
      likes: { type: "number", description: "Number of likes" },
      comments: { type: "number", description: "Number of comments" },
      shares: { type: "number", description: "Number of shares" },
      views: { type: "number", description: "Number of views" },
    },
    required: ["deliverableId"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        deliverableId: params.deliverableId,
        engagement: {
          likes: params.likes || 0,
          comments: params.comments || 0,
          shares: params.shares || 0,
          views: params.views || 0,
          total: (params.likes || 0) + (params.comments || 0) + (params.shares || 0),
        },
        engagementRate: ((params.likes || 0) + (params.comments || 0) + (params.shares || 0)) / Math.max(params.views || 1, 1) * 100,
        updatedAt: new Date().toISOString(),
      },
    };
  },
};

export const allInfluencerManagementTools: ToolDefinition[] = [
  addInfluencer, searchInfluencers, createInfluencerCampaign, createDeliverable, createInfluencerContract, calculateROI, trackEngagement,
];

export const allToolNames: string[] = allInfluencerManagementTools.map((t) => t.name);
