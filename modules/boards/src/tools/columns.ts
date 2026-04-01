/**
 * Column Management Tools — add, update, reorder, delete columns
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const addColumnHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      id: `col_${Date.now()}`,
      boardId: params.boardId,
      name: params.name,
      order: params.order || 1,
      wipLimit: params.wipLimit || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const addColumn: ToolDefinition = {
  name: "addColumn",
  description: "Add a new column to a board with a name and optional WIP limit.",
  parameters: {
    type: "object",
    properties: {
      boardId: { type: "string", description: "Board ID" },
      name: { type: "string", description: "Column name" },
      order: { type: "number", description: "Column display order" },
      wipLimit: { type: "number", description: "Work-in-progress card limit" },
    },
    required: ["boardId", "name"],
  },
  handler: addColumnHandler,
};

const updateColumnHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { id: params.columnId, ...params, updatedAt: new Date().toISOString() },
  };
};

export const updateColumn: ToolDefinition = {
  name: "updateColumn",
  description: "Update a column's name or WIP limit.",
  parameters: {
    type: "object",
    properties: {
      columnId: { type: "string", description: "Column ID" },
      name: { type: "string", description: "New column name" },
      wipLimit: { type: "number", description: "New WIP limit" },
    },
    required: ["columnId"],
  },
  handler: updateColumnHandler,
};

const reorderColumnsHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { boardId: params.boardId, newOrder: params.columnIds, updatedAt: new Date().toISOString() },
  };
};

export const reorderColumns: ToolDefinition = {
  name: "reorderColumns",
  description: "Reorder columns on a board by providing the new column ID sequence.",
  parameters: {
    type: "object",
    properties: {
      boardId: { type: "string", description: "Board ID" },
      columnIds: { type: "string", description: "JSON array of column IDs in new order" },
    },
    required: ["boardId", "columnIds"],
  },
  handler: reorderColumnsHandler,
};

const deleteColumnHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { id: params.columnId, deleted: true, deletedAt: new Date().toISOString() },
  };
};

export const deleteColumn: ToolDefinition = {
  name: "deleteColumn",
  description: "Delete a column from a board. Cards in the column must be moved first.",
  parameters: {
    type: "object",
    properties: {
      columnId: { type: "string", description: "Column ID to delete" },
      moveCardsTo: { type: "string", description: "Column ID to move existing cards to" },
    },
    required: ["columnId"],
  },
  handler: deleteColumnHandler,
};
