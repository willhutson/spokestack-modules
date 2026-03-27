/**
 * CRM Schema Validation Tests — ensures manifest and schema follow rules.
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import type { ModuleManifest } from "@spokestack/module-sdk";

const MANIFEST_PATH = path.join(__dirname, "..", "manifest.json");

describe("CRM Schema Validation", () => {
  let manifest: ModuleManifest;

  it("has a valid manifest.json", () => {
    const raw = fs.readFileSync(MANIFEST_PATH, "utf-8");
    manifest = JSON.parse(raw);
    expect(manifest).toBeDefined();
  });

  it("all models are prefixed with crm_", () => {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    for (const model of manifest.schema.models) {
      expect(model).toMatch(/^crm_/);
    }
  });

  it("declares the correct models", () => {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    expect(manifest.schema.models).toContain("crm_Contact");
    expect(manifest.schema.models).toContain("crm_Deal");
    expect(manifest.schema.models).toContain("crm_Pipeline");
    expect(manifest.schema.models).toContain("crm_Interaction");
    expect(manifest.schema.models).toContain("crm_Tag");
  });

  it("has no direct FK to core models other than organizationId", () => {
    const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    // Check that no @relation references core models
    const relations = schema.match(/@relation\(fields:\s*\[(\w+)\]/g) || [];
    const fkFields = relations.map((r) => {
      const match = r.match(/\[(\w+)\]/);
      return match ? match[1] : "";
    });

    // Only allowed FK into core is organizationId
    const coreRefs = fkFields.filter((f) => f !== "organizationId" && f !== "contactId" && f !== "pipelineId");
    expect(coreRefs).toHaveLength(0);
  });

  it("every model has deletedAt for soft deletes", () => {
    const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    // Extract model blocks
    const modelBlocks = schema.match(/model\s+crm_\w+\s*\{[^}]+\}/g) || [];
    expect(modelBlocks.length).toBeGreaterThan(0);

    for (const block of modelBlocks) {
      const modelName = block.match(/model\s+(crm_\w+)/)?.[1];
      expect(block).toContain("deletedAt");
    }
  });

  it("has required manifest fields", () => {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    expect(manifest.name).toBeDefined();
    expect(manifest.displayName).toBeDefined();
    expect(manifest.version).toBeDefined();
    expect(manifest.schema.prefix).toBe("crm_");
    expect(manifest.agent.name).toBeDefined();
    expect(manifest.agent.tools.length).toBeGreaterThan(0);
    expect(manifest.permissions.ownModels).toBe(true);
  });

  it("declares ContextEntry in coreWrite permissions", () => {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    expect(manifest.permissions.coreWrite).toContain("ContextEntry");
  });
});
