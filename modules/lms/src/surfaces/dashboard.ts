/**
 * LMS Home Surface
 *
 * Metadata definition — tells spokestack-core's dashboard renderer
 * where to load the LMS home page.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const lmsHomeSurface: SurfaceDefinition = {
  id: "lms-home",
  type: "full-page",
  route: "/lms",
  requiredTools: ["listCourses", "getEnrollments"],
};
