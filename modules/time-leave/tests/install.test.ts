import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Time & Leave Install", () => {
  it("loads and validates the manifest", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifest.id).toBe("time-leave");
    expect(manifest.moduleType).toBe("TIME_LEAVE");
    expect(manifest.tools.length).toBeGreaterThanOrEqual(1);
    expect(manifest.surfaces.length).toBe(3);
    expect(manifest.migrations).toBeDefined();
  });

  it("install migration runs successfully", async () => {
    const { install } = await import("../migrations/install");
    const created: any[] = [];
    const mockCtx = {
      prisma: {
        leaveType: { create: async (args: any) => { created.push(args.data); return args.data; } },
        contextEntry: { create: async () => ({}) },
      },
      organizationId: "org_test",
      orgModuleId: "orgmod_test",
    };
    await install(mockCtx);
    expect(created.length).toBe(3); // 3 default leave types
  });
});
