import { describe, it, expect, vi } from "vitest";
import { install } from "../migrations/install";
import { uninstall } from "../migrations/uninstall";

describe("Listening Install", () => {
  const mockPrisma = {
    contextEntry: {
      create: vi.fn().mockResolvedValue({ id: "ctx_001" }),
    },
    orgModule: {
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
  };

  it("install returns success (no seed data needed)", async () => {
    const result = await install(mockPrisma, "org_test");
    expect(result.success).toBe(true);
  });

  it("uninstall returns success", async () => {
    const result = await uninstall(mockPrisma, "org_test");
    expect(result.success).toBe(true);
  });
});
