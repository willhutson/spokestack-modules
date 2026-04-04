import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { install } from "../migrations/install";

describe("Media Buying Manifest Validation", () => {
  it("loads and validates the manifest", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "manifest.json"), "utf-8"));
    expect(manifest.name).toBe("Media Buying");
    expect(manifest.type).toBe("MEDIA_BUYING");
    expect(manifest.slug).toBe("media-buying");
    expect(manifest.version).toBe("1.0.0");
    expect(manifest.category).toBe("marketing");
  });

  it("declares tools", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "manifest.json"), "utf-8"));
    expect(manifest.tools.length).toBeGreaterThanOrEqual(10);
    expect(manifest.tools).toContain("createCampaign");
  });

  it("has migration files", () => {
    expect(fs.existsSync(path.join(__dirname, "..", "migrations", "install.ts"))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, "..", "migrations", "uninstall.ts"))).toBe(true);
  });
});

describe("Media Buying Install Migration", () => {
  const mockPrisma = {
    contextEntry: { create: async () => ({ id: "ctx_001" }) },
    orgModule: { updateMany: async () => ({ count: 1 }) },
  };

  it("install returns success", async () => {
    const result = await install(mockPrisma, "org_test");
    expect(result.success).toBe(true);
  });
});
