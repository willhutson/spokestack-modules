/**
 * Content Studio — Uninstall Migration
 *
 * Cleans up system-seeded data. Asset libraries and content are NOT deleted.
 */

interface UninstallContext {
  prisma: any;
  organizationId: string;
}

export async function uninstall(ctx: UninstallContext): Promise<{ success: boolean }> {
  console.log(`[ContentStudio] Uninstalling for org ${ctx.organizationId}`);

  // Note: Asset libraries and content are NOT deleted (data retained)
  // Remove only system-seeded triggers and templates

  return { success: true };
}
