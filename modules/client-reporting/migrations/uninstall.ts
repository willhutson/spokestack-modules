export async function uninstall(prisma: any, organizationId: string): Promise<{ success: boolean }> {
  await prisma.orgModule?.updateMany?.({
    where: { organizationId, moduleType: "CLIENT_REPORTING" },
    data: { active: false },
  }).catch(() => {});
  return { success: true };
}
