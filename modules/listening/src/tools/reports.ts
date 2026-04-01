/**
 * Listening — Report & Alert Tools
 */

import type { ToolDefinition } from "./monitors";

export const generateReport: ToolDefinition = {
  name: "generateReport",
  description: "Generate a listening report (summary, detailed, or competitive)",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string" },
      monitorId: { type: "string" },
      reportType: { type: "string", enum: ["SUMMARY", "DETAILED", "COMPETITIVE"] },
      startDate: { type: "string" },
      endDate: { type: "string" },
      format: { type: "string", enum: ["JSON", "PDF"] },
    },
    required: ["orgId"],
  },
  handler: async (params) => {
    return {
      reportId: `report_${Date.now()}`,
      type: params.reportType || "SUMMARY",
      period: "last_30d",
      totalMentions: 312,
      topPlatform: "TWITTER",
      sentimentBreakdown: { positive: 65, neutral: 25, negative: 10 },
      topKeywords: ["brandname", "product", "service"],
      generatedAt: new Date().toISOString(),
      downloadUrl: `https://cdn.spokestack.io/reports/report_${Date.now()}.pdf`,
    };
  },
};

export const listReports: ToolDefinition = {
  name: "listReports",
  description: "List previously generated listening reports",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string" },
      monitorId: { type: "string" },
      reportType: { type: "string", enum: ["SUMMARY", "DETAILED", "COMPETITIVE"] },
    },
    required: ["orgId"],
  },
  handler: async () => {
    return [
      { reportId: "report_stub_001", type: "SUMMARY", period: "2026-03", totalMentions: 289, generatedAt: "2026-04-01T00:00:00Z", downloadUrl: "https://cdn.spokestack.io/reports/report_stub_001.pdf" },
      { reportId: "report_stub_002", type: "COMPETITIVE", period: "2026-Q1", totalMentions: 856, generatedAt: "2026-04-01T08:00:00Z", downloadUrl: "https://cdn.spokestack.io/reports/report_stub_002.pdf" },
    ];
  },
};

export const alertOnMention: ToolDefinition = {
  name: "alertOnMention",
  description: "Configure alert rules for a monitor",
  parameters: {
    type: "object",
    properties: {
      monitorId: { type: "string" },
      alertType: { type: "string", enum: ["VOLUME_SPIKE", "NEGATIVE_SENTIMENT", "COMPETITOR_MENTION", "KEYWORD_MATCH"] },
      threshold: { type: "number" },
      channels: { type: "array", items: { type: "string", enum: ["EMAIL", "SLACK", "WHATSAPP"] } },
      recipientIds: { type: "array", items: { type: "string" } },
    },
    required: ["monitorId", "alertType", "channels", "recipientIds"],
  },
  handler: async (params) => {
    return {
      alertId: `alert_${Date.now()}`,
      monitorId: params.monitorId,
      alertType: params.alertType,
      threshold: params.threshold || null,
      channels: params.channels,
      recipientIds: params.recipientIds,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  },
};
