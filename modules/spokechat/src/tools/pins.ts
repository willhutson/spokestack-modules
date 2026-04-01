/**
 * Pin Tools — pin, unpin, get pinned messages
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const pinMessageHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { messageId: params.messageId, channelId: params.channelId, pinnedBy: context.userId || "current_user", pinnedAt: new Date().toISOString() },
  };
};

export const pinMessage: ToolDefinition = {
  name: "pinMessage",
  description: "Pin a message to a channel.",
  parameters: {
    type: "object",
    properties: {
      messageId: { type: "string", description: "Message ID to pin" },
      channelId: { type: "string", description: "Channel ID" },
    },
    required: ["messageId", "channelId"],
  },
  handler: pinMessageHandler,
};

const unpinMessageHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { messageId: params.messageId, unpinned: true },
  };
};

export const unpinMessage: ToolDefinition = {
  name: "unpinMessage",
  description: "Unpin a message from a channel.",
  parameters: {
    type: "object",
    properties: {
      messageId: { type: "string", description: "Message ID to unpin" },
    },
    required: ["messageId"],
  },
  handler: unpinMessageHandler,
};

const getPinnedMessagesHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      channelId: params.channelId,
      pinnedMessages: [
        { id: "msg_010", authorName: "Alice", text: "Team standup at 9:30am daily", pinnedAt: "2026-02-01T10:00:00Z" },
        { id: "msg_025", authorName: "Bob", text: "Deploy checklist: https://wiki.example.com/deploy", pinnedAt: "2026-02-15T14:00:00Z" },
      ],
      total: 2,
    },
  };
};

export const getPinnedMessages: ToolDefinition = {
  name: "getPinnedMessages",
  description: "Get all pinned messages in a channel.",
  parameters: {
    type: "object",
    properties: {
      channelId: { type: "string", description: "Channel ID" },
    },
    required: ["channelId"],
  },
  handler: getPinnedMessagesHandler,
};
