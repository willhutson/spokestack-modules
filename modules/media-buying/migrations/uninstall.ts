/**
 * Media Buying Uninstall Migration — archives campaigns and deregisters agent.
 * Spend records are NOT deleted to preserve financial audit trail.
 */

interface UninstallContext {
  prisma: any;
  organizationId: string;
  agentBuilderUrl: string;
}

export async function uninstall(ctx: UninstallContext): Promise<void> {
  const now = new Date().toISOString();

  // 1. Archive all campaigns (do NOT delete)
  if (ctx.prisma.mb_Campaign?.updateMany) {
    await ctx.prisma.mb_Campaign.updateMany({
      where: { organizationId: ctx.organizationId, status: { not: "ARCHIVED" } },
      data: { status: "ARCHIVED", archivedAt: now },
    });
  }

  // 2. Spend records are intentionally left intact for financial audit.

  // 3. Remove context entries for the media-buying module
  if (ctx.prisma.contextEntry?.deleteMany) {
    await ctx.prisma.contextEntry.deleteMany({
      where: { organizationId: ctx.organizationId, category: { startsWith: "media-buying." } },
    });
  }

  // 4. Deregister agent with agent-builder
  try {
    const response = await fetch(`${ctx.agentBuilderUrl}/agents/deregister`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: ctx.organizationId,
        agentName: "media-buying-agent",
      }),
    });

    if (!response.ok) {
      console.warn(`[MEDIA-BUYING] Agent deregistration returned ${response.status}`);
    }
  } catch (err) {
    console.warn("[MEDIA-BUYING] Failed to deregister agent:", err);
  }

  console.log(`[MEDIA-BUYING] Uninstalled for org ${ctx.organizationId}. Spend records preserved.`);
}
