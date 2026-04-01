/**
 * Content Studio Install Flow Tests
 *
 * Validates manifest structure and install/uninstall migrations.
 */

import { describe, it, expect } from "vitest";
import { install } from "../migrations/install";
import { uninstall } from "../migrations/uninstall";
import * as fs from "fs";
import * as path from "path";

describe("Content Studio Install Flow", () => {
  it("loads and validates the Content Studio manifest", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.id).toBe("content");
    expect(manifest.moduleType).toBe("CONTENT_STUDIO");
    expect(manifest.name).toBe("Content Studio");
    expect(manifest.version).toBe("1.0.0");
    expect(manifest.category).toBe("custom");
    expect(manifest.price).toBeNull();
    expect(manifest.minTier).toBe("BUSINESS");
    expect(manifest.tools.length).toBe(60);
    expect(manifest.surfaces.length).toBe(6);
    expect(manifest.migrations).toBeDefined();
    expect(manifest.migrations.install).toBeTruthy();
    expect(manifest.migrations.uninstall).toBeTruthy();
  });

  it("manifest agentDefinition references correct path and name", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.agentDefinition.path).toBe("./src/agent/content-agent.ts");
    expect(manifest.agentDefinition.name).toBe("content_studio_agent");
  });

  it("manifest surfaces have correct structure", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    for (const surface of manifest.surfaces) {
      expect(surface.id).toBeTruthy();
      expect(surface.type).toBe("full-page");
      expect(surface.route).toBeTruthy();
      expect(surface.requiredTools).toBeInstanceOf(Array);
      expect(surface.requiredTools.length).toBeGreaterThan(0);
    }
  });

  it("install() returns success with seeded items", async () => {
    const result = await install("org_test");

    expect(result.success).toBe(true);
    expect(result.seeded).toBeDefined();
    expect(result.seeded).toContain("brand_library");
    expect(result.seeded).toContain("doc_templates");
    expect(result.seeded).toContain("default_trigger");
  });

  it("uninstall() returns success", async () => {
    const result = await uninstall("org_test");

    expect(result.success).toBe(true);
  });
});
