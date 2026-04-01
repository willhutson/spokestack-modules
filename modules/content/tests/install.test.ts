/**
 * Content Studio — Install Flow Tests
 *
 * Integration test for the module installation flow.
 * Mocks HTTP calls to spokestack-core and agent-builder.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ModuleInstaller } from "../../../sdk/installer/index";
import * as fs from "fs";
import * as path from "path";
import { install } from "../migrations/install";
import { uninstall } from "../migrations/uninstall";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe("Content Studio Install Flow", () => {
  let installer: ModuleInstaller;
  const coreUrl = "https://spokestack-core.vercel.app";
  const agentBuilderUrl = "https://ongoingagentbuilder-production.up.railway.app";
  const authToken = "test-token";
  const agentBuilderSecret = "test-agent-secret";

  beforeEach(() => {
    installer = new ModuleInstaller();
    mockFetch.mockReset();
  });

  it("loads and validates the Content Studio manifest", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.id).toBe("content");
    expect(manifest.moduleType).toBe("CONTENT_STUDIO");
    expect(manifest.name).toBe("Content Studio");
    expect(manifest.category).toBe("custom");
    expect(manifest.price).toBeNull();
    expect(manifest.minTier).toBe("BUSINESS");
    expect(manifest.tools.length).toBe(60);
    expect(manifest.surfaces.length).toBe(6);
    expect(manifest.migrations).toBeDefined();
    expect(manifest.migrations.install).toBeTruthy();
    expect(manifest.migrations.uninstall).toBeTruthy();
  });

  it("install() calls core then agent-builder on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        orgModule: {
          id: "orgmod_content_001",
          moduleType: "CONTENT_STUDIO",
          installedAt: new Date().toISOString(),
        },
      }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ registered: true }),
    });

    const result = await installer.install({
      orgId: "org_test",
      moduleType: "CONTENT_STUDIO",
      coreUrl,
      agentBuilderUrl,
      authToken,
      agentBuilderSecret,
    });

    expect(result.success).toBe(true);
    expect(result.agentRegistered).toBe(true);
    expect(result.orgModule).toBeDefined();
    expect(result.orgModule?.moduleType).toBe("CONTENT_STUDIO");

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[0][0]).toBe(`${coreUrl}/api/v1/modules/install`);
    expect(mockFetch.mock.calls[1][0]).toBe(`${agentBuilderUrl}/api/v1/core/modules/register`);
  });

  it("install() returns error when core rejects", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: "Module requires BUSINESS tier" }),
    });

    const result = await installer.install({
      orgId: "org_test",
      moduleType: "CONTENT_STUDIO",
      coreUrl,
      agentBuilderUrl,
      authToken,
      agentBuilderSecret,
    });

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.agentRegistered).toBe(false);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("install migration returns success with seeded items", async () => {
    const mockCtx = {
      prisma: {},
      organizationId: "org_test",
      orgModuleId: "orgmod_test",
    };

    const result = await install(mockCtx);
    expect(result.success).toBe(true);
    expect(result.seeded).toContain("brand_library");
    expect(result.seeded).toContain("doc_templates");
    expect(result.seeded).toContain("default_trigger");
  });

  it("uninstall migration returns success", async () => {
    const mockCtx = {
      prisma: {},
      organizationId: "org_test",
    };

    const result = await uninstall(mockCtx);
    expect(result.success).toBe(true);
  });
});
