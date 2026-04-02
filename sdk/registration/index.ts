/**
 * Module Registration — registers/deregisters modules with ongoing_agent_builder.
 *
 * Uses X-Agent-Secret header (not Authorization: Bearer).
 * Uses snake_case body fields per agent-builder convention.
 * Uses DELETE for deregistration.
 */

import type { ModuleManifest, AgentDefinition } from '../types/index';

export interface RegistrationConfig {
  /** Base URL for ongoing_agent_builder */
  agentBuilderUrl: string;
  /** Secret for X-Agent-Secret header */
  agentSecret: string;
  /** Base URL for spokestack-core */
  coreUrl: string;
  /** Bearer token for core API */
  coreAuthToken: string;
}

export interface RegistrationResult {
  registered: boolean;
  moduleType: string;
  error?: string;
}

/**
 * Register a module with both spokestack-core and agent-builder.
 */
export async function registerModule(
  manifest: ModuleManifest,
  agent: AgentDefinition,
  orgId: string,
  config: RegistrationConfig,
): Promise<RegistrationResult> {
  // Step 1: Register with spokestack-core (creates OrgModule)
  try {
    const coreRes = await fetch(`${config.coreUrl}/api/v1/modules/install`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.coreAuthToken}`,
      },
      body: JSON.stringify({
        orgId,
        moduleType: manifest.moduleType,
      }),
    });

    if (!coreRes.ok) {
      const err = await coreRes.json().catch(() => ({ error: `HTTP ${coreRes.status}` }));
      return { registered: false, moduleType: manifest.moduleType, error: `Core: ${err.error || coreRes.status}` };
    }
  } catch (err) {
    return { registered: false, moduleType: manifest.moduleType, error: `Core unreachable: ${(err as Error).message}` };
  }

  // Step 2: Register with agent-builder (snake_case body, X-Agent-Secret header)
  try {
    const agentRes = await fetch(`${config.agentBuilderUrl}/api/v1/core/modules/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Agent-Secret': config.agentSecret,
      },
      body: JSON.stringify({
        org_id: orgId,
        module_type: manifest.moduleType,
        agent_definition: {
          name: agent.name,
          description: agent.description,
          system_prompt: agent.system_prompt,
          tools: agent.tools,
        },
      }),
    });

    if (!agentRes.ok) {
      return { registered: true, moduleType: manifest.moduleType, error: 'Core registered but agent-builder failed' };
    }
  } catch {
    return { registered: true, moduleType: manifest.moduleType, error: 'Core registered but agent-builder unreachable' };
  }

  return { registered: true, moduleType: manifest.moduleType };
}

/**
 * Deregister a module from agent-builder and core.
 */
export async function deregisterModule(
  moduleType: string,
  orgId: string,
  config: RegistrationConfig,
): Promise<RegistrationResult> {
  // Step 1: Deregister from agent-builder (DELETE endpoint)
  try {
    await fetch(
      `${config.agentBuilderUrl}/api/v1/core/modules/${encodeURIComponent(orgId)}/${encodeURIComponent(moduleType)}/deregister`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Agent-Secret': config.agentSecret,
        },
      },
    );
  } catch {
    // Non-blocking — continue with core deregistration
  }

  // Step 2: Deactivate in core
  try {
    const res = await fetch(`${config.coreUrl}/api/v1/modules/uninstall`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.coreAuthToken}`,
      },
      body: JSON.stringify({ orgId, moduleType }),
    });

    if (!res.ok) {
      return { registered: false, moduleType, error: `Core uninstall failed: ${res.status}` };
    }
  } catch (err) {
    return { registered: false, moduleType, error: `Core unreachable: ${(err as Error).message}` };
  }

  return { registered: false, moduleType };
}
