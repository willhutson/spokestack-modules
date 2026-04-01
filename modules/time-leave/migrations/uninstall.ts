interface UninstallContext {
  prisma: any;
  organizationId: string;
  agentBuilderUrl: string;
}

export async function uninstall(ctx: UninstallContext): Promise<void> {
  console.log(`[TIME_LEAVE] Uninstalling for org ${ctx.organizationId}`);
  // Time entries and leave records are retained
  await ctx.prisma.orgModule.updateMany({
    where: { organizationId: ctx.organizationId, moduleType: "TIME_LEAVE" },
    data: { active: false },
  });
  try {
    await fetch(`${ctx.agentBuilderUrl}/agents/deregister`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: ctx.organizationId, agentSlug: "time-leave-agent" }),
    });
  } catch (err) {
    console.error("Failed to deregister time-leave agent:", err);
  }
  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "time_leave.module",
      key: `uninstalled:${Date.now()}`,
      value: { uninstalledAt: new Date().toISOString(), note: "Time entries and leave records retained" },
      confidence: 0.3,
      sourceAgentType: "MODULE",
    },
  });
}
