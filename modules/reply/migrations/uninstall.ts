/**
 * Reply Uninstall Migration — deactivates module and writes uninstall context entry.
 */

export async function uninstall(prisma: any, organizationId: string): Promise<{ success: boolean }> {
  await prisma.orgModule?.updateMany?.({
    where: { organizationId, moduleType: "REPLY" },
    data: { active: false },
  }).catch(() => {});

  await prisma.contextEntry?.create?.({
    data: {
      organizationId,
      entryType: "ENTITY",
      category: "reply.module",
      key: `uninstalled:${Date.now()}`,
      value: { uninstalledAt: new Date().toISOString() },
      confidence: 0.3,
      sourceAgentType: "MODULE",
    },
  }).catch(() => {});

  return { success: true };
}
