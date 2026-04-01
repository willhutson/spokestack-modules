/**
 * Workflows Uninstall Migration — archives templates and deregisters agent.
 * Active instances are NOT deleted to preserve audit trail.
 */

interface UninstallContext {
  prisma: any;
  organizationId: string;
  agentBuilderUrl: string;
}

export async function uninstall(ctx: UninstallContext): Promise<void> {
  const now = new Date().toISOString();

  // 1. Archive all workflow templates (do NOT delete)
  if (ctx.prisma.workflowTemplate?.updateMany) {
    await ctx.prisma.workflowTemplate.updateMany({
      where: { organizationId: ctx.organizationId, status: { not: "ARCHIVED" } },
      data: { status: "ARCHIVED", archivedAt: now },
    });
  }

  // 2. Active instances are intentionally left intact for audit purposes.
  //    They will no longer receive new nudges or task updates.

  // 3. Remove context entries for the workflows module
  if (ctx.prisma.contextEntry?.deleteMany) {
    await ctx.prisma.contextEntry.deleteMany({
      where: { organizationId: ctx.organizationId, category: { startsWith: "workflows." } },
    });
  }

  // 4. Deregister agent with agent-builder
  try {
    const response = await fetch(`${ctx.agentBuilderUrl}/agents/deregister`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: ctx.organizationId,
        agentName: "workflow-agent",
      }),
    });

    if (!response.ok) {
      console.warn(`[WORKFLOWS] Agent deregistration returned ${response.status}`);
    }
  } catch (err) {
    console.warn("[WORKFLOWS] Failed to deregister agent:", err);
  }

  console.log(`[WORKFLOWS] Uninstalled for org ${ctx.organizationId}. Active instances preserved.`);
}
