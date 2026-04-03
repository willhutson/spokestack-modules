/**
 * Media Relations Tools — all tool definitions
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

export const addJournalist: ToolDefinition = {
  name: "addJournalist",
  description: "Add a journalist to the media database with contact details and beat information.",
  parameters: {
    type: "object" as const,
    properties: {
      name: { type: "string", description: "Journalist's full name" },
      outlet: { type: "string", description: "Media outlet name" },
      beat: { type: "string", description: "Journalist's beat or coverage area" },
      email: { type: "string", description: "Contact email address" },
      phone: { type: "string", description: "Contact phone number" },
      region: { type: "string", description: "Geographic region" },
    },
    required: ["name", "outlet", "beat", "email", "phone", "region"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `jour_${Date.now()}`,
        name: params.name,
        outlet: params.outlet,
        beat: params.beat,
        email: params.email,
        phone: params.phone,
        region: params.region,
        createdAt: new Date().toISOString(),
        lastContactedAt: null,
        pitchCount: 0,
      },
    };
  },
};

export const searchJournalists: ToolDefinition = {
  name: "searchJournalists",
  description: "Search the journalist database by beat, outlet, region, or free-text query.",
  parameters: {
    type: "object" as const,
    properties: {
      beat: { type: "string", description: "Filter by beat" },
      outlet: { type: "string", description: "Filter by outlet" },
      region: { type: "string", description: "Filter by region" },
      query: { type: "string", description: "Free-text search query" },
    },
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        journalists: [
          { id: "jour_001", name: "Sarah Al-Mansoori", outlet: "Gulf News", beat: params.beat || "business", region: params.region || "UAE", email: "sarah@gulfnews.ae" },
          { id: "jour_002", name: "James Richardson", outlet: "Arabian Business", beat: params.beat || "technology", region: params.region || "GCC", email: "james@arabianbusiness.com" },
          { id: "jour_003", name: "Fatima Al-Hashmi", outlet: "The National", beat: params.beat || "lifestyle", region: params.region || "UAE", email: "fatima@thenationalnews.com" },
        ],
        total: 3,
      },
    };
  },
};

export const createMediaList: ToolDefinition = {
  name: "createMediaList",
  description: "Create a curated media list from selected journalists.",
  parameters: {
    type: "object" as const,
    properties: {
      name: { type: "string", description: "Name of the media list" },
      journalistIds: { type: "array", description: "Array of journalist IDs to include", items: { type: "string" } },
      clientId: { type: "string", description: "Optional client ID to associate the list with" },
    },
    required: ["name", "journalistIds"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `ml_${Date.now()}`,
        name: params.name,
        journalistCount: params.journalistIds?.length || 0,
        journalistIds: params.journalistIds,
        clientId: params.clientId || null,
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const createPitch: ToolDefinition = {
  name: "createPitch",
  description: "Create a pitch brief targeting specific journalists or media lists.",
  parameters: {
    type: "object" as const,
    properties: {
      clientId: { type: "string", description: "Client ID" },
      title: { type: "string", description: "Pitch title" },
      description: { type: "string", description: "Pitch description and key messages" },
      journalistIds: { type: "array", description: "Target journalist IDs", items: { type: "string" } },
      mediaListId: { type: "string", description: "Optional media list ID" },
    },
    required: ["clientId", "title", "description", "journalistIds"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `pitch_${Date.now()}`,
        clientId: params.clientId,
        title: params.title,
        description: params.description,
        journalistIds: params.journalistIds,
        mediaListId: params.mediaListId || null,
        status: "draft",
        metadata: { type: "pitch" },
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const logCoverage: ToolDefinition = {
  name: "logCoverage",
  description: "Log a media coverage entry with outlet, headline, sentiment, and reach.",
  parameters: {
    type: "object" as const,
    properties: {
      clientId: { type: "string", description: "Client ID" },
      headline: { type: "string", description: "Article headline" },
      outlet: { type: "string", description: "Publishing outlet" },
      url: { type: "string", description: "Article URL" },
      journalist: { type: "string", description: "Journalist name" },
      sentiment: { type: "string", description: "Sentiment of coverage", enum: ["positive", "neutral", "negative"] },
      reach: { type: "number", description: "Estimated audience reach" },
    },
    required: ["clientId", "headline", "outlet", "url"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `cov_${Date.now()}`,
        clientId: params.clientId,
        headline: params.headline,
        outlet: params.outlet,
        url: params.url,
        journalist: params.journalist || null,
        sentiment: params.sentiment || "neutral",
        reach: params.reach || 50000,
        loggedAt: new Date().toISOString(),
      },
    };
  },
};

export const getCoverageReport: ToolDefinition = {
  name: "getCoverageReport",
  description: "Generate a coverage report for a client over a given period.",
  parameters: {
    type: "object" as const,
    properties: {
      clientId: { type: "string", description: "Client ID" },
      startDate: { type: "string", description: "Report start date (ISO)" },
      endDate: { type: "string", description: "Report end date (ISO)" },
    },
    required: ["clientId"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        clientId: params.clientId,
        period: { startDate: params.startDate || "2026-01-01", endDate: params.endDate || "2026-03-31" },
        totalCoverage: 47,
        byOutlet: { "Gulf News": 12, "The National": 9, "Arabian Business": 8, "Khaleej Times": 7, "Campaign ME": 6, "Other": 5 },
        bySentiment: { positive: 31, neutral: 12, negative: 4 },
        topStories: [
          { headline: "Company launches regional expansion", outlet: "Gulf News", reach: 250000, sentiment: "positive" },
          { headline: "New partnership announced at GITEX", outlet: "Arabian Business", reach: 180000, sentiment: "positive" },
          { headline: "Q4 results exceed expectations", outlet: "The National", reach: 150000, sentiment: "positive" },
        ],
      },
    };
  },
};

export const allMediaRelationsTools: ToolDefinition[] = [
  addJournalist, searchJournalists, createMediaList, createPitch, logCoverage, getCoverageReport,
];

export const allToolNames: string[] = allMediaRelationsTools.map((t) => t.name);
