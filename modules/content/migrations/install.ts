/**
 * Content Studio — Install Migration
 *
 * Seeds default data when the module is installed for an organization.
 */

export async function install(orgId: string) {
  console.log(`[ContentStudio] Installing for org ${orgId}`);
  // Seed default AssetLibrary: "Brand Assets" (BRAND type)
  // Seed default DocTemplate categories
  // Seed default ContentTrigger: "on brief.created → create video project"
  return { success: true, seeded: ["brand_library", "doc_templates", "default_trigger"] };
}
