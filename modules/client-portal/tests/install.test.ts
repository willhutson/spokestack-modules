import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Client Portal Install", () => {
  it("loads and validates the manifest", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifest.id).toBe("client-portal");
    expect(manifest.moduleType).toBe("CLIENT_PORTAL");
    expect(manifest.tools.length).toBeGreaterThanOrEqual(1);
    expect(manifest.surfaces.length).toBe(3);
    expect(manifest.migrations).toBeDefined();
    expect(manifest.migrations.install).toBeTruthy();
    expect(manifest.migrations.uninstall).toBeTruthy();
  });

  it("install migration returns successfully", async () => {
    const { install } = await import("../migrations/install");
    const mockCtx = {
      prisma: {
        orgSettings: { upsert: async () => ({}) },
        contextEntry: { create: async () => ({}) },
      },
      organizationId: "org_test",
      orgModuleId: "orgmod_test",
    };
    // Should not throw
    await install(mockCtx);
  });
});
