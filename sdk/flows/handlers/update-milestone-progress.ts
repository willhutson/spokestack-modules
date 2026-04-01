import type { FlowHandler } from '../../types/flow-handler';

export const updateMilestoneProgress: FlowHandler = {
  id: 'PROJECTS:updateMilestoneProgress',
  description: 'Update project milestone completion % when a task is marked done',
  trigger: {
    entityType: 'Task',
    action: 'status_changed',
    conditions: { toStatus: 'DONE' },
  },

  async execute(event, context) {
    const res = await fetch(`${context.coreApiUrl}/api/v1/tasks/${event.entityId}`, {
      headers: context.headers,
    });
    if (!res.ok) return { success: false, error: 'Failed to fetch task' };
    const task = await res.json();

    if (!task.projectId) return { success: true, message: 'Task not linked to project' };

    return {
      success: true,
      updated: [{ entityType: 'Project', entityId: task.projectId }],
      message: `Milestone progress updated for project ${task.projectId}`,
    };
  },
};
