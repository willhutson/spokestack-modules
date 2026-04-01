/**
 * Workflow Task Tools
 *
 * Tools for completing, blocking, reassigning, and listing workflow tasks.
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// completeTask
// ---------------------------------------------------------------------------

const completeTaskHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      taskId: params.taskId,
      status: "COMPLETED",
      completedAt: new Date().toISOString(),
      instanceProgress: 75,
    },
  };
};

export const completeTask: ToolDefinition = {
  name: "completeTask",
  description: "Mark a workflow task as completed by a specific user, with optional notes.",
  parameters: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "Workflow task ID" },
      completedById: { type: "string", description: "User ID of who completed the task" },
      notes: { type: "string", description: "Optional completion notes" },
    },
    required: ["taskId", "completedById"],
  },
  handler: completeTaskHandler,
};

// ---------------------------------------------------------------------------
// blockTask
// ---------------------------------------------------------------------------

const blockTaskHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      taskId: params.taskId,
      status: "BLOCKED",
      blockedReason: params.blockedReason,
    },
  };
};

export const blockTask: ToolDefinition = {
  name: "blockTask",
  description: "Block a workflow task with a reason, preventing it from being completed.",
  parameters: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "Workflow task ID to block" },
      blockedReason: { type: "string", description: "Reason the task is blocked" },
    },
    required: ["taskId", "blockedReason"],
  },
  handler: blockTaskHandler,
};

// ---------------------------------------------------------------------------
// reassignTask
// ---------------------------------------------------------------------------

const reassignTaskHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      taskId: params.taskId,
      assigneeId: params.newAssigneeId,
      reassignedAt: new Date().toISOString(),
    },
  };
};

export const reassignTask: ToolDefinition = {
  name: "reassignTask",
  description: "Reassign a workflow task to a different user.",
  parameters: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "Workflow task ID to reassign" },
      newAssigneeId: { type: "string", description: "User ID of the new assignee" },
    },
    required: ["taskId", "newAssigneeId"],
  },
  handler: reassignTaskHandler,
};

// ---------------------------------------------------------------------------
// listWorkflowTasks
// ---------------------------------------------------------------------------

const listWorkflowTasksHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: { tasks: [], total: 0 },
  };
};

export const listWorkflowTasks: ToolDefinition = {
  name: "listWorkflowTasks",
  description:
    "List workflow tasks filtered by instance, assignee, status, or due date.",
  parameters: {
    type: "object",
    properties: {
      instanceId: { type: "string", description: "Filter by workflow instance ID" },
      assigneeId: { type: "string", description: "Filter by assignee user ID" },
      status: {
        type: "string",
        description: "Filter by task status",
        enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "BLOCKED", "SKIPPED"],
      },
      dueBeforeDate: {
        type: "string",
        description: "Filter tasks due before this ISO date",
      },
    },
    required: [],
  },
  handler: listWorkflowTasksHandler,
};
