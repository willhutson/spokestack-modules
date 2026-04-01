/**
 * NPS Surveys Surface
 *
 * Metadata definition for the NPS surveys management page.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const npsSurveysSurface: SurfaceDefinition = {
  id: "nps-surveys",
  type: "full-page",
  route: "/surveys/nps",
  requiredTools: ["createSurvey", "listSurveys", "getSurveyResults", "analyzeNPS"],
};
