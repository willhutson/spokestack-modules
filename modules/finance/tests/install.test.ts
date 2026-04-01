import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Finance Install", () => {
  it("loads and validates the manifest", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifest.id).toBe("finance");
    expect(manifest.moduleType).toBe("FINANCE");
    expect(manifest.tools.length).toBe(13);
    expect(manifest.surfaces.length).toBe(3);
    expect(manifest.migrations).toBeDefined();
    expect(manifest.migrations.install).toBe("migrations/install.ts");
    expect(manifest.migrations.uninstall).toBe("migrations/uninstall.ts");
  });

  it("manifest has correct metadata", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifest.category).toBe("ops");
    expect(manifest.minTier).toBe("BUSINESS");
    expect(manifest.price).toBe(1500);
    expect(manifest.agentDefinition.name).toBe("finance-agent");
  });

  it("manifest surfaces have correct routes", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const surfaces = manifest.surfaces;
    expect(surfaces[0].id).toBe("finance-home");
    expect(surfaces[0].route).toBe("/finance");
    expect(surfaces[1].id).toBe("finance-invoices");
    expect(surfaces[1].route).toBe("/finance/invoices");
    expect(surfaces[2].id).toBe("finance-budgets");
    expect(surfaces[2].route).toBe("/finance/budgets");
  });

  it("install migration runs successfully", async () => {
    const { install } = await import("../migrations/install");
    const created: any[] = [];
    const mockCtx = {
      prisma: {
        contextEntry: {
          create: async (args: any) => {
            created.push(args.data);
            return args.data;
          },
        },
      },
      organizationId: "org_test",
      orgModuleId: "orgmod_test",
    };
    await install(mockCtx);
    expect(created.length).toBe(1);
    expect(created[0].category).toBe("finance.module");
    expect(created[0].key).toBe("installed");
    expect(created[0].organizationId).toBe("org_test");
  });
});
