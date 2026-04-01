/**
 * Form Tools
 *
 * Tools for creating form templates and managing form submissions.
 * Handlers are stubs for Phase 2; real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createForm
// ---------------------------------------------------------------------------

const createFormHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      id: `form_${Date.now()}`,
      organizationId: context.organizationId,
      type: params.type,
      name: params.name,
      isActive: true,
      isSystem: false,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createForm: ToolDefinition = {
  name: "createForm",
  description: "Create a configurable form template with sections, fields, and quality rules.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      type: { type: "string", description: "Form type identifier (e.g. CONTACT_US, FEEDBACK)" },
      name: { type: "string", description: "Human-readable form name" },
      config: { type: "string", description: "JSON configuration with sections, fields, and qualityRules" },
      description: { type: "string", description: "Form description" },
      namingConvention: { type: "string", description: "Naming convention for submissions" },
      namingPrefix: { type: "string", description: "Prefix for auto-generated submission names" },
      submissionModel: {
        type: "string",
        description: "Submission model type",
        enum: ["brief", "standalone"],
      },
      showInMenu: { type: "string", description: "Whether to show in navigation menu (true/false)" },
      menuOrder: { type: "number", description: "Sort order in navigation menu" },
    },
    required: ["orgId", "type", "name", "config"],
  },
  handler: createFormHandler,
};

// ---------------------------------------------------------------------------
// listForms
// ---------------------------------------------------------------------------

const listFormsHandler: ToolHandler = async (_params, _context) => {
  return {
    success: true,
    data: {
      forms: [],
      total: 0,
    },
  };
};

export const listForms: ToolDefinition = {
  name: "listForms",
  description: "List form templates with active status and menu visibility filters.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      isActive: { type: "string", description: "Filter by active status (true/false)" },
      submissionModel: { type: "string", description: "Filter by submission model" },
      showInMenu: { type: "string", description: "Filter by menu visibility (true/false)" },
    },
    required: ["orgId"],
  },
  handler: listFormsHandler,
};

// ---------------------------------------------------------------------------
// submitForm
// ---------------------------------------------------------------------------

const submitFormHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: `sub_${Date.now()}`,
      templateId: params.templateId,
      status: "SUBMITTED",
      submittedAt: new Date().toISOString(),
    },
  };
};

export const submitForm: ToolDefinition = {
  name: "submitForm",
  description: "Submit form data against a template. Validates data against the template configuration.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      templateId: { type: "string", description: "Form template ID to submit against" },
      data: { type: "string", description: "JSON form field values" },
      submittedById: { type: "string", description: "User ID of the submitter" },
      title: { type: "string", description: "Optional title for the submission" },
    },
    required: ["orgId", "templateId", "data", "submittedById"],
  },
  handler: submitFormHandler,
};

// ---------------------------------------------------------------------------
// listSubmissions
// ---------------------------------------------------------------------------

const listSubmissionsHandler: ToolHandler = async (_params, _context) => {
  return {
    success: true,
    data: {
      submissions: [],
      total: 0,
      page: 1,
      limit: 20,
    },
  };
};

export const listSubmissions: ToolDefinition = {
  name: "listSubmissions",
  description: "List form submissions with status, date, and assignee filters.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      templateId: { type: "string", description: "Filter by form template ID" },
      status: {
        type: "string",
        description: "Filter by submission status",
        enum: ["SUBMITTED", "IN_REVIEW", "APPROVED", "REJECTED", "COMPLETED"],
      },
      submittedById: { type: "string", description: "Filter by submitter user ID" },
      assigneeId: { type: "string", description: "Filter by assigned reviewer ID" },
      startDate: { type: "string", description: "Start date filter (ISO 8601)" },
      endDate: { type: "string", description: "End date filter (ISO 8601)" },
    },
    required: ["orgId"],
  },
  handler: listSubmissionsHandler,
};

// ---------------------------------------------------------------------------
// reviewSubmission
// ---------------------------------------------------------------------------

const reviewSubmissionHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.submissionId,
      status: params.status,
      reviewedById: params.reviewedById,
      reviewedAt: new Date().toISOString(),
    },
  };
};

export const reviewSubmission: ToolDefinition = {
  name: "reviewSubmission",
  description: "Review and update a form submission status. Supports approval, rejection, and completion workflows.",
  parameters: {
    type: "object",
    properties: {
      submissionId: { type: "string", description: "Submission ID to review" },
      status: {
        type: "string",
        description: "New status for the submission",
        enum: ["IN_REVIEW", "APPROVED", "REJECTED", "COMPLETED"],
      },
      reviewedById: { type: "string", description: "User ID of the reviewer" },
      reviewNotes: { type: "string", description: "Notes from the reviewer" },
      rejectionReason: { type: "string", description: "Reason for rejection (required when status is REJECTED)" },
    },
    required: ["submissionId", "status", "reviewedById"],
  },
  handler: reviewSubmissionHandler,
};

// ---------------------------------------------------------------------------
// getSubmission
// ---------------------------------------------------------------------------

const getSubmissionHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.submissionId,
      templateId: "form_001",
      templateName: "Contact Us",
      status: "SUBMITTED",
      data: {},
      submittedAt: new Date().toISOString(),
    },
  };
};

export const getSubmission: ToolDefinition = {
  name: "getSubmission",
  description: "Get a single form submission with template metadata and submitted data.",
  parameters: {
    type: "object",
    properties: {
      submissionId: { type: "string", description: "Submission ID to retrieve" },
    },
    required: ["submissionId"],
  },
  handler: getSubmissionHandler,
};
