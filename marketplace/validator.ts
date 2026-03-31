/**
 * Pre-install Validator — checks compatibility, conflicts, and schema rules
 * before allowing module installation.
 */

import type { ModuleManifest } from "../sdk/types/manifest";
import { CORE_MODELS, CORE_SCHEMA_HASH, CORE_VERSION } from "../core-schema";

export interface PreInstallValidation {
  canInstall: boolean;
  errors: string[];
  warnings: string[];
}

interface InstalledModule {
  name: string;
  version: string;
  schemaModels: string[];
}

const TIER_ORDER = ["FREE", "STARTER", "PRO", "BUSINESS", "ENTERPRISE"] as const;

export function validatePreInstall(
  manifest: ModuleManifest,
  organizationTier: string,
  installedModules: InstalledModule[],
): PreInstallValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Core version compatibility
  if (manifest.compatibility.coreVersion) {
    const required = manifest.compatibility.coreVersion.split(".").map(Number);
    const current = CORE_VERSION.split(".").map(Number);
    if (required[0] > current[0]) {
      errors.push(
        `Module requires core v${manifest.compatibility.coreVersion}, but current core is v${CORE_VERSION}`,
      );
    }
  }

  // 2. Schema hash compatibility
  if (manifest.compatibility.schemaHash && manifest.compatibility.schemaHash !== CORE_SCHEMA_HASH) {
    warnings.push(
      "Module was built against a different core schema version. Some features may not work correctly.",
    );
  }

  // 3. Tier check
  const requiredTierIdx = TIER_ORDER.indexOf(manifest.tier.minimum as any);
  const orgTierIdx = TIER_ORDER.indexOf(organizationTier as any);
  if (orgTierIdx < requiredTierIdx) {
    errors.push(
      `Module requires ${manifest.tier.minimum} tier or higher. Organization is on ${organizationTier}.`,
    );
  }
  if (orgTierIdx < TIER_ORDER.indexOf(manifest.tier.recommended as any)) {
    warnings.push(
      `Module recommends ${manifest.tier.recommended} tier for full functionality.`,
    );
  }

  // 4. Conflict check
  for (const conflict of manifest.conflicts) {
    const conflicting = installedModules.find((m) => m.name === conflict);
    if (conflicting) {
      errors.push(`Module conflicts with installed module: ${conflict} (v${conflicting.version})`);
    }
  }

  // 5. Schema model collision check
  const existingModels = new Set(installedModules.flatMap((m) => m.schemaModels));
  for (const model of manifest.schema.models) {
    if (existingModels.has(model)) {
      errors.push(`Schema model '${model}' conflicts with an already-installed module`);
    }
    if (CORE_MODELS.includes(model as any)) {
      errors.push(`Schema model '${model}' conflicts with a core model`);
    }
  }

  // 6. Schema prefix uniqueness
  const existingPrefixes = new Set(
    installedModules.map((m) => {
      const firstModel = m.schemaModels[0];
      return firstModel ? firstModel.split("_")[0] + "_" : "";
    }),
  );
  if (existingPrefixes.has(manifest.schema.prefix)) {
    errors.push(`Schema prefix '${manifest.schema.prefix}' is already in use by another module`);
  }

  // 7. Dependency check
  for (const dep of manifest.schema.dependsOn) {
    if (!installedModules.find((m) => m.name === dep)) {
      errors.push(`Module depends on '${dep}' which is not installed`);
    }
  }

  return {
    canInstall: errors.length === 0,
    errors,
    warnings,
  };
}
