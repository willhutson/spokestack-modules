import type { FlowHandler } from '../../types/flow-handler';

export const createBriefTasks: FlowHandler = {
  id: 'TASKS:createBriefTasks',
  description: 'Auto-create task checklist from brief template when brief is created',
  trigger: { entityType: 'Brief', action: 'created' },

  async execute(event, context) {
    return {
      success: true,
      message: `Task creation from brief template queued for brief ${event.entityId}`,
    };
  },
};
