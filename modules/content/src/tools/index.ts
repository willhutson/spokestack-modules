/**
 * Content Studio Tools — barrel export
 * All Content Studio tools conforming to the SDK ToolDefinition type.
 */

export { uploadAsset, listAssets, getAssetVersions, createAssetVersion, createFolder, listFolders, searchAssets, createAssetLibrary, addAssetComment, resolveAssetComment } from "./dam";
export { createMoodboard, listMoodboards, addToMoodboard, listMoodboardItems, generateShotList, exportMoodboard, saveMoodboardConversation } from "./creative";
export { createVideoProject, listVideoProjects, getVideoProject, updateVideoStatus, writeScript, getScript, buildStoryboard, addStoryboardFrame, listStoryboardFrames, trackVideoStatus } from "./video";
export { createDeck, listDecks, getDeck, addSlide, reorderSlides, deleteSlide, listTemplates, createTemplate, exportDeck, syncDeckToGoogleSlides } from "./presentations";
export { createDocument, listDocuments, getDocument, trackVersions, listDocumentVersions, searchKnowledge, createKnowledgeDoc, embedDocument, trackDocumentUsage, listDocTemplates } from "./docs";
export { submitForApproval, reviewContent, listPendingReviews, trackContentStatus, addContentComment, listContentComments, resolveContentComment, createContentVersion, listContentVersions, setupContentTrigger, listContentTriggers, logContentEvent, addContentAsset } from "./content-ops";

import { uploadAsset, listAssets, getAssetVersions, createAssetVersion, createFolder, listFolders, searchAssets, createAssetLibrary, addAssetComment, resolveAssetComment } from "./dam";
import { createMoodboard, listMoodboards, addToMoodboard, listMoodboardItems, generateShotList, exportMoodboard, saveMoodboardConversation } from "./creative";
import { createVideoProject, listVideoProjects, getVideoProject, updateVideoStatus, writeScript, getScript, buildStoryboard, addStoryboardFrame, listStoryboardFrames, trackVideoStatus } from "./video";
import { createDeck, listDecks, getDeck, addSlide, reorderSlides, deleteSlide, listTemplates, createTemplate, exportDeck, syncDeckToGoogleSlides } from "./presentations";
import { createDocument, listDocuments, getDocument, trackVersions, listDocumentVersions, searchKnowledge, createKnowledgeDoc, embedDocument, trackDocumentUsage, listDocTemplates } from "./docs";
import { submitForApproval, reviewContent, listPendingReviews, trackContentStatus, addContentComment, listContentComments, resolveContentComment, createContentVersion, listContentVersions, setupContentTrigger, listContentTriggers, logContentEvent, addContentAsset } from "./content-ops";
import type { ToolDefinition } from "../../../../sdk/types/index";

/** All Content Studio tools as an array for registration */
export const allContentTools: ToolDefinition[] = [
  // DAM
  uploadAsset, listAssets, getAssetVersions, createAssetVersion,
  createFolder, listFolders, searchAssets, createAssetLibrary,
  addAssetComment, resolveAssetComment,
  // Creative
  createMoodboard, listMoodboards, addToMoodboard, listMoodboardItems,
  generateShotList, exportMoodboard, saveMoodboardConversation,
  // Video
  createVideoProject, listVideoProjects, getVideoProject, updateVideoStatus,
  writeScript, getScript, buildStoryboard, addStoryboardFrame,
  listStoryboardFrames, trackVideoStatus,
  // Presentations
  createDeck, listDecks, getDeck, addSlide, reorderSlides, deleteSlide,
  listTemplates, createTemplate, exportDeck, syncDeckToGoogleSlides,
  // Docs
  createDocument, listDocuments, getDocument, trackVersions,
  listDocumentVersions, searchKnowledge, createKnowledgeDoc,
  embedDocument, trackDocumentUsage, listDocTemplates,
  // Content Ops
  submitForApproval, reviewContent, listPendingReviews, trackContentStatus,
  addContentComment, listContentComments, resolveContentComment,
  createContentVersion, listContentVersions, setupContentTrigger,
  listContentTriggers, logContentEvent, addContentAsset,
];

/** Tool names for manifest and agent definition reference */
export const allToolNames = allContentTools.map((t) => t.name);
