interface InstallContext {
  prisma: any;
  organizationId: string;
  orgModuleId: string;
}

const DEFAULT_ONBOARDING_TEMPLATE = {
  tasks: [
    { title: "Account Setup", category: "SETUP", isRequired: true, sortOrder: 0 },
    { title: "Brand Assets Upload", category: "SETUP", isRequired: true, sortOrder: 1 },
    { title: "Team Introductions", category: "TRAINING", isRequired: false, sortOrder: 2 },
    { title: "Portal Walkthrough", category: "TRAINING", isRequired: true, sortOrder: 3 },
    { title: "First Brief Submission", category: "REVIEW", isRequired: true, sortOrder: 4 },
  ],
};

export async function install(ctx: InstallContext): Promise<void> {
  console.log(`[CLIENT_PORTAL] Installing for org ${ctx.organizationId}`);
  // Seed default onboarding task template into org settings
  await ctx.prisma.orgSettings.upsert({
    where: { organizationId: ctx.organizationId },
    update: {},
    create: {
      organizationId: ctx.organizationId,
      timezone: "UTC",
      language: "en",
    },
  });
  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "client_portal.module",
      key: "installed",
      value: {
        orgModuleId: ctx.orgModuleId,
        onboardingTemplate: DEFAULT_ONBOARDING_TEMPLATE,
      },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  });
}
