/**
 * Content Ops Tools
 *
 * Models: ContentApproval, ContentComment, ContentEvent, ContentTrigger,
 *         ContentVersion, ContentAsset
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// submitForApproval
// ---------------------------------------------------------------------------

const submitForApprovalHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "ca_stub_001",
      postId: params.postId,
      approvalType: params.approvalType,
      status: "PENDING",
      requestedById: params.requestedById,
      assignedToId: params.assignedToId || null,
      clientContactId: params.clientContactId || null,
      versionNumber: params.versionNumber || null,
      requestedAt: new Date().toISOString(),
    },
  };
};

export const submitForApproval: ToolDefinition = {
  name: "submitForApproval",
  description: "Submit content for approval",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string", description: "Content post ID" },
      approvalType: {
        type: "string",
        description: "Type of approval",
        enum: ["INTERNAL", "CLIENT", "LEGAL", "COMPLIANCE"],
      },
      requestedById: { type: "string", description: "User ID requesting approval" },
      assignedToId: { type: "string", description: "User ID to review" },
      clientContactId: { type: "string", description: "Client contact ID" },
      versionNumber: { type: "number", description: "Content version number" },
    },
    required: ["postId", "approvalType", "requestedById"],
  },
  handler: submitForApprovalHandler,
};

// ---------------------------------------------------------------------------
// reviewContent
// ---------------------------------------------------------------------------

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
  description: "Review and respond to a content approval request",
  parameters: {
    type: "object",
    properties: {
      approvalId: { type: "string", description: "Approval ID" },
      status: {
        type: "string",
        description: "Review decision",
        enum: ["PENDING", "APPROVED", "REJECTED", "CHANGES_REQUESTED"],
      },
      responseNotes: { type: "string", description: "Review notes" },
      respondedById: { type: "string", description: "Reviewer user ID" },
    },
    required: ["approvalId", "status", "respondedById"],
  },
  handler: reviewContentHandler,
};

// ---------------------------------------------------------------------------
// listPendingReviews
// ---------------------------------------------------------------------------

const listPendingReviewsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      {
        id: "ca_stub_001",
        postId: "post_stub_001",
        postTitle: "Summer Launch Post",
        approvalType: "INTERNAL",
        status: "PENDING",
        requestedAt: new Date().toISOString(),
        assignedToId: params.assignedToId || null,
      },
      {
        id: "ca_stub_002",
        postId: "post_stub_002",
        postTitle: "Client Q2 Report",
        approvalType: "CLIENT",
        status: "PENDING",
        requestedAt: new Date().toISOString(),
        assignedToId: params.assignedToId || null,
      },
    ],
  };
};

export const listPendingReviews: ToolDefinition = {
  name: "listPendingReviews",
  description: "List pending content approval requests",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      assignedToId: { type: "string", description: "Filter by assigned reviewer" },
      approvalType: {
        type: "string",
        description: "Filter by approval type",
        enum: ["INTERNAL", "CLIENT", "LEGAL", "COMPLIANCE"],
      },
    },
    required: ["orgId"],
  },
  handler: listPendingReviewsHandler,
};

// ---------------------------------------------------------------------------
// trackContentStatus
// ---------------------------------------------------------------------------

const trackContentStatusHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      postId: params.postId,
      currentVersion: 2,
      approvals: [
        { id: "ca_stub_001", approvalType: "INTERNAL", status: "APPROVED" },
        { id: "ca_stub_002", approvalType: "CLIENT", status: "CHANGES_REQUESTED" },
      ],
      latestStatus: "CHANGES_REQUESTED",
    },
  };
};

export const trackContentStatus: ToolDefinition = {
  name: "trackContentStatus",
  description: "Get current approval and version status for a content post",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string", description: "Content post ID" },
    },
    required: ["postId"],
  },
  handler: trackContentStatusHandler,
};

// ---------------------------------------------------------------------------
// addContentComment
// ---------------------------------------------------------------------------

const addContentCommentHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "cc_stub_001",
      postId: params.postId,
      content: params.content,
      userId: params.userId || null,
      clientContactId: params.clientContactId || null,
      parentId: params.parentId || null,
      versionNumber: params.versionNumber || null,
      isResolved: false,
      createdAt: new Date().toISOString(),
    },
  };
};

export const addContentComment: ToolDefinition = {
  name: "addContentComment",
  description: "Add a comment to a content post",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string", description: "Content post ID" },
      content: { type: "string", description: "Comment content" },
      userId: { type: "string", description: "User ID" },
      clientContactId: { type: "string", description: "Client contact ID" },
      parentId: { type: "string", description: "Parent comment ID for threading" },
      versionNumber: { type: "number", description: "Content version number" },
    },
    required: ["postId", "content"],
  },
  handler: addContentCommentHandler,
};

// ---------------------------------------------------------------------------
// listContentComments
// ---------------------------------------------------------------------------

const listContentCommentsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      {
        id: "cc_stub_001",
        postId: params.postId,
        content: "Looks great! One small tweak needed on the headline.",
        userId: "user_stub_001",
        isResolved: false,
        children: [
          {
            id: "cc_stub_002",
            postId: params.postId,
            content: "Updated — how does this look?",
            userId: "user_stub_002",
            isResolved: false,
          },
        ],
        createdAt: new Date().toISOString(),
      },
    ],
  };
};

export const listContentComments: ToolDefinition = {
  name: "listContentComments",
  description: "List comments on a content post",
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

// ---------------------------------------------------------------------------
// resolveContentComment
// ---------------------------------------------------------------------------

const resolveContentCommentHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: params.commentId,
      isResolved: true,
      resolvedById: params.resolvedById,
      resolvedAt: new Date().toISOString(),
    },
  };
};

export const resolveContentComment: ToolDefinition = {
  name: "resolveContentComment",
  description: "Resolve a content comment",
  parameters: {
    type: "object",
    properties: {
      commentId: { type: "string", description: "Comment ID to resolve" },
      resolvedById: { type: "string", description: "User ID who resolved" },
    },
    required: ["commentId", "resolvedById"],
  },
  handler: resolveContentCommentHandler,
};

// ---------------------------------------------------------------------------
// createContentVersion
// ---------------------------------------------------------------------------

const createContentVersionHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "cv_stub_001",
      postId: params.postId,
      versionNumber: 3,
      caption: params.caption,
      hashtags: params.hashtags,
      platforms: params.platforms,
      createdById: params.createdById,
      changeNotes: params.changeNotes || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createContentVersion: ToolDefinition = {
  name: "createContentVersion",
  description: "Create a content version snapshot for a post",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string", description: "Content post ID" },
      caption: { type: "string", description: "Post caption" },
      hashtags: { type: "array", items: { type: "string" }, description: "Hashtags" },
      platforms: { type: "array", items: { type: "string" }, description: "Target platforms" },
      createdById: { type: "string", description: "Creator user ID" },
      changeNotes: { type: "string", description: "Description of changes" },
    },
    required: ["postId", "caption", "hashtags", "platforms"],
  },
  handler: createContentVersionHandler,
};

// ---------------------------------------------------------------------------
// listContentVersions
// ---------------------------------------------------------------------------

const listContentVersionsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      {
        id: "cv_stub_001",
        postId: params.postId,
        versionNumber: 1,
        caption: "Initial draft",
        platforms: ["INSTAGRAM"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "cv_stub_002",
        postId: params.postId,
        versionNumber: 2,
        caption: "Updated after client feedback",
        platforms: ["INSTAGRAM", "FACEBOOK"],
        createdAt: new Date().toISOString(),
      },
    ],
  };
};

export const listContentVersions: ToolDefinition = {
  name: "listContentVersions",
  description: "List version history for a content post",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string", description: "Content post ID" },
    },
    required: ["postId"],
  },
  handler: listContentVersionsHandler,
};

// ---------------------------------------------------------------------------
// setupContentTrigger
// ---------------------------------------------------------------------------

const setupContentTriggerHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "ct_stub_001",
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
      createdAt: new Date().toISOString(),
    },
  };
};

export const setupContentTrigger: ToolDefinition = {
  name: "setupContentTrigger",
  description: "Create a content automation trigger",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Trigger name" },
      eventType: { type: "string", description: "Event type to listen for" },
      actionType: { type: "string", description: "Action to execute" },
      actionConfig: { type: "string", description: "Action configuration (JSON)" },
      conditions: { type: "string", description: "Trigger conditions (JSON)" },
      isEnabled: { type: "string", description: "Whether trigger is enabled (true/false)" },
      priority: { type: "number", description: "Execution priority" },
      debounceMs: { type: "number", description: "Debounce in milliseconds" },
    },
    required: ["orgId", "name", "eventType", "actionType", "actionConfig"],
  },
  handler: setupContentTriggerHandler,
};

// ---------------------------------------------------------------------------
// listContentTriggers
// ---------------------------------------------------------------------------

const listContentTriggersHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      {
        id: "ct_stub_001",
        name: "Auto-create video project on brief",
        eventType: "brief.created",
        actionType: "CREATE_VIDEO_PROJECT",
        isEnabled: true,
        executionCount: 12,
        organizationId: params.orgId,
      },
      {
        id: "ct_stub_002",
        name: "Notify on approval",
        eventType: "content.approved",
        actionType: "SEND_NOTIFICATION",
        isEnabled: true,
        executionCount: 45,
        organizationId: params.orgId,
      },
    ],
  };
};

export const listContentTriggers: ToolDefinition = {
  name: "listContentTriggers",
  description: "List content automation triggers",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      eventType: { type: "string", description: "Filter by event type" },
      isEnabled: { type: "string", description: "Filter by enabled status (true/false)" },
    },
    required: ["orgId"],
  },
  handler: listContentTriggersHandler,
};

// ---------------------------------------------------------------------------
// logContentEvent
// ---------------------------------------------------------------------------

const logContentEventHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "ce_stub_001",
      organizationId: params.orgId,
      eventType: params.eventType,
      sourceType: params.sourceType,
      sourceId: params.sourceId,
      payload: params.payload,
      triggersMatched: 2,
      createdAt: new Date().toISOString(),
    },
  };
};

export const logContentEvent: ToolDefinition = {
  name: "logContentEvent",
  description: "Log a content event record",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      eventType: { type: "string", description: "Event type" },
      sourceType: { type: "string", description: "Source type" },
      sourceId: { type: "string", description: "Source ID" },
      payload: { type: "string", description: "Event payload (JSON)" },
    },
    required: ["orgId", "eventType", "sourceType", "sourceId", "payload"],
  },
  handler: logContentEventHandler,
};

// ---------------------------------------------------------------------------
// addContentAsset
// ---------------------------------------------------------------------------

const addContentAssetHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "casset_stub_001",
      postId: params.postId,
      type: params.type,
      fileName: params.fileName,
      fileUrl: params.fileUrl,
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
  description: "Add a media asset to a content post",
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
      duration: { type: "number", description: "Duration in seconds" },
      aspectRatio: { type: "string", description: "Aspect ratio" },
      sortOrder: { type: "number", description: "Display order" },
      altText: { type: "string", description: "Alt text" },
    },
    required: ["postId", "type", "fileName", "fileUrl"],
  },
  handler: addContentAssetHandler,
};
