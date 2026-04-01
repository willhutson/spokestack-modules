/**
 * Survey Question Tools — add, update, reorder, delete questions
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const addQuestionHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      id: `q_${Date.now()}`,
      surveyId: params.surveyId,
      type: params.type,
      text: params.text,
      order: params.order || 1,
      required: params.required ?? true,
      options: params.options || [],
      createdAt: new Date().toISOString(),
    },
  };
};

export const addQuestion: ToolDefinition = {
  name: "addQuestion",
  description: "Add a question to a survey with type, text, and optional choices.",
  parameters: {
    type: "object",
    properties: {
      surveyId: { type: "string", description: "Survey ID" },
      type: { type: "string", description: "Question type", enum: ["text", "rating", "multiple_choice", "checkbox", "dropdown", "scale", "date"] },
      text: { type: "string", description: "Question text" },
      required: { type: "boolean", description: "Whether the question is required" },
      order: { type: "number", description: "Display order" },
      options: { type: "string", description: "JSON array of options for choice-based questions" },
    },
    required: ["surveyId", "type", "text"],
  },
  handler: addQuestionHandler,
};

const updateQuestionHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      id: params.questionId,
      ...params,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const updateQuestion: ToolDefinition = {
  name: "updateQuestion",
  description: "Update a question's text, type, options, or required status.",
  parameters: {
    type: "object",
    properties: {
      questionId: { type: "string", description: "Question ID" },
      text: { type: "string", description: "New question text" },
      type: { type: "string", description: "New question type", enum: ["text", "rating", "multiple_choice", "checkbox", "dropdown", "scale", "date"] },
      required: { type: "boolean", description: "Whether the question is required" },
      options: { type: "string", description: "JSON array of options" },
    },
    required: ["questionId"],
  },
  handler: updateQuestionHandler,
};

const reorderQuestionsHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      surveyId: params.surveyId,
      newOrder: params.questionIds,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const reorderQuestions: ToolDefinition = {
  name: "reorderQuestions",
  description: "Reorder questions in a survey by providing the new question ID sequence.",
  parameters: {
    type: "object",
    properties: {
      surveyId: { type: "string", description: "Survey ID" },
      questionIds: { type: "string", description: "JSON array of question IDs in new order" },
    },
    required: ["surveyId", "questionIds"],
  },
  handler: reorderQuestionsHandler,
};

const deleteQuestionHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { id: params.questionId, deleted: true, deletedAt: new Date().toISOString() },
  };
};

export const deleteQuestion: ToolDefinition = {
  name: "deleteQuestion",
  description: "Delete a question from a survey.",
  parameters: {
    type: "object",
    properties: {
      questionId: { type: "string", description: "Question ID to delete" },
    },
    required: ["questionId"],
  },
  handler: deleteQuestionHandler,
};
