import { describe, it, expect } from "vitest";
import { timeLeaveAgentDefinition } from "../src/agent/time-leave-agent";

describe("Time & Leave Agent Definition", () => {
  it("has required AgentDefinition fields", () => {
    expect(timeLeaveAgentDefinition.name).toBe("time-leave-agent");
    expect(timeLeaveAgentDefinition.system_prompt).toBeTruthy();
    expect(Array.isArray(timeLeaveAgentDefinition.tools)).toBe(true);
    expect(timeLeaveAgentDefinition.tools.length).toBeGreaterThan(0);
  });

  it("tool_names match exported tools", async () => {
    const { allToolNames } = await import("../src/tools/index");
    timeLeaveAgentDefinition.tools.forEach(name => {
      expect(allToolNames).toContain(name);
    });
  });

  it("includes all 14 tools", () => {
    expect(timeLeaveAgentDefinition.tools.length).toBe(14);
  });
});
