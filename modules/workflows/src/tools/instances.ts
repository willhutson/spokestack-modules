/**
 * Workflow Instance Tools
 *
 * Tools for instantiating workflows, listing active instances, checking status,
 * and cancelling workflow instances.
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// instantiateWorkflow
// ---------------------------------------------------------------------------

const instantiateWorkflowHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: `wfi_${Date.now()}`,
      templateId: params.templateId,
      status: "ACTIVE",
      progress: 0,
      tasks: [
        {
          id: "wft_task_001",
          name: "Review brief",
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          status: "PENDING",
          assigneeRole: "project_manager",
        },
      ],
      startedAt: new Date().toISOString(),
    },
  };
};

export const instantiateWorkflow: ToolDefinition = {
  name: "instantiateWorkflow",
  description:
    "Create a workflow instance from a published template, triggered by an entity event.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      templateId: { type: "string", description: "Workflow template ID to instantiate" },
      triggerEntityType: {
        type: "string",
        description: "Entity type that triggered this workflow (e.g. brief, deal)",
      },
      triggerEntityId: {
        type: "string",
        description: "ID of the entity that triggered the workflow",
      },
      ownerId: { type: "string", description: "User ID of the workflow owner" },
      deadline: {
        type: "string",
        description: "Optional deadline ISO date for the entire workflow",
      },
      triggerData: {
        type: "string",
        description: "JSON string of additional trigger context data",
      },
    },
    required: ["orgId", "templateId", "triggerEntityType", "triggerEntityId", "ownerId"],
  },
  handler: instantiateWorkflowHandler,
};

// ---------------------------------------------------------------------------
// listActiveWorkflows
// ---------------------------------------------------------------------------

const listActiveWorkflowsHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: { instances: [], total: 0, page: 1, limit: 20 },
  };
};

export const listActiveWorkflows: ToolDefinition = {
  name: "listActiveWorkflows",
  description:
    "List workflow instances with status, progress, and optional filters.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      status: {
        type: "string",
        description: "Filter by instance status",
        enum: ["ACTIVE", "COMPLETED", "CANCELLED", "FAILED"],
      },
      ownerId: { type: "string", description: "Filter by workflow owner" },
      templateId: { type: "string", description: "Filter by template ID" },
    },
    required: ["orgId"],
  },
  handler: listActiveWorkflowsHandler,
};

// ---------------------------------------------------------------------------
// getWorkflowStatus
// ---------------------------------------------------------------------------

const getWorkflowStatusHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.instanceId,
      status: "ACTIVE",
      progress: 65,
      tasks: [
        { id: "wft_task_001", name: "Review brief", status: "COMPLETED" },
        { id: "wft_task_002", name: "Assign team", status: "PENDING" },
      ],
      activityLog: [
        {
          type: "TASK_COMPLETED",
          description: "Review brief completed",
          createdAt: new Date().toISOString(),
        },
      ],
      nudges: [],
    },
  };
};

export const getWorkflowStatus: ToolDefinition = {
  name: "getWorkflowStatus",
  description:
    "Get detailed workflow instance status including tasks, activity log, and nudge history.",
  parameters: {
    type: "object",
    properties: {
      instanceId: { type: "string", description: "Workflow instance ID" },
    },
    required: ["instanceId"],
  },
  handler: getWorkflowStatusHandler,
};

// ---------------------------------------------------------------------------
// cancelWorkflow
// ---------------------------------------------------------------------------

const cancelWorkflowHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.instanceId,
      status: "CANCELLED",
      cancelledAt: new Date().toISOString(),
      reason: (params.reason as string) || null,
    },
  };
};

export const cancelWorkflow: ToolDefinition = {
  name: "cancelWorkflow",
  description:
    "Cancel an active workflow instance with an optional reason.",
  parameters: {
    type: "object",
    properties: {
      instanceId: { type: "string", description: "Workflow instance ID to cancel" },
      reason: { type: "string", description: "Reason for cancellation" },
    },
    required: ["instanceId"],
  },
  handler: cancelWorkflowHandler,
};
