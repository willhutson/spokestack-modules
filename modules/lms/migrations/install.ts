/**
 * LMS Install Migration
 */

export async function install(prisma: any, organizationId: string): Promise<{ success: boolean }> {
  await prisma.contextEntry?.create?.({
    data: {
      organizationId,
      entryType: "ENTITY",
      category: "lms.module",
      key: "installed",
      value: { installedAt: new Date().toISOString() },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  }).catch(() => {});

  return { success: true };
}
