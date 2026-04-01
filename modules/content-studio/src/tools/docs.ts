/**
 * Docs & Knowledge Tools
 *
 * Models: StudioDocument, StudioDocVersion, DocTemplate, KnowledgeDocument,
 *         DocumentVersion, DocumentEmbedding, DocumentUsage
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createDocument
// ---------------------------------------------------------------------------

const createDocumentHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "doc_stub_001",
      organizationId: params.orgId,
      title: params.title,
      type: params.type || "DOCUMENT",
      status: "DRAFT",
      wordCount: 0,
      projectId: params.projectId || null,
      briefId: params.briefId || null,
      clientId: params.clientId || null,
      templateId: params.templateId || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createDocument: ToolDefinition = {
  name: "createDocument",
  description: "Create a new studio document",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      title: { type: "string", description: "Document title" },
      type: {
        type: "string",
        description: "Document type",
        enum: ["DOCUMENT", "BRIEF_DOC", "PROPOSAL", "REPORT", "PLAYBOOK", "OTHER"],
      },
      projectId: { type: "string", description: "Project ID" },
      briefId: { type: "string", description: "Brief ID" },
      clientId: { type: "string", description: "Client ID" },
      templateId: { type: "string", description: "Template ID" },
    },
    required: ["orgId", "title"],
  },
  handler: createDocumentHandler,
};

// ---------------------------------------------------------------------------
// listDocuments
// ---------------------------------------------------------------------------

const listDocumentsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      documents: [
        {
          id: "doc_stub_001",
          title: "Campaign Brief",
          type: "BRIEF_DOC",
          status: "DRAFT",
          wordCount: 1200,
          organizationId: params.orgId,
          createdAt: new Date().toISOString(),
        },
        {
          id: "doc_stub_002",
          title: "Brand Guidelines",
          type: "PLAYBOOK",
          status: "PUBLISHED",
          wordCount: 5400,
          organizationId: params.orgId,
          createdAt: new Date().toISOString(),
        },
      ],
      total: 2,
      page: (params.page as number) || 1,
    },
  };
};

export const listDocuments: ToolDefinition = {
  name: "listDocuments",
  description: "List studio documents with optional filters",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Filter by client" },
      projectId: { type: "string", description: "Filter by project" },
      type: {
        type: "string",
        description: "Filter by document type",
        enum: ["DOCUMENT", "BRIEF_DOC", "PROPOSAL", "REPORT", "PLAYBOOK", "OTHER"],
      },
      status: {
        type: "string",
        description: "Filter by status",
        enum: ["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"],
      },
      page: { type: "number", description: "Page number", minimum: 1 },
      limit: { type: "number", description: "Results per page", minimum: 1, maximum: 100 },
    },
    required: ["orgId"],
  },
  handler: listDocumentsHandler,
};

// ---------------------------------------------------------------------------
// getDocument
// ---------------------------------------------------------------------------

const getDocumentHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: params.documentId,
      title: "Campaign Brief",
      type: "BRIEF_DOC",
      status: "DRAFT",
      wordCount: 1200,
      content: { blocks: [{ type: "paragraph", text: "..." }] },
      latestVersion: { id: "dv_stub_001", version: 2, changeNote: "Added objectives" },
      createdAt: new Date().toISOString(),
    },
  };
};

export const getDocument: ToolDefinition = {
  name: "getDocument",
  description: "Get a document with latest version info",
  parameters: {
    type: "object",
    properties: {
      documentId: { type: "string", description: "Document ID" },
    },
    required: ["documentId"],
  },
  handler: getDocumentHandler,
};

// ---------------------------------------------------------------------------
// trackVersions
// ---------------------------------------------------------------------------

const trackVersionsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "dv_stub_new",
      documentId: params.documentId,
      version: 2,
      content: params.content,
      wordCount: params.wordCount,
      changeNote: params.changeNote || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const trackVersions: ToolDefinition = {
  name: "trackVersions",
  description: "Create a version snapshot for a studio document",
  parameters: {
    type: "object",
    properties: {
      documentId: { type: "string", description: "Document ID" },
      content: { type: "string", description: "Document content (JSON)" },
      wordCount: { type: "number", description: "Word count" },
      changeNote: { type: "string", description: "Description of changes" },
    },
    required: ["documentId", "content", "wordCount"],
  },
  handler: trackVersionsHandler,
};

// ---------------------------------------------------------------------------
// listDocumentVersions
// ---------------------------------------------------------------------------

const listDocumentVersionsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      {
        id: "dv_stub_001",
        documentId: params.documentId,
        version: 1,
        wordCount: 800,
        changeNote: "Initial draft",
        createdAt: new Date().toISOString(),
      },
      {
        id: "dv_stub_002",
        documentId: params.documentId,
        version: 2,
        wordCount: 1200,
        changeNote: "Added objectives section",
        createdAt: new Date().toISOString(),
      },
    ],
  };
};

export const listDocumentVersions: ToolDefinition = {
  name: "listDocumentVersions",
  description: "List version history for a studio document",
  parameters: {
    type: "object",
    properties: {
      documentId: { type: "string", description: "Document ID" },
    },
    required: ["documentId"],
  },
  handler: listDocumentVersionsHandler,
};

// ---------------------------------------------------------------------------
// searchKnowledge
// ---------------------------------------------------------------------------

const searchKnowledgeHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      {
        id: "kd_stub_001",
        title: "Brand Voice Guidelines",
        documentType: "REFERENCE",
        path: "/brand/voice-guidelines",
        excerpt: "Our brand voice is confident, warm, and direct...",
        relevanceScore: 0.92,
        status: "PUBLISHED",
      },
      {
        id: "kd_stub_002",
        title: "Content Approval Process",
        documentType: "PROCESS",
        path: "/ops/content-approval",
        excerpt: "All content must go through a two-stage approval...",
        relevanceScore: 0.85,
        status: "PUBLISHED",
      },
    ],
  };
};

export const searchKnowledge: ToolDefinition = {
  name: "searchKnowledge",
  description: "Search knowledge base documents",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      query: { type: "string", description: "Search query" },
      documentType: {
        type: "string",
        description: "Filter by document type",
        enum: ["POLICY", "PROCESS", "SKILL", "PERSONA", "REFERENCE", "TEMPLATE", "OTHER"],
      },
      status: { type: "string", description: "Filter by status" },
      limit: { type: "number", description: "Max results", minimum: 1, maximum: 100 },
    },
    required: ["orgId", "query"],
  },
  handler: searchKnowledgeHandler,
};

// ---------------------------------------------------------------------------
// createKnowledgeDoc
// ---------------------------------------------------------------------------

const createKnowledgeDocHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "kd_stub_new",
      organizationId: params.orgId,
      path: params.path,
      slug: params.slug,
      title: params.title,
      documentType: params.documentType,
      content: params.content,
      description: params.description || null,
      visibility: params.visibility || "INTERNAL",
      agentMetadata: params.agentMetadata || null,
      version: 1,
      isLatest: true,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
    },
  };
};

export const createKnowledgeDoc: ToolDefinition = {
  name: "createKnowledgeDoc",
  description: "Create a knowledge base document",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      path: { type: "string", description: "Document path" },
      slug: { type: "string", description: "URL slug" },
      title: { type: "string", description: "Document title" },
      documentType: {
        type: "string",
        description: "Document type",
        enum: ["POLICY", "PROCESS", "SKILL", "PERSONA", "REFERENCE", "TEMPLATE", "OTHER"],
      },
      content: { type: "string", description: "Document content (markdown)" },
      description: { type: "string", description: "Short description" },
      visibility: {
        type: "string",
        description: "Visibility level",
        enum: ["INTERNAL", "CLIENT", "PUBLIC"],
      },
      agentMetadata: { type: "string", description: "Agent metadata (JSON)" },
    },
    required: ["orgId", "path", "slug", "title", "documentType", "content"],
  },
  handler: createKnowledgeDocHandler,
};

// ---------------------------------------------------------------------------
// embedDocument
// ---------------------------------------------------------------------------

const embedDocumentHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      documentId: params.documentId,
      chunks: 8,
      status: "EMBEDDED",
      model: (params.model as string) || "text-embedding-3-small",
    },
  };
};

export const embedDocument: ToolDefinition = {
  name: "embedDocument",
  description: "Chunk and embed a knowledge document for semantic search",
  parameters: {
    type: "object",
    properties: {
      documentId: { type: "string", description: "Knowledge document ID" },
      model: { type: "string", description: "Embedding model to use" },
    },
    required: ["documentId"],
  },
  handler: embedDocumentHandler,
};

// ---------------------------------------------------------------------------
// trackDocumentUsage
// ---------------------------------------------------------------------------

const trackDocumentUsageHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "du_stub_001",
      documentId: params.documentId,
      usedBy: params.usedBy,
      usageType: params.usageType,
      entityType: params.entityType || null,
      entityId: params.entityId || null,
      usedAt: new Date().toISOString(),
    },
  };
};

export const trackDocumentUsage: ToolDefinition = {
  name: "trackDocumentUsage",
  description: "Log a document usage record",
  parameters: {
    type: "object",
    properties: {
      documentId: { type: "string", description: "Document ID" },
      usedBy: { type: "string", description: "User or agent ID" },
      usageType: {
        type: "string",
        description: "Type of usage",
        enum: ["VIEWED", "CITED", "EXPORTED", "SEARCHED", "AGENT_USED"],
      },
      entityType: { type: "string", description: "Related entity type" },
      entityId: { type: "string", description: "Related entity ID" },
    },
    required: ["documentId", "usedBy", "usageType"],
  },
  handler: trackDocumentUsageHandler,
};

// ---------------------------------------------------------------------------
// listDocTemplates
// ---------------------------------------------------------------------------

const listDocTemplatesHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      {
        id: "dtpl_stub_001",
        name: "Campaign Brief Template",
        category: "BRIEF",
        organizationId: params.orgId,
        isActive: true,
        generationCount: 15,
      },
      {
        id: "dtpl_stub_002",
        name: "Case Study Template",
        category: "REPORT",
        organizationId: params.orgId,
        isActive: true,
        generationCount: 8,
      },
    ],
  };
};

export const listDocTemplates: ToolDefinition = {
  name: "listDocTemplates",
  description: "List document templates",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      category: { type: "string", description: "Filter by template category" },
    },
    required: ["orgId"],
  },
  handler: listDocTemplatesHandler,
};
