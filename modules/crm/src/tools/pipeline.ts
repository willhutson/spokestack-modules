/**
 * CRM Pipeline & Search Tools
 *
 * Each tool conforms to the SDK ToolDefinition type.
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// managePipeline
// ---------------------------------------------------------------------------

const managePipelineHandler: ToolHandler = async (params, context) => {
  const action = params.action as string;
  if (action === "create") {
    return {
      success: true,
      data: {
        id: `pipeline_${Date.now()}`,
        organizationId: context.organizationId,
        ...params,
        createdAt: new Date().toISOString(),
      },
    };
  }
  if (action === "update") {
    const { id, ...updates } = params;
    return {
      success: true,
      data: {
        id,
        organizationId: context.organizationId,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    };
  }
  // list
  return {
    success: true,
    data: {
      pipelines: [],
      total: 0,
    },
  };
};

export const managePipeline: ToolDefinition = {
  name: "managePipeline",
  description: "Create, update, or list SalesPipeline configurations.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Action to perform",
        enum: ["create", "update", "list"],
      },
      id: { type: "string", description: "Pipeline ID (required for update)" },
      name: { type: "string", description: "Pipeline name" },
      description: { type: "string", description: "Pipeline description" },
      stages: { type: "array", description: "Pipeline stages (JSON array)", items: { type: "object" } },
      isDefault: { type: "boolean", description: "Whether this is the default pipeline" },
      isActive: { type: "boolean", description: "Whether the pipeline is active" },
      defaultCurrency: { type: "string", description: "Default currency code" },
    },
    required: ["action"],
  },
  handler: managePipelineHandler,
};

// ---------------------------------------------------------------------------
// logInteraction
// ---------------------------------------------------------------------------

const logInteractionHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      id: `interaction_${Date.now()}`,
      organizationId: context.organizationId,
      ...params,
      createdAt: new Date().toISOString(),
    },
  };
};

export const logInteraction: ToolDefinition = {
  name: "logInteraction",
  description: "Log a DealActivity or ContactActivity interaction record.",
  parameters: {
    type: "object",
    properties: {
      entityType: {
        type: "string",
        description: "Type of entity the interaction is for",
        enum: ["deal", "contact"],
      },
      entityId: { type: "string", description: "ID of the deal or contact" },
      activityType: { type: "string", description: "Type of activity (e.g. call, email, meeting)" },
      subject: { type: "string", description: "Activity subject" },
      description: { type: "string", description: "Activity description" },
      performedById: { type: "string", description: "User ID who performed the activity" },
    },
    required: ["entityType", "entityId", "activityType", "subject", "performedById"],
  },
  handler: logInteractionHandler,
};

// ---------------------------------------------------------------------------
// searchCRM
// ---------------------------------------------------------------------------

const searchCRMHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      results: [],
      total: 0,
      query: params.query,
      limit: (params.limit as number) || 20,
      offset: (params.offset as number) || 0,
    },
  };
};

export const searchCRM: ToolDefinition = {
  name: "searchCRM",
  description: "Full-text search across CRM entities including contacts, deals, clients, and campaigns.",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query string" },
      entityTypes: {
        type: "array",
        description: "Entity types to search",
        items: {
          type: "string",
          enum: ["contact", "deal", "client", "campaign"],
        },
      },
      limit: { type: "number", description: "Max results to return (default 20)", minimum: 1, maximum: 100 },
      offset: { type: "number", description: "Offset for pagination", minimum: 0 },
    },
    required: ["query"],
  },
  handler: searchCRMHandler,
};

// ---------------------------------------------------------------------------
// exportContacts
// ---------------------------------------------------------------------------

const exportContactsHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      contacts: [],
      total: 0,
      format: (params.format as string) || "json",
      page: (params.page as number) || 1,
      pageSize: (params.pageSize as number) || 50,
    },
  };
};

export const exportContacts: ToolDefinition = {
  name: "exportContacts",
  description: "Export a paginated contact list in JSON or CSV format.",
  parameters: {
    type: "object",
    properties: {
      format: {
        type: "string",
        description: "Export format",
        enum: ["json", "csv"],
      },
      page: { type: "number", description: "Page number (default 1)", minimum: 1 },
      pageSize: { type: "number", description: "Results per page (default 50)", minimum: 1, maximum: 500 },
      filterStatus: { type: "string", description: "Filter by contact status" },
      filterCompany: { type: "string", description: "Filter by company" },
      filterSource: { type: "string", description: "Filter by lead source" },
    },
  },
  handler: exportContactsHandler,
};
