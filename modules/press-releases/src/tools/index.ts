/**
 * Press Releases Tools — all tool definitions
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

export const draftPressRelease: ToolDefinition = {
  name: "draftPressRelease",
  description: "Draft a press release with title, body, optional embargo, and distribution list.",
  parameters: {
    type: "object" as const,
    properties: {
      clientId: { type: "string", description: "Client ID" },
      title: { type: "string", description: "Press release headline" },
      body: { type: "string", description: "Full press release body text" },
      embargo: { type: "string", description: "Embargo date/time (ISO)" },
      distributionList: { type: "string", description: "Media list ID for distribution" },
    },
    required: ["clientId", "title", "body"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `pr_${Date.now()}`,
        clientId: params.clientId,
        title: params.title,
        body: params.body,
        embargo: params.embargo || null,
        distributionList: params.distributionList || null,
        status: "draft",
        metadata: { type: "press_release" },
        wordCount: params.body?.split(/\s+/).length || 0,
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const generatePRContent: ToolDefinition = {
  name: "generatePRContent",
  description: "Generate press release content from topic and key messages.",
  parameters: {
    type: "object" as const,
    properties: {
      topic: { type: "string", description: "Press release topic" },
      keyMessages: { type: "array", description: "Array of key messages to include", items: { type: "string" } },
      tone: { type: "string", description: "Desired tone", enum: ["formal", "conversational", "urgent", "celebratory"] },
      targetAudience: { type: "string", description: "Target audience description" },
    },
    required: ["topic", "keyMessages"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `prc_${Date.now()}`,
        topic: params.topic,
        generatedHeadline: `${params.topic} — A Major Development for the Industry`,
        generatedBody: `FOR IMMEDIATE RELEASE\n\n${params.topic}\n\n${(params.keyMessages || []).join("\n\n")}\n\n###\n\nAbout [Company]\n[Boilerplate]`,
        tone: params.tone || "formal",
        targetAudience: params.targetAudience || "general media",
        wordCount: 350,
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const scheduleDistribution: ToolDefinition = {
  name: "scheduleDistribution",
  description: "Schedule press release distribution to a media list on a specific date.",
  parameters: {
    type: "object" as const,
    properties: {
      pressReleaseId: { type: "string", description: "Press release ID to distribute" },
      distributionDate: { type: "string", description: "Scheduled distribution date (ISO)" },
      mediaListId: { type: "string", description: "Media list ID for distribution" },
      channels: { type: "array", description: "Distribution channels", items: { type: "string" } },
    },
    required: ["pressReleaseId", "distributionDate", "mediaListId"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `dist_${Date.now()}`,
        pressReleaseId: params.pressReleaseId,
        distributionDate: params.distributionDate,
        mediaListId: params.mediaListId,
        channels: params.channels || ["email", "wire"],
        status: "scheduled",
        recipientCount: 47,
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const trackPickups: ToolDefinition = {
  name: "trackPickups",
  description: "Track press release pickups across outlets with sentiment breakdown.",
  parameters: {
    type: "object" as const,
    properties: {
      pressReleaseId: { type: "string", description: "Press release ID to track" },
    },
    required: ["pressReleaseId"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        pressReleaseId: params.pressReleaseId,
        totalPickups: 23,
        outlets: [
          { name: "Gulf News", publishedAt: "2026-03-15T09:00:00Z", url: "https://gulfnews.com/article/123", sentiment: "positive" },
          { name: "Arabian Business", publishedAt: "2026-03-15T10:30:00Z", url: "https://arabianbusiness.com/article/456", sentiment: "positive" },
          { name: "The National", publishedAt: "2026-03-15T11:00:00Z", url: "https://thenationalnews.com/article/789", sentiment: "neutral" },
          { name: "Khaleej Times", publishedAt: "2026-03-15T12:00:00Z", url: "https://khaleejtimes.com/article/101", sentiment: "positive" },
        ],
        sentimentBreakdown: { positive: 16, neutral: 5, negative: 2 },
        totalReach: 1250000,
      },
    };
  },
};

export const allPressReleasesTools: ToolDefinition[] = [
  draftPressRelease, generatePRContent, scheduleDistribution, trackPickups,
];

export const allToolNames: string[] = allPressReleasesTools.map((t) => t.name);
