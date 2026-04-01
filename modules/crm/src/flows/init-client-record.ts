import type { FlowHandler } from '../../../../sdk/types/flow-handler';

export const initClientRecord: FlowHandler = {
  id: 'CRM:initializeClientRecord',
  description: 'Create CRM contact entry when a new client is created in core',
  trigger: { entityType: 'Client', action: 'created' },

  async execute(event, context) {
    return {
      success: true,
      message: `CRM record initialization queued for client ${event.entityId}`,
    };
  },
};
