/**
 * LMS Uninstall Migration — archives courses and deregisters agent.
 * Enrollment records are NOT deleted to preserve completion history.
 */

interface UninstallContext {
  prisma: any;
  organizationId: string;
  agentBuilderUrl: string;
}

export async function uninstall(ctx: UninstallContext): Promise<void> {
  const now = new Date().toISOString();

  // 1. Archive all courses (do NOT delete)
  if (ctx.prisma.lms_Course?.updateMany) {
    await ctx.prisma.lms_Course.updateMany({
      where: { organizationId: ctx.organizationId, status: { not: "ARCHIVED" } },
      data: { status: "ARCHIVED", archivedAt: now },
    });
  }

  // 2. Enrollment records are intentionally left intact for audit and certificate purposes.

  // 3. Remove context entries for the LMS module
  if (ctx.prisma.contextEntry?.deleteMany) {
    await ctx.prisma.contextEntry.deleteMany({
      where: { organizationId: ctx.organizationId, category: { startsWith: "lms." } },
    });
  }

  // 4. Deregister agent with agent-builder
  try {
    const response = await fetch(`${ctx.agentBuilderUrl}/agents/deregister`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: ctx.organizationId,
        agentName: "lms-agent",
      }),
    });

    if (!response.ok) {
      console.warn(`[LMS] Agent deregistration returned ${response.status}`);
    }
  } catch (err) {
    console.warn("[LMS] Failed to deregister agent:", err);
  }

  console.log(`[LMS] Uninstalled for org ${ctx.organizationId}. Enrollment records preserved.`);
}
