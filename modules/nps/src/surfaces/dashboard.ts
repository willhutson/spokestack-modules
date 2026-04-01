/**
 * NPS Home Surface
 *
 * Metadata definition — tells spokestack-core's dashboard renderer
 * where to load the NPS & Surveys overview page.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const npsHomeSurface: SurfaceDefinition = {
  id: "nps-home",
  type: "full-page",
  route: "/surveys",
  requiredTools: ["listSurveys", "listForms"],
};
