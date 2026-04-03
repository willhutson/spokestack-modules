/**
 * Entities Uninstall Migration — deactivates module and writes uninstall context entry.
 */

export async function uninstall(prisma: any, organizationId: string): Promise<{ success: boolean }> {
  await prisma.orgModule?.updateMany?.({
    where: { organizationId, moduleType: "ENTITIES" },
    data: { active: false },
  }).catch(() => {});

  await prisma.contextEntry?.create?.({
    data: {
      organizationId,
      entryType: "ENTITY",
      category: "entities.module",
      key: `uninstalled:${Date.now()}`,
      value: { uninstalledAt: new Date().toISOString() },
      confidence: 0.3,
      sourceAgentType: "MODULE",
    },
  }).catch(() => {});

  return { success: true };
}
