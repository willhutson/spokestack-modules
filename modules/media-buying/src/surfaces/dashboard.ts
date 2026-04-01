/**
 * Media Buying Home Surface
 *
 * Metadata definition — tells spokestack-core's dashboard renderer
 * where to load the media buying home page.
 * The actual React component lives in spokestack-core.
 */

import type { SurfaceDefinition } from "../../../../sdk/types/index";

export const mediaBuyingHomeSurface: SurfaceDefinition = {
  id: "media-buying-home",
  type: "full-page",
  route: "/media-buying",
  requiredTools: ["listCampaigns", "getBudgetUtilization"],
};
