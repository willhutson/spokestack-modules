/**
 * Leave Management Tools
 *
 * Tools for requesting leave, approvals, balances, holidays,
 * blackout periods, leave types, and employee documents.
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// requestLeave
// ---------------------------------------------------------------------------

const requestLeaveHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: `lr_${Date.now()}`,
      userId: params.userId,
      leaveTypeId: params.leaveTypeId,
      status: "PENDING",
      startDate: params.startDate,
      endDate: params.endDate,
      totalDays: params.totalDays,
      reason: params.reason || null,
      isHalfDay: params.isHalfDay || false,
      halfDayPeriod: params.halfDayPeriod || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const requestLeave: ToolDefinition = {
  name: "requestLeave",
  description: "Create a new leave request for a user.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      userId: { type: "string", description: "User requesting leave" },
      leaveTypeId: { type: "string", description: "Leave type ID (e.g., lt_annual)" },
      startDate: { type: "string", description: "Leave start date (YYYY-MM-DD)" },
      endDate: { type: "string", description: "Leave end date (YYYY-MM-DD)" },
      totalDays: { type: "number", description: "Total number of leave days requested" },
      reason: { type: "string", description: "Reason for leave" },
      isHalfDay: { type: "string", description: "Whether this is a half-day request (true/false)" },
      halfDayPeriod: { type: "string", description: "Half-day period", enum: ["MORNING", "AFTERNOON"] },
    },
    required: ["orgId", "userId", "leaveTypeId", "startDate", "endDate", "totalDays"],
  },
  handler: requestLeaveHandler,
};

// ---------------------------------------------------------------------------
// approveLeave
// ---------------------------------------------------------------------------

const approveLeaveHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.leaveRequestId,
      status: params.status,
      reviewedById: params.reviewedById,
      reviewedAt: new Date().toISOString(),
      reviewNotes: params.reviewNotes || null,
    },
  };
};

export const approveLeave: ToolDefinition = {
  name: "approveLeave",
  description: "Approve, reject, or cancel a leave request.",
  parameters: {
    type: "object",
    properties: {
      leaveRequestId: { type: "string", description: "Leave request ID" },
      status: { type: "string", description: "New status for the request", enum: ["APPROVED", "REJECTED", "CANCELLED"] },
      reviewedById: { type: "string", description: "ID of the reviewer" },
      reviewNotes: { type: "string", description: "Notes from the reviewer" },
    },
    required: ["leaveRequestId", "status", "reviewedById"],
  },
  handler: approveLeaveHandler,
};

// ---------------------------------------------------------------------------
// getLeaveBalance
// ---------------------------------------------------------------------------

const getLeaveBalanceHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      userId: params.userId,
      year: params.year || new Date().getFullYear(),
      balances: [
        { leaveTypeId: "lt_annual", leaveTypeName: "Annual Leave", entitlement: 21, used: 5, remaining: 16, carriedOver: 0 },
        { leaveTypeId: "lt_sick", leaveTypeName: "Sick Leave", entitlement: 10, used: 2, remaining: 8, carriedOver: 0 },
      ],
    },
  };
};

export const getLeaveBalance: ToolDefinition = {
  name: "getLeaveBalance",
  description: "Get leave balance for a user by year.",
  parameters: {
    type: "object",
    properties: {
      userId: { type: "string", description: "User ID to check balance for" },
      year: { type: "number", description: "Year to check (defaults to current year)" },
    },
    required: ["userId"],
  },
  handler: getLeaveBalanceHandler,
};

// ---------------------------------------------------------------------------
// listLeaveRequests
// ---------------------------------------------------------------------------

const listLeaveRequestsHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      requests: [],
      total: 0,
      page: 1,
      limit: 20,
    },
  };
};

export const listLeaveRequests: ToolDefinition = {
  name: "listLeaveRequests",
  description: "List leave requests with optional status filters.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      userId: { type: "string", description: "Filter by user ID" },
      status: { type: "string", description: "Filter by status", enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"] },
      startDate: { type: "string", description: "Filter by start date (YYYY-MM-DD)" },
      endDate: { type: "string", description: "Filter by end date (YYYY-MM-DD)" },
    },
    required: ["orgId"],
  },
  handler: listLeaveRequestsHandler,
};

// ---------------------------------------------------------------------------
// manageLeaveTypes
// ---------------------------------------------------------------------------

const manageLeaveTypesHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      id: `lt_${Date.now()}`,
      organizationId: context.organizationId,
      name: params.name || "Annual Leave",
      code: params.code || "ANNUAL",
      defaultDays: params.defaultDays || 21,
      carryOverLimit: params.carryOverLimit || 0,
      requiresApproval: params.requiresApproval ?? true,
      isPaid: params.isPaid ?? true,
      color: params.color || "#3B82F6",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  };
};

export const manageLeaveTypes: ToolDefinition = {
  name: "manageLeaveTypes",
  description: "Create, update, or list leave types for the organization.",
  parameters: {
    type: "object",
    properties: {
      action: { type: "string", description: "Action to perform", enum: ["create", "update", "list"] },
      orgId: { type: "string", description: "Organization ID" },
      id: { type: "string", description: "Leave type ID (for update)" },
      name: { type: "string", description: "Leave type name" },
      code: { type: "string", description: "Leave type code (e.g., ANNUAL, SICK)" },
      defaultDays: { type: "number", description: "Default number of days per year" },
      carryOverLimit: { type: "number", description: "Maximum days that can carry over" },
      requiresApproval: { type: "string", description: "Whether approval is required (true/false)" },
      isPaid: { type: "string", description: "Whether the leave is paid (true/false)" },
      color: { type: "string", description: "Display color hex code" },
    },
    required: ["action", "orgId"],
  },
  handler: manageLeaveTypesHandler,
};

// ---------------------------------------------------------------------------
// listHolidays
// ---------------------------------------------------------------------------

const listHolidaysHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      holidays: [
        { id: "hol_001", name: "New Year's Day", date: "2025-01-01", year: 2025, isOptional: false },
      ],
    },
  };
};

export const listHolidays: ToolDefinition = {
  name: "listHolidays",
  description: "List public holidays for the organization.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      year: { type: "number", description: "Filter by year" },
    },
    required: ["orgId"],
  },
  handler: listHolidaysHandler,
};

// ---------------------------------------------------------------------------
// addHoliday
// ---------------------------------------------------------------------------

const addHolidayHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      id: `hol_${Date.now()}`,
      organizationId: context.organizationId,
      name: params.name,
      date: params.date,
      year: params.year,
      isOptional: params.isOptional || false,
      createdAt: new Date().toISOString(),
    },
  };
};

export const addHoliday: ToolDefinition = {
  name: "addHoliday",
  description: "Add a new public holiday for the organization.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Holiday name" },
      date: { type: "string", description: "Holiday date (YYYY-MM-DD)" },
      year: { type: "number", description: "Year of the holiday" },
      isOptional: { type: "string", description: "Whether the holiday is optional (true/false)" },
    },
    required: ["orgId", "name", "date", "year"],
  },
  handler: addHolidayHandler,
};

// ---------------------------------------------------------------------------
// manageBlackoutPeriods
// ---------------------------------------------------------------------------

const manageBlackoutPeriodsHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      id: `bp_${Date.now()}`,
      organizationId: context.organizationId,
      clientId: params.clientId || null,
      name: params.name || "Year-End Freeze",
      startDate: params.startDate,
      endDate: params.endDate,
      reason: params.reason || null,
      isRecurring: params.isRecurring || false,
      createdAt: new Date().toISOString(),
    },
  };
};

export const manageBlackoutPeriods: ToolDefinition = {
  name: "manageBlackoutPeriods",
  description: "Create or list blackout periods during which leave is restricted.",
  parameters: {
    type: "object",
    properties: {
      action: { type: "string", description: "Action to perform", enum: ["create", "list"] },
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Optional client ID to scope the blackout" },
      name: { type: "string", description: "Blackout period name" },
      startDate: { type: "string", description: "Start date (YYYY-MM-DD)" },
      endDate: { type: "string", description: "End date (YYYY-MM-DD)" },
      reason: { type: "string", description: "Reason for the blackout period" },
      isRecurring: { type: "string", description: "Whether the blackout recurs yearly (true/false)" },
    },
    required: ["action", "orgId"],
  },
  handler: manageBlackoutPeriodsHandler,
};

// ---------------------------------------------------------------------------
// manageEmployeeDocuments
// ---------------------------------------------------------------------------

const manageEmployeeDocumentsHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: `doc_${Date.now()}`,
      userId: params.userId,
      type: params.type || "CONTRACT",
      fileName: params.fileName || "document.pdf",
      fileSize: params.fileSize || null,
      mimeType: params.mimeType || null,
      storageKey: params.storageKey || null,
      expiryDate: params.expiryDate || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const manageEmployeeDocuments: ToolDefinition = {
  name: "manageEmployeeDocuments",
  description: "Upload or list employee documents such as contracts, IDs, and certifications.",
  parameters: {
    type: "object",
    properties: {
      action: { type: "string", description: "Action to perform", enum: ["upload", "list"] },
      userId: { type: "string", description: "Employee user ID" },
      type: { type: "string", description: "Document type (e.g., CONTRACT, ID, CERTIFICATION)" },
      fileName: { type: "string", description: "File name" },
      fileSize: { type: "number", description: "File size in bytes" },
      mimeType: { type: "string", description: "MIME type of the file" },
      storageKey: { type: "string", description: "Storage key/path for the file" },
      expiryDate: { type: "string", description: "Document expiry date (YYYY-MM-DD)" },
    },
    required: ["action", "userId"],
  },
  handler: manageEmployeeDocumentsHandler,
};
