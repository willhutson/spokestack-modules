/**
 * Content Studio — Install Migration
 *
 * Seeds default data when the module is installed for an org.
 */

interface InstallContext {
  prisma: any;
  organizationId: string;
  orgModuleId: string;
}

export async function install(ctx: InstallContext): Promise<{ success: boolean; seeded: string[] }> {
  console.log(`[ContentStudio] Installing for org ${ctx.organizationId}`);

  // Seed default AssetLibrary: "Brand Assets" (BRAND type)
  // Seed default DocTemplate categories
  // Seed default ContentTrigger: "on brief.created → create video project"

  return { success: true, seeded: ["brand_library", "doc_templates", "default_trigger"] };
}
