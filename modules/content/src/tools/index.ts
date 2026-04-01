/**
 * Content Studio — Tool Barrel Export
 *
 * Aggregates all tools from all 6 domain files.
 */

// DAM
export { uploadAsset, listAssets, getAssetVersions, createAssetVersion, createFolder, listFolders, searchAssets, createAssetLibrary, addAssetComment, resolveAssetComment } from "./dam";

// Creative
export { createMoodboard, listMoodboards, addToMoodboard, listMoodboardItems, generateShotList, exportMoodboard, saveMoodboardConversation } from "./creative";

// Video
export { createVideoProject, listVideoProjects, getVideoProject, updateVideoStatus, writeScript, getScript, buildStoryboard, addStoryboardFrame, listStoryboardFrames, trackVideoStatus } from "./video";

// Presentations
export { createDeck, listDecks, getDeck, addSlide, reorderSlides, deleteSlide, listTemplates, createTemplate, exportDeck, syncDeckToGoogleSlides } from "./presentations";

// Docs & Knowledge
export { createDocument, listDocuments, getDocument, trackVersions, listDocumentVersions, searchKnowledge, createKnowledgeDoc, embedDocument, trackDocumentUsage, listDocTemplates } from "./docs";

// Content Ops
export { submitForApproval, reviewContent, listPendingReviews, trackContentStatus, addContentComment, listContentComments, resolveContentComment, createContentVersion, listContentVersions, setupContentTrigger, listContentTriggers, logContentEvent, addContentAsset } from "./content-ops";

// ---------------------------------------------------------------------------
// Aggregated imports for array + names
// ---------------------------------------------------------------------------

import { uploadAsset, listAssets, getAssetVersions, createAssetVersion, createFolder, listFolders, searchAssets, createAssetLibrary, addAssetComment, resolveAssetComment } from "./dam";
import { createMoodboard, listMoodboards, addToMoodboard, listMoodboardItems, generateShotList, exportMoodboard, saveMoodboardConversation } from "./creative";
import { createVideoProject, listVideoProjects, getVideoProject, updateVideoStatus, writeScript, getScript, buildStoryboard, addStoryboardFrame, listStoryboardFrames, trackVideoStatus } from "./video";
import { createDeck, listDecks, getDeck, addSlide, reorderSlides, deleteSlide, listTemplates, createTemplate, exportDeck, syncDeckToGoogleSlides } from "./presentations";
import { createDocument, listDocuments, getDocument, trackVersions, listDocumentVersions, searchKnowledge, createKnowledgeDoc, embedDocument, trackDocumentUsage, listDocTemplates } from "./docs";
import { submitForApproval, reviewContent, listPendingReviews, trackContentStatus, addContentComment, listContentComments, resolveContentComment, createContentVersion, listContentVersions, setupContentTrigger, listContentTriggers, logContentEvent, addContentAsset } from "./content-ops";

import type { ToolDefinition } from "../../../../sdk/types/index";

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

export const allToolNames: string[] = allContentTools.map((t) => t.name);
