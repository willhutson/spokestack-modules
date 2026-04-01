/**
 * CRM Contact Management Tools
 *
 * Each tool conforms to the SDK ToolDefinition type.
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 * In production, handlers call through to spokestack-core's CRM API.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createContact
// ---------------------------------------------------------------------------

const createContactHandler: ToolHandler = async (params, context) => {
  // Phase 2 stub — returns mock data
  // Phase 3: POST ${context.coreUrl}/api/v1/crm/contacts
  return {
    success: true,
    data: {
      id: `contact_${Date.now()}`,
      organizationId: context.organizationId,
      ...params,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createContact: ToolDefinition = {
  name: "createContact",
  description: "Create a new contact in the CRM with name, email, phone, company, and other details.",
  parameters: {
    type: "object",
    properties: {
      firstName: { type: "string", description: "Contact's first name" },
      lastName: { type: "string", description: "Contact's last name" },
      email: { type: "string", description: "Email address" },
      phone: { type: "string", description: "Phone number" },
      company: { type: "string", description: "Company name" },
      jobTitle: { type: "string", description: "Job title" },
      source: {
        type: "string",
        description: "Lead source",
        enum: ["website", "referral", "cold-outreach", "event", "agent", "other"],
      },
      status: {
        type: "string",
        description: "Contact status",
        enum: ["lead", "active", "customer", "inactive"],
      },
    },
    required: ["firstName"],
  },
  handler: createContactHandler,
};

// ---------------------------------------------------------------------------
// listContacts
// ---------------------------------------------------------------------------

const listContactsHandler: ToolHandler = async (params, context) => {
  // Phase 2 stub
  return {
    success: true,
    data: {
      contacts: [],
      total: 0,
      page: (params.page as number) || 1,
      pageSize: (params.pageSize as number) || 20,
    },
  };
};

export const listContacts: ToolDefinition = {
  name: "listContacts",
  description: "List and search CRM contacts with optional filters for status, company, and text search.",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query (matches name, email, company)" },
      status: {
        type: "string",
        description: "Filter by contact status",
        enum: ["lead", "active", "customer", "inactive"],
      },
      company: { type: "string", description: "Filter by company name" },
      page: { type: "number", description: "Page number (default 1)", minimum: 1 },
      pageSize: { type: "number", description: "Results per page (default 20)", minimum: 1, maximum: 100 },
    },
  },
  handler: listContactsHandler,
};

// ---------------------------------------------------------------------------
// updateContact
// ---------------------------------------------------------------------------

const updateContactHandler: ToolHandler = async (params, context) => {
  // Phase 2 stub
  const { contactId, ...updates } = params;
  return {
    success: true,
    data: {
      id: contactId,
      organizationId: context.organizationId,
      ...updates,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const updateContact: ToolDefinition = {
  name: "updateContact",
  description: "Update an existing contact's details such as name, email, phone, company, status, or lead score.",
  parameters: {
    type: "object",
    properties: {
      contactId: { type: "string", description: "ID of the contact to update" },
      firstName: { type: "string", description: "Updated first name" },
      lastName: { type: "string", description: "Updated last name" },
      email: { type: "string", description: "Updated email" },
      phone: { type: "string", description: "Updated phone number" },
      company: { type: "string", description: "Updated company name" },
      jobTitle: { type: "string", description: "Updated job title" },
      status: {
        type: "string",
        description: "Updated contact status",
        enum: ["lead", "active", "customer", "inactive"],
      },
      score: { type: "number", description: "Lead score (0-100)", minimum: 0, maximum: 100 },
    },
    required: ["contactId"],
  },
  handler: updateContactHandler,
};
