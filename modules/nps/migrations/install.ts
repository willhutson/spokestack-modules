/**
 * NPS Module — Install Migration
 *
 * Seeds system form templates (CONTACT_US and FEEDBACK) and
 * registers a context entry for the module installation.
 */

interface InstallContext {
  prisma: any;
  organizationId: string;
  orgModuleId: string;
}

export async function install(ctx: InstallContext): Promise<void> {
  console.log(`[NPS] Installing for org ${ctx.organizationId}`);

  await ctx.prisma.formTemplate.create({
    data: {
      organizationId: ctx.organizationId,
      type: "CONTACT_US",
      name: "Contact Us",
      config: {
        sections: [
          {
            title: "Contact Information",
            fields: [
              { name: "name", type: "text", required: true },
              { name: "email", type: "email", required: true },
              { name: "message", type: "textarea", required: true },
            ],
          },
        ],
      },
      isActive: true,
      isSystem: true,
      submissionModel: "standalone",
    },
  });

  await ctx.prisma.formTemplate.create({
    data: {
      organizationId: ctx.organizationId,
      type: "FEEDBACK",
      name: "General Feedback",
      config: {
        sections: [
          {
            title: "Feedback",
            fields: [
              { name: "rating", type: "number", required: true, min: 1, max: 5 },
              { name: "comments", type: "textarea", required: false },
            ],
          },
        ],
      },
      isActive: true,
      isSystem: true,
      submissionModel: "standalone",
    },
  });

  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "nps.module",
      key: "installed",
      value: {
        orgModuleId: ctx.orgModuleId,
        systemForms: ["CONTACT_US", "FEEDBACK"],
      },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  });
}
