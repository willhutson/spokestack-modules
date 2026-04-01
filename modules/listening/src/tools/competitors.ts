/**
 * Listening — Competitive Intelligence Tools
 */

import type { ToolDefinition } from "./monitors";

export const trackCompetitors: ToolDefinition = {
  name: "trackCompetitors",
  description: "List competitor monitoring data and share of voice",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string" },
      monitorId: { type: "string" },
      clientId: { type: "string" },
    },
    required: ["orgId"],
  },
  handler: async () => {
    return {
      competitors: [
        { name: "CompetitorA", handles: ["@competitorA"], mentions: 89, sentimentScore: 0.45, topTopics: ["pricing", "features"], shareOfVoice: 0.32 },
        { name: "CompetitorB", handles: ["@competitorB"], mentions: 56, sentimentScore: 0.62, topTopics: ["customer support", "reliability"], shareOfVoice: 0.13 },
      ],
    };
  },
};

export const compareCompetitors: ToolDefinition = {
  name: "compareCompetitors",
  description: "Head-to-head brand vs competitor comparison",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string" },
      brandMonitorId: { type: "string" },
      competitorNames: { type: "array", items: { type: "string" } },
    },
    required: ["orgId", "brandMonitorId", "competitorNames"],
  },
  handler: async (params) => {
    return {
      brand: { mentions: 245, sentiment: 0.72, shareOfVoice: 0.55, topTopics: ["innovation", "quality"] },
      competitors: (params.competitorNames || []).map((name: string, i: number) => ({
        name,
        mentions: 89 - i * 20,
        sentiment: 0.45 + i * 0.1,
        shareOfVoice: 0.20 - i * 0.05,
        topTopics: ["pricing", "features"],
      })),
    };
  },
};
