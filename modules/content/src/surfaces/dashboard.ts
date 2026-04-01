/**
 * Content Studio Dashboard Surface
 *
 * Landing page for the Content Studio module.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const contentHomeSurface: SurfaceDefinition = {
  id: "content-home",
  type: "full-page",
  route: "/content",
  requiredTools: ["listAssets", "listVideoProjects", "listDecks"],
};
