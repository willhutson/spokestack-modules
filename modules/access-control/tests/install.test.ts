import { describe, it, expect } from "vitest";
import { install } from "../migrations/install";
import { uninstall } from "../migrations/uninstall";

describe("Access Control Install", () => {
  const mockPrisma = { contextEntry: { create: async () => ({ id: "ctx_001" }) }, orgModule: { updateMany: async () => ({ count: 1 }) } };
  it("install returns success", async () => { expect((await install(mockPrisma, "org_test")).success).toBe(true); });
  it("uninstall returns success", async () => { expect((await uninstall(mockPrisma, "org_test")).success).toBe(true); });
});
