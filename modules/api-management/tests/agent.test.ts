import { describe, it, expect } from "vitest";
import { apiManagementAgent } from "../src/agent/api-management-agent";
import { allToolNames } from "../src/tools/index";

describe("API Management Agent Definition", () => {
  it("has a valid name", () => { expect(apiManagementAgent.name).toBeTruthy(); });
  it("has a non-empty system_prompt", () => { expect(apiManagementAgent.system_prompt.length).toBeGreaterThan(50); });
  it("tool_names match allToolNames", () => {
    for (const name of apiManagementAgent.tools) { expect(allToolNames).toContain(name); }
  });
});
