/**
 * Activity Logging Tools
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const logActivityHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      id: `act_${Date.now()}`,
      profileId: params.profileId,
      action: params.action,
      target: params.target,
      details: params.details || "",
      performedBy: context.userId || "current_user",
      timestamp: new Date().toISOString(),
    },
  };
};

export const logActivity: ToolDefinition = {
  name: "logActivity",
  description: "Log an activity performed under a delegation profile.",
  parameters: {
    type: "object",
    properties: {
      profileId: { type: "string", description: "Delegation profile ID" },
      action: { type: "string", description: "Action type performed" },
      target: { type: "string", description: "Target resource identifier" },
      details: { type: "string", description: "Additional details about the action" },
    },
    required: ["profileId", "action", "target"],
  },
  handler: logActivityHandler,
};

const getActivityLogHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      profileId: params.profileId,
      activities: [
        { id: "act_001", action: "approved_expense", target: "EXP-2026-142", performedBy: "user_202", timestamp: "2026-03-30T15:00:00Z" },
        { id: "act_002", action: "signed_document", target: "DOC-2026-089", performedBy: "user_202", timestamp: "2026-03-30T11:30:00Z" },
        { id: "act_003", action: "escalated", target: "EXP-2026-155", performedBy: "system", timestamp: "2026-03-29T16:45:00Z" },
      ],
      total: 3,
    },
  };
};

export const getActivityLog: ToolDefinition = {
  name: "getActivityLog",
  description: "Get the activity log for a delegation profile with optional date filtering.",
  parameters: {
    type: "object",
    properties: {
      profileId: { type: "string", description: "Delegation profile ID" },
      from: { type: "string", description: "Start date filter" },
      to: { type: "string", description: "End date filter" },
      page: { type: "number", description: "Page number" },
    },
    required: ["profileId"],
  },
  handler: getActivityLogHandler,
};
