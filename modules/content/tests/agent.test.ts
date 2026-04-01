/**
 * Content Studio Agent Definition Tests
 *
 * Validates that the AgentDefinition structure is correct,
 * tool names match exported tools, and system_prompt is non-empty.
 */

import { describe, it, expect } from "vitest";
import { contentStudioAgent } from "../src/agent/content-agent";
import { allContentTools, allToolNames } from "../src/tools/index";
import type { AgentDefinition } from "../../../sdk/types/index";

describe("Content Studio Agent Definition", () => {
  it("exports a valid AgentDefinition", () => {
    const agent: AgentDefinition = contentStudioAgent;
    expect(agent).toBeDefined();
    expect(agent.name).toBe("content_studio_agent");
    expect(agent.description).toBeTruthy();
    expect(agent.system_prompt).toBeTruthy();
    expect(agent.tools).toBeInstanceOf(Array);
    expect(agent.tools.length).toBeGreaterThan(0);
  });

  it("has a non-empty system prompt", () => {
    expect(contentStudioAgent.system_prompt.length).toBeGreaterThan(100);
  });

  it("references only tools that are actually exported", () => {
    const exportedToolNames = allContentTools.map((t) => t.name);
    for (const toolName of contentStudioAgent.tools) {
      expect(exportedToolNames).toContain(toolName);
    }
  });

  it("tool names in agent match allToolNames constant", () => {
    expect(contentStudioAgent.tools).toEqual(allToolNames);
  });

  it("every exported tool has valid JSON schema parameters", () => {
    for (const tool of allContentTools) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeDefined();
      expect(tool.parameters.type).toBe("object");
      expect(tool.parameters.properties).toBeDefined();
      expect(typeof tool.handler).toBe("function");
    }
  });

  it("has all 60 tools across 6 domains", () => {
    expect(allContentTools.length).toBe(60);
  });

  it("every tool handler returns a non-null mock object", async () => {
    for (const tool of allContentTools) {
      const mockParams: Record<string, unknown> = {};
      for (const [key, prop] of Object.entries(tool.parameters.properties)) {
        if (tool.parameters.required?.includes(key)) {
          if (prop.type === "string") mockParams[key] = `test_${key}`;
          else if (prop.type === "number") mockParams[key] = 1;
          else if (prop.type === "array") mockParams[key] = [];
        }
      }
      const result = await tool.handler(mockParams, {
        organizationId: "org_test",
        coreUrl: "https://test.spokestack.io",
        authToken: "test-token",
      });
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).not.toBeNull();
    }
  });

  it("allToolNames contains all expected DAM tools", () => {
    const damTools = ["uploadAsset", "listAssets", "getAssetVersions", "createAssetVersion", "createFolder", "listFolders", "searchAssets", "createAssetLibrary", "addAssetComment", "resolveAssetComment"];
    for (const name of damTools) {
      expect(allToolNames).toContain(name);
    }
  });

  it("allToolNames contains all expected Creative tools", () => {
    const creativeTools = ["createMoodboard", "listMoodboards", "addToMoodboard", "listMoodboardItems", "generateShotList", "exportMoodboard", "saveMoodboardConversation"];
    for (const name of creativeTools) {
      expect(allToolNames).toContain(name);
    }
  });

  it("allToolNames contains all expected Video tools", () => {
    const videoTools = ["createVideoProject", "listVideoProjects", "getVideoProject", "updateVideoStatus", "writeScript", "getScript", "buildStoryboard", "addStoryboardFrame", "listStoryboardFrames", "trackVideoStatus"];
    for (const name of videoTools) {
      expect(allToolNames).toContain(name);
    }
  });

  it("allToolNames contains all expected Presentations tools", () => {
    const presTools = ["createDeck", "listDecks", "getDeck", "addSlide", "reorderSlides", "deleteSlide", "listTemplates", "createTemplate", "exportDeck", "syncDeckToGoogleSlides"];
    for (const name of presTools) {
      expect(allToolNames).toContain(name);
    }
  });

  it("allToolNames contains all expected Docs tools", () => {
    const docsTools = ["createDocument", "listDocuments", "getDocument", "trackVersions", "listDocumentVersions", "searchKnowledge", "createKnowledgeDoc", "embedDocument", "trackDocumentUsage", "listDocTemplates"];
    for (const name of docsTools) {
      expect(allToolNames).toContain(name);
    }
  });

  it("allToolNames contains all expected Content Ops tools", () => {
    const opsTools = ["submitForApproval", "reviewContent", "listPendingReviews", "trackContentStatus", "addContentComment", "listContentComments", "resolveContentComment", "createContentVersion", "listContentVersions", "setupContentTrigger", "listContentTriggers", "logContentEvent", "addContentAsset"];
    for (const name of opsTools) {
      expect(allToolNames).toContain(name);
    }
  });
});
