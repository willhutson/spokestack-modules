/**
 * Workflow Activity Tools (Phase 6C)
 *
 * Activity feed and timeline for workflow instances.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// getWorkflowActivity
// ---------------------------------------------------------------------------

export const getWorkflowActivity: ToolDefinition = {
  name: "getWorkflowActivity",
  description: "Get recent activity for a workflow instance including task completions and status changes",
  parameters: {
    type: "object",
    properties: {
      workflowInstanceId: { type: "string", description: "Workflow instance ID" },
      limit: { type: "number", description: "Max results" },
      activityType: { type: "string", description: "Filter by type", enum: ["TASK_COMPLETED", "TASK_BLOCKED", "TASK_REASSIGNED", "STATUS_CHANGED", "NUDGE_SENT", "COMMENT_ADDED"] },
    },
    required: ["workflowInstanceId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: [
        { id: "act_001", type: "TASK_COMPLETED", description: "Review brief requirements completed by Sarah", userId: "user_001", timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: "act_002", type: "TASK_REASSIGNED", description: "Assign creative team reassigned from John to Mike", userId: "user_002", timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: "act_003", type: "NUDGE_SENT", description: "Nudge sent to Mike for overdue task", userId: "system", timestamp: new Date(Date.now() - 10800000).toISOString() },
        { id: "act_004", type: "STATUS_CHANGED", description: "Workflow status changed from PENDING to IN_PROGRESS", userId: "system", timestamp: new Date(Date.now() - 86400000).toISOString() },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// getActivityTimeline
// ---------------------------------------------------------------------------

export const getActivityTimeline: ToolDefinition = {
  name: "getActivityTimeline",
  description: "Get a timeline view of workflow activity across all instances for an organization",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      startDate: { type: "string", description: "Timeline start date" },
      endDate: { type: "string", description: "Timeline end date" },
      workflowTemplateId: { type: "string", description: "Filter by workflow template" },
      limit: { type: "number", description: "Max results" },
    },
    required: ["orgId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        totalActivities: 47,
        timeline: [
          { date: "2025-07-21", activities: [
            { id: "act_010", instanceId: "wfi_001", workflowName: "New Brief Intake", type: "TASK_COMPLETED", description: "Client kickoff meeting completed" },
            { id: "act_011", instanceId: "wfi_002", workflowName: "Deal Won Onboarding", type: "NUDGE_SENT", description: "Reminder sent for collecting brand assets" },
          ]},
          { date: "2025-07-20", activities: [
            { id: "act_012", instanceId: "wfi_001", workflowName: "New Brief Intake", type: "TASK_COMPLETED", description: "Create project timeline completed" },
            { id: "act_013", instanceId: "wfi_003", workflowName: "Deal Won Onboarding", type: "STATUS_CHANGED", description: "Workflow completed" },
          ]},
        ],
      },
    };
  },
};
