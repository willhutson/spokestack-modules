/**
 * Content Studio — Tool Barrel Export
 *
 * Aggregates all tools from all 6 domain files.
 */

// DAM
export { uploadAsset, listAssets, getAssetVersions, createAssetVersion, createFolder, listFolders, searchAssets, createAssetLibrary, addAssetComment, resolveAssetComment } from "./dam";

// DAM v2
export { listAssetLibraries, createAssetFolder, listFolderContents, getAssetDetails, updateAsset, uploadAssetVersion, moveAsset, archiveAsset, getAssetVersionHistory } from "./dam-v2";

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

// Moodboards
export { createMoodboard as createMoodboardV2, addMoodboardItem, getMoodboard, listMoodboards as listMoodboardsV2, generateMoodboardOutput, shareMoodboard } from "./moodboards";

// Storyboards
export { createStoryboard, addFrame, reorderFrames, getStoryboard } from "./storyboards";

// Deck Templates
export { createDeckTemplate, listDeckTemplates, applyTemplate } from "./deck-templates";

// Studio Calendar
export { createCalendarEntry, listCalendarEntries, updateCalendarEntry, getCalendarByDateRange } from "./studio-calendar";

// Content Triggers
export { createTrigger, listTriggers, enableTrigger, disableTrigger } from "./content-triggers";

// ---------------------------------------------------------------------------
// Aggregated imports for array + names
// ---------------------------------------------------------------------------

import { uploadAsset, listAssets, getAssetVersions, createAssetVersion, createFolder, listFolders, searchAssets, createAssetLibrary, addAssetComment, resolveAssetComment } from "./dam";
import { listAssetLibraries, createAssetFolder, listFolderContents, getAssetDetails, updateAsset, uploadAssetVersion, moveAsset, archiveAsset, getAssetVersionHistory } from "./dam-v2";
import { createMoodboard, listMoodboards, addToMoodboard, listMoodboardItems, generateShotList, exportMoodboard, saveMoodboardConversation } from "./creative";
import { createVideoProject, listVideoProjects, getVideoProject, updateVideoStatus, writeScript, getScript, buildStoryboard, addStoryboardFrame, listStoryboardFrames, trackVideoStatus } from "./video";
import { createDeck, listDecks, getDeck, addSlide, reorderSlides, deleteSlide, listTemplates, createTemplate, exportDeck, syncDeckToGoogleSlides } from "./presentations";
import { createDocument, listDocuments, getDocument, trackVersions, listDocumentVersions, searchKnowledge, createKnowledgeDoc, embedDocument, trackDocumentUsage, listDocTemplates } from "./docs";
import { submitForApproval, reviewContent, listPendingReviews, trackContentStatus, addContentComment, listContentComments, resolveContentComment, createContentVersion, listContentVersions, setupContentTrigger, listContentTriggers, logContentEvent, addContentAsset } from "./content-ops";
import { createMoodboard as createMoodboardV2, addMoodboardItem, getMoodboard, listMoodboards as listMoodboardsV2, generateMoodboardOutput, shareMoodboard } from "./moodboards";
import { createStoryboard, addFrame, reorderFrames, getStoryboard } from "./storyboards";
import { createDeckTemplate, listDeckTemplates, applyTemplate } from "./deck-templates";
import { createCalendarEntry, listCalendarEntries, updateCalendarEntry, getCalendarByDateRange } from "./studio-calendar";
import { createTrigger, listTriggers, enableTrigger, disableTrigger } from "./content-triggers";

import type { ToolDefinition } from "../../../../sdk/types/index";

export const allContentTools: ToolDefinition[] = [
  // DAM
  uploadAsset, listAssets, getAssetVersions, createAssetVersion,
  createFolder, listFolders, searchAssets, createAssetLibrary,
  addAssetComment, resolveAssetComment,
  // DAM v2
  listAssetLibraries, createAssetFolder, listFolderContents, getAssetDetails,
  updateAsset, uploadAssetVersion, moveAsset, archiveAsset, getAssetVersionHistory,
  // Creative (createMoodboard + listMoodboards replaced by moodboards.ts v2 below)
  addToMoodboard, listMoodboardItems,
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
  // Moodboards (v2)
  createMoodboardV2, addMoodboardItem, getMoodboard, listMoodboardsV2,
  generateMoodboardOutput, shareMoodboard,
  // Storyboards
  createStoryboard, addFrame, reorderFrames, getStoryboard,
  // Deck Templates
  createDeckTemplate, listDeckTemplates, applyTemplate,
  // Studio Calendar
  createCalendarEntry, listCalendarEntries, updateCalendarEntry, getCalendarByDateRange,
  // Content Triggers
  createTrigger, listTriggers, enableTrigger, disableTrigger,
];

export const allToolNames: string[] = allContentTools.map((t) => t.name);
