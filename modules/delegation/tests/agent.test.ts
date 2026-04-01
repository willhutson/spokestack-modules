import { describe, it, expect } from "vitest";
import { delegationAgent } from "../src/agent/delegation-agent";
import { allToolNames } from "../src/tools/index";

describe("Delegation Agent Definition", () => {
  it("has a valid name", () => { expect(delegationAgent.name).toBeTruthy(); });
  it("has a non-empty system_prompt", () => { expect(delegationAgent.system_prompt.length).toBeGreaterThan(50); });
  it("tool_names match allToolNames", () => {
    for (const name of delegationAgent.tools) { expect(allToolNames).toContain(name); }
  });
});
