interface UninstallContext {
  prisma: any;
  organizationId: string;
  agentBuilderUrl: string;
}

export async function uninstall(ctx: UninstallContext): Promise<void> {
  console.log(`[ANALYTICS] Uninstalling for org ${ctx.organizationId}`);
  // Remove system metrics
  await ctx.prisma.metricDefinition.deleteMany({
    where: { organizationId: ctx.organizationId, isSystem: true },
  });
  // Deactivate OrgModule
  await ctx.prisma.orgModule.updateMany({
    where: { organizationId: ctx.organizationId, moduleType: "ANALYTICS" },
    data: { active: false },
  });
  // Deregister agent
  try {
    await fetch(`${ctx.agentBuilderUrl}/agents/deregister`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: ctx.organizationId, agentSlug: "analytics-agent" }),
    });
  } catch (err) {
    console.error("Failed to deregister analytics agent:", err);
  }
  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "analytics.module",
      key: `uninstalled:${Date.now()}`,
      value: { uninstalledAt: new Date().toISOString() },
      confidence: 0.3,
      sourceAgentType: "MODULE",
    },
  });
}
