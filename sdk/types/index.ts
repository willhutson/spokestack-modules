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

  /**
   * Phase 3: Describes the context graph contract for this module —
   * what entity types it writes, what pattern types it detects,
   * and the key/value format for each.
   * Used by compose-test to detect inter-module conflicts.
   */
  contextSchema?: import('./context').ContextSchema;

  /**
   * Phase 4: Configuration for how this module's entities appear on the
   * Mission Control canvas. Optional — modules without canvasConfig
   * will not appear on the canvas.
   */
  canvasConfig?: CanvasConfig;
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

  /**
   * Phase 3: Declarative conditions that should trigger a handoff to another
   * module's agent. The agent evaluates these using context entry data and
   * calls delegate_to_agent when a condition is met.
   */
  handoffTriggers?: HandoffTrigger[];
}

export interface HandoffTrigger {
  /**
   * Human-readable condition that, when true, should prompt a handoff.
   * Written in a natural DSL — not evaluated programmatically (yet).
   * Example: "deal.value > 50000 AND deal.stage = negotiation"
   */
  condition: string;

  /**
   * The target module ID to hand off to. Must match a registered module's id field.
   * Example: "FINANCE"
   */
  targetModule: string;

  /**
   * Human-readable reason for the handoff, shown to the user.
   */
  reason: string;

  /**
   * Which context fields to pass to the target module's agent as handoff context.
   * Uses dot notation relative to the entity that triggered the condition.
   */
  contextFields: string[];
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
// Phase 4: Canvas Configuration — Mission Control integration
// ---------------------------------------------------------------------------

export interface CanvasRelationship {
  /** Field on this module's entity that holds the foreign key. */
  sourceField: string;
  /** Module type of the target entity. Must match another module's moduleType. */
  targetModule: string;
  /** Entity type within the target module. */
  targetEntity: string;
  /** Human-readable label shown on the canvas edge. */
  label: string;
  /** Visual style of the edge line on the canvas. @default "solid" */
  edgeStyle?: "solid" | "dashed" | "dotted";
}

export interface CanvasConfig {
  /** Node type identifier used on the Mission Control canvas. */
  nodeType: string;
  /** Hex color for the node's border/accent. Must be "#RRGGBB". */
  color: string;
  /** Icon name from the lucide-react icon set. */
  icon: string;
  /** Human-readable label for this module's entity type. */
  entityLabel: string;
  /** Relationships to other modules' entities — drives edge rendering. */
  relationships: CanvasRelationship[];
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

// Phase 3 context protocol types
export type { ContextSchema, ContextEntityType } from "./context";
