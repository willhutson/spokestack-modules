/**
 * CRM Uninstall Migration — soft-deletes all crm_ records and deregisters agent.
 * Does NOT hard-delete data to allow recovery within a grace period.
 */

interface UninstallContext {
  prisma: any;
  organizationId: string;
  agentBuilderUrl: string;
}

export async function uninstall(ctx: UninstallContext): Promise<void> {
  const now = new Date().toISOString();

  // 1. Soft-delete all CRM data (set deletedAt)
  const models = ["crm_Contact", "crm_Deal", "crm_Pipeline", "crm_Interaction", "crm_Tag"];

  for (const model of models) {
    if (ctx.prisma[model]?.updateMany) {
      await ctx.prisma[model].updateMany({
        where: { organizationId: ctx.organizationId, deletedAt: null },
        data: { deletedAt: now },
      });
    }
  }

  // 2. Deregister agent with agent-builder
  try {
    const response = await fetch(`${ctx.agentBuilderUrl}/agents/deregister`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: ctx.organizationId,
        agentSlug: "crm-agent",
      }),
    });

    if (!response.ok) {
      console.error(`Failed to deregister CRM agent: ${response.status}`);
    }
  } catch (err) {
    console.error("Failed to reach agent-builder for deregistration:", err);
  }

  // 3. Deactivate OrgModule record
  await ctx.prisma.orgModule.updateMany({
    where: { organizationId: ctx.organizationId, moduleType: "CRM" },
    data: { active: false },
  });

  // 4. Write uninstall context entry (using real core ContextEntry fields)
  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "crm.module",
      key: `uninstalled:${Date.now()}`,
      value: { uninstalledAt: now },
      confidence: 0.3,
      sourceAgentType: "MODULE",
    },
  });
}
