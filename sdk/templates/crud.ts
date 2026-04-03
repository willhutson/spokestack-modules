/**
 * CRUD Module Template — generates a complete module package for entity management.
 */

import type { ModulePackage, MarketplaceToolDefinition, ParameterDefinition } from "../types/marketplace";
import * as crypto from "crypto";

export interface CrudField {
  name: string;
  type: "string" | "number" | "boolean";
  required?: boolean;
  description?: string;
  enum?: string[];
}

export interface CrudModuleOptions {
  name: string;
  slug: string;
  moduleType: string;
  entityName: string;
  entityNamePlural: string;
  fields: CrudField[];
  category?: string;
  industry?: string;
  description?: string;
  pricing?: { type: "free" | "paid" | "subscription"; priceCents?: number; monthlyPriceCents?: number };
}

export function createCrudModule(options: CrudModuleOptions): ModulePackage {
  const { name, slug, moduleType, entityName, entityNamePlural, fields, category = "Operations", industry, description, pricing = { type: "free" } } = options;
  const basePath = `/api/v1/${entityNamePlural}`;

  const fieldParams: Record<string, ParameterDefinition> = {};
  for (const field of fields) {
    fieldParams[field.name] = {
      type: field.type,
      description: field.description || `The ${field.name} of the ${entityName}`,
      required: field.required,
      ...(field.enum && { enum: field.enum }),
    };
  }

  const idParam: Record<string, ParameterDefinition> = {
    id: { type: "string", description: `The ID of the ${entityName}`, required: true },
  };

  const tools: MarketplaceToolDefinition[] = [
    { name: `list_${entityNamePlural}`, description: `List all ${entityNamePlural} for the current organization`, method: "GET", path: basePath, parameters: {}, returns: { description: `Array of ${entityName} records` } },
    { name: `get_${entityName}`, description: `Get a specific ${entityName} by ID`, method: "GET", path: `${basePath}/{id}`, parameters: idParam, returns: { description: `The ${entityName} record` } },
    { name: `create_${entityName}`, description: `Create a new ${entityName}`, method: "POST", path: basePath, parameters: fieldParams, returns: { description: `The created ${entityName}` } },
    { name: `update_${entityName}`, description: `Update an existing ${entityName}`, method: "PATCH", path: `${basePath}/{id}`, parameters: { ...idParam, ...fieldParams }, returns: { description: `The updated ${entityName}` } },
    { name: `delete_${entityName}`, description: `Delete a ${entityName} by ID`, method: "DELETE", path: `${basePath}/{id}`, parameters: idParam, returns: { description: "Confirmation of deletion" } },
  ];

  const fieldList = fields.map(f => `- **${f.name}** (${f.type})${f.description ? `: ${f.description}` : ""}`).join("\n");

  const systemPrompt = `You manage ${entityNamePlural} for this organization. You help users create, view, update, and manage their ${entityName} records.

## What you can do

- List all ${entityNamePlural}
- Get details for a specific ${entityName}
- Create new ${entityNamePlural}
- Update existing ${entityNamePlural}
- Delete ${entityNamePlural} that are no longer needed

## ${entityName.charAt(0).toUpperCase() + entityName.slice(1)} fields

${fieldList}

## Guidelines

When the user asks to create a ${entityName}, collect all required fields before calling create_${entityName}. If optional fields are not mentioned, omit them.

When listing ${entityNamePlural}, present them in a clear, readable format.

When updating a ${entityName}, first confirm which fields to change. Then call update_${entityName} with only the changed fields.

Be concise and action-oriented. Confirm what was created or changed after each operation.`;

  const manifest = {
    name, slug, moduleType,
    description: description || `Manage your ${entityNamePlural} efficiently with AI assistance.`,
    shortDescription: `AI-powered ${entityName} management for your team.`,
    category, ...(industry && { industry }), version: "1.0.0",
  };

  const canonicalPayload = JSON.stringify({ manifest, tools, systemPrompt, pricing }, null, 0);
  const hash = crypto.createHash("sha256").update(canonicalPayload).digest("hex");

  return { manifest, tools, systemPrompt, pricing, hash, packagedAt: new Date().toISOString() };
}
