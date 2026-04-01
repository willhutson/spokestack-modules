/**
 * CRM Feedback Tools — complaint handling and resolution tracking.
 * handleComplaint moved from clients.ts; listComplaints and getComplaintDetails are new.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

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
  // Phase 6C: real Prisma query
  const { id, ...updates } = params;
  return {
    success: true,
    data: { id, organizationId: context.organizationId, ...updates, updatedAt: new Date().toISOString() },
  };
};

export const handleComplaint: ToolDefinition = {
  name: "handleComplaint",
  description: "Create or update a complaint record for tracking and resolution.",
  parameters: {
    type: "object",
    properties: {
      action: { type: "string", description: "Action to perform", enum: ["create", "update"] },
      id: { type: "string", description: "Complaint ID (required for update)" },
      clientId: { type: "string", description: "Client ID" },
      title: { type: "string", description: "Complaint title" },
      description: { type: "string", description: "Complaint description" },
      severity: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
      category: { type: "string", description: "Complaint category" },
      status: { type: "string", enum: ["NEW", "INVESTIGATING", "RESOLVED", "CLOSED"] },
      assignedToId: { type: "string", description: "User ID assigned to resolve" },
      resolution: { type: "string", description: "Resolution details" },
    },
    required: ["action"],
  },
  handler: handleComplaintHandler,
};

const listComplaintsHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: [
      { id: "complaint_001", clientId: params.clientId || "client_001", title: "Delivery delay", severity: "HIGH", status: "INVESTIGATING", createdAt: "2026-03-15T10:00:00Z" },
      { id: "complaint_002", clientId: params.clientId || "client_001", title: "Invoice discrepancy", severity: "MEDIUM", status: "RESOLVED", createdAt: "2026-03-10T14:00:00Z" },
    ],
  };
};

export const listComplaints: ToolDefinition = {
  name: "listComplaints",
  description: "List complaints with optional filters for client, status, and severity.",
  parameters: {
    type: "object",
    properties: {
      clientId: { type: "string", description: "Filter by client" },
      status: { type: "string", enum: ["NEW", "INVESTIGATING", "RESOLVED", "CLOSED"] },
      severity: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
    },
  },
  handler: listComplaintsHandler,
};

const getComplaintDetailsHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      id: params.complaintId,
      clientId: "client_001",
      title: "Delivery delay",
      description: "Package was supposed to arrive last week",
      severity: "HIGH",
      status: "INVESTIGATING",
      assignedToId: "user_005",
      category: "logistics",
      timeline: [
        { event: "created", at: "2026-03-15T10:00:00Z", by: "user_001" },
        { event: "assigned", at: "2026-03-15T11:00:00Z", to: "user_005" },
      ],
      createdAt: "2026-03-15T10:00:00Z",
    },
  };
};

export const getComplaintDetails: ToolDefinition = {
  name: "getComplaintDetails",
  description: "Get full details of a complaint including timeline and resolution history.",
  parameters: {
    type: "object",
    properties: {
      complaintId: { type: "string", description: "Complaint ID" },
    },
    required: ["complaintId"],
  },
  handler: getComplaintDetailsHandler,
};
