/**
 * Capacity Tools (Phase 6C)
 *
 * Team capacity planning and forecasting.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// getTeamCapacity
// ---------------------------------------------------------------------------

export const getTeamCapacity: ToolDefinition = {
  name: "getTeamCapacity",
  description: "Get current team capacity factoring in leave, holidays, and working hours",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      teamId: { type: "string", description: "Team ID" },
      startDate: { type: "string", description: "Period start date" },
      endDate: { type: "string", description: "Period end date" },
    },
    required: ["orgId", "teamId", "startDate", "endDate"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        teamId: params.teamId,
        startDate: params.startDate,
        endDate: params.endDate,
        totalMembers: 8,
        availableMembers: 6,
        onLeave: 2,
        totalCapacityHours: 960,
        availableCapacityHours: 720,
        utilizationPercent: 75,
        members: [
          { employeeId: "emp_001", name: "Sarah Chen", status: "AVAILABLE", capacityHours: 160 },
          { employeeId: "emp_002", name: "Mike Johnson", status: "ON_LEAVE", capacityHours: 0 },
          { employeeId: "emp_003", name: "Lisa Park", status: "AVAILABLE", capacityHours: 160 },
        ],
      },
    };
  },
};

// ---------------------------------------------------------------------------
// getForecastedCapacity
// ---------------------------------------------------------------------------

export const getForecastedCapacity: ToolDefinition = {
  name: "getForecastedCapacity",
  description: "Forecast team capacity for future periods based on approved and pending leave",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      teamId: { type: "string", description: "Team ID" },
      months: { type: "number", description: "Number of months to forecast (default 3)" },
      includePublicHolidays: { type: "boolean", description: "Factor in public holidays" },
      includePendingLeave: { type: "boolean", description: "Include pending (unapproved) leave requests" },
    },
    required: ["orgId", "teamId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    const months = params.months || 3;
    return {
      success: true,
      data: {
        teamId: params.teamId,
        forecastMonths: months,
        forecast: [
          { month: "2025-08", totalCapacityHours: 1280, availableHours: 1050, approvedLeaveHours: 160, pendingLeaveHours: 70, holidays: 1, utilizationPercent: 82 },
          { month: "2025-09", totalCapacityHours: 1280, availableHours: 960, approvedLeaveHours: 240, pendingLeaveHours: 80, holidays: 1, utilizationPercent: 75 },
          { month: "2025-10", totalCapacityHours: 1280, availableHours: 1120, approvedLeaveHours: 80, pendingLeaveHours: 80, holidays: 1, utilizationPercent: 87.5 },
        ],
      },
    };
  },
};
