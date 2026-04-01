/**
 * Boards Tools — barrel export
 */

export { createBoard, listBoards, getBoard, updateBoard, deleteBoard } from "./boards";
export { addColumn, updateColumn, reorderColumns, deleteColumn } from "./columns";
export { createCard, moveCard, updateCard, assignCard, addCardComment, getCardActivity } from "./cards";
export { filterCards, searchCards, getCardsByAssignee } from "./filters";

import { createBoard, listBoards, getBoard, updateBoard, deleteBoard } from "./boards";
import { addColumn, updateColumn, reorderColumns, deleteColumn } from "./columns";
import { createCard, moveCard, updateCard, assignCard, addCardComment, getCardActivity } from "./cards";
import { filterCards, searchCards, getCardsByAssignee } from "./filters";
import type { ToolDefinition } from "../../../../sdk/types/index";

export const allBoardsTools: ToolDefinition[] = [
  createBoard, listBoards, getBoard, updateBoard, deleteBoard,
  addColumn, updateColumn, reorderColumns, deleteColumn,
  createCard, moveCard, updateCard, assignCard, addCardComment, getCardActivity,
  filterCards, searchCards, getCardsByAssignee,
];

export const allToolNames: string[] = allBoardsTools.map((t) => t.name);
