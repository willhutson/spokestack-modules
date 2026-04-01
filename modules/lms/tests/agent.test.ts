/**
 * LMS Agent Tests — validates agent definition and tool bindings.
 */

import { describe, it, expect } from "vitest";
import { lmsAgentDefinition } from "../src/agent/lms-agent";
import { allLmsTools, LMS_TOOL_NAMES, allToolNames } from "../src/tools/index";

describe("LMS Agent Definition", () => {
  it("has the correct agent name", () => {
    expect(lmsAgentDefinition.name).toBe("lms-agent");
  });

  it("has a non-empty description", () => {
    expect(lmsAgentDefinition.description).toBeTruthy();
    expect(lmsAgentDefinition.description.length).toBeGreaterThan(10);
  });

  it("has a non-empty system_prompt", () => {
    expect(lmsAgentDefinition.system_prompt).toBeTruthy();
    expect(lmsAgentDefinition.system_prompt.length).toBeGreaterThan(50);
  });

  it("references exactly 17 tools", () => {
    expect(lmsAgentDefinition.tools).toHaveLength(17);
  });

  it("exports exactly 17 tool definitions", () => {
    expect(allLmsTools).toHaveLength(17);
  });

  it("LMS_TOOL_NAMES matches allToolNames alias", () => {
    expect(LMS_TOOL_NAMES).toEqual(allToolNames);
  });

  it("agent tools match the exported tool names from index", () => {
    const exportedNames = allLmsTools.map((t) => t.name);
    expect(lmsAgentDefinition.tools).toEqual(exportedNames);
  });

  it("every tool has a valid handler function", () => {
    for (const tool of allLmsTools) {
      expect(typeof tool.handler).toBe("function");
    }
  });

  it("every tool has parameters with type 'object'", () => {
    for (const tool of allLmsTools) {
      expect(tool.parameters.type).toBe("object");
      expect(tool.parameters.properties).toBeDefined();
    }
  });

  it("contains all expected tool names", () => {
    const expectedNames = [
      "createCourse",
      "listCourses",
      "updateCourse",
      "publishCourse",
      "archiveCourse",
      "createLesson",
      "updateLesson",
      "reorderLessons",
      "addLessonContent",
      "enrollUser",
      "getEnrollments",
      "getProgress",
      "issueCompletion",
      "createQuiz",
      "addQuizQuestion",
      "submitQuizAttempt",
      "getQuizResults",
    ];

    for (const name of expectedNames) {
      expect(LMS_TOOL_NAMES).toContain(name);
    }
  });
});
