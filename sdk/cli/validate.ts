/**
 * Module validation CLI — validates manifest, schema, and permissions.
 * Usage: pnpm sdk validate ./modules/crm
 */

import * as fs from "fs";
import * as path from "path";
import type { ModuleManifest } from "../types/manifest";
import { CORE_MODELS, CORE_SCHEMA_HASH } from "../../core-schema";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateModule(modulePath: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Check manifest exists
  const manifestPath = path.join(modulePath, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    return { valid: false, errors: ["manifest.json not found"], warnings };
  }

  let manifest: ModuleManifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  } catch {
    return { valid: false, errors: ["manifest.json is not valid JSON"], warnings };
  }

  // 2. Required fields
  const required: (keyof ModuleManifest)[] = [
    "name", "displayName", "description", "version", "author",
    "compatibility", "tier", "pricing", "schema", "agent",
    "surfaces", "permissions",
  ];
  for (const field of required) {
    if (!manifest[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // 3. Schema prefix check
  if (manifest.schema) {
    if (!manifest.schema.prefix) {
      errors.push("schema.prefix is required");
    } else if (!manifest.schema.prefix.endsWith("_")) {
      errors.push("schema.prefix must end with underscore (e.g. 'crm_')");
    }

    // Check models are prefixed
    for (const model of manifest.schema.models) {
      if (!model.startsWith(manifest.schema.prefix)) {
        errors.push(`Model '${model}' must be prefixed with '${manifest.schema.prefix}'`);
      }
    }

    // Check no conflicts with core models
    for (const model of manifest.schema.models) {
      if (CORE_MODELS.includes(model as any)) {
        errors.push(`Model '${model}' conflicts with core model`);
      }
    }
  }

  // 4. Permission validation
  if (manifest.permissions) {
    for (const model of manifest.permissions.coreRead) {
      if (!CORE_MODELS.includes(model as any)) {
        warnings.push(`coreRead references unknown core model: ${model}`);
      }
    }
    for (const model of manifest.permissions.coreWrite) {
      if (!CORE_MODELS.includes(model as any)) {
        warnings.push(`coreWrite references unknown core model: ${model}`);
      }
    }
  }

  // 5. Compatibility check
  if (manifest.compatibility?.schemaHash && manifest.compatibility.schemaHash !== CORE_SCHEMA_HASH) {
    warnings.push(`Schema hash mismatch — module was built against a different core schema version`);
  }

  // 6. Version format
  if (manifest.version && !/^\d+\.\d+\.\d+/.test(manifest.version)) {
    errors.push("version must be valid semver");
  }

  // 7. Check for prisma schema if models declared
  if (manifest.schema?.models?.length > 0) {
    const prismaPath = path.join(modulePath, "prisma", "schema.prisma");
    if (!fs.existsSync(prismaPath)) {
      errors.push("Module declares models but prisma/schema.prisma not found");
    }
  }

  // 8. Check agent definition exists
  const agentDefPath = path.join(modulePath, "agent", "definition.ts");
  if (!fs.existsSync(agentDefPath)) {
    warnings.push("agent/definition.ts not found — agent behavior may not be defined");
  }

  return { valid: errors.length === 0, errors, warnings };
}

// CLI entry point
if (require.main === module) {
  const modulePath = process.argv[2];
  if (!modulePath) {
    console.error("Usage: validate <module-path>");
    process.exit(1);
  }

  const result = validateModule(path.resolve(modulePath));

  if (result.errors.length > 0) {
    console.error("\n❌ Validation errors:");
    result.errors.forEach((e) => console.error(`  • ${e}`));
  }
  if (result.warnings.length > 0) {
    console.warn("\n⚠️  Warnings:");
    result.warnings.forEach((w) => console.warn(`  • ${w}`));
  }
  if (result.valid) {
    console.log("\n✅ Module is valid");
  }

  process.exit(result.valid ? 0 : 1);
}
