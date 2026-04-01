/**
 * Media Buying Agent Tests — validates agent definition and tool bindings.
 */

import { describe, it, expect } from "vitest";
import { mediaBuyingAgentDefinition } from "../src/agent/media-buying-agent";
import { allMediaBuyingTools, MEDIA_BUYING_TOOL_NAMES, allToolNames } from "../src/tools/index";

describe("Media Buying Agent Definition", () => {
  it("has the correct agent name", () => {
    expect(mediaBuyingAgentDefinition.name).toBe("media-buying-agent");
  });

  it("has a non-empty description", () => {
    expect(mediaBuyingAgentDefinition.description).toBeTruthy();
    expect(mediaBuyingAgentDefinition.description.length).toBeGreaterThan(10);
  });

  it("has a non-empty system_prompt", () => {
    expect(mediaBuyingAgentDefinition.system_prompt).toBeTruthy();
    expect(mediaBuyingAgentDefinition.system_prompt.length).toBeGreaterThan(50);
  });

  it("references exactly 15 tools", () => {
    expect(mediaBuyingAgentDefinition.tools).toHaveLength(15);
  });

  it("exports exactly 15 tool definitions", () => {
    expect(allMediaBuyingTools).toHaveLength(15);
  });

  it("MEDIA_BUYING_TOOL_NAMES matches allToolNames alias", () => {
    expect(MEDIA_BUYING_TOOL_NAMES).toEqual(allToolNames);
  });

  it("agent tools match the exported tool names from index", () => {
    const exportedNames = allMediaBuyingTools.map((t) => t.name);
    expect(mediaBuyingAgentDefinition.tools).toEqual(exportedNames);
  });

  it("every tool has a valid handler function", () => {
    for (const tool of allMediaBuyingTools) {
      expect(typeof tool.handler).toBe("function");
    }
  });

  it("every tool has parameters with type 'object'", () => {
    for (const tool of allMediaBuyingTools) {
      expect(tool.parameters.type).toBe("object");
      expect(tool.parameters.properties).toBeDefined();
    }
  });

  it("contains all expected tool names", () => {
    const expectedNames = [
      "createCampaign",
      "listCampaigns",
      "updateCampaign",
      "getCampaignPerformance",
      "createAdSet",
      "updateAdSet",
      "pauseAdSet",
      "getAdSetMetrics",
      "uploadCreative",
      "listCreatives",
      "linkCreativeToAdSet",
      "trackSpend",
      "getBudgetUtilization",
      "getROAS",
      "exportSpendReport",
    ];

    for (const name of expectedNames) {
      expect(MEDIA_BUYING_TOOL_NAMES).toContain(name);
    }
  });
});
