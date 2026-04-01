/**
 * Video Production Tools
 *
 * Models: VideoProject, VideoScript, Storyboard, StoryboardFrame, ShotListItem
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const createVideoProjectHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "vproj_stub_001",
      organizationId: params.orgId,
      title: params.title,
      type: params.type,
      description: params.description || null,
      status: "CONCEPT",
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
  description: "Create a VideoProject",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      title: { type: "string", description: "Project title" },
      type: { type: "string", description: "Video project type", enum: ["COMMERCIAL", "SOCIAL", "DOCUMENTARY", "CORPORATE", "EVENT", "OTHER"] },
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

const listVideoProjectsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      projects: [
        { id: "vproj_stub_001", title: "Summer Commercial", type: "COMMERCIAL", status: "CONCEPT", createdAt: new Date().toISOString() },
        { id: "vproj_stub_002", title: "Social Reel", type: "SOCIAL", status: "PRE_PRODUCTION", createdAt: new Date().toISOString() },
      ],
      total: 2,
      page: params.page || 1,
    },
  };
};

export const listVideoProjects: ToolDefinition = {
  name: "listVideoProjects",
  description: "List video projects for an organization",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Filter by client" },
      status: { type: "string", description: "Filter by status", enum: ["CONCEPT", "PRE_PRODUCTION", "PRODUCTION", "POST_PRODUCTION", "REVIEW", "DELIVERED"] },
      page: { type: "number", description: "Page number" },
      limit: { type: "number", description: "Items per page" },
    },
    required: ["orgId"],
  },
  handler: listVideoProjectsHandler,
};

const getVideoProjectHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: params.projectId,
      title: "Summer Commercial",
      type: "COMMERCIAL",
      status: "PRE_PRODUCTION",
      duration: 30,
      aspectRatio: "16:9",
      scriptSummary: { id: "vscript_stub_001", version: 1, status: "DRAFT", wordCount: 450 },
      storyboardSummary: { id: "sb_stub_001", frameCount: 8 },
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
  description: "Update VideoProject status",
  parameters: {
    type: "object",
    properties: {
      projectId: { type: "string", description: "Video project ID" },
      status: { type: "string", description: "New status", enum: ["CONCEPT", "PRE_PRODUCTION", "PRODUCTION", "POST_PRODUCTION", "REVIEW", "DELIVERED"] },
    },
    required: ["projectId", "status"],
  },
  handler: updateVideoStatusHandler,
};

const writeScriptHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "vscript_stub_001",
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
  description: "Create or update a VideoScript",
  parameters: {
    type: "object",
    properties: {
      videoProjectId: { type: "string", description: "Video project ID" },
      content: { type: "string", description: "JSON structured script content" },
      contentText: { type: "string", description: "Plain text version of the script" },
      aiGenerated: { type: "string", description: "Whether AI generated (true/false)" },
      aiPrompt: { type: "string", description: "AI prompt used for generation" },
    },
    required: ["videoProjectId", "content"],
  },
  handler: writeScriptHandler,
};

const getScriptHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "vscript_stub_001",
      videoProjectId: params.videoProjectId,
      content: { scenes: [{ scene: 1, direction: "Open on wide shot", dialogue: "Welcome to..." }] },
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
  description: "Get a VideoScript by project ID",
  parameters: {
    type: "object",
    properties: {
      videoProjectId: { type: "string", description: "Video project ID" },
    },
    required: ["videoProjectId"],
  },
  handler: getScriptHandler,
};

const buildStoryboardHandler: ToolHandler = async (params) => {
  const frames = ((params.frames as Array<Record<string, unknown>>) || []).map((f, i) => ({
    id: `sbf_stub_${String(i + 1).padStart(3, "0")}`,
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
  description: "Create a Storyboard and initial StoryboardFrame records",
  parameters: {
    type: "object",
    properties: {
      videoProjectId: { type: "string", description: "Video project ID" },
      frames: { type: "array", items: { type: "string" }, description: "Array of frame objects (JSON)" },
    },
    required: ["videoProjectId", "frames"],
  },
  handler: buildStoryboardHandler,
};

const addStoryboardFrameHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "sbf_stub_new",
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
  description: "Add a single StoryboardFrame",
  parameters: {
    type: "object",
    properties: {
      storyboardId: { type: "string", description: "Storyboard ID" },
      orderIndex: { type: "number", description: "Frame order index" },
      description: { type: "string", description: "Frame description" },
      dialogue: { type: "string", description: "Dialogue in frame" },
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

const listStoryboardFramesHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      { id: "sbf_stub_001", storyboardId: params.storyboardId, orderIndex: 0, description: "Wide establishing shot", shotType: "WIDE", duration: 3 },
      { id: "sbf_stub_002", storyboardId: params.storyboardId, orderIndex: 1, description: "Medium shot of talent", shotType: "MEDIUM", duration: 5 },
      { id: "sbf_stub_003", storyboardId: params.storyboardId, orderIndex: 2, description: "Close up product detail", shotType: "CLOSE_UP", duration: 2 },
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

const trackVideoStatusHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: params.projectId,
      status: params.status,
      notes: params.notes || null,
      activityLog: { type: "status_change", status: params.status, notes: params.notes || null, timestamp: new Date().toISOString() },
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
      status: { type: "string", description: "New status", enum: ["CONCEPT", "PRE_PRODUCTION", "PRODUCTION", "POST_PRODUCTION", "REVIEW", "DELIVERED"] },
      notes: { type: "string", description: "Activity notes" },
    },
    required: ["projectId", "status"],
  },
  handler: trackVideoStatusHandler,
};
