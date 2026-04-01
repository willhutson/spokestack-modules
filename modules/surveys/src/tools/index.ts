/**
 * Surveys Tools — barrel export
 */

export { createSurvey, listSurveys, getSurvey, updateSurvey, deleteSurvey, cloneSurvey } from "./templates";
export { addQuestion, updateQuestion, reorderQuestions, deleteQuestion } from "./questions";
export { submitResponse, listResponses, getResults, exportResults } from "./responses";

import { createSurvey, listSurveys, getSurvey, updateSurvey, deleteSurvey, cloneSurvey } from "./templates";
import { addQuestion, updateQuestion, reorderQuestions, deleteQuestion } from "./questions";
import { submitResponse, listResponses, getResults, exportResults } from "./responses";
import type { ToolDefinition } from "../../../../sdk/types/index";

export const allSurveysTools: ToolDefinition[] = [
  createSurvey, listSurveys, getSurvey, updateSurvey, deleteSurvey, cloneSurvey,
  addQuestion, updateQuestion, reorderQuestions, deleteQuestion,
  submitResponse, listResponses, getResults, exportResults,
];

export const allToolNames: string[] = allSurveysTools.map((t) => t.name);
