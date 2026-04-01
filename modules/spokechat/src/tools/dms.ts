/**
 * Direct Message Tools — create DM, list DMs
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const createDMHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      id: `dm_${Date.now()}`,
      participants: [context.userId || "current_user", params.userId],
      createdAt: new Date().toISOString(),
    },
  };
};

export const createDM: ToolDefinition = {
  name: "createDM",
  description: "Create or open a direct message conversation with another user.",
  parameters: {
    type: "object",
    properties: {
      userId: { type: "string", description: "User ID to start a DM with" },
    },
    required: ["userId"],
  },
  handler: createDMHandler,
};

const listDMsHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      conversations: [
        { id: "dm_001", participantName: "Alice", lastMessage: "Thanks for the update!", lastMessageAt: "2026-03-31T16:00:00Z", unreadCount: 0 },
        { id: "dm_002", participantName: "Bob", lastMessage: "Can you review PR #142?", lastMessageAt: "2026-03-31T14:30:00Z", unreadCount: 1 },
      ],
      total: 2,
    },
  };
};

export const listDMs: ToolDefinition = {
  name: "listDMs",
  description: "List all direct message conversations with unread counts.",
  parameters: {
    type: "object",
    properties: {
      page: { type: "number", description: "Page number" },
      pageSize: { type: "number", description: "Items per page" },
    },
  },
  handler: listDMsHandler,
};
