/**
 * CRM Schema Validation Tests — Phase 2
 *
 * Validates the CRM manifest against the Phase 2 ModuleManifest interface
 * and checks the Prisma schema follows module rules.
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import type { ModuleManifest } from "../../../sdk/types/index";
import { validateManifest } from "../../../sdk/validator/index";

const MANIFEST_PATH = path.join(__dirname, "..", "manifest.json");

describe("CRM Schema Validation", () => {
  let manifest: ModuleManifest;

  it("has a valid manifest.json", () => {
    const raw = fs.readFileSync(MANIFEST_PATH, "utf-8");
    manifest = JSON.parse(raw);
    expect(manifest).toBeDefined();
  });

  it("passes validateManifest() with no errors", () => {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    const result = validateManifest(manifest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("has correct Phase 2 required fields", () => {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    expect(manifest.id).toBe("crm");
    expect(manifest.moduleType).toBe("CRM");
    expect(manifest.name).toBe("CRM");
    expect(manifest.version).toBe("1.0.0");
    expect(manifest.description).toBeTruthy();
    expect(manifest.category).toBe("ops");
    expect(manifest.minTier).toBe("PRO");
  });

  it("has a valid agentDefinition reference", () => {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    expect(manifest.agentDefinition).toBeDefined();
    expect(manifest.agentDefinition.name).toBe("crm-agent");
    expect(manifest.agentDefinition.path).toBeTruthy();
  });

  it("declares all 7 CRM tools", () => {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    expect(manifest.tools).toHaveLength(7);
    expect(manifest.tools).toContain("createContact");
    expect(manifest.tools).toContain("listContacts");
    expect(manifest.tools).toContain("updateContact");
    expect(manifest.tools).toContain("createDeal");
    expect(manifest.tools).toContain("updateDeal");
    expect(manifest.tools).toContain("listDeals");
    expect(manifest.tools).toContain("linkContactToDeal");
  });

  it("declares 4 surfaces with valid types", () => {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    expect(manifest.surfaces).toHaveLength(4);

    const types = manifest.surfaces.map((s) => s.type);
    expect(types).toContain("dashboard");
    expect(types).toContain("full-page");

    // Full-page surfaces must have routes
    for (const surface of manifest.surfaces) {
      if (surface.type === "full-page") {
        expect(surface.route).toBeTruthy();
      }
      expect(surface.requiredTools.length).toBeGreaterThan(0);
    }
  });

  it("declares migrations", () => {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    expect(manifest.migrations).toBeDefined();
    expect(manifest.migrations!.install).toBeTruthy();
    expect(manifest.migrations!.uninstall).toBeTruthy();
  });

  it("uses valid BillingTierType value", () => {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    const validTiers = ["FREE", "STARTER", "PRO", "BUSINESS", "ENTERPRISE"];
    expect(validTiers).toContain(manifest.minTier);
  });

  it("Prisma schema: no direct FK to core models other than organizationId", () => {
    const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    const relations = schema.match(/@relation\(fields:\s*\[(\w+)\]/g) || [];
    const fkFields = relations.map((r) => {
      const match = r.match(/\[(\w+)\]/);
      return match ? match[1] : "";
    });

    const coreRefs = fkFields.filter(
      (f) => f !== "organizationId" && f !== "contactId" && f !== "pipelineId",
    );
    expect(coreRefs).toHaveLength(0);
  });

  it("Prisma schema: every model has deletedAt for soft deletes", () => {
    const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    const modelBlocks = schema.match(/model\s+crm_\w+\s*\{[^}]+\}/g) || [];
    expect(modelBlocks.length).toBeGreaterThan(0);

    for (const block of modelBlocks) {
      expect(block).toContain("deletedAt");
    }
  });
});
