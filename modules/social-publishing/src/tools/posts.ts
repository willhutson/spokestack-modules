/**
 * Social Publishing — Content Post Tools
 */

import type { ToolDefinition } from "./accounts";

export const createPost: ToolDefinition = {
  name: "createPost",
  description: "Create a new content post for scheduling or immediate publishing",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string" },
      clientId: { type: "string" },
      title: { type: "string" },
      caption: { type: "string" },
      platforms: { type: "array", items: { type: "string", enum: ["INSTAGRAM", "FACEBOOK", "TWITTER", "LINKEDIN", "TIKTOK", "YOUTUBE"] } },
      contentType: { type: "string", enum: ["IMAGE", "VIDEO", "CAROUSEL", "REEL", "STORY", "TEXT", "LINK"] },
      socialAccountId: { type: "string" },
      hashtags: { type: "array", items: { type: "string" } },
      mentions: { type: "array", items: { type: "string" } },
      linkUrl: { type: "string" },
      locationName: { type: "string" },
      captionAr: { type: "string" },
      briefId: { type: "string" },
    },
    required: ["orgId", "clientId", "title", "caption", "platforms", "contentType"],
  },
  handler: async (params) => {
    return {
      id: `post_${Date.now()}`,
      organizationId: params.orgId,
      clientId: params.clientId,
      title: params.title,
      caption: params.caption,
      status: "DRAFT",
      platforms: params.platforms,
      contentType: params.contentType,
      hashtags: params.hashtags || [],
      mentions: params.mentions || [],
      currentVersion: 1,
      createdAt: new Date().toISOString(),
    };
  },
};

export const listPosts: ToolDefinition = {
  name: "listPosts",
  description: "List content posts with optional filters",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string" },
      clientId: { type: "string" },
      status: { type: "string", enum: ["DRAFT", "IN_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "FAILED", "CANCELLED"] },
      platform: { type: "string" },
      startDate: { type: "string" },
      endDate: { type: "string" },
      page: { type: "number" },
      limit: { type: "number" },
    },
    required: ["orgId"],
  },
  handler: async (params) => {
    return {
      posts: [
        { id: "post_stub_001", title: "Product Launch Announcement", status: "SCHEDULED", platforms: ["INSTAGRAM", "LINKEDIN"], contentType: "CAROUSEL", scheduledFor: "2026-04-05T10:00:00Z", likes: null, comments: null },
        { id: "post_stub_002", title: "Behind the Scenes", status: "PUBLISHED", platforms: ["INSTAGRAM"], contentType: "REEL", publishedAt: "2026-04-01T14:00:00Z", likes: 1240, comments: 45, engagementRate: 5.2 },
      ],
      total: 2,
      page: params.page || 1,
      limit: params.limit || 20,
    };
  },
};

export const getPost: ToolDefinition = {
  name: "getPost",
  description: "Get a single content post with assets, versions, and approvals",
  parameters: {
    type: "object",
    properties: { postId: { type: "string" } },
    required: ["postId"],
  },
  handler: async (params) => {
    return {
      id: params.postId,
      title: "Product Launch Announcement",
      caption: "Exciting news! Our latest product is here. #launch #innovation",
      status: "SCHEDULED",
      platforms: ["INSTAGRAM", "LINKEDIN"],
      contentType: "CAROUSEL",
      hashtags: ["#launch", "#innovation"],
      mentions: [],
      currentVersion: 2,
      scheduledFor: "2026-04-05T10:00:00Z",
      timezone: "Asia/Dubai",
      createdAt: "2026-04-01T09:00:00Z",
      updatedAt: "2026-04-01T12:00:00Z",
    };
  },
};

export const updatePost: ToolDefinition = {
  name: "updatePost",
  description: "Update a content post's caption, hashtags, platforms, or other fields",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string" },
      title: { type: "string" },
      caption: { type: "string" },
      captionAr: { type: "string" },
      platforms: { type: "array", items: { type: "string" } },
      hashtags: { type: "array", items: { type: "string" } },
      mentions: { type: "array", items: { type: "string" } },
      linkUrl: { type: "string" },
      locationName: { type: "string" },
      status: { type: "string" },
    },
    required: ["postId"],
  },
  handler: async (params) => {
    const { postId, ...updates } = params;
    return { id: postId, ...updates, updatedAt: new Date().toISOString() };
  },
};

export const deletePost: ToolDefinition = {
  name: "deletePost",
  description: "Soft-delete or cancel a content post",
  parameters: {
    type: "object",
    properties: { postId: { type: "string" } },
    required: ["postId"],
  },
  handler: async (params) => {
    return { success: true, postId: params.postId, status: "CANCELLED" };
  },
};
