import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { install } from "../migrations/install";

describe("LMS Manifest Validation", () => {
  it("loads and validates the LMS manifest", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "manifest.json"), "utf-8"));
    expect(manifest.name).toBe("LMS");
    expect(manifest.type).toBe("LMS");
    expect(manifest.slug).toBe("lms");
    expect(manifest.version).toBe("1.0.0");
    expect(manifest.category).toBe("ops");
  });

  it("declares tools", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "manifest.json"), "utf-8"));
    expect(manifest.tools.length).toBeGreaterThanOrEqual(5);
  });

  it("has migration files", () => {
    expect(fs.existsSync(path.join(__dirname, "..", "migrations", "install.ts"))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, "..", "migrations", "uninstall.ts"))).toBe(true);
  });
});

describe("LMS Install Migration", () => {
  const mockPrisma = {
    contextEntry: { create: async () => ({ id: "ctx_001" }) },
    orgModule: { updateMany: async () => ({ count: 1 }) },
  };

  it("install returns success", async () => {
    const result = await install(mockPrisma, "org_test");
    expect(result.success).toBe(true);
  });
});
