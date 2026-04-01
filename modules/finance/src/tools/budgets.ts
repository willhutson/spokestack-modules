/**
 * Finance Tools — Budgets
 *
 * Tools for setting, listing, tracking, and summarizing budgets.
 * Handlers are stubs for Phase 2; real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// setBudget
// ---------------------------------------------------------------------------

const setBudgetHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      id: `budget_${Date.now()}`,
      organizationId: context.organizationId,
      name: params.name,
      amount: params.amount,
      spent: 0,
      remaining: params.amount,
      period: params.period || "MONTHLY",
      createdAt: new Date().toISOString(),
    },
  };
};

export const setBudget: ToolDefinition = {
  name: "setBudget",
  description: "Create or update a budget record for an organization or department",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Budget name" },
      amount: { type: "number", description: "Budget amount" },
      currency: { type: "string", description: "Currency code (default USD)" },
      period: {
        type: "string",
        description: "Budget period",
        enum: ["MONTHLY", "QUARTERLY", "ANNUAL"],
      },
      category: { type: "string", description: "Budget category (e.g. operations, marketing)" },
      startDate: { type: "string", description: "Budget start date in ISO 8601 format" },
      endDate: { type: "string", description: "Budget end date in ISO 8601 format" },
      notes: { type: "string", description: "Additional notes about the budget" },
    },
    required: ["orgId", "name", "amount"],
  },
  handler: setBudgetHandler,
};

// ---------------------------------------------------------------------------
// listBudgets
// ---------------------------------------------------------------------------

const listBudgetsHandler: ToolHandler = async (_params, _context) => {
  return {
    success: true,
    data: {
      budgets: [],
      total: 0,
    },
  };
};

export const listBudgets: ToolDefinition = {
  name: "listBudgets",
  description: "List budgets with optional category and period filters",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      category: { type: "string", description: "Filter by budget category" },
      period: {
        type: "string",
        description: "Filter by budget period",
        enum: ["MONTHLY", "QUARTERLY", "ANNUAL"],
      },
      year: { type: "number", description: "Filter by year" },
    },
    required: ["orgId"],
  },
  handler: listBudgetsHandler,
};

// ---------------------------------------------------------------------------
// trackBudgetSpend
// ---------------------------------------------------------------------------

const trackBudgetSpendHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      budgetId: params.budgetId,
      totalSpent: params.amount,
      remaining: 5000,
      utilizationPercent: 45,
    },
  };
};

export const trackBudgetSpend: ToolDefinition = {
  name: "trackBudgetSpend",
  description: "Record spend against a budget and get updated utilization",
  parameters: {
    type: "object",
    properties: {
      budgetId: { type: "string", description: "Budget ID to record spend against" },
      amount: { type: "number", description: "Spend amount to record" },
      description: { type: "string", description: "Description of the expense" },
      date: { type: "string", description: "Date of the expense in ISO 8601 format" },
    },
    required: ["budgetId", "amount", "description"],
  },
  handler: trackBudgetSpendHandler,
};

// ---------------------------------------------------------------------------
// getBudgetSummary
// ---------------------------------------------------------------------------

const getBudgetSummaryHandler: ToolHandler = async (_params, _context) => {
  return {
    success: true,
    data: {
      totalBudget: 50000,
      totalSpent: 22500,
      utilizationPercent: 45,
      byCategory: {
        operations: { budget: 15000, spent: 8000 },
        marketing: { budget: 20000, spent: 10500 },
        technology: { budget: 15000, spent: 4000 },
      },
    },
  };
};

export const getBudgetSummary: ToolDefinition = {
  name: "getBudgetSummary",
  description: "Get budget utilization overview across all categories",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      period: {
        type: "string",
        description: "Filter by budget period",
        enum: ["MONTHLY", "QUARTERLY", "ANNUAL"],
      },
      year: { type: "number", description: "Filter by year" },
    },
    required: ["orgId"],
  },
  handler: getBudgetSummaryHandler,
};
