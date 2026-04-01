import { describe, it, expect } from "vitest";
import { builderAgent } from "../src/agent/builder-agent";
import { allToolNames } from "../src/tools/index";

describe("Builder Agent Definition", () => {
  it("has a valid name", () => { expect(builderAgent.name).toBeTruthy(); });
  it("has a non-empty system_prompt", () => { expect(builderAgent.system_prompt.length).toBeGreaterThan(50); });
  it("tool_names match allToolNames", () => {
    for (const name of builderAgent.tools) { expect(allToolNames).toContain(name); }
  });
});
