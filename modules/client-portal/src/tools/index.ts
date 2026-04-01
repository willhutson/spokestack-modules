import type { ToolDefinition } from "../../../../sdk/types/index";

export { createPortalUser, listPortalUsers, deactivatePortalUser, managePortalSessions } from "./portal-users";
export { generateMagicLink, validateMagicLink } from "./auth";
export { listBriefRequests, reviewBriefRequest, convertBriefRequest } from "./requests";
export { trackOnboarding, updateOnboardingTask, listOnboardingTasks } from "./onboarding";
export { addPortalComment, listPortalComments } from "./portal-comments";

import { createPortalUser, listPortalUsers, deactivatePortalUser, managePortalSessions } from "./portal-users";
import { generateMagicLink, validateMagicLink } from "./auth";
import { listBriefRequests, reviewBriefRequest, convertBriefRequest } from "./requests";
import { trackOnboarding, updateOnboardingTask, listOnboardingTasks } from "./onboarding";
import { addPortalComment, listPortalComments } from "./portal-comments";

export const allClientPortalTools: ToolDefinition[] = [
  createPortalUser,
  listPortalUsers,
  deactivatePortalUser,
  managePortalSessions,
  generateMagicLink,
  validateMagicLink,
  listBriefRequests,
  reviewBriefRequest,
  convertBriefRequest,
  trackOnboarding,
  updateOnboardingTask,
  listOnboardingTasks,
  addPortalComment,
  listPortalComments,
];

export const CLIENT_PORTAL_TOOL_NAMES: string[] = allClientPortalTools.map((t) => t.name);

export const allToolNames: string[] = CLIENT_PORTAL_TOOL_NAMES;
