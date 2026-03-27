/**
 * Module Installer — ASYNC installation flow.
 *
 * Synchronous phase:
 *   1. Validate manifest
 *   2. Check conflicts
 *   3. Create ModuleInstallation record (status: "provisioning")
 *   4. Activate Stripe billing
 *
 * Async phase (queued):
 *   5. Apply pre-built migration SQL
 *   6. Run install.ts seed
 *   7. Register agent with agent-builder (POST /agents/register)
 *   8. Register surfaces
 *   9. Register milestones
 *   10. Update status to "active"
 *   11. Agent announces installation
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
  agentBuilderUrl: string;
  installedModules: { name: string; version: string; schemaModels: string[] }[];
}

export interface InstallResult {
  success: boolean;
  installationId?: string;
  error?: string;
}

export interface AsyncInstallJob {
  installationId: string;
  organizationId: string;
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

  // 2. Create ModuleInstallation record
  const installation = await ctx.prisma.moduleInstallation.create({
    data: {
      organizationId: ctx.organizationId,
      moduleName: manifest.name,
      moduleVersion: manifest.version,
      status: "provisioning",
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
  let billing: BillingActivation | undefined;
  try {
    billing = await activateBilling({
      organizationId: ctx.organizationId,
      moduleName: manifest.name,
      pricing: manifest.pricing,
    });
  } catch (err) {
    // Billing failure is non-blocking for free modules
    if (manifest.pricing.model !== "free") {
      await ctx.prisma.moduleInstallation.update({
        where: { id: installation.id },
        data: { status: "suspended" },
      });
      return { success: false, error: `Billing activation failed: ${err}` };
    }
  }

  // 4. Queue async installation
  const job: AsyncInstallJob = {
    installationId: installation.id,
    organizationId: ctx.organizationId,
    manifest,
    agentPayload: {
      moduleId: installation.id,
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
      moduleId: installation.id,
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

  return { success: true, installationId: installation.id };
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

    // 10. Update status to "active"
    await ctx.prisma.moduleInstallation.update({
      where: { id: job.installationId },
      data: {
        status: "active",
        activatedAt: new Date().toISOString(),
      },
    });

    // 11. Create notification for agent announcement
    await ctx.prisma.notification.create({
      data: {
        organizationId: job.organizationId,
        type: "module.activated",
        title: `${job.manifest.displayName} is ready!`,
        body: `The ${job.manifest.displayName} module has been installed and is now active. Your ${job.manifest.agent.name} agent is ready to help.`,
        data: {
          moduleName: job.manifest.name,
          installationId: job.installationId,
        },
      },
    });
  } catch (err) {
    // Mark as failed
    await ctx.prisma.moduleInstallation.update({
      where: { id: job.installationId },
      data: { status: "suspended" },
    });
    throw err;
  }
}
