/**
 * Workflow Nudge Tools
 *
 * Tools for triggering and listing nudge notifications for workflow tasks.
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// triggerNudge
// ---------------------------------------------------------------------------

const triggerNudgeHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: `nudge_${Date.now()}`,
      instanceId: params.instanceId,
      taskId: params.taskId,
      channel: params.channel,
      scheduledAt: (params.scheduledAt as string) || new Date().toISOString(),
      sentAt: null,
    },
  };
};

export const triggerNudge: ToolDefinition = {
  name: "triggerNudge",
  description:
    "Send a nudge notification to a task assignee through a specified channel.",
  parameters: {
    type: "object",
    properties: {
      instanceId: { type: "string", description: "Workflow instance ID" },
      taskId: { type: "string", description: "Task ID to nudge about" },
      recipientId: { type: "string", description: "User ID of the nudge recipient" },
      channel: {
        type: "string",
        description: "Notification channel",
        enum: ["EMAIL", "SLACK", "WHATSAPP", "IN_APP"],
      },
      message: { type: "string", description: "Nudge message content" },
      scheduledAt: {
        type: "string",
        description: "Optional ISO date to schedule the nudge for later",
      },
    },
    required: ["instanceId", "taskId", "recipientId", "channel", "message"],
  },
  handler: triggerNudgeHandler,
};

// ---------------------------------------------------------------------------
// listNudges
// ---------------------------------------------------------------------------

const listNudgesHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: { nudges: [], total: 0 },
  };
};

export const listNudges: ToolDefinition = {
  name: "listNudges",
  description:
    "List nudge notification records filtered by instance, task, or recipient.",
  parameters: {
    type: "object",
    properties: {
      instanceId: { type: "string", description: "Filter by workflow instance ID" },
      taskId: { type: "string", description: "Filter by task ID" },
      recipientId: { type: "string", description: "Filter by recipient user ID" },
      sentAfter: {
        type: "string",
        description: "Filter nudges sent after this ISO date",
      },
    },
    required: [],
  },
  handler: listNudgesHandler,
};
