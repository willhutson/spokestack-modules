/**
 * Workflows Install Flow Tests
 *
 * Validates the module manifest and runs install migration with mock prisma.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { install } from "../migrations/install";

describe("Workflows Manifest Validation", () => {
  it("loads and validates the workflows manifest", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.id).toBe("workflows");
    expect(manifest.moduleType).toBe("WORKFLOWS");
    expect(manifest.name).toBe("Workflows");
    expect(manifest.version).toBe("1.0.0");
    expect(manifest.category).toBe("ops");
    expect(manifest.minTier).toBe("PRO");
    expect(manifest.price).toBe(1000);
  });

  it("declares exactly 15 tools", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.tools.length).toBeGreaterThanOrEqual(1);
    const toolNames = manifest.tools.map((t: any) => typeof t === "string" ? t : t.name);
    expect(toolNames).toContain("create_workflow");
  });

  it("declares exactly 3 surfaces", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.surfaces).toHaveLength(3);

    const surfaceIds = manifest.surfaces.map((s: any) => s.id);
    expect(surfaceIds).toContain("workflows-home");
    expect(surfaceIds).toContain("workflows-templates");
    expect(surfaceIds).toContain("workflows-active");

    for (const surface of manifest.surfaces) {
      expect(surface.type).toBe("full-page");
      expect(surface.route).toBeTruthy();
      expect(surface.requiredTools.length).toBeGreaterThan(0);
    }
  });

  it("declares migration paths", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.migrations).toBeDefined();
    expect(manifest.migrations.install).toBe("migrations/install.ts");
    expect(manifest.migrations.uninstall).toBe("migrations/uninstall.ts");
  });

  it("has a valid agent definition reference", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.agentDefinition).toBeDefined();
    expect(manifest.agentDefinition.name).toBe("workflow-agent");
    expect(manifest.agentDefinition.path).toBe("src/agent/workflow-agent.ts");
  });
});

describe("Workflows Install Migration", () => {
  let mockPrisma: any;
  const orgId = "org_test_123";
  const orgModuleId = "orgmod_wf_123";

  beforeEach(() => {
    mockPrisma = {
      workflowTemplate: {
        create: vi.fn().mockResolvedValue({ id: "wft_mock" }),
      },
      contextEntry: {
        create: vi.fn().mockResolvedValue({ id: "ctx_mock" }),
      },
    };
  });

  it("creates two default workflow templates", async () => {
    await install({ prisma: mockPrisma, organizationId: orgId, orgModuleId });

    expect(mockPrisma.workflowTemplate.create).toHaveBeenCalledTimes(2);

    const firstCall = mockPrisma.workflowTemplate.create.mock.calls[0][0].data;
    expect(firstCall.name).toBe("New Brief Intake");
    expect(firstCall.module).toBe("agency");
    expect(firstCall.triggerType).toBe("brief.created");
    expect(firstCall.taskTemplates).toHaveLength(5);
    expect(firstCall.status).toBe("PUBLISHED");
    expect(firstCall.organizationId).toBe(orgId);

    const secondCall = mockPrisma.workflowTemplate.create.mock.calls[1][0].data;
    expect(secondCall.name).toBe("Deal Won Onboarding");
    expect(secondCall.module).toBe("crm");
    expect(secondCall.triggerType).toBe("deal.won");
    expect(secondCall.taskTemplates).toHaveLength(7);
    expect(secondCall.status).toBe("PUBLISHED");
  });

  it("creates a context entry for the installed module", async () => {
    await install({ prisma: mockPrisma, organizationId: orgId, orgModuleId });

    expect(mockPrisma.contextEntry.create).toHaveBeenCalledTimes(1);

    const ctxData = mockPrisma.contextEntry.create.mock.calls[0][0].data;
    expect(ctxData.organizationId).toBe(orgId);
    expect(ctxData.entryType).toBe("ENTITY");
    expect(ctxData.category).toBe("workflows.module");
    expect(ctxData.key).toBe("installed");
    expect(ctxData.value.orgModuleId).toBe(orgModuleId);
    expect(ctxData.value.defaultTemplates).toEqual(["New Brief Intake", "Deal Won Onboarding"]);
    expect(ctxData.confidence).toBe(0.9);
    expect(ctxData.sourceAgentType).toBe("MODULE");
  });
});
