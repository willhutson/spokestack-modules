/**
 * Per-module Stripe metered billing.
 * Manages subscriptions, metered usage, and billing lifecycle for modules.
 */

import type { ModulePricing } from "../sdk/types/manifest";

export interface BillingActivationParams {
  organizationId: string;
  moduleName: string;
  pricing: ModulePricing;
}

export interface BillingActivation {
  subscriptionId: string;
  status: "active" | "trialing";
  trialEnd?: string;
}

export interface UsageReport {
  moduleName: string;
  organizationId: string;
  quantity: number;
  timestamp: string;
}

/**
 * Activate billing for a module installation.
 * In production, this creates a Stripe subscription item.
 */
export async function activateBilling(params: BillingActivationParams): Promise<BillingActivation> {
  const { pricing } = params;

  // Free modules skip billing
  if (pricing.model === "free") {
    return { subscriptionId: "free", status: "active" };
  }

  // In production, this would:
  // 1. Retrieve org's Stripe customer ID
  // 2. Create a subscription item for this module
  // 3. Apply trial period if configured

  const now = new Date();
  const trialEnd = pricing.trialDays > 0
    ? new Date(now.getTime() + pricing.trialDays * 86400000).toISOString()
    : undefined;

  return {
    subscriptionId: `sub_placeholder_${params.moduleName}_${Date.now()}`,
    status: pricing.trialDays > 0 ? "trialing" : "active",
    trialEnd,
  };
}

/**
 * Report metered usage for billing.
 * Used by metered-pricing modules to report consumption.
 */
export async function reportUsage(report: UsageReport): Promise<void> {
  // In production, this would:
  // 1. Find the Stripe subscription item for this module
  // 2. Report usage via Stripe's Usage Records API
  console.log(`Usage reported: ${report.moduleName} — ${report.quantity} units`);
}

/**
 * Deactivate billing when a module is uninstalled.
 */
export async function deactivateBilling(
  organizationId: string,
  moduleName: string,
): Promise<void> {
  // In production, this would:
  // 1. Cancel the Stripe subscription item
  // 2. Prorate if applicable
  console.log(`Billing deactivated: ${moduleName} for org ${organizationId}`);
}
