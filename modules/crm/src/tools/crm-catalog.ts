/**
 * CRM Catalog & Campaign Tools
 *
 * Each tool conforms to the SDK ToolDefinition type.
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// manageProducts
// ---------------------------------------------------------------------------

const manageProductsHandler: ToolHandler = async (params, context) => {
  const action = params.action as string;
  if (action === "create") {
    return {
      success: true,
      data: {
        id: `product_${Date.now()}`,
        organizationId: context.organizationId,
        ...params,
        isActive: params.isActive ?? true,
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
      products: [],
      total: 0,
    },
  };
};

export const manageProducts: ToolDefinition = {
  name: "manageProducts",
  description: "Create, update, or list products in the CRM product catalog.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Action to perform",
        enum: ["create", "update", "list"],
      },
      id: { type: "string", description: "Product ID (required for update)" },
      name: { type: "string", description: "Product name" },
      code: { type: "string", description: "Product code" },
      description: { type: "string", description: "Product description" },
      unitPrice: { type: "number", description: "Unit price", minimum: 0 },
      currency: { type: "string", description: "Currency code" },
      productType: {
        type: "string",
        description: "Product type",
        enum: ["SERVICE", "PRODUCT", "SUBSCRIPTION"],
      },
      isRecurring: { type: "boolean", description: "Whether the product is recurring" },
      billingPeriod: { type: "string", description: "Billing period (e.g. monthly, annual)" },
      isActive: { type: "boolean", description: "Whether the product is active" },
    },
    required: ["action"],
  },
  handler: manageProductsHandler,
};

// ---------------------------------------------------------------------------
// manageCompetitors
// ---------------------------------------------------------------------------

const manageCompetitorsHandler: ToolHandler = async (params, context) => {
  const action = params.action as string;
  if (action === "create") {
    return {
      success: true,
      data: {
        id: `competitor_${Date.now()}`,
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
      competitors: [],
      total: 0,
    },
  };
};

export const manageCompetitors: ToolDefinition = {
  name: "manageCompetitors",
  description: "Create, update, or list competitor records in the CRM.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Action to perform",
        enum: ["create", "update", "list"],
      },
      id: { type: "string", description: "Competitor ID (required for update)" },
      name: { type: "string", description: "Competitor name" },
      website: { type: "string", description: "Competitor website URL" },
      description: { type: "string", description: "Competitor description" },
      strengths: { type: "array", description: "List of strengths", items: { type: "string" } },
      weaknesses: { type: "array", description: "List of weaknesses", items: { type: "string" } },
      marketPosition: { type: "string", description: "Market position" },
      pricePosition: { type: "string", description: "Price positioning" },
    },
    required: ["action"],
  },
  handler: manageCompetitorsHandler,
};

// ---------------------------------------------------------------------------
// manageCRMCampaigns
// ---------------------------------------------------------------------------

const manageCRMCampaignsHandler: ToolHandler = async (params, context) => {
  const action = params.action as string;
  if (action === "create") {
    return {
      success: true,
      data: {
        id: `campaign_${Date.now()}`,
        organizationId: context.organizationId,
        ...params,
        status: (params.status as string) || "DRAFT",
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
      campaigns: [],
      total: 0,
    },
  };
};

export const manageCRMCampaigns: ToolDefinition = {
  name: "manageCRMCampaigns",
  description: "Create, update, or list marketing campaigns in the CRM.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Action to perform",
        enum: ["create", "update", "list"],
      },
      id: { type: "string", description: "Campaign ID (required for update)" },
      name: { type: "string", description: "Campaign name" },
      description: { type: "string", description: "Campaign description" },
      campaignType: {
        type: "string",
        description: "Campaign type",
        enum: ["EMAIL", "SOCIAL", "EVENT", "CONTENT", "REFERRAL", "ABM"],
      },
      channels: { type: "array", description: "Distribution channels", items: { type: "string" } },
      status: {
        type: "string",
        description: "Campaign status",
        enum: ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"],
      },
      startDate: { type: "string", description: "Start date (ISO 8601)" },
      endDate: { type: "string", description: "End date (ISO 8601)" },
      budgetAmount: { type: "number", description: "Budget amount", minimum: 0 },
      clientId: { type: "string", description: "Associated client ID" },
      ownerId: { type: "string", description: "Campaign owner user ID" },
    },
    required: ["action"],
  },
  handler: manageCRMCampaignsHandler,
};

// ---------------------------------------------------------------------------
// manageRetainerPeriods
// ---------------------------------------------------------------------------

const manageRetainerPeriodsHandler: ToolHandler = async (params, context) => {
  const action = params.action as string;
  if (action === "get") {
    return {
      success: true,
      data: {
        id: params.id,
        clientId: params.clientId,
        year: params.year,
        month: params.month,
        budgetHours: 0,
        budgetValue: 0,
        actualHours: 0,
        actualCost: 0,
        status: "ACTIVE",
      },
    };
  }
  if (action === "update") {
    const { id, ...updates } = params;
    return {
      success: true,
      data: {
        id,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    };
  }
  // list
  return {
    success: true,
    data: {
      retainerPeriods: [],
      total: 0,
    },
  };
};

export const manageRetainerPeriods: ToolDefinition = {
  name: "manageRetainerPeriods",
  description: "Get, update, or list retainer periods for client billing and time tracking.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Action to perform",
        enum: ["get", "update", "list"],
      },
      id: { type: "string", description: "Retainer period ID" },
      clientId: { type: "string", description: "Client ID" },
      year: { type: "number", description: "Year" },
      month: { type: "number", description: "Month (1-12)", minimum: 1, maximum: 12 },
      budgetHours: { type: "number", description: "Budgeted hours", minimum: 0 },
      budgetValue: { type: "number", description: "Budgeted value", minimum: 0 },
      actualHours: { type: "number", description: "Actual hours used", minimum: 0 },
      actualCost: { type: "number", description: "Actual cost incurred", minimum: 0 },
      status: {
        type: "string",
        description: "Period status",
        enum: ["ACTIVE", "CLOSED", "INVOICED"],
      },
    },
    required: ["action"],
  },
  handler: manageRetainerPeriodsHandler,
};
