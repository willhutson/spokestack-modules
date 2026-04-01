// Phase 2 registry (primary)
export { getRegistry, getModuleEntry, getModuleTypes, getModulesByCategory, getModulesForTier } from "./registry/index";

// Phase 1 infrastructure (still available)
export { ModuleRegistry, type RegistryEntry, type RegistrySearchParams } from "./registry";
export { installModule, type InstallResult } from "./installer";
export { validatePreInstall, type PreInstallValidation } from "./validator";
export { activateBilling, deactivateBilling, reportUsage } from "./billing";
export { composeSchemas, type CompositionResult } from "./composer";
