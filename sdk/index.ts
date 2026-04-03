// SDK public API — Phase 2 types (primary)
export * from "./types/index";

// Phase 1 types available under namespaced imports:
//   import type { ModuleAgent } from "@spokestack/module-sdk/types/agent"
//   import type { ContextEntry } from "@spokestack/module-sdk/types/context"

// SDK modules
export { ModuleInstaller } from "./installer/index";
export { validateManifest } from "./validator/index";
export { composeModule } from "./composer/index";

// Phase 10C: Module factory, registration, discovery, hooks
export { createModule, type ModuleOptions, type ModuleBundle } from "./factory/index";
export { validateModuleConfig } from "./factory/validate";
export { registerModule, deregisterModule, type RegistrationConfig, type RegistrationResult } from "./registration/index";
export { discoverModules, buildModuleRegistry, getModulesForTier, type DiscoveredModule } from "./discovery/index";
export { executeModuleAgent, streamModuleAgent, getAgentChatHint, type ModuleContext, type AgentResponse } from "./hooks/index";

// Suite system
export { SUITES, getSuiteById, getAllSuites, installSuite, planSuiteInstall } from "./suites/index";
export type { SuiteDefinition, SuiteInstallResult, SuitePlanResult, IndustryVertical } from "./suites/types";

// Phase 12B: Marketplace publish SDK
export * from "./types/marketplace";
export { packageModule, serializePackage, deserializePackage } from "./packaging/index";
export { validateModuleForPublish, validateModuleSecurity } from "./validation/publish";
export { publishModule, updateModule, unpublishModule, PublishError } from "./publishing/index";
export { createCrudModule } from "./templates/crud";
export { createWorkflowModule } from "./templates/workflow";
export { createDashboardModule } from "./templates/dashboard";
