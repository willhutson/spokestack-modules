/**
 * Finance Uninstall Migration — deactivates module and deregisters agent.
 * Financial records are retained for compliance; does NOT hard-delete data.
 */

interface UninstallContext {
  prisma: any;
  organizationId: string;
  agentBuilderUrl: string;
}

export async function uninstall(ctx: UninstallContext): Promise<void> {
  const now = new Date().toISOString();

  // 1. Deregister agent with agent-builder
  try {
    const response = await fetch(`${ctx.agentBuilderUrl}/agents/deregister`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: ctx.organizationId,
        agentSlug: "finance-agent",
      }),
    });

    if (!response.ok) {
      console.error(`Failed to deregister Finance agent: ${response.status}`);
    }
  } catch (err) {
    console.error("Failed to reach agent-builder for deregistration:", err);
  }

  // 2. Deactivate OrgModule record
  await ctx.prisma.orgModule.updateMany({
    where: { organizationId: ctx.organizationId, moduleType: "FINANCE" },
    data: { active: false },
  });

  // 3. Write uninstall context entry (using real core ContextEntry fields)
  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "finance.module",
      key: `uninstalled:${Date.now()}`,
      value: { uninstalledAt: now },
      confidence: 0.3,
      sourceAgentType: "MODULE",
    },
  });
}
