/**
 * Card Filter & Search Tools
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const filterCardsHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      cards: [
        { id: "card_001", title: "Implement auth", columnName: "In Progress", priority: "high", assigneeId: "user_101" },
        { id: "card_002", title: "Fix login bug", columnName: "Review", priority: "critical", assigneeId: "user_202" },
      ],
      total: 2,
    },
  };
};

export const filterCards: ToolDefinition = {
  name: "filterCards",
  description: "Filter cards on a board by priority, assignee, label, or due date range.",
  parameters: {
    type: "object",
    properties: {
      boardId: { type: "string", description: "Board ID" },
      priority: { type: "string", description: "Filter by priority", enum: ["low", "medium", "high", "critical"] },
      assigneeId: { type: "string", description: "Filter by assignee user ID" },
      label: { type: "string", description: "Filter by label" },
      dueBefore: { type: "string", description: "Filter cards due before this date" },
      dueAfter: { type: "string", description: "Filter cards due after this date" },
    },
    required: ["boardId"],
  },
  handler: filterCardsHandler,
};

const searchCardsHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      cards: [
        { id: "card_003", title: "Search API integration", boardName: "Product Roadmap", columnName: "Backlog", priority: "medium" },
      ],
      total: 1,
    },
  };
};

export const searchCards: ToolDefinition = {
  name: "searchCards",
  description: "Full-text search across all cards in all boards.",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" },
      boardId: { type: "string", description: "Limit search to a specific board" },
    },
    required: ["query"],
  },
  handler: searchCardsHandler,
};

const getCardsByAssigneeHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      assigneeId: params.assigneeId,
      cards: [
        { id: "card_001", title: "Implement auth", boardName: "Product Roadmap", columnName: "In Progress", priority: "high", dueDate: "2026-04-01T00:00:00Z" },
        { id: "card_005", title: "Write docs", boardName: "Sprint 14", columnName: "Backlog", priority: "low", dueDate: "2026-04-10T00:00:00Z" },
      ],
      total: 2,
    },
  };
};

export const getCardsByAssignee: ToolDefinition = {
  name: "getCardsByAssignee",
  description: "Get all cards assigned to a specific user across all boards.",
  parameters: {
    type: "object",
    properties: {
      assigneeId: { type: "string", description: "User ID" },
    },
    required: ["assigneeId"],
  },
  handler: getCardsByAssigneeHandler,
};
