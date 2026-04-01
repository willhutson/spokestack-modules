/**
 * Content Studio Assets Surface
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const contentAssetsSurface: SurfaceDefinition = {
  id: "content-assets",
  type: "full-page",
  route: "/content/assets",
  requiredTools: ["listAssets", "uploadAsset", "searchAssets"],
};
