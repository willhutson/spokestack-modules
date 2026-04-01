/**
 * CRM Enhanced Deal Tools
 *
 * Each tool conforms to the SDK ToolDefinition type.
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// manageDealContacts
// ---------------------------------------------------------------------------

const manageDealContactsHandler: ToolHandler = async (params, context) => {
  const action = params.action as string;
  if (action === "add") {
    return {
      success: true,
      data: {
        id: `deal_contact_${Date.now()}`,
        dealId: params.dealId,
        contactId: params.contactId,
        role: params.role || "END_USER",
        isPrimary: params.isPrimary || false,
        createdAt: new Date().toISOString(),
      },
    };
  }
  if (action === "remove") {
    return {
      success: true,
      data: {
        dealId: params.dealId,
        contactId: params.contactId,
        removed: true,
      },
    };
  }
  // list
  return {
    success: true,
    data: {
      dealContacts: [],
      dealId: params.dealId,
      total: 0,
    },
  };
};

export const manageDealContacts: ToolDefinition = {
  name: "manageDealContacts",
  description: "Add, remove, or list contacts associated with a deal, including their roles.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Action to perform",
        enum: ["add", "remove", "list"],
      },
      dealId: { type: "string", description: "Deal ID" },
      contactId: { type: "string", description: "Contact ID (required for add/remove)" },
      role: {
        type: "string",
        description: "Contact role in the deal",
        enum: ["DECISION_MAKER", "INFLUENCER", "CHAMPION", "END_USER", "GATEKEEPER"],
      },
      isPrimary: { type: "boolean", description: "Whether this is the primary contact" },
    },
    required: ["action", "dealId"],
  },
  handler: manageDealContactsHandler,
};

// ---------------------------------------------------------------------------
// manageDealProducts
// ---------------------------------------------------------------------------

const manageDealProductsHandler: ToolHandler = async (params, context) => {
  const action = params.action as string;
  if (action === "add") {
    return {
      success: true,
      data: {
        id: `deal_product_${Date.now()}`,
        dealId: params.dealId,
        productId: params.productId,
        name: params.name,
        quantity: params.quantity || 1,
        unitPrice: params.unitPrice || 0,
        discount: params.discount || 0,
        createdAt: new Date().toISOString(),
      },
    };
  }
  if (action === "remove") {
    return {
      success: true,
      data: {
        dealId: params.dealId,
        productId: params.productId,
        removed: true,
      },
    };
  }
  // list
  return {
    success: true,
    data: {
      dealProducts: [],
      dealId: params.dealId,
      total: 0,
    },
  };
};

export const manageDealProducts: ToolDefinition = {
  name: "manageDealProducts",
  description: "Add, remove, or list products associated with a deal.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Action to perform",
        enum: ["add", "remove", "list"],
      },
      dealId: { type: "string", description: "Deal ID" },
      productId: { type: "string", description: "Product ID" },
      name: { type: "string", description: "Product name" },
      quantity: { type: "number", description: "Quantity", minimum: 1 },
      unitPrice: { type: "number", description: "Unit price", minimum: 0 },
      discount: { type: "number", description: "Discount percentage", minimum: 0, maximum: 100 },
      isRecurring: { type: "boolean", description: "Whether the product is a recurring charge" },
      billingPeriod: { type: "string", description: "Billing period (e.g. monthly, annual)" },
    },
    required: ["action", "dealId"],
  },
  handler: manageDealProductsHandler,
};

// ---------------------------------------------------------------------------
// trackDealCompetitors
// ---------------------------------------------------------------------------

const trackDealCompetitorsHandler: ToolHandler = async (params, context) => {
  const action = params.action as string;
  if (action === "add") {
    return {
      success: true,
      data: {
        id: `deal_competitor_${Date.now()}`,
        dealId: params.dealId,
        competitorId: params.competitorId,
        name: params.name,
        strengthsWeaknesses: params.strengthsWeaknesses,
        pricing: params.pricing,
        status: params.status,
        createdAt: new Date().toISOString(),
      },
    };
  }
  if (action === "update") {
    return {
      success: true,
      data: {
        id: params.id,
        dealId: params.dealId,
        ...params,
        updatedAt: new Date().toISOString(),
      },
    };
  }
  // list
  return {
    success: true,
    data: {
      dealCompetitors: [],
      dealId: params.dealId,
      total: 0,
    },
  };
};

export const trackDealCompetitors: ToolDefinition = {
  name: "trackDealCompetitors",
  description: "Add, update, or list competitors associated with a deal.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Action to perform",
        enum: ["add", "update", "list"],
      },
      dealId: { type: "string", description: "Deal ID" },
      id: { type: "string", description: "Deal competitor record ID (for update)" },
      competitorId: { type: "string", description: "Competitor ID" },
      name: { type: "string", description: "Competitor name" },
      strengthsWeaknesses: { type: "string", description: "Competitor strengths and weaknesses" },
      pricing: { type: "string", description: "Competitor pricing information" },
      status: { type: "string", description: "Competition status" },
    },
    required: ["action", "dealId"],
  },
  handler: trackDealCompetitorsHandler,
};

// ---------------------------------------------------------------------------
// getDealStageHistory
// ---------------------------------------------------------------------------

const getDealStageHistoryHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      dealId: params.dealId,
      history: [],
      total: 0,
    },
  };
};

export const getDealStageHistory: ToolDefinition = {
  name: "getDealStageHistory",
  description: "Retrieve the stage transition history for a deal.",
  parameters: {
    type: "object",
    properties: {
      dealId: { type: "string", description: "Deal ID" },
    },
    required: ["dealId"],
  },
  handler: getDealStageHistoryHandler,
};
