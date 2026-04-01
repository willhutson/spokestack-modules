/**
 * Message Tools — send, list, edit, delete, thread, search
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const sendMessageHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      id: `msg_${Date.now()}`,
      channelId: params.channelId,
      authorId: context.userId || "current_user",
      text: params.text,
      threadId: params.threadId || null,
      attachments: [],
      createdAt: new Date().toISOString(),
    },
  };
};

export const sendMessage: ToolDefinition = {
  name: "sendMessage",
  description: "Send a message to a channel, optionally as a reply in a thread.",
  parameters: {
    type: "object",
    properties: {
      channelId: { type: "string", description: "Channel ID" },
      text: { type: "string", description: "Message text" },
      threadId: { type: "string", description: "Parent message ID for threaded replies" },
    },
    required: ["channelId", "text"],
  },
  handler: sendMessageHandler,
};

const listMessagesHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      messages: [
        { id: "msg_001", authorId: "user_101", authorName: "Alice", text: "Good morning team!", replyCount: 2, createdAt: "2026-03-30T09:00:00Z" },
        { id: "msg_002", authorId: "user_202", authorName: "Bob", text: "Sprint review at 3pm today", replyCount: 0, createdAt: "2026-03-30T09:15:00Z" },
        { id: "msg_003", authorId: "user_303", authorName: "Carol", text: "PR #142 ready for review", replyCount: 5, createdAt: "2026-03-30T10:30:00Z" },
      ],
      hasMore: true,
    },
  };
};

export const listMessages: ToolDefinition = {
  name: "listMessages",
  description: "List messages in a channel with pagination.",
  parameters: {
    type: "object",
    properties: {
      channelId: { type: "string", description: "Channel ID" },
      limit: { type: "number", description: "Number of messages to return" },
      before: { type: "string", description: "Cursor: return messages before this message ID" },
      after: { type: "string", description: "Cursor: return messages after this message ID" },
    },
    required: ["channelId"],
  },
  handler: listMessagesHandler,
};

const editMessageHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { id: params.messageId, text: params.text, edited: true, editedAt: new Date().toISOString() },
  };
};

export const editMessage: ToolDefinition = {
  name: "editMessage",
  description: "Edit an existing message's text.",
  parameters: {
    type: "object",
    properties: {
      messageId: { type: "string", description: "Message ID" },
      text: { type: "string", description: "New message text" },
    },
    required: ["messageId", "text"],
  },
  handler: editMessageHandler,
};

const deleteMessageHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { id: params.messageId, deleted: true, deletedAt: new Date().toISOString() },
  };
};

export const deleteMessage: ToolDefinition = {
  name: "deleteMessage",
  description: "Delete a message.",
  parameters: {
    type: "object",
    properties: {
      messageId: { type: "string", description: "Message ID to delete" },
    },
    required: ["messageId"],
  },
  handler: deleteMessageHandler,
};

const getThreadHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      parentMessage: { id: params.messageId, authorName: "Alice", text: "Should we refactor the auth module?", createdAt: "2026-03-30T09:00:00Z" },
      replies: [
        { id: "msg_r1", authorName: "Bob", text: "Yes, the token refresh is brittle", createdAt: "2026-03-30T09:05:00Z" },
        { id: "msg_r2", authorName: "Carol", text: "I can take that on this sprint", createdAt: "2026-03-30T09:10:00Z" },
      ],
      replyCount: 2,
    },
  };
};

export const getThread: ToolDefinition = {
  name: "getThread",
  description: "Get a message thread with all replies.",
  parameters: {
    type: "object",
    properties: {
      messageId: { type: "string", description: "Parent message ID" },
    },
    required: ["messageId"],
  },
  handler: getThreadHandler,
};

const searchMessagesHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      results: [
        { id: "msg_045", channelName: "engineering", authorName: "Alice", text: "Deploy pipeline is green", createdAt: "2026-03-28T16:00:00Z" },
      ],
      total: 1,
    },
  };
};

export const searchMessages: ToolDefinition = {
  name: "searchMessages",
  description: "Search messages across all channels by text, author, or date range.",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" },
      channelId: { type: "string", description: "Limit to specific channel" },
      authorId: { type: "string", description: "Filter by author" },
      after: { type: "string", description: "Messages after this date" },
      before: { type: "string", description: "Messages before this date" },
    },
    required: ["query"],
  },
  handler: searchMessagesHandler,
};
