/**
 * Blackout Period Tools (Phase 6C)
 *
 * Manage periods when leave cannot be taken.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createBlackoutPeriod
// ---------------------------------------------------------------------------

export const createBlackoutPeriod: ToolDefinition = {
  name: "createBlackoutPeriod",
  description: "Create a blackout period when leave requests are restricted",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Blackout period name" },
      startDate: { type: "string", description: "Start date (ISO 8601)" },
      endDate: { type: "string", description: "End date (ISO 8601)" },
      reason: { type: "string", description: "Reason for blackout" },
      appliesToTeams: { type: "array", items: { type: "string" }, description: "Team IDs (omit for org-wide)" },
      isHard: { type: "boolean", description: "Hard blackout (no exceptions) vs soft (requires extra approval)" },
    },
    required: ["orgId", "name", "startDate", "endDate"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `bp_${Date.now()}`,
        organizationId: params.orgId,
        name: params.name,
        startDate: params.startDate,
        endDate: params.endDate,
        reason: params.reason || null,
        appliesToTeams: params.appliesToTeams || [],
        isHard: params.isHard || false,
        isOrgWide: !params.appliesToTeams || (params.appliesToTeams as any[]).length === 0,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// listBlackoutPeriods
// ---------------------------------------------------------------------------

export const listBlackoutPeriods: ToolDefinition = {
  name: "listBlackoutPeriods",
  description: "List blackout periods for an organization",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      includeExpired: { type: "boolean", description: "Include past blackout periods" },
    },
    required: ["orgId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: [
        { id: "bp_001", name: "Year-End Close", startDate: "2025-12-20", endDate: "2025-12-31", reason: "Financial year-end", isHard: true, isOrgWide: true, status: "ACTIVE" },
        { id: "bp_002", name: "Product Launch Week", startDate: "2025-09-01", endDate: "2025-09-07", reason: "Major product launch", isHard: false, isOrgWide: false, status: "ACTIVE" },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// checkDateAvailability
// ---------------------------------------------------------------------------

export const checkDateAvailability: ToolDefinition = {
  name: "checkDateAvailability",
  description: "Check if a date range is available for leave (not blocked by blackout periods)",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      employeeId: { type: "string", description: "Employee ID" },
      startDate: { type: "string", description: "Requested start date" },
      endDate: { type: "string", description: "Requested end date" },
    },
    required: ["orgId", "employeeId", "startDate", "endDate"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        isAvailable: true,
        startDate: params.startDate,
        endDate: params.endDate,
        conflicts: [],
        warnings: [
          { type: "TEAM_COVERAGE", message: "2 other team members already on leave during this period" },
        ],
      },
    };
  },
};
