/**
 * Social Publishing — Account Management Tools
 */

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: object;
  handler: (params: any) => Promise<any>;
}

export const connectAccount: ToolDefinition = {
  name: "connectAccount",
  description: "Connect a social media account for a client",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string" },
      clientId: { type: "string" },
      platform: {
        type: "string",
        enum: ["INSTAGRAM", "FACEBOOK", "TWITTER", "LINKEDIN", "TIKTOK", "YOUTUBE", "PINTEREST", "SNAPCHAT"],
      },
      accountName: { type: "string" },
      accountId: { type: "string" },
      accountUrl: { type: "string" },
      managementType: {
        type: "string",
        enum: ["AGENCY_MANAGED", "CLIENT_MANAGED", "SHARED"],
      },
    },
    required: ["orgId", "clientId", "platform", "accountName"],
  },
  handler: async (params) => {
    return {
      id: `sa_${Date.now()}`,
      clientId: params.clientId,
      platform: params.platform,
      accountName: params.accountName,
      accountId: params.accountId || null,
      accountUrl: params.accountUrl || null,
      managementType: params.managementType || "AGENCY_MANAGED",
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  },
};

export const listAccounts: ToolDefinition = {
  name: "listAccounts",
  description: "List connected social media accounts",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string" },
      clientId: { type: "string" },
      platform: { type: "string" },
      isActive: { type: "boolean" },
    },
    required: ["orgId"],
  },
  handler: async (params) => {
    return [
      {
        id: "sa_stub_001",
        clientId: params.clientId || "client_001",
        platform: "INSTAGRAM",
        accountName: "@brandname",
        isActive: true,
        lastSyncAt: new Date().toISOString(),
      },
      {
        id: "sa_stub_002",
        clientId: params.clientId || "client_001",
        platform: "LINKEDIN",
        accountName: "Brand Company Page",
        isActive: true,
        lastSyncAt: new Date().toISOString(),
      },
    ];
  },
};

export const disconnectAccount: ToolDefinition = {
  name: "disconnectAccount",
  description: "Disconnect (deactivate) a social media account",
  parameters: {
    type: "object",
    properties: {
      accountId: { type: "string" },
    },
    required: ["accountId"],
  },
  handler: async (params) => {
    return { success: true, accountId: params.accountId };
  },
};

export const getAccountSpecs: ToolDefinition = {
  name: "getAccountSpecs",
  description: "Get platform specifications (character limits, supported features) for a social platform",
  parameters: {
    type: "object",
    properties: {
      platform: {
        type: "string",
        enum: ["INSTAGRAM", "FACEBOOK", "TWITTER", "LINKEDIN", "TIKTOK", "YOUTUBE"],
      },
    },
    required: ["platform"],
  },
  handler: async (params) => {
    const specs: Record<string, any> = {
      INSTAGRAM: { platform: "INSTAGRAM", displayName: "Instagram", captionMaxLength: 2200, hashtagMaxCount: 30, supportsCarousel: true, maxCarouselItems: 10, supportsStories: true, supportsLinks: false, supportsLocation: true, supportedAspectRatios: ["1:1", "4:5", "9:16", "16:9"], recommendedAspectRatio: "4:5" },
      FACEBOOK: { platform: "FACEBOOK", displayName: "Facebook", captionMaxLength: 63206, hashtagMaxCount: 30, supportsCarousel: true, maxCarouselItems: 10, supportsLinks: true, supportsLocation: true, supportedAspectRatios: ["1:1", "4:5", "16:9"] },
      TWITTER: { platform: "TWITTER", displayName: "X (Twitter)", captionMaxLength: 280, hashtagMaxCount: 2, supportsCarousel: false, supportsLinks: true, supportedAspectRatios: ["16:9", "1:1"] },
      LINKEDIN: { platform: "LINKEDIN", displayName: "LinkedIn", captionMaxLength: 3000, hashtagMaxCount: 5, supportsCarousel: true, maxCarouselItems: 9, supportsLinks: true, supportedAspectRatios: ["1:1", "4:5", "16:9"] },
      TIKTOK: { platform: "TIKTOK", displayName: "TikTok", captionMaxLength: 2200, hashtagMaxCount: 20, videoMaxDuration: 600, videoMinDuration: 3, supportsScheduling: true, supportsLinks: false, supportedAspectRatios: ["9:16"], recommendedAspectRatio: "9:16" },
      YOUTUBE: { platform: "YOUTUBE", displayName: "YouTube", captionMaxLength: 5000, videoMaxDuration: 43200, supportsCarousel: false, supportsScheduling: true, supportsLinks: true, supportedAspectRatios: ["16:9"], recommendedAspectRatio: "16:9" },
    };
    return specs[params.platform] || { platform: params.platform, displayName: params.platform };
  },
};
