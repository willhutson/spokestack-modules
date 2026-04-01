/**
 * Time Tracking Tools
 *
 * Tools for logging time, viewing timesheets, approving entries,
 * listing entries, and deleting entries.
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// logTime
// ---------------------------------------------------------------------------

const logTimeHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      id: `te_${Date.now()}`,
      organizationId: context.organizationId,
      userId: params.userId,
      hours: params.hours,
      date: params.date,
      description: params.description || null,
      briefId: params.briefId || null,
      projectId: params.projectId || null,
      isBillable: params.isBillable ?? true,
      isApproved: false,
      startTime: params.startTime || null,
      endTime: params.endTime || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const logTime: ToolDefinition = {
  name: "logTime",
  description: "Log a time entry for a user with hours, date, and billing status.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      userId: { type: "string", description: "User ID for the time entry" },
      hours: { type: "number", description: "Number of hours worked", minimum: 0.25 },
      date: { type: "string", description: "Date of the time entry (YYYY-MM-DD)" },
      description: { type: "string", description: "Description of the work performed" },
      briefId: { type: "string", description: "Associated brief ID" },
      projectId: { type: "string", description: "Associated project ID" },
      isBillable: { type: "string", description: "Whether the time is billable (true/false)" },
      startTime: { type: "string", description: "Start time (HH:MM)" },
      endTime: { type: "string", description: "End time (HH:MM)" },
    },
    required: ["orgId", "userId", "hours", "date"],
  },
  handler: logTimeHandler,
};

// ---------------------------------------------------------------------------
// getTimesheetSummary
// ---------------------------------------------------------------------------

const getTimesheetSummaryHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      userId: params.userId,
      startDate: params.startDate,
      endDate: params.endDate,
      totalHours: 42.5,
      billableHours: 38.0,
      nonBillableHours: 4.5,
      entries: [],
      byProject: { "proj_001": 12.0, "proj_002": 18.5 },
      byBrief: {},
    },
  };
};

export const getTimesheetSummary: ToolDefinition = {
  name: "getTimesheetSummary",
  description: "Aggregate time entries for a user over a date range to produce a timesheet summary.",
  parameters: {
    type: "object",
    properties: {
      userId: { type: "string", description: "User ID to summarize" },
      orgId: { type: "string", description: "Organization ID" },
      startDate: { type: "string", description: "Start date of the range (YYYY-MM-DD)" },
      endDate: { type: "string", description: "End date of the range (YYYY-MM-DD)" },
    },
    required: ["userId", "orgId", "startDate", "endDate"],
  },
  handler: getTimesheetSummaryHandler,
};

// ---------------------------------------------------------------------------
// approveTimeEntry
// ---------------------------------------------------------------------------

const approveTimeEntryHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.timeEntryId,
      isApproved: true,
      approvedById: params.approvedById,
      approvedAt: new Date().toISOString(),
    },
  };
};

export const approveTimeEntry: ToolDefinition = {
  name: "approveTimeEntry",
  description: "Approve a pending time entry.",
  parameters: {
    type: "object",
    properties: {
      timeEntryId: { type: "string", description: "ID of the time entry to approve" },
      approvedById: { type: "string", description: "ID of the user approving the entry" },
    },
    required: ["timeEntryId", "approvedById"],
  },
  handler: approveTimeEntryHandler,
};

// ---------------------------------------------------------------------------
// listTimeEntries
// ---------------------------------------------------------------------------

const listTimeEntriesHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      entries: [],
      total: 0,
      page: (params.page as number) || 1,
      limit: (params.limit as number) || 20,
    },
  };
};

export const listTimeEntries: ToolDefinition = {
  name: "listTimeEntries",
  description: "List and filter time entries by user, project, brief, or date range.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      userId: { type: "string", description: "Filter by user ID" },
      briefId: { type: "string", description: "Filter by brief ID" },
      projectId: { type: "string", description: "Filter by project ID" },
      startDate: { type: "string", description: "Filter start date (YYYY-MM-DD)" },
      endDate: { type: "string", description: "Filter end date (YYYY-MM-DD)" },
      isApproved: { type: "string", description: "Filter by approval status (true/false)" },
      isBillable: { type: "string", description: "Filter by billable status (true/false)" },
      page: { type: "number", description: "Page number", minimum: 1 },
      limit: { type: "number", description: "Results per page", minimum: 1, maximum: 100 },
    },
    required: ["orgId"],
  },
  handler: listTimeEntriesHandler,
};

// ---------------------------------------------------------------------------
// deleteTimeEntry
// ---------------------------------------------------------------------------

const deleteTimeEntryHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.timeEntryId,
      deleted: true,
    },
  };
};

export const deleteTimeEntry: ToolDefinition = {
  name: "deleteTimeEntry",
  description: "Remove a time entry.",
  parameters: {
    type: "object",
    properties: {
      timeEntryId: { type: "string", description: "ID of the time entry to delete" },
    },
    required: ["timeEntryId"],
  },
  handler: deleteTimeEntryHandler,
};
