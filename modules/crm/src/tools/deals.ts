/**
 * CRM Deal Management Tools
 *
 * Each tool conforms to the SDK ToolDefinition type.
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createDeal
// ---------------------------------------------------------------------------

const createDealHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      id: `deal_${Date.now()}`,
      organizationId: context.organizationId,
      ...params,
      stage: (params.stage as string) || "lead",
      probability: (params.probability as number) || 10,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createDeal: ToolDefinition = {
  name: "createDeal",
  description: "Create a new deal in the sales pipeline with title, value, stage, and optional contact link.",
  parameters: {
    type: "object",
    properties: {
      title: { type: "string", description: "Deal title" },
      value: { type: "number", description: "Deal value in dollars", minimum: 0 },
      currency: { type: "string", description: "Currency code (default USD)" },
      stage: {
        type: "string",
        description: "Pipeline stage",
        enum: ["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"],
      },
      probability: { type: "number", description: "Win probability (0-100)", minimum: 0, maximum: 100 },
      contactId: { type: "string", description: "Associated contact ID" },
      expectedCloseDate: { type: "string", description: "Expected close date (ISO 8601)" },
    },
    required: ["title"],
  },
  handler: createDealHandler,
};

// ---------------------------------------------------------------------------
// updateDeal
// ---------------------------------------------------------------------------

const updateDealHandler: ToolHandler = async (params, context) => {
  const { dealId, ...updates } = params;
  return {
    success: true,
    data: {
      id: dealId,
      organizationId: context.organizationId,
      ...updates,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const updateDeal: ToolDefinition = {
  name: "updateDeal",
  description: "Update a deal's stage, value, probability, or other details.",
  parameters: {
    type: "object",
    properties: {
      dealId: { type: "string", description: "ID of the deal to update" },
      title: { type: "string", description: "Updated deal title" },
      value: { type: "number", description: "Updated deal value", minimum: 0 },
      stage: {
        type: "string",
        description: "New pipeline stage",
        enum: ["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"],
      },
      probability: { type: "number", description: "Updated win probability (0-100)", minimum: 0, maximum: 100 },
      lostReason: { type: "string", description: "Reason for loss (when moving to closed_lost)" },
      expectedCloseDate: { type: "string", description: "Updated expected close date" },
    },
    required: ["dealId"],
  },
  handler: updateDealHandler,
};

// ---------------------------------------------------------------------------
// listDeals
// ---------------------------------------------------------------------------

const listDealsHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      deals: [],
      total: 0,
      page: (params.page as number) || 1,
      pageSize: (params.pageSize as number) || 20,
    },
  };
};

export const listDeals: ToolDefinition = {
  name: "listDeals",
  description: "List and filter deals in the pipeline by stage, value range, or associated contact.",
  parameters: {
    type: "object",
    properties: {
      stage: {
        type: "string",
        description: "Filter by pipeline stage",
        enum: ["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"],
      },
      contactId: { type: "string", description: "Filter by associated contact" },
      minValue: { type: "number", description: "Minimum deal value", minimum: 0 },
      maxValue: { type: "number", description: "Maximum deal value", minimum: 0 },
      page: { type: "number", description: "Page number", minimum: 1 },
      pageSize: { type: "number", description: "Results per page", minimum: 1, maximum: 100 },
    },
  },
  handler: listDealsHandler,
};

// ---------------------------------------------------------------------------
// linkContactToDeal
// ---------------------------------------------------------------------------

const linkContactToDealHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      dealId: params.dealId,
      contactId: params.contactId,
      linkedAt: new Date().toISOString(),
    },
  };
};

export const linkContactToDeal: ToolDefinition = {
  name: "linkContactToDeal",
  description: "Associate a contact with a deal to track the relationship.",
  parameters: {
    type: "object",
    properties: {
      dealId: { type: "string", description: "Deal ID to link" },
      contactId: { type: "string", description: "Contact ID to associate" },
    },
    required: ["dealId", "contactId"],
  },
  handler: linkContactToDealHandler,
};
