/**
 * Workflow Agent Tests — validates agent definition and tool bindings.
 */

import { describe, it, expect } from "vitest";
import { workflowAgentDefinition } from "../src/agent/workflow-agent";
import { allWorkflowTools, WORKFLOW_TOOL_NAMES, allToolNames } from "../src/tools/index";

describe("Workflow Agent Definition", () => {
  it("has the correct agent name", () => {
    expect(workflowAgentDefinition.name).toBe("workflow-agent");
  });

  it("has a non-empty description", () => {
    expect(workflowAgentDefinition.description).toBeTruthy();
    expect(workflowAgentDefinition.description.length).toBeGreaterThan(10);
  });

  it("has a non-empty system_prompt", () => {
    expect(workflowAgentDefinition.system_prompt).toBeTruthy();
    expect(workflowAgentDefinition.system_prompt.length).toBeGreaterThan(50);
  });

  it("references exactly 17 tools", () => {
    expect(workflowAgentDefinition.tools).toHaveLength(17);
  });

  it("exports exactly 17 tool definitions", () => {
    expect(allWorkflowTools).toHaveLength(17);
  });

  it("WORKFLOW_TOOL_NAMES matches allToolNames alias", () => {
    expect(WORKFLOW_TOOL_NAMES).toEqual(allToolNames);
  });

  it("agent tools match the exported tool names from index", () => {
    const exportedNames = allWorkflowTools.map((t) => t.name);
    expect(workflowAgentDefinition.tools).toEqual(exportedNames);
  });

  it("every tool has a valid handler function", () => {
    for (const tool of allWorkflowTools) {
      expect(typeof tool.handler).toBe("function");
    }
  });

  it("every tool has parameters with type 'object'", () => {
    for (const tool of allWorkflowTools) {
      expect(tool.parameters.type).toBe("object");
      expect(tool.parameters.properties).toBeDefined();
    }
  });

  it("contains all expected tool names", () => {
    const expectedNames = [
      "createWorkflow",
      "listWorkflowTemplates",
      "getWorkflowTemplate",
      "publishWorkflow",
      "archiveWorkflow",
      "instantiateWorkflow",
      "listActiveWorkflows",
      "getWorkflowStatus",
      "cancelWorkflow",
      "completeTask",
      "blockTask",
      "reassignTask",
      "listWorkflowTasks",
      "triggerNudge",
      "listNudges",
    ];

    for (const name of expectedNames) {
      expect(WORKFLOW_TOOL_NAMES).toContain(name);
    }
  });
});
