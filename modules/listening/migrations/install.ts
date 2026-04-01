/**
 * Listening — Install Migration
 * No seed data — monitors are org-specific and created via agent tools.
 */

export async function install(prisma: any, organizationId: string): Promise<{ success: boolean }> {
  await prisma.contextEntry?.create?.({
    data: {
      organizationId,
      entryType: "ENTITY",
      category: "listening.module",
      key: "installed",
      value: { installedAt: new Date().toISOString() },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  }).catch(() => {});

  return { success: true };
}
