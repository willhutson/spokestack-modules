/**
 * NPS Forms Surface
 *
 * Metadata definition for the form templates and submissions page.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const npsFormsSurface: SurfaceDefinition = {
  id: "nps-forms",
  type: "full-page",
  route: "/surveys/forms",
  requiredTools: ["createForm", "listForms", "listSubmissions"],
};
