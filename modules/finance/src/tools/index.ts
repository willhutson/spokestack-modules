/**
 * Finance Tools — barrel export
 *
 * All Finance tools conforming to the SDK ToolDefinition type.
 * Tool handlers are stubs for Phase 2; real data layer is Phase 3.
 */

export {
  createInvoice,
  listInvoices,
  getInvoice,
  updateInvoiceStatus,
  trackPayment,
  getFinancialSummary,
} from "./invoices";
export { setBudget, listBudgets, trackBudgetSpend, getBudgetSummary } from "./budgets";
export { forecastRevenue, getRevenueMetrics, listForecastScenarios } from "./forecast";
export { createRetainerPeriod, getRetainerStatus, updateRetainerPeriod, getRetainerBurnRate, listRetainerPeriods } from "./retainers";

import {
  createInvoice,
  listInvoices,
  getInvoice,
  updateInvoiceStatus,
  trackPayment,
  getFinancialSummary,
} from "./invoices";
import { setBudget, listBudgets, trackBudgetSpend, getBudgetSummary } from "./budgets";
import { forecastRevenue, getRevenueMetrics, listForecastScenarios } from "./forecast";
import { createRetainerPeriod, getRetainerStatus, updateRetainerPeriod, getRetainerBurnRate, listRetainerPeriods } from "./retainers";
import type { ToolDefinition } from "../../../../sdk/types/index";

/** All Finance tools as an array for registration */
export const allFinanceTools: ToolDefinition[] = [
  // Invoicing
  createInvoice,
  listInvoices,
  getInvoice,
  updateInvoiceStatus,
  trackPayment,
  getFinancialSummary,
  // Budgets
  setBudget,
  listBudgets,
  trackBudgetSpend,
  getBudgetSummary,
  // Forecasting
  forecastRevenue,
  getRevenueMetrics,
  listForecastScenarios,
  // Retainers
  createRetainerPeriod,
  getRetainerStatus,
  updateRetainerPeriod,
  getRetainerBurnRate,
  listRetainerPeriods,
];

/** Tool names for manifest and agent definition reference */
export const FINANCE_TOOL_NAMES = allFinanceTools.map((t) => t.name);

/** Alias for test compatibility */
export const allToolNames = FINANCE_TOOL_NAMES;
