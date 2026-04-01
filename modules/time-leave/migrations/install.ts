interface InstallContext {
  prisma: any;
  organizationId: string;
  orgModuleId: string;
}

export async function install(ctx: InstallContext): Promise<void> {
  console.log(`[TIME_LEAVE] Installing for org ${ctx.organizationId}`);

  const defaultLeaveTypes = [
    { name: "Annual Leave", code: "ANNUAL", defaultDays: 21, carryOverLimit: 5, requiresApproval: true, isPaid: true, color: "#3B82F6" },
    { name: "Sick Leave", code: "SICK", defaultDays: 10, carryOverLimit: 0, requiresApproval: true, isPaid: true, color: "#EF4444" },
    { name: "Emergency Leave", code: "EMERGENCY", defaultDays: 5, carryOverLimit: 0, requiresApproval: true, isPaid: true, color: "#F59E0B" },
  ];

  for (const lt of defaultLeaveTypes) {
    await ctx.prisma.leaveType.create({
      data: { organizationId: ctx.organizationId, ...lt, isActive: true },
    });
  }

  await ctx.prisma.contextEntry.create({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "time_leave.module",
      key: "installed",
      value: { orgModuleId: ctx.orgModuleId, defaultLeaveTypes: defaultLeaveTypes.map(lt => lt.code) },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  });
}
