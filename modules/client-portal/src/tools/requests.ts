import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const handleListBriefRequests: ToolHandler = async (params, _context) => {
  const { clientId, status, page, pageSize } = params as {
    clientId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  };
  return {
    success: true,
    data: {
      requests: [
        {
          id: "breq_001",
          clientId: clientId ?? "client_abc",
          title: "Q2 Social Media Campaign",
          description: "We need a comprehensive social media campaign for Q2 product launch across Instagram, TikTok, and LinkedIn.",
          status: status ?? "SUBMITTED",
          submittedBy: { id: "cpu_001", name: "Sarah Chen" },
          submittedAt: "2026-03-28T10:30:00Z",
          reviewedAt: null,
          reviewNotes: null,
        },
        {
          id: "breq_002",
          clientId: clientId ?? "client_abc",
          title: "Website Refresh Landing Page",
          description: "Need a new landing page design for the upcoming product refresh. Modern, clean aesthetic.",
          status: status ?? "REVIEWED",
          submittedBy: { id: "cpu_002", name: "James Rivera" },
          submittedAt: "2026-03-25T14:00:00Z",
          reviewedAt: "2026-03-26T09:15:00Z",
          reviewNotes: "Good scope. Needs budget confirmation.",
        },
      ],
      total: 2,
      page: page ?? 1,
      pageSize: pageSize ?? 20,
    },
  };
};

export const listBriefRequests: ToolDefinition = {
  name: "listBriefRequests",
  description: "List brief requests submitted by clients, optionally filtered by client or status.",
  parameters: {
    type: "object",
    properties: {
      clientId: { type: "string", description: "Filter by client ID" },
      status: {
        type: "string",
        enum: ["SUBMITTED", "REVIEWED", "ACCEPTED", "REJECTED", "CONVERTED"],
        description: "Filter by request status",
      },
      page: { type: "number", description: "Page number for pagination", minimum: 1 },
      pageSize: { type: "number", description: "Number of results per page", minimum: 1, maximum: 100 },
    },
    required: [],
  },
  handler: handleListBriefRequests,
};

const handleReviewBriefRequest: ToolHandler = async (params, _context) => {
  const { requestId, status, reviewNotes, reviewedById } = params as {
    requestId: string;
    status: string;
    reviewNotes?: string;
    reviewedById?: string;
  };
  return {
    success: true,
    data: {
      id: requestId,
      status,
      reviewNotes: reviewNotes ?? null,
      reviewedById: reviewedById ?? "user_reviewer_01",
      reviewedAt: new Date().toISOString(),
    },
  };
};

export const reviewBriefRequest: ToolDefinition = {
  name: "reviewBriefRequest",
  description: "Review and update the status of a brief request. Can mark as REVIEWED, ACCEPTED, or REJECTED.",
  parameters: {
    type: "object",
    properties: {
      requestId: { type: "string", description: "The brief request ID to review" },
      status: {
        type: "string",
        enum: ["REVIEWED", "ACCEPTED", "REJECTED"],
        description: "The new status for the request",
      },
      reviewNotes: { type: "string", description: "Optional notes from the reviewer" },
      reviewedById: { type: "string", description: "The user ID of the reviewer" },
    },
    required: ["requestId", "status"],
  },
  handler: handleReviewBriefRequest,
};

const handleConvertBriefRequest: ToolHandler = async (params, _context) => {
  const { requestId, briefId } = params as { requestId: string; briefId: string };
  return {
    success: true,
    data: {
      id: requestId,
      status: "CONVERTED",
      convertedToBriefId: briefId,
      convertedAt: new Date().toISOString(),
    },
  };
};

export const convertBriefRequest: ToolDefinition = {
  name: "convertBriefRequest",
  description: "Convert an approved brief request into an actual brief. The request status is set to CONVERTED.",
  parameters: {
    type: "object",
    properties: {
      requestId: { type: "string", description: "The brief request ID to convert" },
      briefId: { type: "string", description: "The brief ID that was created from this request" },
    },
    required: ["requestId", "briefId"],
  },
  handler: handleConvertBriefRequest,
};
