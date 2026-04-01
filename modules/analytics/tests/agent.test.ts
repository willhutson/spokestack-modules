import { describe, it, expect } from "vitest";
import { analyticsAgentDefinition } from "../src/agent/analytics-agent";

describe("Analytics Agent Definition", () => {
  it("has required AgentDefinition fields", () => {
    expect(analyticsAgentDefinition.name).toBe("analytics-agent");
    expect(analyticsAgentDefinition.system_prompt).toBeTruthy();
    expect(Array.isArray(analyticsAgentDefinition.tools)).toBe(true);
    expect(analyticsAgentDefinition.tools.length).toBeGreaterThan(0);
  });

  it("tool_names match exported tools", async () => {
    const { allToolNames } = await import("../src/tools/index");
    analyticsAgentDefinition.tools.forEach(name => {
      expect(allToolNames).toContain(name);
    });
  });

  it("includes all 20 tools", () => {
    expect(analyticsAgentDefinition.tools.length).toBe(20);
  });
});
