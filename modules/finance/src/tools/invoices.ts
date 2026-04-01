/**
 * Finance Tools — Invoicing
 *
 * Tools for creating, listing, updating, and tracking invoices and payments.
 * Handlers are stubs for Phase 2; real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createInvoice
// ---------------------------------------------------------------------------

const createInvoiceHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      id: `inv_${Date.now()}`,
      organizationId: context.organizationId,
      clientId: params.clientId,
      status: "DRAFT",
      total: 5000,
      currency: params.currency || "USD",
      dueDate: params.dueDate || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createInvoice: ToolDefinition = {
  name: "createInvoice",
  description: "Create a new invoice with line items for a client",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Client ID to invoice" },
      lineItems: {
        type: "string",
        description:
          "JSON array of line items, each with description, quantity, unitPrice",
      },
      currency: { type: "string", description: "Currency code (default USD)" },
      dueDate: {
        type: "string",
        description: "Due date in ISO 8601 format",
      },
      notes: { type: "string", description: "Additional notes for the invoice" },
      reference: {
        type: "string",
        description: "External reference number",
      },
    },
    required: ["orgId", "clientId", "lineItems"],
  },
  handler: createInvoiceHandler,
};

// ---------------------------------------------------------------------------
// listInvoices
// ---------------------------------------------------------------------------

const listInvoicesHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      invoices: [
        {
          id: "inv_001",
          clientName: "Acme Corp",
          total: 5000,
          status: "SENT",
          dueDate: "2025-04-30",
        },
      ],
      total: 18,
      page: params.page || 1,
      limit: params.limit || 20,
    },
  };
};

export const listInvoices: ToolDefinition = {
  name: "listInvoices",
  description: "List invoices with optional status and date filters",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Filter by client ID" },
      status: {
        type: "string",
        description: "Filter by invoice status",
        enum: ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"],
      },
      startDate: {
        type: "string",
        description: "Filter invoices created on or after this date",
      },
      endDate: {
        type: "string",
        description: "Filter invoices created on or before this date",
      },
      page: { type: "number", description: "Page number for pagination" },
      limit: { type: "number", description: "Items per page (default 20)" },
    },
    required: ["orgId"],
  },
  handler: listInvoicesHandler,
};

// ---------------------------------------------------------------------------
// getInvoice
// ---------------------------------------------------------------------------

const getInvoiceHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.invoiceId,
      clientId: "client_001",
      clientName: "Acme Corp",
      status: "SENT",
      lineItems: [
        {
          description: "Web Design",
          quantity: 1,
          unitPrice: 5000,
          total: 5000,
        },
      ],
      total: 5000,
      currency: "USD",
      dueDate: "2025-04-30",
      createdAt: new Date().toISOString(),
    },
  };
};

export const getInvoice: ToolDefinition = {
  name: "getInvoice",
  description: "Get a single invoice with full line item details",
  parameters: {
    type: "object",
    properties: {
      invoiceId: { type: "string", description: "Invoice ID to retrieve" },
    },
    required: ["invoiceId"],
  },
  handler: getInvoiceHandler,
};

// ---------------------------------------------------------------------------
// updateInvoiceStatus
// ---------------------------------------------------------------------------

const updateInvoiceStatusHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.invoiceId,
      status: params.status,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const updateInvoiceStatus: ToolDefinition = {
  name: "updateInvoiceStatus",
  description:
    "Update the status of an invoice (DRAFT, SENT, PAID, OVERDUE, CANCELLED)",
  parameters: {
    type: "object",
    properties: {
      invoiceId: { type: "string", description: "Invoice ID to update" },
      status: {
        type: "string",
        description: "New invoice status",
        enum: ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"],
      },
      notes: {
        type: "string",
        description: "Optional notes about the status change",
      },
    },
    required: ["invoiceId", "status"],
  },
  handler: updateInvoiceStatusHandler,
};

// ---------------------------------------------------------------------------
// trackPayment
// ---------------------------------------------------------------------------

const trackPaymentHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      invoiceId: params.invoiceId,
      amountPaid: params.amount,
      status: "PAID",
      paidAt: params.paymentDate,
    },
  };
};

export const trackPayment: ToolDefinition = {
  name: "trackPayment",
  description: "Record a payment against an invoice",
  parameters: {
    type: "object",
    properties: {
      invoiceId: {
        type: "string",
        description: "Invoice ID to record payment against",
      },
      amount: { type: "number", description: "Payment amount" },
      paymentDate: {
        type: "string",
        description: "Date of payment in ISO 8601 format",
      },
      paymentMethod: {
        type: "string",
        description: "Payment method used",
        enum: ["BANK_TRANSFER", "CARD", "CASH", "OTHER"],
      },
      reference: {
        type: "string",
        description: "Payment reference or transaction ID",
      },
    },
    required: ["invoiceId", "amount", "paymentDate"],
  },
  handler: trackPaymentHandler,
};

// ---------------------------------------------------------------------------
// getFinancialSummary
// ---------------------------------------------------------------------------

const getFinancialSummaryHandler: ToolHandler = async (
  _params,
  _context,
) => {
  return {
    success: true,
    data: {
      totalInvoiced: 125000,
      totalPaid: 98000,
      totalOutstanding: 27000,
      overdueAmount: 8500,
      topClients: [
        { clientId: "client_001", clientName: "Acme Corp", total: 35000 },
      ],
      monthlyRevenue: [
        { month: "2025-01", revenue: 42000 },
        { month: "2025-02", revenue: 45000 },
      ],
    },
  };
};

export const getFinancialSummary: ToolDefinition = {
  name: "getFinancialSummary",
  description:
    "Get financial overview with total revenue, outstanding amounts, and top clients",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      startDate: {
        type: "string",
        description: "Start date for summary period",
      },
      endDate: {
        type: "string",
        description: "End date for summary period",
      },
    },
    required: ["orgId"],
  },
  handler: getFinancialSummaryHandler,
};
