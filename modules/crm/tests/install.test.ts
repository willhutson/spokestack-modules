/**
 * CRM Install Flow Tests
 *
 * Integration test for the module installation flow.
 * Mocks HTTP calls to spokestack-core and agent-builder.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ModuleInstaller } from "../../../sdk/installer/index";
import * as fs from "fs";
import * as path from "path";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe("CRM Install Flow", () => {
  let installer: ModuleInstaller;
  const coreUrl = "https://spokestack-core.vercel.app";
  const agentBuilderUrl = "https://ongoingagentbuilder-production.up.railway.app";
  const authToken = "test-token";
  const agentBuilderSecret = "test-agent-secret";

  beforeEach(() => {
    installer = new ModuleInstaller();
    mockFetch.mockReset();
  });

  it("loads and validates the CRM manifest", () => {
    const manifestPath = path.join(__dirname, "..", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.id).toBe("crm");
    expect(manifest.moduleType).toBe("CRM");
    expect(manifest.tools.length).toBe(25);
    expect(manifest.surfaces.length).toBe(4);
    expect(manifest.migrations).toBeDefined();
    expect(manifest.migrations.install).toBeTruthy();
    expect(manifest.migrations.uninstall).toBeTruthy();
  });

  it("install() calls core then agent-builder on success", async () => {
    // Mock core install endpoint
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        orgModule: {
          id: "orgmod_123",
          moduleType: "CRM",
          installedAt: new Date().toISOString(),
        },
      }),
    });

    // Mock agent-builder register endpoint
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ registered: true }),
    });

    const result = await installer.install({
      orgId: "org_test",
      moduleType: "CRM",
      coreUrl,
      agentBuilderUrl,
      authToken,
      agentBuilderSecret,
    });

    expect(result.success).toBe(true);
    expect(result.agentRegistered).toBe(true);
    expect(result.orgModule).toBeDefined();
    expect(result.orgModule?.moduleType).toBe("CRM");

    // Verify core was called first
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[0][0]).toBe(`${coreUrl}/api/v1/modules/install`);
    expect(mockFetch.mock.calls[1][0]).toBe(`${agentBuilderUrl}/api/v1/core/modules/register`);
  });

  it("install() returns error when core rejects", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: "Module requires PRO tier" }),
    });

    const result = await installer.install({
      orgId: "org_test",
      moduleType: "CRM",
      coreUrl,
      agentBuilderUrl,
      authToken,
      agentBuilderSecret,
    });

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.agentRegistered).toBe(false);
    // Should NOT call agent-builder if core fails
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("install() reports partial success when agent-builder fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        orgModule: { id: "orgmod_123", moduleType: "CRM", installedAt: new Date().toISOString() },
      }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: "Agent builder unavailable" }),
    });

    const result = await installer.install({
      orgId: "org_test",
      moduleType: "CRM",
      coreUrl,
      agentBuilderUrl,
      authToken,
      agentBuilderSecret,
    });

    // Core succeeded, agent-builder failed
    expect(result.success).toBe(true);
    expect(result.orgModule).toBeDefined();
    expect(result.agentRegistered).toBe(false);
  });
});
