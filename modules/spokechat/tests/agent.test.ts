import { describe, it, expect } from "vitest";
import { spokechatAgent } from "../src/agent/spokechat-agent";
import { allToolNames } from "../src/tools/index";

describe("SpokeChat Agent Definition", () => {
  it("has a valid name", () => { expect(spokechatAgent.name).toBeTruthy(); });
  it("has a non-empty system_prompt", () => { expect(spokechatAgent.system_prompt.length).toBeGreaterThan(50); });
  it("tool_names match allToolNames", () => {
    for (const name of spokechatAgent.tools) { expect(allToolNames).toContain(name); }
  });
});
