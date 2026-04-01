/**
 * Video Production Tools
 *
 * Models: VideoProject, VideoScript, Storyboard, StoryboardFrame, ShotListItem
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createVideoProject
// ---------------------------------------------------------------------------

const createVideoProjectHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "vp_stub_001",
      organizationId: params.orgId,
      title: params.title,
      type: params.type,
      status: "CONCEPT",
      description: params.description || null,
      duration: params.duration || null,
      aspectRatio: params.aspectRatio || null,
      platform: params.platform || null,
      clientId: params.clientId || null,
      briefId: params.briefId || null,
      directorId: params.directorId || null,
      shootDate: params.shootDate || null,
      dueDate: params.dueDate || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createVideoProject: ToolDefinition = {
  name: "createVideoProject",
  description: "Create a new video project",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      title: { type: "string", description: "Project title" },
      type: {
        type: "string",
        description: "Video project type",
        enum: ["COMMERCIAL", "SOCIAL", "DOCUMENTARY", "CORPORATE", "EVENT", "OTHER"],
      },
      description: { type: "string", description: "Project description" },
      duration: { type: "number", description: "Target duration in seconds" },
      aspectRatio: { type: "string", description: "Aspect ratio (e.g. 16:9)" },
      platform: { type: "string", description: "Target platform" },
      clientId: { type: "string", description: "Client ID" },
      briefId: { type: "string", description: "Brief ID" },
      directorId: { type: "string", description: "Director user ID" },
      shootDate: { type: "string", description: "Shoot date (ISO)" },
      dueDate: { type: "string", description: "Due date (ISO)" },
    },
    required: ["orgId", "title", "type"],
  },
  handler: createVideoProjectHandler,
};

// ---------------------------------------------------------------------------
// listVideoProjects
// ---------------------------------------------------------------------------

const listVideoProjectsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      projects: [
        {
          id: "vp_stub_001",
          title: "Summer Campaign Spot",
          type: "COMMERCIAL",
          status: "PRE_PRODUCTION",
          organizationId: params.orgId,
          createdAt: new Date().toISOString(),
        },
        {
          id: "vp_stub_002",
          title: "Brand Story",
          type: "CORPORATE",
          status: "CONCEPT",
          organizationId: params.orgId,
          createdAt: new Date().toISOString(),
        },
      ],
      total: 2,
      page: (params.page as number) || 1,
    },
  };
};

export const listVideoProjects: ToolDefinition = {
  name: "listVideoProjects",
  description: "List video projects with optional filters",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Filter by client" },
      status: {
        type: "string",
        description: "Filter by status",
        enum: ["CONCEPT", "PRE_PRODUCTION", "PRODUCTION", "POST_PRODUCTION", "REVIEW", "DELIVERED"],
      },
      page: { type: "number", description: "Page number", minimum: 1 },
      limit: { type: "number", description: "Results per page", minimum: 1, maximum: 100 },
    },
    required: ["orgId"],
  },
  handler: listVideoProjectsHandler,
};

// ---------------------------------------------------------------------------
// getVideoProject
// ---------------------------------------------------------------------------

const getVideoProjectHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: params.projectId,
      title: "Summer Campaign Spot",
      type: "COMMERCIAL",
      status: "PRE_PRODUCTION",
      description: "30-second spot for summer product launch",
      duration: 30,
      aspectRatio: "16:9",
      script: { id: "vs_stub_001", version: 1, status: "DRAFT", wordCount: 450 },
      storyboard: { id: "sb_stub_001", frameCount: 12 },
      createdAt: new Date().toISOString(),
    },
  };
};

export const getVideoProject: ToolDefinition = {
  name: "getVideoProject",
  description: "Get a single video project with script and storyboard summary",
  parameters: {
    type: "object",
    properties: {
      projectId: { type: "string", description: "Video project ID" },
    },
    required: ["projectId"],
  },
  handler: getVideoProjectHandler,
};

// ---------------------------------------------------------------------------
// updateVideoStatus
// ---------------------------------------------------------------------------

const updateVideoStatusHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: params.projectId,
      status: params.status,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const updateVideoStatus: ToolDefinition = {
  name: "updateVideoStatus",
  description: "Update a video project's status",
  parameters: {
    type: "object",
    properties: {
      projectId: { type: "string", description: "Video project ID" },
      status: {
        type: "string",
        description: "New status",
        enum: ["CONCEPT", "PRE_PRODUCTION", "PRODUCTION", "POST_PRODUCTION", "REVIEW", "DELIVERED"],
      },
    },
    required: ["projectId", "status"],
  },
  handler: updateVideoStatusHandler,
};

// ---------------------------------------------------------------------------
// writeScript
// ---------------------------------------------------------------------------

const writeScriptHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "vs_stub_001",
      videoProjectId: params.videoProjectId,
      content: params.content,
      contentText: params.contentText || null,
      version: 1,
      status: "DRAFT",
      wordCount: 450,
      estimatedDuration: 135,
      aiGenerated: params.aiGenerated || false,
      aiPrompt: params.aiPrompt || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const writeScript: ToolDefinition = {
  name: "writeScript",
  description: "Create or update a video script",
  parameters: {
    type: "object",
    properties: {
      videoProjectId: { type: "string", description: "Video project ID" },
      content: { type: "string", description: "Script content (JSON structured)" },
      contentText: { type: "string", description: "Plain text version of script" },
      aiGenerated: { type: "string", description: "Whether AI generated (true/false)" },
      aiPrompt: { type: "string", description: "AI prompt used to generate script" },
    },
    required: ["videoProjectId", "content"],
  },
  handler: writeScriptHandler,
};

// ---------------------------------------------------------------------------
// getScript
// ---------------------------------------------------------------------------

const getScriptHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "vs_stub_001",
      videoProjectId: params.videoProjectId,
      content: { scenes: [{ title: "Opening", dialogue: "...", action: "..." }] },
      contentText: "Opening scene...",
      version: 1,
      status: "DRAFT",
      wordCount: 450,
      estimatedDuration: 135,
      createdAt: new Date().toISOString(),
    },
  };
};

export const getScript: ToolDefinition = {
  name: "getScript",
  description: "Get the video script for a project",
  parameters: {
    type: "object",
    properties: {
      videoProjectId: { type: "string", description: "Video project ID" },
    },
    required: ["videoProjectId"],
  },
  handler: getScriptHandler,
};

// ---------------------------------------------------------------------------
// buildStoryboard
// ---------------------------------------------------------------------------

const buildStoryboardHandler: ToolHandler = async (params) => {
  const frames = (params.frames as Array<Record<string, unknown>>).map((f, i) => ({
    id: `sf_stub_${String(i + 1).padStart(3, "0")}`,
    orderIndex: i,
    description: f.description || null,
    dialogue: f.dialogue || null,
    action: f.action || null,
    shotType: f.shotType || null,
    duration: f.duration || null,
  }));
  return {
    success: true,
    data: {
      id: "sb_stub_001",
      videoProjectId: params.videoProjectId,
      frameCount: frames.length,
      frames,
      createdAt: new Date().toISOString(),
    },
  };
};

export const buildStoryboard: ToolDefinition = {
  name: "buildStoryboard",
  description: "Create a storyboard with initial frames for a video project",
  parameters: {
    type: "object",
    properties: {
      videoProjectId: { type: "string", description: "Video project ID" },
      frames: {
        type: "array",
        items: { type: "string" },
        description: "Array of frame objects with description, dialogue, action, shotType, duration",
      },
    },
    required: ["videoProjectId", "frames"],
  },
  handler: buildStoryboardHandler,
};

// ---------------------------------------------------------------------------
// addStoryboardFrame
// ---------------------------------------------------------------------------

const addStoryboardFrameHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "sf_stub_new",
      storyboardId: params.storyboardId,
      orderIndex: params.orderIndex,
      description: params.description || null,
      dialogue: params.dialogue || null,
      action: params.action || null,
      shotType: params.shotType || null,
      cameraMovement: params.cameraMovement || null,
      duration: params.duration || null,
      notes: params.notes || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const addStoryboardFrame: ToolDefinition = {
  name: "addStoryboardFrame",
  description: "Add a single frame to a storyboard",
  parameters: {
    type: "object",
    properties: {
      storyboardId: { type: "string", description: "Storyboard ID" },
      orderIndex: { type: "number", description: "Position index" },
      description: { type: "string", description: "Frame description" },
      dialogue: { type: "string", description: "Dialogue in this frame" },
      action: { type: "string", description: "Action description" },
      shotType: { type: "string", description: "Shot type" },
      cameraMovement: { type: "string", description: "Camera movement" },
      duration: { type: "number", description: "Frame duration in seconds" },
      notes: { type: "string", description: "Additional notes" },
    },
    required: ["storyboardId", "orderIndex"],
  },
  handler: addStoryboardFrameHandler,
};

// ---------------------------------------------------------------------------
// listStoryboardFrames
// ---------------------------------------------------------------------------

const listStoryboardFramesHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      {
        id: "sf_stub_001",
        storyboardId: params.storyboardId,
        orderIndex: 0,
        description: "Wide establishing shot",
        shotType: "WIDE",
        duration: 3,
      },
      {
        id: "sf_stub_002",
        storyboardId: params.storyboardId,
        orderIndex: 1,
        description: "Medium shot of talent",
        shotType: "MEDIUM",
        duration: 5,
      },
    ],
  };
};

export const listStoryboardFrames: ToolDefinition = {
  name: "listStoryboardFrames",
  description: "List frames for a storyboard in order",
  parameters: {
    type: "object",
    properties: {
      storyboardId: { type: "string", description: "Storyboard ID" },
    },
    required: ["storyboardId"],
  },
  handler: listStoryboardFramesHandler,
};

// ---------------------------------------------------------------------------
// trackVideoStatus
// ---------------------------------------------------------------------------

const trackVideoStatusHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: params.projectId,
      status: params.status,
      notes: params.notes || null,
      activityLog: {
        action: "status_change",
        status: params.status,
        notes: params.notes || null,
        timestamp: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    },
  };
};

export const trackVideoStatus: ToolDefinition = {
  name: "trackVideoStatus",
  description: "Update video project status and log an activity note",
  parameters: {
    type: "object",
    properties: {
      projectId: { type: "string", description: "Video project ID" },
      status: {
        type: "string",
        description: "New status",
        enum: ["CONCEPT", "PRE_PRODUCTION", "PRODUCTION", "POST_PRODUCTION", "REVIEW", "DELIVERED"],
      },
      notes: { type: "string", description: "Activity notes" },
    },
    required: ["projectId", "status"],
  },
  handler: trackVideoStatusHandler,
};
