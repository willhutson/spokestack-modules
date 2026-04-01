/**
 * NPS Module — Uninstall Migration
 *
 * Deactivates system form templates (does not delete them).
 * Survey data is retained for historical reference.
 */

interface UninstallContext {
  prisma: any;
  organizationId: string;
  orgModuleId: string;
}

export async function uninstall(ctx: UninstallContext): Promise<void> {
  console.log(`[NPS] Uninstalling for org ${ctx.organizationId}`);

  // Deactivate system form templates — do NOT delete them
  await ctx.prisma.formTemplate.updateMany({
    where: {
      organizationId: ctx.organizationId,
      isSystem: true,
    },
    data: {
      isActive: false,
    },
  });

  // Mark the context entry as uninstalled
  await ctx.prisma.contextEntry.updateMany({
    where: {
      organizationId: ctx.organizationId,
      category: "nps.module",
      key: "installed",
    },
    data: {
      value: {
        orgModuleId: ctx.orgModuleId,
        uninstalledAt: new Date().toISOString(),
        systemForms: ["CONTACT_US", "FEEDBACK"],
      },
    },
  });

  console.log(`[NPS] Uninstall complete for org ${ctx.organizationId}. Survey data retained.`);
}
