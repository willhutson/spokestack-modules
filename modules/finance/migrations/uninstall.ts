/**
 * Finance Uninstall Migration — deactivates module, removes event subscriptions.
 * Financial records are retained for compliance; does NOT hard-delete data.
 */

const MODULE_TYPE = 'FINANCE';

interface UninstallContext {
  prisma: any;
  organizationId: string;
  agentBuilderUrl: string;
  coreApiUrl?: string;
  headers?: Record<string, string>;
}

export async function uninstall(ctx: UninstallContext): Promise<{ success: boolean }> {
  const now = new Date().toISOString();

  // 1. Remove event subscriptions
  if (ctx.coreApiUrl && ctx.headers) {
    try {
      const res = await fetch(
        `${ctx.coreApiUrl}/api/v1/events/subscriptions?moduleType=${MODULE_TYPE}&organizationId=${ctx.organizationId}`,
        { headers: ctx.headers }
      );
      if (res.ok) {
        const subs = await res.json();
        for (const sub of Array.isArray(subs) ? subs : []) {
          await fetch(`${ctx.coreApiUrl}/api/v1/events/subscriptions/${sub.id}`, {
            method: 'DELETE',
            headers: ctx.headers,
          }).catch(() => {});
        }
      }
    } catch {}
  }

  // 2. Deactivate OrgModule
  await ctx.prisma.orgModule?.updateMany?.({
    where: { organizationId: ctx.organizationId, moduleType: MODULE_TYPE },
    data: { active: false },
  }).catch(() => {});

  // 3. Write uninstall context entry
  await ctx.prisma.contextEntry?.create?.({
    data: {
      organizationId: ctx.organizationId,
      entryType: "ENTITY",
      category: "finance.module",
      key: `uninstalled:${Date.now()}`,
      value: { uninstalledAt: now },
      confidence: 0.3,
      sourceAgentType: "MODULE",
    },
  }).catch(() => {});

  return { success: true };
}
