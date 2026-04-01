/**
 * ModuleInstaller — the integration seam between SDK and live APIs.
 *
 * Two-step install flow:
 *   1. POST {coreUrl}/api/v1/modules/install → creates OrgModule in core
 *   2. POST {agentBuilderUrl}/api/v1/core/modules/register → registers agent
 *
 * Configurable with base URLs and auth tokens — no hardcoded URLs.
 */

import type { InstallResult, UninstallResult, ModuleManifest } from "../types/index";
import { validateManifest } from "../validator/index";

export interface InstallOptions {
  orgId: string;
  moduleType: string;
  coreUrl: string;
  agentBuilderUrl: string;
  authToken: string;
  agentBuilderSecret: string;
}

export interface UninstallOptions {
  orgId: string;
  moduleType: string;
  coreUrl: string;
  agentBuilderUrl: string;
  authToken: string;
  agentBuilderSecret: string;
}

export class ModuleInstaller {
  /**
   * Install a module: validate → register with core → register with agent-builder.
   */
  async install(opts: InstallOptions): Promise<InstallResult> {
    const errors: string[] = [];

    // Step 1: POST to spokestack-core to create OrgModule
    let orgModule: InstallResult["orgModule"];
    try {
      const coreResponse = await fetch(`${opts.coreUrl}/api/v1/modules/install`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${opts.authToken}`,
        },
        body: JSON.stringify({
          orgId: opts.orgId,
          moduleType: opts.moduleType,
        }),
      });

      if (!coreResponse.ok) {
        const err = await coreResponse.json().catch(() => ({ error: `HTTP ${coreResponse.status}` }));
        return {
          success: false,
          agentRegistered: false,
          errors: [`Core install failed: ${err.error || coreResponse.status}`],
        };
      }

      const coreData = await coreResponse.json();
      orgModule = coreData.orgModule;
    } catch (err) {
      return {
        success: false,
        agentRegistered: false,
        errors: [`Core unreachable: ${err instanceof Error ? err.message : String(err)}`],
      };
    }

    // Step 2: POST to agent-builder to register module agent
    let agentRegistered = false;
    try {
      const agentResponse = await fetch(`${opts.agentBuilderUrl}/api/v1/core/modules/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Agent-Secret": opts.agentBuilderSecret,
        },
        body: JSON.stringify({
          org_id: opts.orgId,
          module_type: opts.moduleType,
        }),
      });

      agentRegistered = agentResponse.ok;
      if (!agentRegistered) {
        errors.push("Agent registration failed — module installed but agent not available");
      }
    } catch {
      errors.push("Agent-builder unreachable — module installed but agent not available");
    }

    return {
      success: true,
      orgModule,
      agentRegistered,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Uninstall a module: deregister from agent-builder → remove from core.
   */
  async uninstall(opts: UninstallOptions): Promise<UninstallResult> {
    const errors: string[] = [];

    // Step 1: Deregister from agent-builder
    try {
      await fetch(
        `${opts.agentBuilderUrl}/api/v1/core/modules/${encodeURIComponent(opts.orgId)}/${encodeURIComponent(opts.moduleType)}/deregister`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Agent-Secret": opts.agentBuilderSecret,
          },
        }
      );
    } catch {
      errors.push("Agent-builder unreachable during deregistration");
    }

    // Step 2: POST to core to deactivate OrgModule
    try {
      const response = await fetch(`${opts.coreUrl}/api/v1/modules/uninstall`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${opts.authToken}`,
        },
        body: JSON.stringify({
          orgId: opts.orgId,
          moduleType: opts.moduleType,
        }),
      });

      if (!response.ok) {
        errors.push("Core uninstall failed");
      }
    } catch {
      errors.push("Core unreachable during uninstall");
    }

    return {
      success: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Install with manifest validation first.
   */
  async installWithValidation(
    manifest: ModuleManifest,
    opts: Omit<InstallOptions, "moduleType">,
  ): Promise<InstallResult> {
    const validation = validateManifest(manifest);
    if (!validation.valid) {
      return {
        success: false,
        agentRegistered: false,
        errors: validation.errors,
      };
    }

    return this.install({ ...opts, moduleType: manifest.moduleType });
  }
}
