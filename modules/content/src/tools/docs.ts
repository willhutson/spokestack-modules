/**
 * Docs & Knowledge Tools
 *
 * Models: StudioDocument, StudioDocVersion, DocTemplate, KnowledgeDocument,
 *         DocumentVersion, DocumentEmbedding, DocumentUsage
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const createDocumentHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "sdoc_stub_001",
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
  description: "Create a StudioDocument",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      title: { type: "string", description: "Document title" },
      type: { type: "string", description: "Document type", enum: ["DOCUMENT", "BRIEF_DOC", "PROPOSAL", "REPORT", "PLAYBOOK", "OTHER"] },
      projectId: { type: "string", description: "Associated project ID" },
      briefId: { type: "string", description: "Associated brief ID" },
      clientId: { type: "string", description: "Associated client ID" },
      templateId: { type: "string", description: "Template ID" },
    },
    required: ["orgId", "title"],
  },
  handler: createDocumentHandler,
};

const listDocumentsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      documents: [
        { id: "sdoc_stub_001", title: "Campaign Brief", type: "BRIEF_DOC", status: "DRAFT", wordCount: 1200, createdAt: new Date().toISOString() },
        { id: "sdoc_stub_002", title: "Brand Playbook", type: "PLAYBOOK", status: "PUBLISHED", wordCount: 5400, createdAt: new Date().toISOString() },
      ],
      total: 2,
      page: 1,
    },
  };
};

export const listDocuments: ToolDefinition = {
  name: "listDocuments",
  description: "List studio documents for an organization",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Filter by client" },
      projectId: { type: "string", description: "Filter by project" },
      type: { type: "string", description: "Filter by type", enum: ["DOCUMENT", "BRIEF_DOC", "PROPOSAL", "REPORT", "PLAYBOOK", "OTHER"] },
      status: { type: "string", description: "Filter by status", enum: ["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"] },
    },
    required: ["orgId"],
  },
  handler: listDocumentsHandler,
};

const getDocumentHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: params.documentId,
      title: "Campaign Brief",
      type: "BRIEF_DOC",
      status: "DRAFT",
      wordCount: 1200,
      content: { blocks: [{ type: "paragraph", text: "This is the campaign brief..." }] },
      latestVersion: { id: "sdver_001", version: 2, changeNote: "Updated objectives", createdAt: new Date().toISOString() },
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

const trackVersionsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "sdver_stub_001",
      documentId: params.documentId,
      version: 2,
      content: params.content,
      wordCount: params.wordCount,
      changeNote: params.changeNote || null,
      createdById: "user_001",
      createdAt: new Date().toISOString(),
    },
  };
};

export const trackVersions: ToolDefinition = {
  name: "trackVersions",
  description: "Create a StudioDocVersion snapshot",
  parameters: {
    type: "object",
    properties: {
      documentId: { type: "string", description: "Document ID" },
      content: { type: "string", description: "JSON content snapshot" },
      wordCount: { type: "number", description: "Word count" },
      changeNote: { type: "string", description: "Description of changes" },
    },
    required: ["documentId", "content", "wordCount"],
  },
  handler: trackVersionsHandler,
};

const listDocumentVersionsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      { id: "sdver_stub_001", documentId: params.documentId, version: 1, wordCount: 800, changeNote: "Initial draft", createdAt: new Date().toISOString() },
      { id: "sdver_stub_002", documentId: params.documentId, version: 2, wordCount: 1200, changeNote: "Updated objectives", createdAt: new Date().toISOString() },
    ],
  };
};

export const listDocumentVersions: ToolDefinition = {
  name: "listDocumentVersions",
  description: "List StudioDocVersion records for a document",
  parameters: {
    type: "object",
    properties: {
      documentId: { type: "string", description: "Document ID" },
    },
    required: ["documentId"],
  },
  handler: listDocumentVersionsHandler,
};

const searchKnowledgeHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      { id: "kdoc_stub_001", title: "Brand Voice Guidelines", documentType: "REFERENCE", excerpt: "Our brand voice is confident, approachable...", relevanceScore: 0.92 },
      { id: "kdoc_stub_002", title: "Content Approval Process", documentType: "PROCESS", excerpt: "All content must go through a three-step...", relevanceScore: 0.85 },
    ],
  };
};

export const searchKnowledge: ToolDefinition = {
  name: "searchKnowledge",
  description: "Search KnowledgeDocument records",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      query: { type: "string", description: "Search query" },
      documentType: { type: "string", description: "Filter by type", enum: ["POLICY", "PROCESS", "SKILL", "PERSONA", "REFERENCE", "TEMPLATE", "OTHER"] },
      status: { type: "string", description: "Filter by status" },
      limit: { type: "number", description: "Max results" },
    },
    required: ["orgId", "query"],
  },
  handler: searchKnowledgeHandler,
};

const createKnowledgeDocHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "kdoc_stub_003",
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
  description: "Create a KnowledgeDocument",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      path: { type: "string", description: "Document path" },
      slug: { type: "string", description: "URL-friendly slug" },
      title: { type: "string", description: "Document title" },
      documentType: { type: "string", description: "Document type", enum: ["POLICY", "PROCESS", "SKILL", "PERSONA", "REFERENCE", "TEMPLATE", "OTHER"] },
      content: { type: "string", description: "Markdown content" },
      description: { type: "string", description: "Short description" },
      visibility: { type: "string", description: "Visibility level", enum: ["INTERNAL", "CLIENT", "PUBLIC"] },
      agentMetadata: { type: "string", description: "JSON agent metadata" },
    },
    required: ["orgId", "path", "slug", "title", "documentType", "content"],
  },
  handler: createKnowledgeDocHandler,
};

const embedDocumentHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      documentId: params.documentId,
      chunks: 8,
      status: "EMBEDDED",
      model: params.model || "text-embedding-3-small",
    },
  };
};

export const embedDocument: ToolDefinition = {
  name: "embedDocument",
  description: "Simulate chunking and embedding a KnowledgeDocument",
  parameters: {
    type: "object",
    properties: {
      documentId: { type: "string", description: "Knowledge document ID" },
      model: { type: "string", description: "Embedding model name" },
    },
    required: ["documentId"],
  },
  handler: embedDocumentHandler,
};

const trackDocumentUsageHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "dusage_stub_001",
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
  description: "Log a DocumentUsage record",
  parameters: {
    type: "object",
    properties: {
      documentId: { type: "string", description: "Document ID" },
      usedBy: { type: "string", description: "User or agent ID" },
      usageType: { type: "string", description: "Usage type", enum: ["VIEWED", "CITED", "EXPORTED", "SEARCHED", "AGENT_USED"] },
      entityType: { type: "string", description: "Related entity type" },
      entityId: { type: "string", description: "Related entity ID" },
    },
    required: ["documentId", "usedBy", "usageType"],
  },
  handler: trackDocumentUsageHandler,
};

const listDocTemplatesHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      { id: "dtmpl_stub_001", name: "Campaign Brief Template", category: "BRIEF", isActive: true, createdAt: new Date().toISOString() },
      { id: "dtmpl_stub_002", name: "Monthly Report", category: "REPORT", isActive: true, createdAt: new Date().toISOString() },
    ],
  };
};

export const listDocTemplates: ToolDefinition = {
  name: "listDocTemplates",
  description: "List DocTemplate records",
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
