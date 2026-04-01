/**
 * Social Publishing — Tool barrel export
 */

export { connectAccount, listAccounts, disconnectAccount, getAccountSpecs } from "./accounts";
export { createPost, listPosts, getPost, updatePost, deletePost } from "./posts";
export { schedulePost, publishNow, listScheduled, cancelScheduled, getPublishLog, listPublishJobs } from "./scheduling";
export { trackCampaign, addCampaignActivity, manageCampaignMembers, analyzeEngagement } from "./campaigns";

export const allToolNames: string[] = [
  "connectAccount", "listAccounts", "disconnectAccount", "getAccountSpecs",
  "createPost", "listPosts", "getPost", "updatePost", "deletePost",
  "schedulePost", "publishNow", "listScheduled", "cancelScheduled", "getPublishLog", "listPublishJobs",
  "trackCampaign", "addCampaignActivity", "manageCampaignMembers", "analyzeEngagement",
];
