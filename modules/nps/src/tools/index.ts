/**
 * NPS Tools — barrel export
 *
 * All NPS tools conforming to the SDK ToolDefinition type.
 * Tool handlers are stubs for Phase 2; real data layer is Phase 3.
 */

export {
  createSurvey,
  sendSurvey,
  listSurveys,
  getSurveyResults,
  analyzeNPS,
  submitNPSResponse,
  listResponses,
} from "./surveys";

export {
  createForm,
  listForms,
  submitForm,
  listSubmissions,
  reviewSubmission,
  getSubmission,
} from "./forms";

import {
  createSurvey,
  sendSurvey,
  listSurveys,
  getSurveyResults,
  analyzeNPS,
  submitNPSResponse,
  listResponses,
} from "./surveys";

import {
  createForm,
  listForms,
  submitForm,
  listSubmissions,
  reviewSubmission,
  getSubmission,
} from "./forms";

import type { ToolDefinition } from "../../../../sdk/types/index";

/** All NPS tools as an array for registration */
export const allNpsTools: ToolDefinition[] = [
  // NPS surveys
  createSurvey,
  sendSurvey,
  listSurveys,
  getSurveyResults,
  analyzeNPS,
  submitNPSResponse,
  listResponses,
  // Forms
  createForm,
  listForms,
  submitForm,
  listSubmissions,
  reviewSubmission,
  getSubmission,
];

/** Tool names for manifest and agent definition reference */
export const NPS_TOOL_NAMES = allNpsTools.map((t) => t.name);

/** Alias for test compatibility */
export const allToolNames = NPS_TOOL_NAMES;
