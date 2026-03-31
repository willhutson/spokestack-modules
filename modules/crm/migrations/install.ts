/**
 * CRM Install Migration — seeds defaults and creates initial ContextEntry records.
 * Runs asynchronously after OrgModule record is created.
 */

interface InstallContext {
  prisma: any;
  organizationId: string;
  orgModuleId: string;
}

const DEFAULT_PIPELINE_STAGES = [
  { id: "lead", name: "Lead", probability: 10 },
  { id: "qualified", name: "Qualified", probability: 25 },
  { id: "proposal", name: "Proposal", probability: 50 },
  { id: "negotiation", name: "Negotiation", probability: 75 },
  { id: "closed_won", name: "Closed Won", probability: 100 },
  { id: "closed_lost", name: "Closed Lost", probability: 0 },
];

export async function install(ctx: InstallContext): Promise<void> {
  // 1. Create default pipeline
  const pipeline = await ctx.prisma.crm_Pipeline.create({
    data: {
      organizationId: ctx.organizationId,
      name: "Default Pipeline",
      stages: DEFAULT_PIPELINE_STAGES,
      isDefault: true,
    },
  });

  // 2. Write initial context entry (using real core ContextEntry fields)
  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "crm.module",
      key: "installed",
      value: {
        orgModuleId: ctx.orgModuleId,
        defaultPipelineId: pipeline.id,
        stages: DEFAULT_PIPELINE_STAGES.map((s) => s.name),
      },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  });

  // 3. Create welcome notification (uses real Notification model fields)
  await ctx.prisma.notification.create({
    data: {
      organizationId: ctx.organizationId,
      userId: "", // populated by installer with the installing user
      type: "AGENT_RECOMMENDATION",
      title: "CRM Module Installed",
      body: "Your CRM is ready! Start by adding contacts or ask your agent to help set up your pipeline.",
      channel: "IN_APP",
    },
  });
}
