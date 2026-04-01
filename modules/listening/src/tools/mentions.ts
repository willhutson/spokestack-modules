/**
 * Listening — Mention Tracking Tools
 */

import type { ToolDefinition } from "./monitors";

export const listMentions: ToolDefinition = {
  name: "listMentions",
  description: "List mentions captured by a monitor with optional filters",
  parameters: {
    type: "object",
    properties: {
      monitorId: { type: "string" },
      orgId: { type: "string" },
      platform: { type: "string" },
      sentiment: { type: "string", enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"] },
      startDate: { type: "string" },
      endDate: { type: "string" },
      keyword: { type: "string" },
      page: { type: "number" },
      limit: { type: "number" },
    },
  },
  handler: async (params) => {
    return {
      mentions: [
        { id: "mention_001", platform: "TWITTER", author: "@happycustomer", content: "Love the new features from @brandname! Great work team.", url: "https://twitter.com/happycustomer/status/123", sentiment: "POSITIVE", sentimentScore: 0.92, keywords: ["brandname", "features"], publishedAt: "2026-04-01T14:30:00Z", engagementCount: 45 },
        { id: "mention_002", platform: "INSTAGRAM", author: "@techreviewer", content: "Mixed feelings about brandname's latest update. Some good, some not so much.", url: "https://instagram.com/p/abc123", sentiment: "NEUTRAL", sentimentScore: 0.48, keywords: ["brandname", "update"], publishedAt: "2026-04-01T12:15:00Z", engagementCount: 128 },
        { id: "mention_003", platform: "TWITTER", author: "@frustrateduser", content: "Delivery from brandname took 3 weeks. Not acceptable.", url: "https://twitter.com/frustrateduser/status/456", sentiment: "NEGATIVE", sentimentScore: 0.15, keywords: ["brandname", "delivery"], publishedAt: "2026-04-01T09:45:00Z", engagementCount: 12 },
      ],
      total: 248,
      page: params.page || 1,
    };
  },
};

export const getMention: ToolDefinition = {
  name: "getMention",
  description: "Get a single mention with full context and engagement breakdown",
  parameters: {
    type: "object",
    properties: { mentionId: { type: "string" } },
    required: ["mentionId"],
  },
  handler: async (params) => {
    return {
      id: params.mentionId,
      platform: "TWITTER",
      author: "@happycustomer",
      authorFollowers: 12500,
      content: "Love the new features from @brandname! Great work team.",
      url: "https://twitter.com/happycustomer/status/123",
      sentiment: "POSITIVE",
      sentimentScore: 0.92,
      keywords: ["brandname", "features"],
      publishedAt: "2026-04-01T14:30:00Z",
      engagement: { likes: 32, retweets: 8, replies: 5 },
      engagementCount: 45,
      flagged: false,
      dismissed: false,
    };
  },
};

export const flagMention: ToolDefinition = {
  name: "flagMention",
  description: "Flag a mention for follow-up",
  parameters: {
    type: "object",
    properties: {
      mentionId: { type: "string" },
      flaggedById: { type: "string" },
      reason: { type: "string" },
      priority: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
    },
    required: ["mentionId", "flaggedById"],
  },
  handler: async (params) => {
    return { mentionId: params.mentionId, flagged: true, priority: params.priority || "MEDIUM", reason: params.reason || null };
  },
};

export const dismissMention: ToolDefinition = {
  name: "dismissMention",
  description: "Mark a mention as reviewed/dismissed",
  parameters: {
    type: "object",
    properties: {
      mentionId: { type: "string" },
      dismissedById: { type: "string" },
    },
    required: ["mentionId", "dismissedById"],
  },
  handler: async (params) => {
    return { mentionId: params.mentionId, dismissed: true };
  },
};
