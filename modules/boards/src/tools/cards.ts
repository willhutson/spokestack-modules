/**
 * Card Management Tools — create, move, update, assign, comment, activity
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const createCardHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      id: `card_${Date.now()}`,
      boardId: params.boardId,
      columnId: params.columnId,
      title: params.title,
      description: params.description || "",
      priority: params.priority || "medium",
      assigneeId: null,
      labels: [],
      createdAt: new Date().toISOString(),
    },
  };
};

export const createCard: ToolDefinition = {
  name: "createCard",
  description: "Create a new card in a specific column with title, description, and priority.",
  parameters: {
    type: "object",
    properties: {
      boardId: { type: "string", description: "Board ID" },
      columnId: { type: "string", description: "Column ID to place the card in" },
      title: { type: "string", description: "Card title" },
      description: { type: "string", description: "Card description" },
      priority: { type: "string", description: "Card priority", enum: ["low", "medium", "high", "critical"] },
      dueDate: { type: "string", description: "Due date in ISO format" },
    },
    required: ["boardId", "columnId", "title"],
  },
  handler: createCardHandler,
};

const moveCardHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      id: params.cardId,
      fromColumnId: "col_prev",
      toColumnId: params.toColumnId,
      position: params.position || 0,
      movedAt: new Date().toISOString(),
    },
  };
};

export const moveCard: ToolDefinition = {
  name: "moveCard",
  description: "Move a card to a different column or position within the same column.",
  parameters: {
    type: "object",
    properties: {
      cardId: { type: "string", description: "Card ID to move" },
      toColumnId: { type: "string", description: "Target column ID" },
      position: { type: "number", description: "Position within the column (0-based)" },
    },
    required: ["cardId", "toColumnId"],
  },
  handler: moveCardHandler,
};

const updateCardHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { id: params.cardId, ...params, updatedAt: new Date().toISOString() },
  };
};

export const updateCard: ToolDefinition = {
  name: "updateCard",
  description: "Update a card's title, description, priority, labels, or due date.",
  parameters: {
    type: "object",
    properties: {
      cardId: { type: "string", description: "Card ID" },
      title: { type: "string", description: "New title" },
      description: { type: "string", description: "New description" },
      priority: { type: "string", description: "New priority", enum: ["low", "medium", "high", "critical"] },
      dueDate: { type: "string", description: "New due date" },
      labels: { type: "string", description: "JSON array of label strings" },
    },
    required: ["cardId"],
  },
  handler: updateCardHandler,
};

const assignCardHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      cardId: params.cardId,
      assigneeId: params.assigneeId,
      assignedAt: new Date().toISOString(),
    },
  };
};

export const assignCard: ToolDefinition = {
  name: "assignCard",
  description: "Assign a card to a user or unassign it.",
  parameters: {
    type: "object",
    properties: {
      cardId: { type: "string", description: "Card ID" },
      assigneeId: { type: "string", description: "User ID to assign (empty to unassign)" },
    },
    required: ["cardId", "assigneeId"],
  },
  handler: assignCardHandler,
};

const addCardCommentHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      id: `comment_${Date.now()}`,
      cardId: params.cardId,
      authorId: context.userId || "system",
      text: params.text,
      createdAt: new Date().toISOString(),
    },
  };
};

export const addCardComment: ToolDefinition = {
  name: "addCardComment",
  description: "Add a comment to a card.",
  parameters: {
    type: "object",
    properties: {
      cardId: { type: "string", description: "Card ID" },
      text: { type: "string", description: "Comment text" },
    },
    required: ["cardId", "text"],
  },
  handler: addCardCommentHandler,
};

const getCardActivityHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      cardId: params.cardId,
      activity: [
        { type: "created", userId: "user_101", timestamp: "2026-03-10T09:00:00Z" },
        { type: "moved", userId: "user_101", from: "Backlog", to: "In Progress", timestamp: "2026-03-12T14:00:00Z" },
        { type: "comment", userId: "user_202", text: "Looking good!", timestamp: "2026-03-13T10:30:00Z" },
        { type: "assigned", userId: "user_101", assignee: "user_303", timestamp: "2026-03-14T08:15:00Z" },
      ],
    },
  };
};

export const getCardActivity: ToolDefinition = {
  name: "getCardActivity",
  description: "Get the activity log for a card including moves, comments, and assignments.",
  parameters: {
    type: "object",
    properties: {
      cardId: { type: "string", description: "Card ID" },
    },
    required: ["cardId"],
  },
  handler: getCardActivityHandler,
};
