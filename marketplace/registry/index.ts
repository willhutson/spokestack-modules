/**
 * Static Module Registry
 *
 * Exports the authoritative list of all available modules.
 * When spokestack-core upgrades from its local registry.json to the
 * @spokestack/marketplace npm package, this is what it imports.
 */

import type { RegistryModule, ModuleManifest } from "../../sdk/types/index";
import staticRegistry from "./static-registry.json";

/**
 * Get all registered modules.
 */
export function getRegistry(): RegistryModule[] {
  return staticRegistry as RegistryModule[];
}

/**
 * Get a specific module's registry entry by moduleType.
 */
export function getModuleEntry(moduleType: string): RegistryModule | null {
  return (staticRegistry as RegistryModule[]).find((m) => m.moduleType === moduleType) ?? null;
}

/**
 * Get all module types as a string array.
 */
export function getModuleTypes(): string[] {
  return (staticRegistry as RegistryModule[]).map((m) => m.moduleType);
}

/**
 * Get modules filtered by category.
 */
export function getModulesByCategory(category: string): RegistryModule[] {
  return (staticRegistry as RegistryModule[]).filter((m) => m.category === category);
}

/**
 * Get modules available for a given tier.
 */
export function getModulesForTier(tier: string): RegistryModule[] {
  const tierOrder = ["FREE", "STARTER", "PRO", "BUSINESS", "ENTERPRISE"];
  const tierIdx = tierOrder.indexOf(tier);
  if (tierIdx === -1) return [];
  return (staticRegistry as RegistryModule[]).filter((m) => {
    const minIdx = tierOrder.indexOf(m.minTier);
    return minIdx <= tierIdx;
  });
}
