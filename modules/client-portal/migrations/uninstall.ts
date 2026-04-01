interface UninstallContext {
  prisma: any;
  organizationId: string;
  agentBuilderUrl: string;
}

export async function uninstall(ctx: UninstallContext): Promise<void> {
  console.log(`[CLIENT_PORTAL] Uninstalling for org ${ctx.organizationId}`);
  // Note: ClientPortalUser records are NOT deleted (client data retained)
  // Deactivate OrgModule
  await ctx.prisma.orgModule.updateMany({
    where: { organizationId: ctx.organizationId, moduleType: "CLIENT_PORTAL" },
    data: { active: false },
  });
  // Deregister agent
  try {
    await fetch(`${ctx.agentBuilderUrl}/agents/deregister`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: ctx.organizationId, agentSlug: "client-portal-agent" }),
    });
  } catch (err) {
    console.error("Failed to deregister client-portal agent:", err);
  }
  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "client_portal.module",
      key: `uninstalled:${Date.now()}`,
      value: { uninstalledAt: new Date().toISOString(), note: "Portal user records retained" },
      confidence: 0.3,
      sourceAgentType: "MODULE",
    },
  });
}
