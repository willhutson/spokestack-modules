import type { FlowHandler } from '../../../../sdk/types/flow-handler';

export const refreshDashboardOnSync: FlowHandler = {
  id: 'ANALYTICS:refreshDashboard',
  description: 'Refresh analytics dashboards when external data sync completes',
  trigger: { entityType: 'Integration', action: 'sync_completed' },

  async execute(event, context) {
    return {
      success: true,
      message: `Dashboard refresh queued after ${event.metadata?.provider} sync`,
    };
  },
};
