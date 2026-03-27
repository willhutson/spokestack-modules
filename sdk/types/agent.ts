/**
 * ModuleAgent — JSON-serializable agent definition.
 * Authored here, serialized and sent to agent-builder's
 * POST /agents/register endpoint at module install time.
 */

export interface ModuleAgent {
  /** Unique agent name, e.g. "crm-agent" */
  name: string;
  /** URL-safe slug, e.g. "crm-agent" */
  slug: string;
  /** Patterns that trigger this agent (regex strings) */
  intentPatterns: string[];
  /** Full system prompt for the agent */
  systemPrompt: string;
  /** Tool definitions the agent can invoke */
  tools: AgentToolDefinition[];
  /** Context types this agent reads from and writes to */
  contextContributions: ContextContribution[];
}

export interface AgentToolDefinition {
  /** Tool function name */
  name: string;
  /** Human-readable description for the agent */
  description: string;
  /** JSON Schema for tool parameters */
  parameters: Record<string, unknown>;
  /** Whether this tool writes to ContextEntry */
  writesContext: boolean;
}

export interface ContextContribution {
  /** Context entry type key, e.g. "crm.contact.created" */
  type: string;
  /** Human description of what this context represents */
  description: string;
  /** Whether the agent reads or writes this type */
  direction: "read" | "write" | "both";
}

/**
 * AgentRegistrationPayload — the serialized form sent to
 * agent-builder's POST /agents/register endpoint.
 */
export interface AgentRegistrationPayload {
  moduleId: string;
  organizationId: string;
  agent: ModuleAgent;
  /** Prisma connection string for the agent's CoreToolkit */
  coreDbUrl?: string;
}

/**
 * AgentRegistrationResponse from agent-builder.
 */
export interface AgentRegistrationResponse {
  agentId: string;
  status: "registered" | "error";
  error?: string;
}
