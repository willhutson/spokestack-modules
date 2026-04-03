/**
 * Workflow Module Template — generates automation modules with triggers and actions.
 */

import type { ModulePackage, MarketplaceToolDefinition } from "../types/marketplace";
import * as crypto from "crypto";

export type TriggerType = "status_change" | "date_reached" | "field_updated" | "record_created" | "manual";

export interface WorkflowAction {
  name: string;
  description: string;
  entityType: string;
}

export interface WorkflowModuleOptions {
  name: string;
  slug: string;
  moduleType: string;
  triggerType: TriggerType;
  actions: WorkflowAction[];
  description?: string;
  category?: string;
  industry?: string;
  pricing?: { type: "free" | "paid" | "subscription"; priceCents?: number; monthlyPriceCents?: number };
}

export function createWorkflowModule(options: WorkflowModuleOptions): ModulePackage {
  const { name, slug, moduleType, triggerType, actions, category = "Operations", industry, pricing = { type: "free" } } = options;

  const tools: MarketplaceToolDefinition[] = [
    { name: "list_workflows", description: "List all automated workflows", method: "GET", path: "/api/v1/context", parameters: { category: { type: "string", description: "Filter", enum: ["workflow"] } } },
    { name: "create_workflow", description: "Create a new automation workflow", method: "POST", path: "/api/v1/context", parameters: { name: { type: "string", description: "Workflow name", required: true }, trigger: { type: "string", description: `Trigger: ${triggerType}`, required: true }, condition: { type: "string", description: "Filter condition" }, action: { type: "string", description: "Action when triggered", required: true }, category: { type: "string", enum: ["workflow"] } } },
    { name: "activate_workflow", description: "Activate or deactivate a workflow", method: "PATCH", path: "/api/v1/context/{id}", parameters: { id: { type: "string", description: "Workflow ID", required: true }, active: { type: "boolean", description: "true=activate, false=pause", required: true } } },
    { name: "delete_workflow", description: "Delete a workflow", method: "DELETE", path: "/api/v1/context/{id}", parameters: { id: { type: "string", description: "Workflow ID", required: true } } },
    ...actions.map(action => ({
      name: action.name,
      description: action.description,
      method: "POST" as const,
      path: `/api/v1/${action.entityType}s`,
      parameters: { title: { type: "string" as const, description: `Title for the ${action.entityType}`, required: true }, notes: { type: "string" as const, description: "Additional notes" } },
    })),
  ];

  const actionList = actions.map(a => `- \`${a.name}\`: ${a.description}`).join("\n");

  const systemPrompt = `You design and manage automated workflows. You help teams create trigger-based automations that reduce manual work.

## Workflow anatomy

Every workflow has: Trigger (${triggerType}), Condition (optional filter), Action (what happens).

## Available actions

${actionList}

## Guidelines

Confirm all three parts (trigger, condition, action) before creating. Present workflows clearly with status.`;

  const manifest = {
    name, slug, moduleType,
    description: options.description || `Automate your team's workflows with trigger-based actions.`,
    shortDescription: `Workflow automation with ${triggerType.replace("_", " ")} triggers.`,
    category, ...(industry && { industry }), version: "1.0.0",
  };

  const canonicalPayload = JSON.stringify({ manifest, tools, systemPrompt, pricing }, null, 0);
  const hash = crypto.createHash("sha256").update(canonicalPayload).digest("hex");

  return { manifest, tools, systemPrompt, pricing, hash, packagedAt: new Date().toISOString() };
}
