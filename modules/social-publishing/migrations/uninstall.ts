/**
 * Social Publishing — Uninstall Migration
 * SocialAccount records, ContentPost records, and PublishJob history are retained.
 */

export async function uninstall(prisma: any, organizationId: string): Promise<{ success: boolean }> {
  // Deactivate OrgModule
  await prisma.orgModule?.updateMany?.({
    where: { organizationId, moduleType: "SOCIAL_PUBLISHING" },
    data: { active: false },
  }).catch(() => {});

  // Log uninstall context
  await prisma.contextEntry?.create?.({
    data: {
      organizationId,
      entryType: "ENTITY",
      category: "social_publishing.module",
      key: `uninstalled:${Date.now()}`,
      value: { uninstalledAt: new Date().toISOString() },
      confidence: 0.3,
      sourceAgentType: "MODULE",
    },
  }).catch(() => {});

  return { success: true };
}
