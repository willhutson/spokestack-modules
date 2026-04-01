import { describe, it, expect, vi } from "vitest";
import { install } from "../migrations/install";
import { uninstall } from "../migrations/uninstall";

describe("Social Publishing Install", () => {
  const mockPrisma = {
    platformSpec: {
      upsert: vi.fn().mockResolvedValue({ id: "spec_001" }),
    },
    contextEntry: {
      create: vi.fn().mockResolvedValue({ id: "ctx_001" }),
    },
    orgModule: {
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
  };

  it("install seeds PlatformSpec records and returns success", async () => {
    const result = await install(mockPrisma, "org_test");
    expect(result.success).toBe(true);
    // 6 platforms seeded
    expect(mockPrisma.platformSpec.upsert).toHaveBeenCalledTimes(6);
  });

  it("uninstall returns success", async () => {
    const result = await uninstall(mockPrisma, "org_test");
    expect(result.success).toBe(true);
  });
});
