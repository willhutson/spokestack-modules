/**
 * Reaction Tools — add, remove, get reactions
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const addReactionHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { messageId: params.messageId, emoji: params.emoji, userId: context.userId || "current_user", addedAt: new Date().toISOString() },
  };
};

export const addReaction: ToolDefinition = {
  name: "addReaction",
  description: "Add an emoji reaction to a message.",
  parameters: {
    type: "object",
    properties: {
      messageId: { type: "string", description: "Message ID" },
      emoji: { type: "string", description: "Emoji code (e.g. thumbsup, heart, rocket)" },
    },
    required: ["messageId", "emoji"],
  },
  handler: addReactionHandler,
};

const removeReactionHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { messageId: params.messageId, emoji: params.emoji, removed: true },
  };
};

export const removeReaction: ToolDefinition = {
  name: "removeReaction",
  description: "Remove an emoji reaction from a message.",
  parameters: {
    type: "object",
    properties: {
      messageId: { type: "string", description: "Message ID" },
      emoji: { type: "string", description: "Emoji code to remove" },
    },
    required: ["messageId", "emoji"],
  },
  handler: removeReactionHandler,
};

const getReactionsHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      messageId: params.messageId,
      reactions: [
        { emoji: "thumbsup", count: 5, users: ["user_101", "user_202", "user_303", "user_404", "user_505"] },
        { emoji: "rocket", count: 2, users: ["user_101", "user_303"] },
      ],
    },
  };
};

export const getReactions: ToolDefinition = {
  name: "getReactions",
  description: "Get all reactions on a message with user lists.",
  parameters: {
    type: "object",
    properties: {
      messageId: { type: "string", description: "Message ID" },
    },
    required: ["messageId"],
  },
  handler: getReactionsHandler,
};
