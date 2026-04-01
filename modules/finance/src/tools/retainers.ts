/**
 * Retainer Tools (Phase 6C)
 *
 * Client retainer period management and burn rate tracking.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createRetainerPeriod
// ---------------------------------------------------------------------------

export const createRetainerPeriod: ToolDefinition = {
  name: "createRetainerPeriod",
  description: "Create a new retainer period for a client with budget and hour allocations",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Client ID" },
      periodStart: { type: "string", description: "Period start date (ISO 8601)" },
      periodEnd: { type: "string", description: "Period end date (ISO 8601)" },
      totalBudget: { type: "number", description: "Total budget in cents" },
      totalHours: { type: "number", description: "Total allocated hours" },
      currency: { type: "string", description: "Currency code", enum: ["USD", "EUR", "GBP", "AUD", "CAD"] },
    },
    required: ["orgId", "clientId", "periodStart", "periodEnd", "totalBudget"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `ret_${Date.now()}`,
        organizationId: params.orgId,
        clientId: params.clientId,
        periodStart: params.periodStart,
        periodEnd: params.periodEnd,
        totalBudget: params.totalBudget,
        totalHours: params.totalHours || null,
        spentBudget: 0,
        spentHours: 0,
        currency: params.currency || "USD",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// getRetainerStatus
// ---------------------------------------------------------------------------

export const getRetainerStatus: ToolDefinition = {
  name: "getRetainerStatus",
  description: "Get the current status and utilization of a retainer period",
  parameters: {
    type: "object",
    properties: {
      retainerId: { type: "string", description: "Retainer period ID" },
    },
    required: ["retainerId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: params.retainerId,
        clientName: "Acme Corp",
        periodStart: "2025-07-01T00:00:00Z",
        periodEnd: "2025-07-31T23:59:59Z",
        totalBudget: 1500000,
        spentBudget: 875000,
        remainingBudget: 625000,
        totalHours: 80,
        spentHours: 52.5,
        remainingHours: 27.5,
        utilizationPercent: 58.3,
        daysRemaining: 12,
        projectedOverage: false,
        status: "ACTIVE",
      },
    };
  },
};

// ---------------------------------------------------------------------------
// updateRetainerPeriod
// ---------------------------------------------------------------------------

export const updateRetainerPeriod: ToolDefinition = {
  name: "updateRetainerPeriod",
  description: "Update a retainer period's budget, hours, or dates",
  parameters: {
    type: "object",
    properties: {
      retainerId: { type: "string", description: "Retainer period ID" },
      totalBudget: { type: "number", description: "Updated total budget" },
      totalHours: { type: "number", description: "Updated total hours" },
      periodEnd: { type: "string", description: "Updated end date" },
      status: { type: "string", description: "Updated status", enum: ["ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"] },
    },
    required: ["retainerId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: params.retainerId,
        ...params,
        updatedAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// getRetainerBurnRate
// ---------------------------------------------------------------------------

export const getRetainerBurnRate: ToolDefinition = {
  name: "getRetainerBurnRate",
  description: "Calculate the burn rate for a retainer period with projections",
  parameters: {
    type: "object",
    properties: {
      retainerId: { type: "string", description: "Retainer period ID" },
      granularity: { type: "string", description: "Time granularity", enum: ["DAILY", "WEEKLY", "MONTHLY"] },
    },
    required: ["retainerId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        retainerId: params.retainerId,
        granularity: params.granularity || "WEEKLY",
        averageDailyBurn: 43750,
        averageWeeklyBurn: 218750,
        projectedTotalSpend: 1356250,
        projectedEndDate: "2025-07-28T00:00:00Z",
        isOnTrack: true,
        burnHistory: [
          { period: "2025-07-01 - 2025-07-07", spent: 195000, hours: 12.5 },
          { period: "2025-07-08 - 2025-07-14", spent: 232000, hours: 14.0 },
          { period: "2025-07-15 - 2025-07-21", spent: 248000, hours: 15.5 },
        ],
      },
    };
  },
};

// ---------------------------------------------------------------------------
// listRetainerPeriods
// ---------------------------------------------------------------------------

export const listRetainerPeriods: ToolDefinition = {
  name: "listRetainerPeriods",
  description: "List retainer periods with optional filters by client or status",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Filter by client" },
      status: { type: "string", description: "Filter by status", enum: ["ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"] },
    },
    required: ["orgId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: [
        { id: "ret_001", clientName: "Acme Corp", periodStart: "2025-07-01", periodEnd: "2025-07-31", totalBudget: 1500000, spentBudget: 875000, utilizationPercent: 58.3, status: "ACTIVE" },
        { id: "ret_002", clientName: "GlobalTech", periodStart: "2025-07-01", periodEnd: "2025-09-30", totalBudget: 4500000, spentBudget: 1200000, utilizationPercent: 26.7, status: "ACTIVE" },
        { id: "ret_003", clientName: "StartupXYZ", periodStart: "2025-06-01", periodEnd: "2025-06-30", totalBudget: 800000, spentBudget: 780000, utilizationPercent: 97.5, status: "COMPLETED" },
      ],
    };
  },
};
