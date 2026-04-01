/**
 * Storyboard Tools (Phase 6C)
 *
 * Visual storyboard creation and frame management.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createStoryboard
// ---------------------------------------------------------------------------

export const createStoryboard: ToolDefinition = {
  name: "createStoryboard",
  description: "Create a new storyboard for a video or campaign project",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      title: { type: "string", description: "Storyboard title" },
      projectId: { type: "string", description: "Associated project ID" },
      aspectRatio: { type: "string", description: "Frame aspect ratio", enum: ["16:9", "9:16", "1:1", "4:3"] },
      description: { type: "string", description: "Storyboard description" },
    },
    required: ["orgId", "title"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `sb_${Date.now()}`,
        organizationId: params.orgId,
        title: params.title,
        projectId: params.projectId || null,
        aspectRatio: params.aspectRatio || "16:9",
        description: params.description || null,
        frameCount: 0,
        status: "DRAFT",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// addFrame
// ---------------------------------------------------------------------------

export const addFrame: ToolDefinition = {
  name: "addFrame",
  description: "Add a frame to a storyboard with visual description and dialogue",
  parameters: {
    type: "object",
    properties: {
      storyboardId: { type: "string", description: "Storyboard ID" },
      sceneNumber: { type: "number", description: "Scene number" },
      imageUrl: { type: "string", description: "Frame image URL" },
      visualDescription: { type: "string", description: "Description of the visual" },
      dialogue: { type: "string", description: "Character dialogue or voiceover" },
      duration: { type: "number", description: "Frame duration in seconds" },
      cameraAngle: { type: "string", description: "Camera angle", enum: ["WIDE", "MEDIUM", "CLOSE_UP", "OVER_SHOULDER", "POV", "AERIAL"] },
    },
    required: ["storyboardId", "visualDescription"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `frame_${Date.now()}`,
        storyboardId: params.storyboardId,
        sceneNumber: params.sceneNumber || 1,
        imageUrl: params.imageUrl || null,
        visualDescription: params.visualDescription,
        dialogue: params.dialogue || null,
        duration: params.duration || 3,
        cameraAngle: params.cameraAngle || "MEDIUM",
        orderIndex: 0,
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// reorderFrames
// ---------------------------------------------------------------------------

export const reorderFrames: ToolDefinition = {
  name: "reorderFrames",
  description: "Reorder frames within a storyboard",
  parameters: {
    type: "object",
    properties: {
      storyboardId: { type: "string", description: "Storyboard ID" },
      frameOrder: { type: "array", items: { type: "string" }, description: "Ordered array of frame IDs" },
    },
    required: ["storyboardId", "frameOrder"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        storyboardId: params.storyboardId,
        frameCount: (params.frameOrder as any[]).length,
        newOrder: params.frameOrder,
        updatedAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// getStoryboard
// ---------------------------------------------------------------------------

export const getStoryboard: ToolDefinition = {
  name: "getStoryboard",
  description: "Get a storyboard with all its frames",
  parameters: {
    type: "object",
    properties: {
      storyboardId: { type: "string", description: "Storyboard ID" },
    },
    required: ["storyboardId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: params.storyboardId,
        title: "Product Launch Storyboard",
        aspectRatio: "16:9",
        status: "DRAFT",
        frameCount: 3,
        frames: [
          { id: "frame_001", sceneNumber: 1, visualDescription: "Wide shot of cityscape at dawn", cameraAngle: "WIDE", duration: 4, orderIndex: 0 },
          { id: "frame_002", sceneNumber: 2, visualDescription: "Medium shot of protagonist with product", cameraAngle: "MEDIUM", duration: 3, orderIndex: 1 },
          { id: "frame_003", sceneNumber: 3, visualDescription: "Close-up of product details", cameraAngle: "CLOSE_UP", duration: 2, orderIndex: 2 },
        ],
        totalDuration: 9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  },
};
