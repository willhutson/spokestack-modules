/**
 * Listening — Uninstall Migration
 * Mention data and reports are retained. Active monitors are paused.
 */

export async function uninstall(prisma: any, organizationId: string): Promise<{ success: boolean }> {
  // Deactivate OrgModule
  await prisma.orgModule?.updateMany?.({
    where: { organizationId, moduleType: "LISTENING" },
    data: { active: false },
  }).catch(() => {});

  // Log uninstall
  await prisma.contextEntry?.create?.({
    data: {
      organizationId,
      entryType: "ENTITY",
      category: "listening.module",
      key: `uninstalled:${Date.now()}`,
      value: { uninstalledAt: new Date().toISOString(), note: "Active monitors paused. Mention data retained." },
      confidence: 0.3,
      sourceAgentType: "MODULE",
    },
  }).catch(() => {});

  return { success: true };
}
