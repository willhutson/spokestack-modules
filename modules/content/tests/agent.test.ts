/**
 * Content Studio — Agent Structure Tests
 *
 * Validates agent definition structure and tool_names ↔ index consistency.
 */

import { describe, it, expect } from "vitest";
import { contentStudioAgent } from "../src/agent/content-agent";
import { allToolNames, allContentTools } from "../src/tools/index";
import * as fs from "fs";
import * as path from "path";

describe("Content Studio Agent", () => {
  it("exports a valid agent definition", () => {
    expect(contentStudioAgent).toBeDefined();
    expect(contentStudioAgent.name).toBe("content_studio_agent");
    expect(contentStudioAgent.description).toBeTruthy();
    expect(contentStudioAgent.system_prompt).toBeTruthy();
    expect(contentStudioAgent.system_prompt.length).toBeGreaterThan(100);
  });

  it("agent tool_names match allToolNames from index", () => {
    expect(contentStudioAgent.tools).toEqual(allToolNames);
  });

  it("allToolNames contains all 60 tools", () => {
    expect(allToolNames.length).toBe(60);
  });

  it("every tool name is unique", () => {
    const unique = new Set(allToolNames);
    expect(unique.size).toBe(allToolNames.length);
  });

  it("every tool has a non-null handler that returns data", async () => {
    for (const tool of allContentTools) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeDefined();
      expect(tool.parameters.type).toBe("object");
      expect(typeof tool.handler).toBe("function");
    }
  });

  it("every tool handler returns a non-null result", async () => {
    const mockContext = {
      organizationId: "org_test",
      userId: "user_test",
      coreUrl: "https://test.spokestack.io",
      authToken: "test-token",
    };

    for (const tool of allContentTools) {
      const mockParams: Record<string, unknown> = {};
      // Populate required params with stub values
      if (tool.parameters.required) {
        for (const req of tool.parameters.required) {
          const prop = tool.parameters.properties[req];
          if (prop.type === "string") {
            mockParams[req] = "stub_value";
          } else if (prop.type === "number") {
            mockParams[req] = 1;
          } else if (prop.type === "array") {
            mockParams[req] = [];
          }
        }
      }
      // Special cases for tools with array params that get iterated
      if (tool.name === "buildStoryboard") {
        mockParams.frames = [{ description: "Test frame" }];
      }

      const result = await tool.handler(mockParams, mockContext);
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
      expect(result.success).toBe(true);
      expect(result.data).not.toBeNull();
      expect(result.data).not.toBeUndefined();
    }
  });

  it("manifest tools match allToolNames", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifest.tools).toEqual(allToolNames);
  });

  it("system_prompt references all six domains", () => {
    const prompt = contentStudioAgent.system_prompt;
    expect(prompt).toContain("DAM");
    expect(prompt).toContain("Creative");
    expect(prompt).toContain("Video");
    expect(prompt).toContain("Presentations");
    expect(prompt).toContain("Docs");
    expect(prompt).toContain("Content Ops");
  });
});
