/**
 * Content Ops Tools
 *
 * Models: ContentApproval, ContentComment, ContentEvent, ContentTrigger,
 *         ContentVersion, ContentAsset
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const submitForApprovalHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "cappr_stub_001",
      postId: params.postId,
      approvalType: params.approvalType,
      status: "PENDING",
      requestedById: params.requestedById,
      assignedToId: params.assignedToId || null,
      clientContactId: params.clientContactId || null,
      versionNumber: params.versionNumber || null,
      requestedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  };
};

export const submitForApproval: ToolDefinition = {
  name: "submitForApproval",
  description: "Create a ContentApproval for a ContentPost",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string", description: "Content post ID" },
      approvalType: { type: "string", description: "Approval type", enum: ["INTERNAL", "CLIENT", "LEGAL", "COMPLIANCE"] },
      requestedById: { type: "string", description: "User who requested approval" },
      assignedToId: { type: "string", description: "Assigned reviewer" },
      clientContactId: { type: "string", description: "Client contact for external reviews" },
      versionNumber: { type: "number", description: "Version number being approved" },
    },
    required: ["postId", "approvalType", "requestedById"],
  },
  handler: submitForApprovalHandler,
};

const reviewContentHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: params.approvalId,
      status: params.status,
      responseNotes: params.responseNotes || null,
      respondedById: params.respondedById,
      respondedAt: new Date().toISOString(),
    },
  };
};

export const reviewContent: ToolDefinition = {
  name: "reviewContent",
  description: "Update ContentApproval status (approve, reject, request changes)",
  parameters: {
    type: "object",
    properties: {
      approvalId: { type: "string", description: "Approval ID" },
      status: { type: "string", description: "New status", enum: ["PENDING", "APPROVED", "REJECTED", "CHANGES_REQUESTED"] },
      responseNotes: { type: "string", description: "Reviewer notes" },
      respondedById: { type: "string", description: "Reviewer user ID" },
    },
    required: ["approvalId", "status", "respondedById"],
  },
  handler: reviewContentHandler,
};

const listPendingReviewsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      { id: "cappr_stub_001", postId: "post_001", postTitle: "Summer Launch Post", approvalType: "INTERNAL", status: "PENDING", requestedAt: new Date().toISOString() },
      { id: "cappr_stub_002", postId: "post_002", postTitle: "Product Announcement", approvalType: "CLIENT", status: "PENDING", requestedAt: new Date().toISOString() },
    ],
  };
};

export const listPendingReviews: ToolDefinition = {
  name: "listPendingReviews",
  description: "List ContentApproval records with status PENDING",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      assignedToId: { type: "string", description: "Filter by assigned reviewer" },
      approvalType: { type: "string", description: "Filter by approval type", enum: ["INTERNAL", "CLIENT", "LEGAL", "COMPLIANCE"] },
    },
    required: ["orgId"],
  },
  handler: listPendingReviewsHandler,
};

const trackContentStatusHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      postId: params.postId,
      currentVersion: 2,
      approvals: [
        { id: "cappr_stub_001", approvalType: "INTERNAL", status: "APPROVED" },
        { id: "cappr_stub_002", approvalType: "CLIENT", status: "CHANGES_REQUESTED" },
      ],
      latestStatus: "CHANGES_REQUESTED",
    },
  };
};

export const trackContentStatus: ToolDefinition = {
  name: "trackContentStatus",
  description: "Get current approval and version status for a post",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string", description: "Content post ID" },
    },
    required: ["postId"],
  },
  handler: trackContentStatusHandler,
};

const addContentCommentHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "ccomm_stub_001",
      postId: params.postId,
      content: params.content,
      userId: params.userId || null,
      clientContactId: params.clientContactId || null,
      parentId: params.parentId || null,
      versionNumber: params.versionNumber || null,
      isResolved: false,
      source: "PORTAL",
      createdAt: new Date().toISOString(),
    },
  };
};

export const addContentComment: ToolDefinition = {
  name: "addContentComment",
  description: "Create a ContentComment on a post",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string", description: "Content post ID" },
      content: { type: "string", description: "Comment content" },
      userId: { type: "string", description: "User ID" },
      clientContactId: { type: "string", description: "Client contact ID" },
      parentId: { type: "string", description: "Parent comment ID for threading" },
      versionNumber: { type: "number", description: "Version number the comment refers to" },
    },
    required: ["postId", "content"],
  },
  handler: addContentCommentHandler,
};

const listContentCommentsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      { id: "ccomm_stub_001", postId: params.postId, content: "Looks great!", userId: "user_001", isResolved: false, children: [], createdAt: new Date().toISOString() },
      { id: "ccomm_stub_002", postId: params.postId, content: "Can we adjust the copy?", userId: "user_002", isResolved: false, children: [
        { id: "ccomm_stub_003", postId: params.postId, content: "Sure, updating now", userId: "user_001", parentId: "ccomm_stub_002", isResolved: false, createdAt: new Date().toISOString() },
      ], createdAt: new Date().toISOString() },
    ],
  };
};

export const listContentComments: ToolDefinition = {
  name: "listContentComments",
  description: "List comments on a post (threaded)",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string", description: "Content post ID" },
      includeResolved: { type: "string", description: "Include resolved comments (true/false)" },
    },
    required: ["postId"],
  },
  handler: listContentCommentsHandler,
};

const resolveContentCommentHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: params.commentId,
      isResolved: true,
      resolvedAt: new Date().toISOString(),
      resolvedById: params.resolvedById,
    },
  };
};

export const resolveContentComment: ToolDefinition = {
  name: "resolveContentComment",
  description: "Resolve a ContentComment",
  parameters: {
    type: "object",
    properties: {
      commentId: { type: "string", description: "Comment ID" },
      resolvedById: { type: "string", description: "User ID who resolved it" },
    },
    required: ["commentId", "resolvedById"],
  },
  handler: resolveContentCommentHandler,
};

const createContentVersionHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "cver_stub_001",
      postId: params.postId,
      versionNumber: 3,
      caption: params.caption,
      hashtags: params.hashtags || [],
      platforms: params.platforms || [],
      createdById: params.createdById,
      changeNotes: params.changeNotes || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createContentVersion: ToolDefinition = {
  name: "createContentVersion",
  description: "Snapshot a ContentVersion for a post",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string", description: "Content post ID" },
      caption: { type: "string", description: "Post caption" },
      hashtags: { type: "array", items: { type: "string" }, description: "Hashtags" },
      platforms: { type: "array", items: { type: "string" }, description: "Target platforms" },
      changeNotes: { type: "string", description: "Description of changes" },
      createdById: { type: "string", description: "Creator user ID" },
    },
    required: ["postId", "caption", "hashtags", "platforms", "createdById"],
  },
  handler: createContentVersionHandler,
};

const listContentVersionsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      { id: "cver_stub_001", postId: params.postId, versionNumber: 1, caption: "Initial draft", createdAt: new Date().toISOString() },
      { id: "cver_stub_002", postId: params.postId, versionNumber: 2, caption: "Updated copy", changeNotes: "Revised headline", createdAt: new Date().toISOString() },
    ],
  };
};

export const listContentVersions: ToolDefinition = {
  name: "listContentVersions",
  description: "List ContentVersion records for a post",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string", description: "Content post ID" },
    },
    required: ["postId"],
  },
  handler: listContentVersionsHandler,
};

const setupContentTriggerHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "ctrig_stub_001",
      organizationId: params.orgId,
      name: params.name,
      eventType: params.eventType,
      actionType: params.actionType,
      actionConfig: params.actionConfig,
      conditions: params.conditions || null,
      isEnabled: params.isEnabled !== false,
      priority: params.priority || 0,
      debounceMs: params.debounceMs || null,
      executionCount: 0,
      successCount: 0,
      failureCount: 0,
      createdAt: new Date().toISOString(),
    },
  };
};

export const setupContentTrigger: ToolDefinition = {
  name: "setupContentTrigger",
  description: "Create a ContentTrigger for event-driven automation",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Trigger name" },
      eventType: { type: "string", description: "Event type to match" },
      actionType: { type: "string", description: "Action to execute" },
      actionConfig: { type: "string", description: "JSON action configuration" },
      conditions: { type: "string", description: "JSON conditions" },
      isEnabled: { type: "string", description: "Whether trigger is enabled" },
      priority: { type: "number", description: "Priority (higher = first)" },
      debounceMs: { type: "number", description: "Debounce in milliseconds" },
    },
    required: ["orgId", "name", "eventType", "actionType", "actionConfig"],
  },
  handler: setupContentTriggerHandler,
};

const listContentTriggersHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      { id: "ctrig_stub_001", name: "Auto-create video project", eventType: "brief.created", actionType: "CREATE_VIDEO_PROJECT", isEnabled: true, executionCount: 5 },
      { id: "ctrig_stub_002", name: "Notify on approval", eventType: "approval.submitted", actionType: "SEND_NOTIFICATION", isEnabled: true, executionCount: 12 },
    ],
  };
};

export const listContentTriggers: ToolDefinition = {
  name: "listContentTriggers",
  description: "List ContentTrigger records",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      eventType: { type: "string", description: "Filter by event type" },
      isEnabled: { type: "string", description: "Filter by enabled status" },
    },
    required: ["orgId"],
  },
  handler: listContentTriggersHandler,
};

const logContentEventHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "cevt_stub_001",
      organizationId: params.orgId,
      eventType: params.eventType,
      sourceType: params.sourceType,
      sourceId: params.sourceId,
      payload: params.payload,
      triggersMatched: 2,
      triggersExecuted: 2,
      createdAt: new Date().toISOString(),
    },
  };
};

export const logContentEvent: ToolDefinition = {
  name: "logContentEvent",
  description: "Create a ContentEvent record",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      eventType: { type: "string", description: "Event type" },
      sourceType: { type: "string", description: "Source entity type" },
      sourceId: { type: "string", description: "Source entity ID" },
      payload: { type: "string", description: "JSON event payload" },
    },
    required: ["orgId", "eventType", "sourceType", "sourceId", "payload"],
  },
  handler: logContentEventHandler,
};

const addContentAssetHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "casset_stub_001",
      postId: params.postId,
      type: params.type,
      fileName: params.fileName,
      fileUrl: params.fileUrl,
      thumbnailUrl: null,
      mimeType: params.mimeType || null,
      fileSize: params.fileSize || null,
      width: params.width || null,
      height: params.height || null,
      duration: params.duration || null,
      aspectRatio: params.aspectRatio || null,
      sortOrder: params.sortOrder || 0,
      altText: params.altText || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const addContentAsset: ToolDefinition = {
  name: "addContentAsset",
  description: "Add a ContentAsset to a ContentPost",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string", description: "Content post ID" },
      type: { type: "string", description: "Asset type" },
      fileName: { type: "string", description: "File name" },
      fileUrl: { type: "string", description: "File URL" },
      mimeType: { type: "string", description: "MIME type" },
      fileSize: { type: "number", description: "File size in bytes" },
      width: { type: "number", description: "Width in pixels" },
      height: { type: "number", description: "Height in pixels" },
      duration: { type: "number", description: "Duration in seconds (video/audio)" },
      aspectRatio: { type: "string", description: "Aspect ratio" },
      sortOrder: { type: "number", description: "Sort order" },
      altText: { type: "string", description: "Alt text for accessibility" },
    },
    required: ["postId", "type", "fileName", "fileUrl"],
  },
  handler: addContentAssetHandler,
};
