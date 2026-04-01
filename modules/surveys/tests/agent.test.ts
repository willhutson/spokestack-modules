import { describe, it, expect } from "vitest";
import { surveysAgent } from "../src/agent/surveys-agent";
import { allToolNames } from "../src/tools/index";

describe("Surveys Agent Definition", () => {
  it("has a valid name", () => { expect(surveysAgent.name).toBeTruthy(); });
  it("has a non-empty system_prompt", () => { expect(surveysAgent.system_prompt.length).toBeGreaterThan(50); });
  it("tool_names match allToolNames", () => {
    for (const name of surveysAgent.tools) { expect(allToolNames).toContain(name); }
  });
});
