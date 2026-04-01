/**
 * Content Studio Video Surface
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const contentVideoSurface: SurfaceDefinition = {
  id: "content-video",
  type: "full-page",
  route: "/content/video",
  requiredTools: ["listVideoProjects", "createVideoProject"],
};
