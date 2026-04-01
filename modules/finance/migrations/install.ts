/**
 * Finance Install Migration — creates initial ContextEntry record.
 * No seed data needed for finance; runs after OrgModule record is created.
 */

interface InstallContext {
  prisma: any;
  organizationId: string;
  orgModuleId: string;
}

export async function install(ctx: InstallContext): Promise<void> {
  console.log(`[FINANCE] Installing for org ${ctx.organizationId}`);

  // Write initial context entry (using real core ContextEntry fields)
  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "finance.module",
      key: "installed",
      value: { orgModuleId: ctx.orgModuleId },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  });
}
