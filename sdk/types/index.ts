/**
 * SpokeStack Module SDK — Phase 2 Type Definitions
 *
 * These types define the contract between spokestack-modules and spokestack-core.
 * They must match what spokestack-core's /api/v1/modules/* endpoints expect.
 */

// ---------------------------------------------------------------------------
// Module Manifest — the complete declaration of a marketplace module
// ---------------------------------------------------------------------------

export interface ModuleManifest {
  /** Unique identifier for the module */
  id: string;
  /** Must match a ModuleType enum value from core's Prisma schema */
  moduleType: string;
  /** Human-readable display name */
  name: string;
  /** Semver version string */
  version: string;
  /** Short description for marketplace listing */
  description: string;
  /** Module category for marketplace filtering */
  category: "core" | "marketing" | "ops" | "analytics" | "custom";
  /** Minimum BillingTierType required to install (FREE/STARTER/PRO/BUSINESS/ENTERPRISE) */
  minTier: string;
  /** Monthly price in cents (0 for free modules) */
  price?: number;
  /** Reference to the agent definition */
  agentDefinition: AgentDefinitionRef;
  /** Tool names this module provides */
  tools: string[];
  /** UI surface definitions */
  surfaces: SurfaceDefinition[];
  /** Migration paths for install/uninstall */
  migrations?: {
    install: string;
    uninstall: string;
  };
}

export interface AgentDefinitionRef {
  /** Path to the agent definition file (relative to module root) */
  path: string;
  /** Agent name */
  name: string;
}

// ---------------------------------------------------------------------------
// Agent Definition — serializable agent config sent to agent-builder
// ---------------------------------------------------------------------------

export interface AgentDefinition {
  /** Agent name, e.g. "crm-agent" */
  name: string;
  /** Human-readable description */
  description: string;
  /** Full system prompt for the agent */
  system_prompt: string;
  /** Tool names the agent can invoke (must match exported tool names) */
  tools: string[];
  /** Optional model override (defaults to agent-builder's default) */
  model?: string;
}

// ---------------------------------------------------------------------------
// Tool Definition — a tool an agent can invoke
// ---------------------------------------------------------------------------

export interface ToolDefinition {
  /** Tool function name, e.g. "createContact" */
  name: string;
  /** Human-readable description shown to the agent */
  description: string;
  /** JSON Schema for the tool's parameters */
  parameters: ToolParameterSchema;
  /** The handler function (stub OK for Phase 2) */
  handler: ToolHandler;
}

export interface ToolParameterSchema {
  type: "object";
  properties: Record<string, ToolParameterProperty>;
  required?: string[];
}

export interface ToolParameterProperty {
  type: string;
  description?: string;
  enum?: string[];
  items?: ToolParameterProperty;
  minimum?: number;
  maximum?: number;
}

export type ToolHandler = (
  params: Record<string, unknown>,
  context: ToolContext,
) => Promise<ToolResult>;

export interface ToolContext {
  organizationId: string;
  userId?: string;
  coreUrl: string;
  authToken: string;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

// ---------------------------------------------------------------------------
// Surface Definition — metadata telling core where to render UI
// ---------------------------------------------------------------------------

export interface SurfaceDefinition {
  /** Unique surface ID within the module */
  id: string;
  /** Surface type determines rendering strategy in spokestack-core dashboard */
  type: "dashboard" | "sidebar" | "modal" | "full-page";
  /** Route path for full-page surfaces, e.g. "/crm/contacts" */
  route?: string;
  /** Tools required for this surface to function */
  requiredTools: string[];
}

// ---------------------------------------------------------------------------
// Install / Validation Results
// ---------------------------------------------------------------------------

export interface InstallResult {
  success: boolean;
  /** The OrgModule record created in core */
  orgModule?: {
    id: string;
    moduleType: string;
    installedAt: string;
  };
  /** Whether the agent was registered with agent-builder */
  agentRegistered: boolean;
  errors?: string[];
}

export interface UninstallResult {
  success: boolean;
  errors?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Composed Module — bundled module ready for installation
// ---------------------------------------------------------------------------

export interface ComposedModule {
  manifest: ModuleManifest;
  agent: AgentDefinition;
  tools: ToolDefinition[];
  surfaces: SurfaceDefinition[];
}

// ---------------------------------------------------------------------------
// Registry types
// ---------------------------------------------------------------------------

export interface RegistryModule {
  moduleType: string;
  name: string;
  description: string;
  category: "core" | "marketing" | "ops" | "analytics" | "custom";
  minTier: string;
  price: number;
  surfaces: SurfaceDefinition[];
}

// Re-export Phase 1 types that are still used internally
export type { ContextEntry, ContextEntryType, ContextQuery, MilestoneDefinition } from "./context";
export type { ModuleAgent, AgentToolDefinition, AgentRegistrationPayload } from "./agent";
