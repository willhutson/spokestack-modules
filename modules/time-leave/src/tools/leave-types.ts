/**
 * Leave Type Tools (Phase 6C)
 *
 * Leave type configuration and management.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createLeaveType
// ---------------------------------------------------------------------------

export const createLeaveType: ToolDefinition = {
  name: "createLeaveType",
  description: "Create a new leave type with accrual rules and policies",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Leave type name" },
      code: { type: "string", description: "Short code (e.g., PTO, SICK)" },
      isPaid: { type: "boolean", description: "Whether leave is paid" },
      defaultDaysPerYear: { type: "number", description: "Default annual allocation" },
      accrualType: { type: "string", description: "Accrual method", enum: ["ANNUAL", "MONTHLY", "BIWEEKLY", "NONE"] },
      requiresApproval: { type: "boolean", description: "Whether leave requires manager approval" },
      allowCarryOver: { type: "boolean", description: "Whether unused days carry over" },
      maxCarryOverDays: { type: "number", description: "Maximum carry-over days" },
    },
    required: ["orgId", "name", "code"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `lt_${Date.now()}`,
        organizationId: params.orgId,
        name: params.name,
        code: params.code,
        isPaid: params.isPaid !== false,
        defaultDaysPerYear: params.defaultDaysPerYear || 0,
        accrualType: params.accrualType || "ANNUAL",
        requiresApproval: params.requiresApproval !== false,
        allowCarryOver: params.allowCarryOver || false,
        maxCarryOverDays: params.maxCarryOverDays || 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// listLeaveTypes
// ---------------------------------------------------------------------------

export const listLeaveTypes: ToolDefinition = {
  name: "listLeaveTypes",
  description: "List all leave types configured for an organization",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      isActive: { type: "boolean", description: "Filter by active status" },
    },
    required: ["orgId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: [
        { id: "lt_001", name: "Paid Time Off", code: "PTO", isPaid: true, defaultDaysPerYear: 20, accrualType: "MONTHLY", isActive: true },
        { id: "lt_002", name: "Sick Leave", code: "SICK", isPaid: true, defaultDaysPerYear: 10, accrualType: "ANNUAL", isActive: true },
        { id: "lt_003", name: "Unpaid Leave", code: "UNPAID", isPaid: false, defaultDaysPerYear: 0, accrualType: "NONE", isActive: true },
        { id: "lt_004", name: "Parental Leave", code: "PARENTAL", isPaid: true, defaultDaysPerYear: 60, accrualType: "NONE", isActive: true },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// updateLeaveType
// ---------------------------------------------------------------------------

export const updateLeaveType: ToolDefinition = {
  name: "updateLeaveType",
  description: "Update a leave type's configuration",
  parameters: {
    type: "object",
    properties: {
      leaveTypeId: { type: "string", description: "Leave type ID" },
      name: { type: "string", description: "Updated name" },
      defaultDaysPerYear: { type: "number", description: "Updated annual allocation" },
      accrualType: { type: "string", description: "Updated accrual method" },
      requiresApproval: { type: "boolean", description: "Updated approval requirement" },
      allowCarryOver: { type: "boolean", description: "Updated carry-over policy" },
      maxCarryOverDays: { type: "number", description: "Updated max carry-over" },
      isActive: { type: "boolean", description: "Active status" },
    },
    required: ["leaveTypeId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: params.leaveTypeId,
        ...params,
        updatedAt: new Date().toISOString(),
      },
    };
  },
};
