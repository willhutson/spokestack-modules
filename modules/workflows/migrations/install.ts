/**
 * Workflows Install Migration — seeds default workflow templates and creates
 * initial ContextEntry records. Runs asynchronously after OrgModule record is created.
 */

interface InstallContext {
  prisma: any;
  organizationId: string;
  orgModuleId: string;
}

export async function install(ctx: InstallContext): Promise<void> {
  console.log(`[WORKFLOWS] Installing for org ${ctx.organizationId}`);

  const briefIntakeTasks = [
    { name: "Review brief requirements", assigneeRole: "project_manager", relativeDueDays: 1 },
    { name: "Assign creative team", assigneeRole: "project_manager", relativeDueDays: 2 },
    { name: "Create project timeline", assigneeRole: "project_manager", relativeDueDays: 3 },
    { name: "Client kickoff meeting", assigneeRole: "account_manager", relativeDueDays: 5 },
    { name: "Confirm scope and deliverables", assigneeRole: "project_manager", relativeDueDays: 5 },
  ];

  const dealWonTasks = [
    { name: "Send welcome email", assigneeRole: "account_manager", relativeDueDays: 1 },
    { name: "Create client record", assigneeRole: "account_manager", relativeDueDays: 1 },
    { name: "Set up retainer if applicable", assigneeRole: "finance", relativeDueDays: 2 },
    { name: "Schedule onboarding call", assigneeRole: "account_manager", relativeDueDays: 3 },
    { name: "Collect brand assets", assigneeRole: "account_manager", relativeDueDays: 5 },
    { name: "Create first brief", assigneeRole: "project_manager", relativeDueDays: 7 },
    { name: "Internal team briefing", assigneeRole: "project_manager", relativeDueDays: 7 },
  ];

  await ctx.prisma.workflowTemplate.create({
    data: {
      organizationId: ctx.organizationId,
      name: "New Brief Intake",
      module: "agency",
      triggerType: "brief.created",
      taskTemplates: briefIntakeTasks,
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
      version: 1,
      isLatest: true,
      createdById: "system",
    },
  });

  await ctx.prisma.workflowTemplate.create({
    data: {
      organizationId: ctx.organizationId,
      name: "Deal Won Onboarding",
      module: "crm",
      triggerType: "deal.won",
      taskTemplates: dealWonTasks,
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
      version: 1,
      isLatest: true,
      createdById: "system",
    },
  });

  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "workflows.module",
      key: "installed",
      value: { orgModuleId: ctx.orgModuleId, defaultTemplates: ["New Brief Intake", "Deal Won Onboarding"] },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  });
}
