/**
 * Leave Balance Tools (Phase 6C)
 *
 * Employee leave balance tracking and adjustments.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// getLeaveBalance
// ---------------------------------------------------------------------------

export const getLeaveBalance: ToolDefinition = {
  name: "getLeaveBalance",
  description: "Get leave balance for an employee across all leave types",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      employeeId: { type: "string", description: "Employee ID" },
      leaveTypeId: { type: "string", description: "Specific leave type (omit for all)" },
      asOfDate: { type: "string", description: "Balance as of date (default: today)" },
    },
    required: ["orgId", "employeeId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        employeeId: params.employeeId,
        asOfDate: params.asOfDate || new Date().toISOString().split("T")[0],
        balances: [
          { leaveTypeId: "lt_001", leaveTypeName: "Paid Time Off", allocated: 20, used: 8, pending: 2, available: 10, unit: "days" },
          { leaveTypeId: "lt_002", leaveTypeName: "Sick Leave", allocated: 10, used: 3, pending: 0, available: 7, unit: "days" },
          { leaveTypeId: "lt_004", leaveTypeName: "Parental Leave", allocated: 60, used: 0, pending: 0, available: 60, unit: "days" },
        ],
      },
    };
  },
};

// ---------------------------------------------------------------------------
// adjustBalance
// ---------------------------------------------------------------------------

export const adjustBalance: ToolDefinition = {
  name: "adjustBalance",
  description: "Manually adjust a leave balance (e.g., for corrections or special grants)",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      employeeId: { type: "string", description: "Employee ID" },
      leaveTypeId: { type: "string", description: "Leave type ID" },
      adjustment: { type: "number", description: "Days to add (positive) or remove (negative)" },
      reason: { type: "string", description: "Reason for adjustment" },
    },
    required: ["orgId", "employeeId", "leaveTypeId", "adjustment", "reason"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `adj_${Date.now()}`,
        employeeId: params.employeeId,
        leaveTypeId: params.leaveTypeId,
        adjustment: params.adjustment,
        reason: params.reason,
        previousBalance: 10,
        newBalance: 10 + (params.adjustment as number),
        adjustedBy: "admin_001",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// getTeamBalances
// ---------------------------------------------------------------------------

export const getTeamBalances: ToolDefinition = {
  name: "getTeamBalances",
  description: "Get leave balances for all members of a team",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      teamId: { type: "string", description: "Team ID" },
      leaveTypeId: { type: "string", description: "Specific leave type (omit for primary)" },
    },
    required: ["orgId", "teamId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        teamId: params.teamId,
        memberCount: 5,
        balances: [
          { employeeId: "emp_001", employeeName: "Sarah Chen", allocated: 20, used: 8, available: 12 },
          { employeeId: "emp_002", employeeName: "Mike Johnson", allocated: 20, used: 15, available: 5 },
          { employeeId: "emp_003", employeeName: "Lisa Park", allocated: 20, used: 3, available: 17 },
          { employeeId: "emp_004", employeeName: "Tom Wilson", allocated: 25, used: 10, available: 15 },
          { employeeId: "emp_005", employeeName: "Ana Rivera", allocated: 20, used: 12, available: 8 },
        ],
      },
    };
  },
};

// ---------------------------------------------------------------------------
// getCarryOver
// ---------------------------------------------------------------------------

export const getCarryOver: ToolDefinition = {
  name: "getCarryOver",
  description: "Get carry-over balance details for year-end leave transitions",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      employeeId: { type: "string", description: "Employee ID (omit for all)" },
      year: { type: "number", description: "Year to check carry-over for" },
    },
    required: ["orgId", "year"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        year: params.year,
        entries: [
          { employeeId: "emp_001", employeeName: "Sarah Chen", leaveType: "PTO", unusedDays: 5, carryOverDays: 5, forfeitedDays: 0, maxCarryOver: 10 },
          { employeeId: "emp_002", employeeName: "Mike Johnson", leaveType: "PTO", unusedDays: 2, carryOverDays: 2, forfeitedDays: 0, maxCarryOver: 10 },
          { employeeId: "emp_003", employeeName: "Lisa Park", leaveType: "PTO", unusedDays: 14, carryOverDays: 10, forfeitedDays: 4, maxCarryOver: 10 },
        ],
      },
    };
  },
};
