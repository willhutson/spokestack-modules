import { describe, it, expect } from "vitest";
import { boardsAgent } from "../src/agent/boards-agent";
import { allToolNames } from "../src/tools/index";

describe("Boards Agent Definition", () => {
  it("has a valid name", () => { expect(boardsAgent.name).toBeTruthy(); });
  it("has a non-empty system_prompt", () => { expect(boardsAgent.system_prompt.length).toBeGreaterThan(50); });
  it("tool_names match allToolNames", () => {
    for (const name of boardsAgent.tools) { expect(allToolNames).toContain(name); }
  });
});
