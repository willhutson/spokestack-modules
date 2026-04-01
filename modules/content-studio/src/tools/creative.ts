/**
 * Creative / Moodboard Tools
 *
 * Models: Moodboard, MoodboardConversation, MoodboardItem, MoodboardOutput, ShotListItem
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createMoodboard
// ---------------------------------------------------------------------------

const createMoodboardHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "mb_stub_001",
      organizationId: params.orgId,
      title: params.title,
      description: params.description || null,
      type: params.type || "GENERAL",
      status: "ACTIVE",
      backgroundColor: params.backgroundColor || null,
      clientId: params.clientId || null,
      projectId: params.projectId || null,
      briefId: params.briefId || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createMoodboard: ToolDefinition = {
  name: "createMoodboard",
  description: "Create a new moodboard for campaign concepting",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      title: { type: "string", description: "Moodboard title" },
      description: { type: "string", description: "Moodboard description" },
      type: {
        type: "string",
        description: "Moodboard type",
        enum: ["GENERAL", "BRAND", "CAMPAIGN", "PRODUCT"],
      },
      clientId: { type: "string", description: "Client ID" },
      projectId: { type: "string", description: "Project ID" },
      briefId: { type: "string", description: "Brief ID" },
      backgroundColor: { type: "string", description: "Background color hex" },
    },
    required: ["orgId", "title"],
  },
  handler: createMoodboardHandler,
};

// ---------------------------------------------------------------------------
// listMoodboards
// ---------------------------------------------------------------------------

const listMoodboardsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      {
        id: "mb_stub_001",
        title: "Summer Campaign Mood",
        type: "CAMPAIGN",
        status: "ACTIVE",
        itemCount: 12,
        organizationId: params.orgId,
        createdAt: new Date().toISOString(),
      },
      {
        id: "mb_stub_002",
        title: "Brand Refresh",
        type: "BRAND",
        status: "ACTIVE",
        itemCount: 8,
        organizationId: params.orgId,
        createdAt: new Date().toISOString(),
      },
    ],
  };
};

export const listMoodboards: ToolDefinition = {
  name: "listMoodboards",
  description: "List moodboards with optional filters",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Filter by client" },
      projectId: { type: "string", description: "Filter by project" },
      status: { type: "string", description: "Filter by status" },
    },
    required: ["orgId"],
  },
  handler: listMoodboardsHandler,
};

// ---------------------------------------------------------------------------
// addToMoodboard
// ---------------------------------------------------------------------------

const addToMoodboardHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "mbi_stub_001",
      moodboardId: params.moodboardId,
      type: params.type,
      fileUrl: params.fileUrl || null,
      sourceUrl: params.sourceUrl || null,
      title: params.title || null,
      color: params.color || null,
      text: params.text || null,
      tags: params.tags || [],
      positionX: 0,
      positionY: 0,
      zIndex: 1,
      createdAt: new Date().toISOString(),
    },
  };
};

export const addToMoodboard: ToolDefinition = {
  name: "addToMoodboard",
  description: "Add an item to a moodboard",
  parameters: {
    type: "object",
    properties: {
      moodboardId: { type: "string", description: "Moodboard ID" },
      type: {
        type: "string",
        description: "Item type",
        enum: ["IMAGE", "VIDEO", "COLOR", "TEXT", "URL", "FILE"],
      },
      fileUrl: { type: "string", description: "File URL" },
      sourceUrl: { type: "string", description: "Source URL" },
      title: { type: "string", description: "Item title" },
      color: { type: "string", description: "Color hex value" },
      text: { type: "string", description: "Text content" },
      tags: { type: "array", items: { type: "string" }, description: "Tags" },
    },
    required: ["moodboardId", "type"],
  },
  handler: addToMoodboardHandler,
};

// ---------------------------------------------------------------------------
// listMoodboardItems
// ---------------------------------------------------------------------------

const listMoodboardItemsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      {
        id: "mbi_stub_001",
        moodboardId: params.moodboardId,
        type: "IMAGE",
        fileUrl: "https://cdn.spokestack.io/stub/image1.jpg",
        title: "Hero shot reference",
        zIndex: 0,
      },
      {
        id: "mbi_stub_002",
        moodboardId: params.moodboardId,
        type: "COLOR",
        color: "#FF6B35",
        title: "Accent color",
        zIndex: 1,
      },
    ],
  };
};

export const listMoodboardItems: ToolDefinition = {
  name: "listMoodboardItems",
  description: "List items in a moodboard sorted by zIndex",
  parameters: {
    type: "object",
    properties: {
      moodboardId: { type: "string", description: "Moodboard ID" },
    },
    required: ["moodboardId"],
  },
  handler: listMoodboardItemsHandler,
};

// ---------------------------------------------------------------------------
// generateShotList
// ---------------------------------------------------------------------------

const generateShotListHandler: ToolHandler = async (params) => {
  const count = (params.count as number) || 10;
  const shots = Array.from({ length: count }, (_, i) => ({
    id: `shot_stub_${String(i + 1).padStart(3, "0")}`,
    videoProjectId: params.videoProjectId,
    shotNumber: `S${String(i + 1).padStart(2, "0")}`,
    orderIndex: i,
    description: `Shot ${i + 1} description based on moodboard reference`,
    shotType: ["WIDE", "MEDIUM", "CLOSE_UP", "DETAIL"][i % 4],
    duration: 3 + (i % 5),
    status: "PLANNED",
    createdAt: new Date().toISOString(),
  }));
  return { success: true, data: shots };
};

export const generateShotList: ToolDefinition = {
  name: "generateShotList",
  description: "Generate shot list items for a video project from a moodboard",
  parameters: {
    type: "object",
    properties: {
      moodboardId: { type: "string", description: "Source moodboard ID" },
      videoProjectId: { type: "string", description: "Target video project ID" },
      count: { type: "number", description: "Number of shots to generate (default 10)", minimum: 1 },
    },
    required: ["moodboardId", "videoProjectId"],
  },
  handler: generateShotListHandler,
};

// ---------------------------------------------------------------------------
// exportMoodboard
// ---------------------------------------------------------------------------

const exportMoodboardHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "mbo_stub_001",
      moodboardId: params.moodboardId,
      type: params.type,
      title: params.title,
      content: {},
      prompt: params.prompt,
      createdAt: new Date().toISOString(),
    },
  };
};

export const exportMoodboard: ToolDefinition = {
  name: "exportMoodboard",
  description: "Export a moodboard as a creative output",
  parameters: {
    type: "object",
    properties: {
      moodboardId: { type: "string", description: "Moodboard ID" },
      type: {
        type: "string",
        description: "Output type",
        enum: ["BRIEF", "MOOD_REEL", "CONCEPT", "COLOR_PALETTE", "STYLE_GUIDE"],
      },
      title: { type: "string", description: "Output title" },
      prompt: { type: "string", description: "Generation prompt" },
    },
    required: ["moodboardId", "type", "title", "prompt"],
  },
  handler: exportMoodboardHandler,
};

// ---------------------------------------------------------------------------
// saveMoodboardConversation
// ---------------------------------------------------------------------------

const saveMoodboardConversationHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "mc_stub_001",
      moodboardId: params.moodboardId,
      messages: params.messages,
      contextSnapshot: params.contextSnapshot || null,
      createdById: "user_stub_001",
      createdAt: new Date().toISOString(),
    },
  };
};

export const saveMoodboardConversation: ToolDefinition = {
  name: "saveMoodboardConversation",
  description: "Persist a moodboard conversation",
  parameters: {
    type: "object",
    properties: {
      moodboardId: { type: "string", description: "Moodboard ID" },
      messages: { type: "string", description: "Messages JSON array" },
      contextSnapshot: { type: "string", description: "Context snapshot JSON" },
    },
    required: ["moodboardId", "messages"],
  },
  handler: saveMoodboardConversationHandler,
};
