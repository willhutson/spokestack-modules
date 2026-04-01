/**
 * NPS Install Flow Tests
 *
 * Validates the module manifest and tests the install migration
 * with a mock Prisma client.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { install } from "../migrations/install";

describe("NPS Manifest Validation", () => {
  let manifest: any;

  beforeEach(() => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  });

  it("has correct module identity", () => {
    expect(manifest.id).toBe("nps");
    expect(manifest.moduleType).toBe("NPS");
    expect(manifest.name).toBe("NPS & Surveys");
    expect(manifest.version).toBe("1.0.0");
  });

  it("has marketing category and STARTER tier", () => {
    expect(manifest.category).toBe("marketing");
    expect(manifest.minTier).toBe("STARTER");
  });

  it("declares exactly 13 tools", () => {
    expect(manifest.tools).toHaveLength(13);
  });

  it("declares exactly 3 surfaces", () => {
    expect(manifest.surfaces).toHaveLength(3);
  });

  it("surfaces have correct structure", () => {
    for (const surface of manifest.surfaces) {
      expect(surface.id).toBeTruthy();
      expect(surface.type).toBe("full-page");
      expect(surface.route).toBeTruthy();
      expect(Array.isArray(surface.requiredTools)).toBe(true);
      expect(surface.requiredTools.length).toBeGreaterThan(0);
    }
  });

  it("has migration paths defined", () => {
    expect(manifest.migrations).toBeDefined();
    expect(manifest.migrations.install).toBe("migrations/install.ts");
    expect(manifest.migrations.uninstall).toBe("migrations/uninstall.ts");
  });

  it("has agent definition reference", () => {
    expect(manifest.agentDefinition).toBeDefined();
    expect(manifest.agentDefinition.name).toBe("nps-agent");
    expect(manifest.agentDefinition.path).toBe("src/agent/nps-agent.ts");
  });

  it("all tool names are valid identifiers", () => {
    for (const tool of manifest.tools) {
      expect(tool).toMatch(/^[a-zA-Z][a-zA-Z0-9]*$/);
    }
  });
});

describe("NPS Install Migration", () => {
  let mockPrisma: any;
  let createdRecords: any[];

  beforeEach(() => {
    createdRecords = [];
    mockPrisma = {
      formTemplate: {
        create: vi.fn().mockImplementation(({ data }) => {
          const record = { id: `form_${Date.now()}_${Math.random()}`, ...data };
          createdRecords.push(record);
          return Promise.resolve(record);
        }),
      },
      contextEntry: {
        create: vi.fn().mockImplementation(({ data }) => {
          const record = { id: `ctx_${Date.now()}`, ...data };
          createdRecords.push(record);
          return Promise.resolve(record);
        }),
      },
    };
  });

  it("creates two system form templates and a context entry", async () => {
    await install({
      prisma: mockPrisma,
      organizationId: "org_test",
      orgModuleId: "orgmod_test",
    });

    expect(mockPrisma.formTemplate.create).toHaveBeenCalledTimes(2);
    expect(mockPrisma.contextEntry.create).toHaveBeenCalledTimes(1);
  });

  it("creates CONTACT_US template with correct config", async () => {
    await install({
      prisma: mockPrisma,
      organizationId: "org_test",
      orgModuleId: "orgmod_test",
    });

    const contactUsCall = mockPrisma.formTemplate.create.mock.calls[0][0];
    expect(contactUsCall.data.type).toBe("CONTACT_US");
    expect(contactUsCall.data.name).toBe("Contact Us");
    expect(contactUsCall.data.isActive).toBe(true);
    expect(contactUsCall.data.isSystem).toBe(true);
    expect(contactUsCall.data.submissionModel).toBe("standalone");
    expect(contactUsCall.data.config.sections).toHaveLength(1);
    expect(contactUsCall.data.config.sections[0].fields).toHaveLength(3);
  });

  it("creates FEEDBACK template with correct config", async () => {
    await install({
      prisma: mockPrisma,
      organizationId: "org_test",
      orgModuleId: "orgmod_test",
    });

    const feedbackCall = mockPrisma.formTemplate.create.mock.calls[1][0];
    expect(feedbackCall.data.type).toBe("FEEDBACK");
    expect(feedbackCall.data.name).toBe("General Feedback");
    expect(feedbackCall.data.isActive).toBe(true);
    expect(feedbackCall.data.isSystem).toBe(true);
    expect(feedbackCall.data.config.sections[0].fields).toHaveLength(2);
  });

  it("creates context entry with correct metadata", async () => {
    await install({
      prisma: mockPrisma,
      organizationId: "org_test",
      orgModuleId: "orgmod_test",
    });

    const ctxCall = mockPrisma.contextEntry.create.mock.calls[0][0];
    expect(ctxCall.data.organizationId).toBe("org_test");
    expect(ctxCall.data.entryType).toBe("ENTITY");
    expect(ctxCall.data.category).toBe("nps.module");
    expect(ctxCall.data.key).toBe("installed");
    expect(ctxCall.data.value.orgModuleId).toBe("orgmod_test");
    expect(ctxCall.data.value.systemForms).toEqual(["CONTACT_US", "FEEDBACK"]);
    expect(ctxCall.data.confidence).toBe(0.9);
    expect(ctxCall.data.sourceAgentType).toBe("MODULE");
  });

  it("uses the provided organizationId for all records", async () => {
    await install({
      prisma: mockPrisma,
      organizationId: "org_specific",
      orgModuleId: "orgmod_specific",
    });

    for (const call of mockPrisma.formTemplate.create.mock.calls) {
      expect(call[0].data.organizationId).toBe("org_specific");
    }
    expect(mockPrisma.contextEntry.create.mock.calls[0][0].data.organizationId).toBe("org_specific");
  });
});
