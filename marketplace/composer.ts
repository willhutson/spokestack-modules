/**
 * Schema Composer — composes core + module schemas at PUBLISH time
 * (not install time) to generate pre-built migration SQL.
 *
 * This runs during the module publishing process to validate that
 * module schemas are compatible with core and to pre-generate
 * the SQL migration that will be applied at install time.
 */

import * as fs from "fs";
import * as path from "path";

export interface CompositionResult {
  success: boolean;
  migrationSql?: string;
  composedSchema?: string;
  errors: string[];
}

export interface CompositionInput {
  coreSchemaPath: string;
  moduleSchemaPath: string;
  modulePrefix: string;
}

/**
 * Compose core and module schemas into a single Prisma schema,
 * then generate the migration SQL for the module's additions.
 */
export function composeSchemas(input: CompositionInput): CompositionResult {
  const errors: string[] = [];

  // 1. Read schemas
  let coreSchema: string;
  let moduleSchema: string;

  try {
    coreSchema = fs.readFileSync(input.coreSchemaPath, "utf-8");
  } catch {
    return { success: false, errors: ["Could not read core schema"] };
  }

  try {
    moduleSchema = fs.readFileSync(input.moduleSchemaPath, "utf-8");
  } catch {
    return { success: false, errors: ["Could not read module schema"] };
  }

  // 2. Validate module schema rules
  const moduleModels = extractModelNames(moduleSchema);
  for (const model of moduleModels) {
    if (!model.startsWith(input.modulePrefix)) {
      errors.push(`Model '${model}' must be prefixed with '${input.modulePrefix}'`);
    }
  }

  // Check for FK violations
  const moduleRelations = extractRelationFields(moduleSchema);
  const coreModels = new Set(extractModelNames(coreSchema));

  for (const { model, field, referencedModel } of moduleRelations) {
    if (coreModels.has(referencedModel) && field !== "organizationId") {
      // Module models should not have direct FKs to core models (except organizationId)
      errors.push(
        `${model}.${field} references core model ${referencedModel}. ` +
        `Only organizationId FK to core is allowed. Use ContextEntry for cross-model links.`,
      );
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  // 3. Extract module model blocks (strip generator and datasource)
  const moduleModelBlocks = extractModelBlocks(moduleSchema);

  // 4. Compose — append module models to core schema
  const composedSchema = `${coreSchema}\n\n// --- Module: ${input.modulePrefix} ---\n\n${moduleModelBlocks}`;

  // 5. Generate migration SQL (simplified — in production, use prisma migrate diff)
  const migrationSql = generateMigrationSql(moduleModels, moduleSchema);

  return {
    success: true,
    migrationSql,
    composedSchema,
    errors: [],
  };
}

function extractModelNames(schema: string): string[] {
  const matches = schema.match(/model\s+(\w+)\s*\{/g) || [];
  return matches.map((m) => m.match(/model\s+(\w+)/)![1]);
}

interface RelationInfo {
  model: string;
  field: string;
  referencedModel: string;
}

function extractRelationFields(schema: string): RelationInfo[] {
  const results: RelationInfo[] = [];
  const modelBlocks = schema.match(/model\s+(\w+)\s*\{([^}]+)\}/g) || [];

  for (const block of modelBlocks) {
    const modelName = block.match(/model\s+(\w+)/)![1];
    const relations = block.match(/(\w+)\s+(\w+)\s+@relation\(fields:\s*\[(\w+)\]/g) || [];

    for (const rel of relations) {
      const match = rel.match(/(\w+)\s+(\w+)\s+@relation\(fields:\s*\[(\w+)\]/);
      if (match) {
        results.push({
          model: modelName,
          field: match[3],
          referencedModel: match[2],
        });
      }
    }
  }

  return results;
}

function extractModelBlocks(schema: string): string {
  const lines = schema.split("\n");
  const result: string[] = [];
  let inModel = false;
  let braceCount = 0;

  for (const line of lines) {
    if (line.match(/^model\s+/)) {
      inModel = true;
      braceCount = 0;
    }

    if (inModel) {
      result.push(line);
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      if (braceCount === 0 && result.length > 1) {
        inModel = false;
        result.push("");
      }
    }
  }

  return result.join("\n");
}

function generateMigrationSql(modelNames: string[], schema: string): string {
  // Simplified SQL generation — in production, use Prisma's migration engine
  const statements: string[] = [
    `-- Auto-generated migration for module models`,
    `-- Generated at: ${new Date().toISOString()}`,
    ``,
  ];

  for (const model of modelNames) {
    const tableName = extractTableName(schema, model) || model.toLowerCase() + "s";
    statements.push(`-- Create table for ${model}`);
    statements.push(`CREATE TABLE IF NOT EXISTS "${tableName}" (`);
    statements.push(`  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),`);
    statements.push(`  "organizationId" UUID NOT NULL,`);
    statements.push(`  "deletedAt" TIMESTAMPTZ,`);
    statements.push(`  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),`);
    statements.push(`  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()`);
    statements.push(`);`);
    statements.push(`CREATE INDEX IF NOT EXISTS "idx_${tableName}_org" ON "${tableName}" ("organizationId");`);
    statements.push(``);
  }

  return statements.join("\n");
}

function extractTableName(schema: string, modelName: string): string | null {
  const regex = new RegExp(`model\\s+${modelName}\\s*\\{[^}]*@@map\\("(\\w+)"\\)`, "s");
  const match = schema.match(regex);
  return match ? match[1] : null;
}
