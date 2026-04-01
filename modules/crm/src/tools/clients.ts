/**
 * CRM Client Management Tools
 *
 * Each tool conforms to the SDK ToolDefinition type.
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// manageClients
// ---------------------------------------------------------------------------

const manageClientsHandler: ToolHandler = async (params, context) => {
  const action = params.action as string;
  if (action === "create") {
    return {
      success: true,
      data: {
        id: `client_${Date.now()}`,
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
      clients: [],
      total: 0,
    },
  };
};

export const manageClients: ToolDefinition = {
  name: "manageClients",
  description: "Create, update, or list Client records in the CRM.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Action to perform",
        enum: ["create", "update", "list"],
      },
      id: { type: "string", description: "Client ID (required for update)" },
      name: { type: "string", description: "Client name" },
      code: { type: "string", description: "Client code" },
      industry: { type: "string", description: "Industry sector" },
      isRetainer: { type: "boolean", description: "Whether client is on retainer" },
      retainerHours: { type: "number", description: "Monthly retainer hours" },
      accountManagerId: { type: "string", description: "Account manager user ID" },
      relationshipStatus: { type: "string", description: "Relationship status" },
      filterIndustry: { type: "string", description: "Filter by industry (list action)" },
      filterIsRetainer: { type: "string", description: "Filter by retainer status: true/false (list action)" },
      filterRelationshipStatus: { type: "string", description: "Filter by relationship status (list action)" },
      filterAccountManagerId: { type: "string", description: "Filter by account manager ID (list action)" },
    },
    required: ["action"],
  },
  handler: manageClientsHandler,
};

// ---------------------------------------------------------------------------
// trackClientActivity
// ---------------------------------------------------------------------------

const trackClientActivityHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      id: `client_activity_${Date.now()}`,
      organizationId: context.organizationId,
      ...params,
      createdAt: new Date().toISOString(),
    },
  };
};

export const trackClientActivity: ToolDefinition = {
  name: "trackClientActivity",
  description: "Log a ClientActivity such as a meeting, call, email, or note.",
  parameters: {
    type: "object",
    properties: {
      clientId: { type: "string", description: "Client ID" },
      userId: { type: "string", description: "User ID who performed the activity" },
      type: {
        type: "string",
        description: "Activity type",
        enum: ["MEETING", "CALL", "EMAIL", "NOTE"],
      },
      title: { type: "string", description: "Activity title" },
      description: { type: "string", description: "Activity description" },
      meetingDate: { type: "string", description: "Meeting date (ISO 8601)" },
      meetingDuration: { type: "number", description: "Meeting duration in minutes" },
      attendees: { type: "array", description: "List of attendee IDs", items: { type: "string" } },
      emailSubject: { type: "string", description: "Email subject line" },
      callDuration: { type: "number", description: "Call duration in minutes" },
    },
    required: ["clientId", "userId", "type", "title"],
  },
  handler: trackClientActivityHandler,
};

// ---------------------------------------------------------------------------
// handleComplaint
// ---------------------------------------------------------------------------

const handleComplaintHandler: ToolHandler = async (params, context) => {
  const action = params.action as string;
  if (action === "create") {
    return {
      success: true,
      data: {
        id: `complaint_${Date.now()}`,
        organizationId: context.organizationId,
        ...params,
        status: "NEW",
        createdAt: new Date().toISOString(),
      },
    };
  }
  // update
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
};

export const handleComplaint: ToolDefinition = {
  name: "handleComplaint",
  description: "Create or update a ClientComplaint record for tracking and resolution.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Action to perform",
        enum: ["create", "update"],
      },
      id: { type: "string", description: "Complaint ID (required for update)" },
      clientId: { type: "string", description: "Client ID" },
      title: { type: "string", description: "Complaint title" },
      description: { type: "string", description: "Complaint description" },
      severity: {
        type: "string",
        description: "Complaint severity",
        enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      },
      category: { type: "string", description: "Complaint category" },
      status: {
        type: "string",
        description: "Complaint status",
        enum: ["NEW", "INVESTIGATING", "RESOLVED", "CLOSED"],
      },
      assignedToId: { type: "string", description: "User ID assigned to resolve" },
      resolution: { type: "string", description: "Resolution details" },
    },
    required: ["action"],
  },
  handler: handleComplaintHandler,
};
