/**
 * NPS Agent Definition Tests
 *
 * Validates the agent definition, tool count, and tool name consistency.
 */

import { describe, it, expect } from "vitest";
import { npsAgentDefinition } from "../src/agent/nps-agent";
import { allNpsTools, NPS_TOOL_NAMES, allToolNames } from "../src/tools/index";

describe("NPS Agent Definition", () => {
  it("has the correct agent name", () => {
    expect(npsAgentDefinition.name).toBe("nps-agent");
  });

  it("has a description", () => {
    expect(npsAgentDefinition.description).toBeTruthy();
    expect(npsAgentDefinition.description.length).toBeGreaterThan(10);
  });

  it("has a system prompt", () => {
    expect(npsAgentDefinition.system_prompt).toBeTruthy();
    expect(npsAgentDefinition.system_prompt.length).toBeGreaterThan(50);
  });

  it("references exactly 13 tools", () => {
    expect(npsAgentDefinition.tools).toHaveLength(13);
  });

  it("tool names match the tools index NPS_TOOL_NAMES", () => {
    expect(npsAgentDefinition.tools).toEqual(NPS_TOOL_NAMES);
  });

  it("allNpsTools array has 13 tool definitions", () => {
    expect(allNpsTools).toHaveLength(13);
  });

  it("NPS_TOOL_NAMES and allToolNames are identical", () => {
    expect(NPS_TOOL_NAMES).toEqual(allToolNames);
  });

  it("every tool in allNpsTools has a valid handler function", () => {
    for (const tool of allNpsTools) {
      expect(typeof tool.handler).toBe("function");
    }
  });

  it("every tool has required fields: name, description, parameters", () => {
    for (const tool of allNpsTools) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeDefined();
      expect(tool.parameters.type).toBe("object");
      expect(tool.parameters.properties).toBeDefined();
    }
  });

  it("contains all expected tool names", () => {
    const expectedTools = [
      "createSurvey",
      "sendSurvey",
      "listSurveys",
      "getSurveyResults",
      "analyzeNPS",
      "submitNPSResponse",
      "listResponses",
      "createForm",
      "listForms",
      "submitForm",
      "listSubmissions",
      "reviewSubmission",
      "getSubmission",
    ];
    expect(NPS_TOOL_NAMES).toEqual(expectedTools);
  });

  it("submitNPSResponse handler categorizes scores correctly", async () => {
    const tool = allNpsTools.find((t) => t.name === "submitNPSResponse")!;
    const mockContext = {
      organizationId: "org_test",
      coreUrl: "http://localhost",
      authToken: "test-token",
    };

    // Detractor (0-6)
    const detractor = await tool.handler({ surveyId: "s1", score: 4 }, mockContext);
    expect(detractor.success).toBe(true);
    expect((detractor.data as any).category).toBe("DETRACTOR");

    // Passive (7-8)
    const passive = await tool.handler({ surveyId: "s1", score: 7 }, mockContext);
    expect(passive.success).toBe(true);
    expect((passive.data as any).category).toBe("PASSIVE");

    // Promoter (9-10)
    const promoter = await tool.handler({ surveyId: "s1", score: 10 }, mockContext);
    expect(promoter.success).toBe(true);
    expect((promoter.data as any).category).toBe("PROMOTER");
  });

  it("all tool handlers return success: true with data", async () => {
    const mockContext = {
      organizationId: "org_test",
      coreUrl: "http://localhost",
      authToken: "test-token",
    };

    for (const tool of allNpsTools) {
      const params: Record<string, unknown> = {};
      // Provide minimal required params for each tool
      if (tool.parameters.required) {
        for (const key of tool.parameters.required) {
          const prop = tool.parameters.properties[key];
          if (prop.type === "number") {
            params[key] = 5;
          } else {
            params[key] = `test_${key}`;
          }
        }
      }
      const result = await tool.handler(params, mockContext);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    }
  });
});
