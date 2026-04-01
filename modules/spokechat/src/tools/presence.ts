/**
 * Presence Tools — set, get user presence, list online users
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const setPresenceHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { userId: context.userId || "current_user", status: params.status, statusText: params.statusText || "", updatedAt: new Date().toISOString() },
  };
};

export const setPresence: ToolDefinition = {
  name: "setPresence",
  description: "Set the current user's presence status and optional status text.",
  parameters: {
    type: "object",
    properties: {
      status: { type: "string", description: "Presence status", enum: ["online", "away", "busy", "offline"] },
      statusText: { type: "string", description: "Custom status text" },
    },
    required: ["status"],
  },
  handler: setPresenceHandler,
};

const getUserPresenceHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { userId: params.userId, status: "online", statusText: "In a meeting", lastSeenAt: "2026-03-31T14:30:00Z" },
  };
};

export const getUserPresence: ToolDefinition = {
  name: "getUserPresence",
  description: "Get a specific user's current presence status.",
  parameters: {
    type: "object",
    properties: {
      userId: { type: "string", description: "User ID" },
    },
    required: ["userId"],
  },
  handler: getUserPresenceHandler,
};

const getOnlineUsersHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      users: [
        { userId: "user_101", displayName: "Alice", status: "online", statusText: "" },
        { userId: "user_202", displayName: "Bob", status: "busy", statusText: "In a meeting" },
        { userId: "user_303", displayName: "Carol", status: "away", statusText: "Back in 15 min" },
      ],
      onlineCount: 3,
    },
  };
};

export const getOnlineUsers: ToolDefinition = {
  name: "getOnlineUsers",
  description: "Get a list of all currently online users with their presence status.",
  parameters: {
    type: "object",
    properties: {
      channelId: { type: "string", description: "Optional: limit to users in a specific channel" },
    },
  },
  handler: getOnlineUsersHandler,
};
