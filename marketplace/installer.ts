/**
 * Module Installer — ASYNC installation flow.
 *
 * Core uses OrgModule (with ModuleType enum) for module tracking.
 * There is no separate ModuleInstallation model — we write to OrgModule.
 *
 * Synchronous phase:
 *   1. Validate manifest
 *   2. Check conflicts
 *   3. Create OrgModule record (active: false during provisioning)
 *   4. Activate Stripe billing
 *
 * Async phase (queued):
 *   5. Apply pre-built migration SQL
 *   6. Run install.ts seed
 *   7. Register agent with agent-builder
 *   8. Register surfaces
 *   9. Register milestones
 *   10. Update OrgModule to active: true
 *   11. Agent announces
 */

import type { ModuleManifest } from "../sdk/types/manifest";
import type { AgentRegistrationPayload } from "../sdk/types/agent";
import type { SurfaceRegistrationRequest } from "../sdk/types/surface";
import { validatePreInstall } from "./validator";
import { activateBilling, type BillingActivation } from "./billing";

interface InstallContext {
  prisma: any;
  organizationId: string;
  organizationTier: string;
  userId: string;
  agentBuilderUrl: string;
  installedModules: { name: string; version: string; schemaModels: string[] }[];
}

export interface InstallResult {
  success: boolean;
  orgModuleId?: string;
  error?: string;
}

export interface AsyncInstallJob {
  orgModuleId: string;
  organizationId: string;
  userId: string;
  manifest: ModuleManifest;
  migrationSql?: string;
  installScript?: () => Promise<void>;
  agentPayload: AgentRegistrationPayload;
  surfacePayload: SurfaceRegistrationRequest;
}

// ---------------------------------------------------------------------------
// Synchronous Phase
// ---------------------------------------------------------------------------

export async function installModule(
  manifest: ModuleManifest,
  ctx: InstallContext,
): Promise<InstallResult> {
  // 1. Pre-install validation
  const validation = validatePreInstall(manifest, ctx.organizationTier, ctx.installedModules);
  if (!validation.canInstall) {
    return { success: false, error: validation.errors.join("; ") };
  }

  // 2. Create OrgModule record (core model)
  const orgModule = await ctx.prisma.orgModule.create({
    data: {
      organizationId: ctx.organizationId,
      moduleType: manifest.name.replace("@spokestack/", "").toUpperCase().replace(/-/g, "_"),
      active: false, // will be set to true after async phase
      config: {
        manifest: {
          name: manifest.name,
          version: manifest.version,
          schema: manifest.schema,
          agent: manifest.agent,
        },
      },
    },
  });

  // 3. Activate Stripe billing
  try {
    await activateBilling({
      organizationId: ctx.organizationId,
      moduleName: manifest.name,
      pricing: manifest.pricing,
    });
  } catch (err) {
    // Billing failure is non-blocking for free modules
    if (manifest.pricing.model !== "free") {
      await ctx.prisma.orgModule.update({
        where: { id: orgModule.id },
        data: { active: false },
      });
      return { success: false, error: `Billing activation failed: ${err}` };
    }
  }

  // 4. Queue async installation
  const job: AsyncInstallJob = {
    orgModuleId: orgModule.id,
    organizationId: ctx.organizationId,
    userId: ctx.userId,
    manifest,
    agentPayload: {
      moduleId: orgModule.id,
      organizationId: ctx.organizationId,
      agent: {
        name: manifest.agent.name,
        slug: manifest.agent.name,
        intentPatterns: [],
        systemPrompt: "",
        tools: [],
        contextContributions: [],
      },
    },
    surfacePayload: {
      organizationId: ctx.organizationId,
      moduleId: orgModule.id,
      surfaces: {
        moduleId: manifest.name,
        dashboardWidgets: [],
        pages: [],
        agentCards: [],
      },
    },
  };

  // In production, this would be queued to a job processor (BullMQ, etc.)
  // For now, execute inline
  await executeAsyncInstall(job, ctx);

  return { success: true, orgModuleId: orgModule.id };
}

// ---------------------------------------------------------------------------
// Async Phase
// ---------------------------------------------------------------------------

async function executeAsyncInstall(job: AsyncInstallJob, ctx: InstallContext): Promise<void> {
  try {
    // 5. Apply pre-built migration (would run SQL from composer output)
    // In production: await ctx.prisma.$executeRawUnsafe(job.migrationSql)

    // 6. Run install.ts seed
    if (job.installScript) {
      await job.installScript();
    }

    // 7. Register agent with agent-builder
    try {
      const agentResponse = await fetch(`${ctx.agentBuilderUrl}/agents/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job.agentPayload),
      });

      if (!agentResponse.ok) {
        console.error(`Agent registration failed: ${agentResponse.status}`);
      }
    } catch {
      console.error("Could not reach agent-builder for registration");
    }

    // 8. Register surfaces (would POST to core's surface API)

    // 9. Register milestones (would POST to core's milestone API)

    // 10. Activate OrgModule
    await ctx.prisma.orgModule.update({
      where: { id: job.orgModuleId },
      data: { active: true },
    });

    // 11. Create notification (using real Notification model fields)
    await ctx.prisma.notification.create({
      data: {
        organizationId: job.organizationId,
        userId: job.userId,
        type: "AGENT_RECOMMENDATION",
        title: `${job.manifest.displayName} is ready!`,
        body: `The ${job.manifest.displayName} module has been installed and is now active. Your ${job.manifest.agent.name} agent is ready to help.`,
        channel: "IN_APP",
      },
    });
  } catch (err) {
    // Mark as failed
    await ctx.prisma.orgModule.update({
      where: { id: job.orgModuleId },
      data: { active: false },
    });
    throw err;
  }
}
