import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Analytics Install", () => {
  it("loads and validates the manifest", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifest.id).toBe("analytics");
    expect(manifest.moduleType).toBe("ANALYTICS");
    expect(manifest.tools.length).toBeGreaterThanOrEqual(1);
    expect(manifest.surfaces.length).toBe(3);
    expect(manifest.migrations).toBeDefined();
  });

  it("install migration runs successfully", async () => {
    const { install } = await import("../migrations/install");
    const created: any[] = [];
    const mockCtx = {
      prisma: {
        metricDefinition: { create: async (args: any) => { created.push(args.data); return args.data; } },
        analyticsDashboard: { create: async (args: any) => { created.push(args.data); return args.data; } },
        contextEntry: { create: async () => ({}) },
      },
      organizationId: "org_test",
      orgModuleId: "orgmod_test",
    };
    await install(mockCtx);
    // Should have created 3 metrics + 1 dashboard + 1 context entry
    expect(created.length).toBeGreaterThanOrEqual(4);
  });
});
