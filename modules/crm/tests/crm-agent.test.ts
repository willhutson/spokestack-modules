/**
 * CRM Agent Definition Tests — Phase 2
 *
 * Validates that the AgentDefinition structure is correct,
 * tool names match exported tools, and all 24 tools are present (Phase 6B refactored).
 */

import { describe, it, expect } from "vitest";
import { crmAgentDefinition } from "../src/agent/crm-agent";
import { allCrmTools, CRM_TOOL_NAMES, allToolNames } from "../src/tools/index";
import type { AgentDefinition } from "../../../sdk/types/index";

describe("CRM Agent Definition", () => {
  it("has required AgentDefinition fields", () => {
    expect(crmAgentDefinition.name).toBe("crm-agent");
    expect(crmAgentDefinition.system_prompt).toBeTruthy();
    expect(Array.isArray(crmAgentDefinition.tools)).toBe(true);
    expect(crmAgentDefinition.tools.length).toBeGreaterThan(0);
  });

  it("tool_names match exported tools", async () => {
    const { allToolNames } = await import("../src/tools/index");
    crmAgentDefinition.tools.forEach(name => {
      expect(allToolNames).toContain(name);
    });
  });

  it("includes all 24 tools (Phase 6B: removed clients + retainers, added feedback)", () => {
    expect(crmAgentDefinition.tools.length).toBe(24);
  });

  it("exports a valid AgentDefinition", () => {
    const agent: AgentDefinition = crmAgentDefinition;
    expect(agent).toBeDefined();
    expect(agent.name).toBe("crm-agent");
    expect(agent.description).toBeTruthy();
    expect(agent.system_prompt).toBeTruthy();
    expect(agent.tools).toBeInstanceOf(Array);
    expect(agent.tools.length).toBeGreaterThan(0);
  });

  it("has a non-empty system prompt", () => {
    expect(crmAgentDefinition.system_prompt.length).toBeGreaterThan(100);
  });

  it("references only tools that are actually exported", () => {
    const exportedToolNames = allCrmTools.map((t) => t.name);
    for (const toolName of crmAgentDefinition.tools) {
      expect(exportedToolNames).toContain(toolName);
    }
  });

  it("tool names in agent match CRM_TOOL_NAMES constant", () => {
    expect(crmAgentDefinition.tools).toEqual(CRM_TOOL_NAMES);
  });

  it("allToolNames alias matches CRM_TOOL_NAMES", () => {
    expect(allToolNames).toEqual(CRM_TOOL_NAMES);
  });

  it("every exported tool has valid JSON schema parameters", () => {
    for (const tool of allCrmTools) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeDefined();
      expect(tool.parameters.type).toBe("object");
      expect(tool.parameters.properties).toBeDefined();
      expect(typeof tool.handler).toBe("function");
    }
  });

  it("required tools have their required fields specified", () => {
    const createContact = allCrmTools.find((t) => t.name === "createContact");
    expect(createContact?.parameters.required).toContain("firstName");

    const updateContact = allCrmTools.find((t) => t.name === "updateContact");
    expect(updateContact?.parameters.required).toContain("contactId");

    const linkContactToDeal = allCrmTools.find((t) => t.name === "linkContactToDeal");
    expect(linkContactToDeal?.parameters.required).toContain("dealId");
    expect(linkContactToDeal?.parameters.required).toContain("contactId");
  });
});
