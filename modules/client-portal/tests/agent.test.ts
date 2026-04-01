import { describe, it, expect } from "vitest";
import { clientPortalAgentDefinition } from "../src/agent/client-portal-agent";

describe("Client Portal Agent Definition", () => {
  it("has required AgentDefinition fields", () => {
    expect(clientPortalAgentDefinition.name).toBe("client-portal-agent");
    expect(clientPortalAgentDefinition.system_prompt).toBeTruthy();
    expect(Array.isArray(clientPortalAgentDefinition.tools)).toBe(true);
    expect(clientPortalAgentDefinition.tools.length).toBeGreaterThan(0);
  });

  it("tool_names match exported tools", async () => {
    const { allToolNames } = await import("../src/tools/index");
    clientPortalAgentDefinition.tools.forEach(name => {
      expect(allToolNames).toContain(name);
    });
  });

  it("includes all 14 tools", () => {
    expect(clientPortalAgentDefinition.tools.length).toBe(14);
  });
});
