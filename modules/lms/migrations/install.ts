/**
 * LMS Install Migration — seeds default courses and creates
 * initial ContextEntry records. Runs asynchronously after OrgModule record is created.
 */

interface InstallContext {
  prisma: any;
  organizationId: string;
  orgModuleId: string;
}

export async function install(ctx: InstallContext): Promise<void> {
  console.log(`[LMS] Installing for org ${ctx.organizationId}`);

  const onboardingLessons = [
    { title: "Welcome & Overview", type: "TEXT", durationMinutes: 10, orderIndex: 0 },
    { title: "Company Culture", type: "VIDEO", durationMinutes: 15, orderIndex: 1 },
    { title: "Tools & Systems Setup", type: "INTERACTIVE", durationMinutes: 30, orderIndex: 2 },
    { title: "Security Fundamentals", type: "QUIZ", durationMinutes: 20, orderIndex: 3 },
    { title: "Your First Week", type: "TEXT", durationMinutes: 10, orderIndex: 4 },
  ];

  await ctx.prisma.lms_Course.create({
    data: {
      organizationId: ctx.organizationId,
      title: "New Employee Onboarding",
      description: "Essential onboarding course for all new team members.",
      category: "ONBOARDING",
      difficulty: "BEGINNER",
      estimatedHours: 2,
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
      lessons: onboardingLessons,
      createdById: "system",
    },
  });

  await ctx.prisma.lms_Course.create({
    data: {
      organizationId: ctx.organizationId,
      title: "Data Privacy & Compliance",
      description: "Annual compliance training covering data privacy regulations.",
      category: "COMPLIANCE",
      difficulty: "INTERMEDIATE",
      estimatedHours: 1,
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
      lessons: [
        { title: "Privacy Regulations Overview", type: "TEXT", durationMinutes: 15, orderIndex: 0 },
        { title: "Data Handling Best Practices", type: "VIDEO", durationMinutes: 20, orderIndex: 1 },
        { title: "Compliance Assessment", type: "QUIZ", durationMinutes: 15, orderIndex: 2 },
      ],
      createdById: "system",
    },
  });

  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "lms.module",
      key: "installed",
      value: { orgModuleId: ctx.orgModuleId, defaultCourses: ["New Employee Onboarding", "Data Privacy & Compliance"] },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  });
}
