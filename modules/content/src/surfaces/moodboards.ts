/**
 * Content Studio Moodboards Surface
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const contentMoodboardsSurface: SurfaceDefinition = {
  id: "content-moodboards",
  type: "full-page",
  route: "/content/moodboards",
  requiredTools: ["listMoodboards", "createMoodboard"],
};
