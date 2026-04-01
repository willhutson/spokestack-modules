interface InstallContext {
  prisma: any;
  organizationId: string;
  orgModuleId: string;
}

export async function install(ctx: InstallContext): Promise<void> {
  console.log(`[ANALYTICS] Installing for org ${ctx.organizationId}`);

  // Seed 3 default MetricDefinition records
  const defaultMetrics = [
    { code: "brief_completion_rate", name: "Brief Completion Rate", category: "PERFORMANCE", formula: "completed_briefs / total_briefs * 100", aggregation: "percentage", format: "percentage", decimals: 1, suffix: "%", higherIsBetter: true, isSystem: true },
    { code: "avg_deal_value", name: "Average Deal Value", category: "REVENUE", formula: "sum(deal_value) / count(deals)", aggregation: "average", format: "currency", decimals: 2, prefix: "$", higherIsBetter: true, isSystem: true },
    { code: "client_nps_score", name: "Client NPS Score", category: "SATISFACTION", formula: "promoters_pct - detractors_pct", aggregation: "score", format: "number", decimals: 0, higherIsBetter: true, isSystem: true },
  ];

  for (const metric of defaultMetrics) {
    await ctx.prisma.metricDefinition.create({
      data: { organizationId: ctx.organizationId, ...metric, isActive: true },
    });
  }

  // Seed 1 default dashboard
  await ctx.prisma.analyticsDashboard.create({
    data: {
      organizationId: ctx.organizationId,
      name: "Overview",
      type: "OVERVIEW",
      isPublic: true,
      layout: [],
      defaultFilters: {},
    },
  });

  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "analytics.module",
      key: "installed",
      value: { orgModuleId: ctx.orgModuleId, defaultMetrics: defaultMetrics.map(m => m.code) },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  });
}
