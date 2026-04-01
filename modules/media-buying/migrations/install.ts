/**
 * Media Buying Install Migration — seeds default campaign templates and creates
 * initial ContextEntry records. Runs asynchronously after OrgModule record is created.
 */

interface InstallContext {
  prisma: any;
  organizationId: string;
  orgModuleId: string;
}

export async function install(ctx: InstallContext): Promise<void> {
  console.log(`[MEDIA-BUYING] Installing for org ${ctx.organizationId}`);

  await ctx.prisma.mb_Campaign.create({
    data: {
      organizationId: ctx.organizationId,
      name: "Sample Awareness Campaign",
      objective: "AWARENESS",
      platform: "META",
      budget: 1000000,
      spent: 0,
      status: "DRAFT",
      createdById: "system",
    },
  });

  await ctx.prisma.mb_Campaign.create({
    data: {
      organizationId: ctx.organizationId,
      name: "Sample Conversions Campaign",
      objective: "CONVERSIONS",
      platform: "GOOGLE",
      budget: 2000000,
      spent: 0,
      status: "DRAFT",
      createdById: "system",
    },
  });

  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "media-buying.module",
      key: "installed",
      value: { orgModuleId: ctx.orgModuleId, defaultCampaigns: ["Sample Awareness Campaign", "Sample Conversions Campaign"] },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  });
}
