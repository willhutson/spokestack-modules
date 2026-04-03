import { describe, it, expect } from "vitest";
import { install } from "../migrations/install";

const mockPrisma = {
  contextEntry: { create: async () => ({ id: "ctx_001" }) },
  orgModule: { updateMany: async () => ({ count: 1 }) },
};

describe("Tickets Install", () => {
  it("install returns success", async () => {
    expect((await install(mockPrisma, "org_test")).success).toBe(true);
  });
});
