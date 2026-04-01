/**
 * Content Studio Docs Surface
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const contentDocsSurface: SurfaceDefinition = {
  id: "content-docs",
  type: "full-page",
  route: "/content/docs",
  requiredTools: ["listDocuments", "createDocument"],
};
