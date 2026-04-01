export async function uninstall(prisma: any, organizationId: string): Promise<{ success: boolean }> {
  await prisma.orgModule?.updateMany?.({
    where: { organizationId, moduleType: "SURVEYS" },
    data: { active: false },
  }).catch(() => {});
  return { success: true };
}
