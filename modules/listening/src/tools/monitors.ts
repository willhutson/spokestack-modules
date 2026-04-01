/**
 * Listening — Monitor Configuration Tools
 */

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: object;
  handler: (params: any) => Promise<any>;
}

export const setupMonitor: ToolDefinition = {
  name: "setupMonitor",
  description: "Create a listening monitor configuration with keywords and platforms",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string" },
      name: { type: "string" },
      keywords: { type: "array", items: { type: "string" } },
      platforms: { type: "array", items: { type: "string", enum: ["INSTAGRAM", "FACEBOOK", "TWITTER", "LINKEDIN", "TIKTOK", "YOUTUBE"] } },
      clientId: { type: "string" },
      competitors: { type: "array", items: { type: "object", properties: { name: { type: "string" }, handles: { type: "array", items: { type: "string" } } } } },
      sentiment: { type: "boolean" },
      language: { type: "string", enum: ["en", "ar", "both"] },
      alertThreshold: { type: "number" },
    },
    required: ["orgId", "name", "keywords", "platforms"],
  },
  handler: async (params) => {
    return {
      id: `monitor_${Date.now()}`,
      name: params.name,
      keywords: params.keywords,
      platforms: params.platforms,
      clientId: params.clientId || null,
      competitors: params.competitors || [],
      sentiment: params.sentiment !== false,
      language: params.language || "en",
      alertThreshold: params.alertThreshold || 50,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
  },
};

export const listMonitors: ToolDefinition = {
  name: "listMonitors",
  description: "List monitoring configurations",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string" },
      clientId: { type: "string" },
      status: { type: "string", enum: ["ACTIVE", "PAUSED", "ARCHIVED"] },
    },
    required: ["orgId"],
  },
  handler: async () => {
    return [
      { id: "monitor_stub_001", name: "Brand Mentions", keywords: ["brandname", "@brandhandle"], platforms: ["TWITTER", "INSTAGRAM"], mentionCount: 142, lastMentionAt: "2026-04-01T15:30:00Z", status: "ACTIVE" },
      { id: "monitor_stub_002", name: "Product Feedback", keywords: ["productname", "review"], platforms: ["TWITTER", "LINKEDIN"], mentionCount: 67, lastMentionAt: "2026-04-01T12:00:00Z", status: "ACTIVE" },
    ];
  },
};

export const updateMonitor: ToolDefinition = {
  name: "updateMonitor",
  description: "Update monitor keywords, platforms, or threshold",
  parameters: {
    type: "object",
    properties: {
      monitorId: { type: "string" },
      keywords: { type: "array", items: { type: "string" } },
      platforms: { type: "array", items: { type: "string" } },
      alertThreshold: { type: "number" },
      status: { type: "string", enum: ["ACTIVE", "PAUSED", "ARCHIVED"] },
    },
    required: ["monitorId"],
  },
  handler: async (params) => {
    const { monitorId, ...updates } = params;
    return { id: monitorId, ...updates, updatedAt: new Date().toISOString() };
  },
};

export const pauseMonitor: ToolDefinition = {
  name: "pauseMonitor",
  description: "Pause a monitor",
  parameters: {
    type: "object",
    properties: { monitorId: { type: "string" } },
    required: ["monitorId"],
  },
  handler: async (params) => {
    return { monitorId: params.monitorId, status: "PAUSED" };
  },
};

export const deleteMonitor: ToolDefinition = {
  name: "deleteMonitor",
  description: "Archive a monitor",
  parameters: {
    type: "object",
    properties: { monitorId: { type: "string" } },
    required: ["monitorId"],
  },
  handler: async (params) => {
    return { success: true, monitorId: params.monitorId, status: "ARCHIVED" };
  },
};
