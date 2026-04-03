/**
 * Dashboard Module Template — generates analytics/metrics modules.
 */

import type { ModulePackage, MarketplaceToolDefinition } from "../types/marketplace";
import * as crypto from "crypto";

export interface DashboardMetric {
  name: string;
  label: string;
  unit?: string;
  aggregation: "sum" | "count" | "avg" | "last";
  entityType: string;
  field?: string;
}

export interface DashboardModuleOptions {
  name: string;
  slug: string;
  moduleType: string;
  metrics: DashboardMetric[];
  description?: string;
  category?: string;
  industry?: string;
  pricing?: { type: "free" | "paid" | "subscription"; priceCents?: number; monthlyPriceCents?: number };
}

export function createDashboardModule(options: DashboardModuleOptions): ModulePackage {
  const { name, slug, moduleType, metrics, category = "Operations", industry, pricing = { type: "free" } } = options;

  const entityTypes = [...new Set(metrics.map(m => m.entityType))];

  const tools: MarketplaceToolDefinition[] = [
    ...entityTypes.map(entityType => ({
      name: `list_${entityType}`,
      description: `Retrieve ${entityType} records for metric calculation`,
      method: "GET" as const,
      path: `/api/v1/${entityType}`,
      parameters: {
        startDate: { type: "string" as const, description: "ISO date for range start" },
        endDate: { type: "string" as const, description: "ISO date for range end" },
      },
    })),
    {
      name: "get_dashboard_summary",
      description: "Get a summary of all key metrics",
      method: "GET",
      path: "/api/v1/context",
      parameters: { category: { type: "string", description: "Filter", enum: ["dashboard_summary"] } },
    },
  ];

  const metricList = metrics.map(m => `- **${m.label}**: ${m.aggregation} of ${m.entityType}.${m.field || "count"} (${m.unit || "count"})`).join("\n");

  const systemPrompt = `You provide analytics and insights. You retrieve data and calculate key metrics.

## Metrics

${metricList}

## Guidelines

When asked for an overview, retrieve all metrics and present them clearly. Default to current month if no range specified. Format numbers: currencies with symbols, percentages to one decimal.`;

  const manifest = {
    name, slug, moduleType,
    description: options.description || `Analytics dashboard for ${metrics.map(m => m.label).join(", ")}.`,
    shortDescription: `Real-time analytics for ${metrics.length} key metrics.`,
    category, ...(industry && { industry }), version: "1.0.0",
  };

  const canonicalPayload = JSON.stringify({ manifest, tools, systemPrompt, pricing }, null, 0);
  const hash = crypto.createHash("sha256").update(canonicalPayload).digest("hex");

  return { manifest, tools, systemPrompt, pricing, hash, packagedAt: new Date().toISOString() };
}
