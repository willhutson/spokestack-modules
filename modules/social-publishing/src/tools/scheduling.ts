/**
 * Social Publishing — Scheduling & Publishing Tools
 */

import type { ToolDefinition } from "./accounts";

export const schedulePost: ToolDefinition = {
  name: "schedulePost",
  description: "Schedule a post to publish at a specific time, creating PublishJobs per platform",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string" },
      scheduledFor: { type: "string", description: "ISO 8601 datetime" },
      timezone: { type: "string", description: "Default: Asia/Dubai" },
    },
    required: ["postId", "scheduledFor"],
  },
  handler: async (params) => {
    return {
      postId: params.postId,
      status: "SCHEDULED",
      scheduledFor: params.scheduledFor,
      timezone: params.timezone || "Asia/Dubai",
      publishJobs: [
        { id: `job_${Date.now()}_ig`, platform: "INSTAGRAM", scheduledFor: params.scheduledFor, status: "PENDING" },
        { id: `job_${Date.now()}_li`, platform: "LINKEDIN", scheduledFor: params.scheduledFor, status: "PENDING" },
      ],
    };
  },
};

export const publishNow: ToolDefinition = {
  name: "publishNow",
  description: "Publish a post immediately with high priority",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string" },
      platform: { type: "string", description: "Publish to specific platform; omit for all attached" },
    },
    required: ["postId"],
  },
  handler: async (params) => {
    const now = new Date().toISOString();
    return {
      postId: params.postId,
      publishJobs: [
        { id: `job_${Date.now()}`, platform: params.platform || "INSTAGRAM", status: "PENDING", scheduledFor: now, priority: 10 },
      ],
    };
  },
};

export const listScheduled: ToolDefinition = {
  name: "listScheduled",
  description: "List scheduled posts as a calendar view",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string" },
      clientId: { type: "string" },
      startDate: { type: "string" },
      endDate: { type: "string" },
      platform: { type: "string" },
    },
    required: ["orgId"],
  },
  handler: async () => {
    return [
      { postId: "post_stub_001", title: "Product Launch", platforms: ["INSTAGRAM", "LINKEDIN"], scheduledFor: "2026-04-05T10:00:00Z", status: "SCHEDULED" },
      { postId: "post_stub_003", title: "Weekly Tips", platforms: ["TWITTER"], scheduledFor: "2026-04-07T15:00:00Z", status: "SCHEDULED" },
    ];
  },
};

export const cancelScheduled: ToolDefinition = {
  name: "cancelScheduled",
  description: "Cancel a scheduled post or a specific publish job",
  parameters: {
    type: "object",
    properties: {
      postId: { type: "string" },
      jobId: { type: "string" },
    },
  },
  handler: async (params) => {
    return { cancelled: true, postId: params.postId || null, jobId: params.jobId || null };
  },
};

export const getPublishLog: ToolDefinition = {
  name: "getPublishLog",
  description: "Get detailed publish log entries for a publish job",
  parameters: {
    type: "object",
    properties: { jobId: { type: "string" } },
    required: ["jobId"],
  },
  handler: async (params) => {
    return [
      { id: `log_001`, jobId: params.jobId, event: "ATTEMPT", message: "Publishing to Instagram...", durationMs: 1250, createdAt: "2026-04-01T10:00:01Z" },
      { id: `log_002`, jobId: params.jobId, event: "SUCCESS", message: "Published successfully", durationMs: 320, createdAt: "2026-04-01T10:00:02Z" },
    ];
  },
};

export const listPublishJobs: ToolDefinition = {
  name: "listPublishJobs",
  description: "List publish jobs with optional filters",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string" },
      status: { type: "string", enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"] },
      platform: { type: "string" },
      startDate: { type: "string" },
      endDate: { type: "string" },
    },
    required: ["orgId"],
  },
  handler: async () => {
    return {
      jobs: [
        { id: "job_stub_001", postId: "post_stub_002", postTitle: "Behind the Scenes", platform: "INSTAGRAM", status: "COMPLETED", publishedAt: "2026-04-01T14:00:00Z" },
        { id: "job_stub_002", postId: "post_stub_001", postTitle: "Product Launch", platform: "INSTAGRAM", status: "PENDING", scheduledFor: "2026-04-05T10:00:00Z" },
      ],
      total: 2,
    };
  },
};
