// SDK public API — Phase 2 types (primary)
export * from "./types/index";

// Phase 1 types available under namespaced imports:
//   import type { ModuleAgent } from "@spokestack/module-sdk/types/agent"
//   import type { ContextEntry } from "@spokestack/module-sdk/types/context"

// SDK modules
export { ModuleInstaller } from "./installer/index";
export { validateManifest } from "./validator/index";
export { composeModule } from "./composer/index";
