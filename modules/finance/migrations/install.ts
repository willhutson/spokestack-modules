/**
 * Finance Install Migration — creates initial ContextEntry + event subscriptions.
 */

const MODULE_TYPE = 'FINANCE';

const FLOW_SUBSCRIPTIONS = [
  { entityType: 'Order', action: 'created', handler: 'module:FINANCE:createInvoiceDraft' },
  { entityType: 'Project', action: 'status_changed', handler: 'module:FINANCE:generateProjectInvoice', conditions: { toStatus: 'COMPLETED' } },
];

interface InstallContext {
  prisma: any;
  organizationId: string;
  orgModuleId: string;
  coreApiUrl?: string;
  headers?: Record<string, string>;
}

export async function install(ctx: InstallContext): Promise<{ success: boolean }> {
  // Write initial context entry
  await ctx.prisma.contextEntry?.create?.({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "finance.module",
      key: "installed",
      value: { orgModuleId: ctx.orgModuleId },
      confidence: 0.9,
      sourceAgentType: "MODULE",
    },
  }).catch(() => {});

  // Seed event subscriptions
  if (ctx.coreApiUrl && ctx.headers) {
    for (const sub of FLOW_SUBSCRIPTIONS) {
      await fetch(`${ctx.coreApiUrl}/api/v1/events/subscriptions`, {
        method: 'POST',
        headers: { ...ctx.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: ctx.organizationId,
          entityType: sub.entityType,
          action: sub.action,
          handler: sub.handler,
          moduleType: MODULE_TYPE,
          config: sub.conditions ? { conditions: sub.conditions } : undefined,
          enabled: true,
        }),
      }).catch(() => {});
    }
  }

  return { success: true };
}
