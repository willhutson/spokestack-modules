/**
 * Media Buying Install Flow Tests
 *
 * Validates the module manifest and runs install migration with mock prisma.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { install } from "../migrations/install";

describe("Media Buying Manifest Validation", () => {
  it("loads and validates the media buying manifest", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.name).toBe("@spokestack/media-buying");
    expect(manifest.displayName).toBe("Media Buying");
    expect(manifest.version).toBe("0.1.0");
  });

  it("declares required schema models", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.schema.models).toContain("mb_Campaign");
    expect(manifest.schema.models).toContain("mb_AdSet");
    expect(manifest.schema.models).toContain("mb_Creative");
    expect(manifest.schema.prefix).toBe("mb_");
  });

  it("declares an agent definition", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.agent).toBeDefined();
    expect(manifest.agent.name).toBe("media-buying-agent");
  });

  it("declares migration paths", () => {
    const installPath = path.join(__dirname, "..", "migrations", "install.ts");
    const uninstallPath = path.join(__dirname, "..", "migrations", "uninstall.ts");

    expect(fs.existsSync(installPath)).toBe(true);
    expect(fs.existsSync(uninstallPath)).toBe(true);
  });
});

describe("Media Buying Install Migration", () => {
  let mockPrisma: any;
  const orgId = "org_test_123";
  const orgModuleId = "orgmod_mb_123";

  beforeEach(() => {
    mockPrisma = {
      mb_Campaign: {
        create: vi.fn().mockResolvedValue({ id: "camp_mock" }),
      },
      contextEntry: {
        create: vi.fn().mockResolvedValue({ id: "ctx_mock" }),
      },
    };
  });

  it("creates two default campaigns", async () => {
    await install({ prisma: mockPrisma, organizationId: orgId, orgModuleId });

    expect(mockPrisma.mb_Campaign.create).toHaveBeenCalledTimes(2);

    const firstCall = mockPrisma.mb_Campaign.create.mock.calls[0][0].data;
    expect(firstCall.name).toBe("Sample Awareness Campaign");
    expect(firstCall.objective).toBe("AWARENESS");
    expect(firstCall.platform).toBe("META");
    expect(firstCall.status).toBe("DRAFT");
    expect(firstCall.organizationId).toBe(orgId);

    const secondCall = mockPrisma.mb_Campaign.create.mock.calls[1][0].data;
    expect(secondCall.name).toBe("Sample Conversions Campaign");
    expect(secondCall.objective).toBe("CONVERSIONS");
    expect(secondCall.platform).toBe("GOOGLE");
  });

  it("creates a context entry for the installed module", async () => {
    await install({ prisma: mockPrisma, organizationId: orgId, orgModuleId });

    expect(mockPrisma.contextEntry.create).toHaveBeenCalledTimes(1);

    const ctxData = mockPrisma.contextEntry.create.mock.calls[0][0].data;
    expect(ctxData.organizationId).toBe(orgId);
    expect(ctxData.entryType).toBe("ENTITY");
    expect(ctxData.category).toBe("media-buying.module");
    expect(ctxData.key).toBe("installed");
    expect(ctxData.value.orgModuleId).toBe(orgModuleId);
    expect(ctxData.value.defaultCampaigns).toEqual(["Sample Awareness Campaign", "Sample Conversions Campaign"]);
  });
});
