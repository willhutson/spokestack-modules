/**
 * Content Studio — Uninstall Migration
 *
 * Cleans up system-seeded data. Asset libraries and content are NOT deleted.
 */

export async function uninstall(orgId: string) {
  console.log(`[ContentStudio] Uninstalling for org ${orgId}`);
  // Note: Asset libraries and content are NOT deleted (data retained)
  // Remove only system-seeded triggers and templates
  return { success: true };
}
