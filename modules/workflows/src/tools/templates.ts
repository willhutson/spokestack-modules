/**
 * Workflow Template Tools
 *
 * Tools for creating, listing, publishing, and archiving workflow templates.
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createWorkflow
// ---------------------------------------------------------------------------

const createWorkflowHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      id: `wft_${Date.now()}`,
      organizationId: context.organizationId,
      name: params.name,
      status: "DRAFT",
      version: 1,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createWorkflow: ToolDefinition = {
  name: "createWorkflow",
  description:
    "Create a new workflow template with trigger type, task definitions, nudge rules, and stage gates.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Workflow template name" },
      description: { type: "string", description: "Template description" },
      module: {
        type: "string",
        description: "Module this workflow belongs to",
        enum: ["agency", "crm", "content", "custom"],
      },
      triggerType: {
        type: "string",
        description: "Event type that triggers this workflow (e.g. brief.created, deal.won)",
      },
      triggerConditions: {
        type: "string",
        description: "JSON string of trigger conditions to evaluate before instantiation",
      },
      taskTemplates: {
        type: "string",
        description:
          "JSON string array of task template objects with fields: name, assigneeRole, relativeDueDays",
      },
      nudgeRules: {
        type: "string",
        description: "JSON string array of nudge rule objects for automated notifications",
      },
      stageGates: {
        type: "string",
        description: "JSON string array of stage gate objects defining approval requirements",
      },
      aiSkills: {
        type: "string",
        description: "JSON string array of AI skill identifiers to attach to this workflow",
      },
    },
    required: ["orgId", "name", "module", "triggerType", "taskTemplates"],
  },
  handler: createWorkflowHandler,
};

// ---------------------------------------------------------------------------
// listWorkflowTemplates
// ---------------------------------------------------------------------------

const listWorkflowTemplatesHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: { templates: [], total: 0, page: 1, limit: 20 },
  };
};

export const listWorkflowTemplates: ToolDefinition = {
  name: "listWorkflowTemplates",
  description:
    "List workflow templates filtered by module, status, or trigger type.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      module: {
        type: "string",
        description: "Filter by module",
        enum: ["agency", "crm", "content", "custom"],
      },
      status: {
        type: "string",
        description: "Filter by template status",
        enum: ["DRAFT", "PUBLISHED", "ARCHIVED", "DEPRECATED"],
      },
      triggerType: { type: "string", description: "Filter by trigger type" },
    },
    required: ["orgId"],
  },
  handler: listWorkflowTemplatesHandler,
};

// ---------------------------------------------------------------------------
// getWorkflowTemplate
// ---------------------------------------------------------------------------

const getWorkflowTemplateHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.templateId,
      name: "New Brief Intake",
      module: "agency",
      triggerType: "brief.created",
      status: "PUBLISHED",
      version: 1,
      taskTemplates: [
        {
          name: "Review brief",
          assigneeRole: "project_manager",
          relativeDueDays: 1,
        },
      ],
      nudgeRules: [],
      stageGates: [],
      createdAt: new Date().toISOString(),
    },
  };
};

export const getWorkflowTemplate: ToolDefinition = {
  name: "getWorkflowTemplate",
  description:
    "Get a single workflow template by ID with full task definitions, nudge rules, and stage gates.",
  parameters: {
    type: "object",
    properties: {
      templateId: { type: "string", description: "Workflow template ID" },
    },
    required: ["templateId"],
  },
  handler: getWorkflowTemplateHandler,
};

// ---------------------------------------------------------------------------
// publishWorkflow
// ---------------------------------------------------------------------------

const publishWorkflowHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.templateId,
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
    },
  };
};

export const publishWorkflow: ToolDefinition = {
  name: "publishWorkflow",
  description:
    "Publish a draft workflow template, making it available for instantiation.",
  parameters: {
    type: "object",
    properties: {
      templateId: { type: "string", description: "Workflow template ID to publish" },
    },
    required: ["templateId"],
  },
  handler: publishWorkflowHandler,
};

// ---------------------------------------------------------------------------
// archiveWorkflow
// ---------------------------------------------------------------------------

const archiveWorkflowHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.templateId,
      status: "ARCHIVED",
    },
  };
};

export const archiveWorkflow: ToolDefinition = {
  name: "archiveWorkflow",
  description:
    "Archive a workflow template so it can no longer be instantiated.",
  parameters: {
    type: "object",
    properties: {
      templateId: { type: "string", description: "Workflow template ID to archive" },
    },
    required: ["templateId"],
  },
  handler: archiveWorkflowHandler,
};
