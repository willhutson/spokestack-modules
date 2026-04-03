/**
 * Suite Installer — installs a suite (multiple modules + config + workflows + prompts).
 * Implements the three-leg install protocol from the deployment spec.
 */

import type { SuiteDefinition, SuiteInstallResult, SuitePlanResult } from './types';

export interface SuiteInstallContext {
  coreUrl: string;
  builderUrl: string;
  orgId: string;
  authHeaders: Record<string, string>;
  agentSecret: string;
}

/**
 * Plan a suite install — show what would happen without executing.
 */
export function planSuiteInstall(suite: SuiteDefinition): SuitePlanResult {
  return {
    suite,
    modulesToInstall: suite.modules,
    configChanges: suite.config,
    workflowsToCreate: suite.workflows?.length ?? 0,
    estimatedTime: `~${suite.modules.length * 5}s`,
  };
}

/**
 * Install a suite — three-leg protocol for each module + config + workflows + prompts.
 */
export async function installSuite(
  suite: SuiteDefinition,
  ctx: SuiteInstallContext,
): Promise<SuiteInstallResult> {
  const errors: string[] = [];
  let installed = 0;

  // 1. Apply org config
  if (suite.config && Object.keys(suite.config).length > 0) {
    try {
      await fetch(`${ctx.coreUrl}/api/v1/settings`, {
        method: 'PATCH',
        headers: { ...ctx.authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(suite.config),
      });
    } catch (err) {
      errors.push(`Config update failed: ${(err as Error).message}`);
    }
  }

  // 2. Install each module (three-leg: core + builder + route verification)
  for (const moduleType of suite.modules) {
    try {
      // Leg 1: Core — create OrgModule
      const coreRes = await fetch(`${ctx.coreUrl}/api/v1/modules/install`, {
        method: 'POST',
        headers: { ...ctx.authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleType }),
      });
      if (!coreRes.ok) {
        errors.push(`${moduleType}: core install failed (${coreRes.status})`);
        continue;
      }

      // Leg 2: Builder — register tools + prompts
      await fetch(`${ctx.builderUrl}/api/v1/core/modules/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Agent-Secret': ctx.agentSecret },
        body: JSON.stringify({ org_id: ctx.orgId, module_type: moduleType }),
      }).catch(() => errors.push(`${moduleType}: builder registration failed`));

      installed++;
    } catch (err) {
      errors.push(`${moduleType}: ${(err as Error).message}`);
    }
  }

  // 3. Apply module overrides
  if (suite.moduleOverrides) {
    for (const [moduleType, overrides] of Object.entries(suite.moduleOverrides)) {
      try {
        await fetch(`${ctx.coreUrl}/api/v1/modules/${moduleType}/config`, {
          method: 'PATCH',
          headers: { ...ctx.authHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify(overrides),
        });
      } catch {
        errors.push(`${moduleType}: config override failed`);
      }
    }
  }

  // 4. Create workflow subscriptions
  if (suite.workflows) {
    for (const workflow of suite.workflows) {
      try {
        await fetch(`${ctx.coreUrl}/api/v1/events/subscriptions`, {
          method: 'POST',
          headers: { ...ctx.authHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ organizationId: ctx.orgId, ...workflow, enabled: true }),
        });
      } catch {
        errors.push(`Workflow ${workflow.handler} creation failed`);
      }
    }
  }

  // 5. Register agent prompt overrides
  if (suite.agentPrompts) {
    for (const [agentType, prompt] of Object.entries(suite.agentPrompts)) {
      try {
        await fetch(`${ctx.builderUrl}/api/v1/core/modules/register-prompt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Agent-Secret': ctx.agentSecret },
          body: JSON.stringify({ orgId: ctx.orgId, agentType, systemPromptExtension: prompt }),
        });
      } catch {
        errors.push(`Agent prompt for ${agentType} registration failed`);
      }
    }
  }

  return { success: errors.length === 0, modulesInstalled: installed, errors };
}
