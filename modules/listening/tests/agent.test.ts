import { describe, it, expect } from "vitest";
import { listeningAgent } from "../src/agent/listening-agent";
import { allToolNames } from "../src/tools/index";
import * as monitors from "../src/tools/monitors";
import * as mentions from "../src/tools/mentions";
import * as sentiment from "../src/tools/sentiment";
import * as competitors from "../src/tools/competitors";
import * as reports from "../src/tools/reports";

describe("Listening Agent Definition", () => {
  it("has a valid name", () => {
    expect(listeningAgent.name).toBe("social_listening_agent");
  });

  it("has a non-empty system_prompt", () => {
    expect(listeningAgent.system_prompt.length).toBeGreaterThan(100);
  });

  it("tool_names is a non-empty array", () => {
    expect(listeningAgent.tool_names).toBeInstanceOf(Array);
    expect(listeningAgent.tool_names.length).toBe(16);
  });

  it("all tool_names are present in allToolNames export", () => {
    for (const name of listeningAgent.tool_names) {
      expect(allToolNames).toContain(name);
    }
  });

  it("all exported tool handlers return non-null data", async () => {
    const tools = [
      monitors.setupMonitor, monitors.listMonitors, monitors.updateMonitor, monitors.pauseMonitor, monitors.deleteMonitor,
      mentions.listMentions, mentions.getMention, mentions.flagMention, mentions.dismissMention,
      sentiment.analyzeSentiment, sentiment.getSentimentTrend,
      competitors.trackCompetitors, competitors.compareCompetitors,
      reports.generateReport, reports.listReports, reports.alertOnMention,
    ];

    for (const tool of tools) {
      const result = await tool.handler({
        orgId: "org_test", monitorId: "monitor_test", mentionId: "mention_test",
        flaggedById: "user_test", dismissedById: "user_test",
        name: "Test Monitor", keywords: ["test"], platforms: ["TWITTER"],
        brandMonitorId: "monitor_test", competitorNames: ["CompA"],
        alertType: "VOLUME_SPIKE", channels: ["EMAIL"], recipientIds: ["user_test"],
      });
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    }
  });

  it("system_prompt references all tool names", () => {
    for (const name of allToolNames) {
      expect(listeningAgent.system_prompt).toContain(name);
    }
  });
});
