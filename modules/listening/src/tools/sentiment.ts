/**
 * Listening — Sentiment Analysis Tools
 */

import type { ToolDefinition } from "./monitors";

export const analyzeSentiment: ToolDefinition = {
  name: "analyzeSentiment",
  description: "Run sentiment analysis on a set of mentions for a monitor",
  parameters: {
    type: "object",
    properties: {
      monitorId: { type: "string" },
      startDate: { type: "string" },
      endDate: { type: "string" },
    },
    required: ["monitorId"],
  },
  handler: async (params) => {
    return {
      monitorId: params.monitorId,
      period: "last_7d",
      overall: { positive: 68, neutral: 22, negative: 10 },
      trend: "+5% positive vs previous period",
      topPositiveTopics: ["customer service", "product quality"],
      topNegativeTopics: ["delivery time"],
      avgSentimentScore: 0.58,
    };
  },
};

export const getSentimentTrend: ToolDefinition = {
  name: "getSentimentTrend",
  description: "Return time-series sentiment data for trend analysis",
  parameters: {
    type: "object",
    properties: {
      monitorId: { type: "string" },
      granularity: { type: "string", enum: ["daily", "weekly"] },
      periods: { type: "number" },
    },
    required: ["monitorId"],
  },
  handler: async (params) => {
    const periods = params.periods || 7;
    const data = [];
    for (let i = 0; i < periods; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (periods - 1 - i));
      data.push({
        date: date.toISOString().split("T")[0],
        positive: 60 + Math.floor(Math.random() * 20),
        neutral: 15 + Math.floor(Math.random() * 10),
        negative: 5 + Math.floor(Math.random() * 10),
        mentions: 25 + Math.floor(Math.random() * 20),
      });
    }
    return { monitorId: params.monitorId, granularity: params.granularity || "daily", data };
  },
};
