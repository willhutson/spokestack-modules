import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const handleAddPortalComment: ToolHandler = async (params, _context) => {
  const { briefId, approvalId, content, authorId } = params as {
    briefId?: string;
    approvalId?: string;
    content: string;
    authorId: string;
  };
  return {
    success: true,
    data: {
      id: `pcmt_${Date.now()}`,
      briefId: briefId ?? null,
      approvalId: approvalId ?? null,
      content,
      authorId,
      authorName: "Sarah Chen",
      createdAt: new Date().toISOString(),
    },
  };
};

export const addPortalComment: ToolDefinition = {
  name: "addPortalComment",
  description: "Add a comment on a brief or approval in the client portal.",
  parameters: {
    type: "object",
    properties: {
      briefId: { type: "string", description: "The brief ID to comment on (provide briefId or approvalId)" },
      approvalId: { type: "string", description: "The approval ID to comment on (provide briefId or approvalId)" },
      content: { type: "string", description: "The comment text content" },
      authorId: { type: "string", description: "The portal user ID of the comment author" },
    },
    required: ["content", "authorId"],
  },
  handler: handleAddPortalComment,
};

const handleListPortalComments: ToolHandler = async (params, _context) => {
  const { briefId, approvalId, page, pageSize } = params as {
    briefId?: string;
    approvalId?: string;
    page?: number;
    pageSize?: number;
  };
  return {
    success: true,
    data: {
      comments: [
        {
          id: "pcmt_001",
          briefId: briefId ?? null,
          approvalId: approvalId ?? null,
          content: "Love the direction on this! Can we explore a darker color palette option as well?",
          authorId: "cpu_001",
          authorName: "Sarah Chen",
          createdAt: "2026-03-29T16:45:00Z",
        },
        {
          id: "pcmt_002",
          briefId: briefId ?? null,
          approvalId: approvalId ?? null,
          content: "Absolutely, we will prepare an alternative with a darker palette by Friday.",
          authorId: "user_designer_01",
          authorName: "Alex Thompson",
          createdAt: "2026-03-30T09:12:00Z",
        },
      ],
      total: 2,
      page: page ?? 1,
      pageSize: pageSize ?? 20,
    },
  };
};

export const listPortalComments: ToolDefinition = {
  name: "listPortalComments",
  description: "List portal comments for a brief or approval, with pagination.",
  parameters: {
    type: "object",
    properties: {
      briefId: { type: "string", description: "Filter comments by brief ID" },
      approvalId: { type: "string", description: "Filter comments by approval ID" },
      page: { type: "number", description: "Page number for pagination", minimum: 1 },
      pageSize: { type: "number", description: "Number of results per page", minimum: 1, maximum: 100 },
    },
    required: [],
  },
  handler: handleListPortalComments,
};
