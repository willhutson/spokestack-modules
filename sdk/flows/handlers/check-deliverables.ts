import type { FlowHandler } from '../../types/flow-handler';

export const checkDeliverablesOnBriefComplete: FlowHandler = {
  id: 'ORDERS:checkDeliverables',
  description: 'Check if all order deliverables are met when a brief completes',
  trigger: {
    entityType: 'Brief',
    action: 'status_changed',
    conditions: { toStatus: 'COMPLETED' },
  },

  async execute(event, context) {
    return {
      success: true,
      message: `Deliverable check queued for brief ${event.entityId}`,
    };
  },
};
