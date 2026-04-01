import { describe, it, expect } from "vitest";
import { accessControlAgent } from "../src/agent/access-control-agent";
import { allToolNames } from "../src/tools/index";

describe("Access Control Agent Definition", () => {
  it("has a valid name", () => { expect(accessControlAgent.name).toBeTruthy(); });
  it("has a non-empty system_prompt", () => { expect(accessControlAgent.system_prompt.length).toBeGreaterThan(50); });
  it("tool_names match allToolNames", () => {
    for (const name of accessControlAgent.tools) { expect(allToolNames).toContain(name); }
  });
});
