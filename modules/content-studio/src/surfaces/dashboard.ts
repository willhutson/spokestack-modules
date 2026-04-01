/**
 * Content Studio Dashboard Surface
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const contentHomeSurface: SurfaceDefinition = {
  id: "content-home",
  type: "full-page",
  route: "/content",
  requiredTools: ["listAssets", "listMoodboards", "listVideoProjects", "listDecks", "listDocuments", "listPendingReviews"],
};
