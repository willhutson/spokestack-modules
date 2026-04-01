/**
 * Flow Handler Types — cross-module data flow definitions.
 * Flow handlers are triggered by EntityEvents from spokestack-core.
 */

export interface FlowHandler {
  /** Unique handler ID: "{moduleType}:{handlerName}" */
  id: string;
  /** Human-readable description */
  description: string;
  /** Which event triggers this handler */
  trigger: {
    entityType: string;
    action: string;
    conditions?: Record<string, unknown>;
  };
  /** The handler function */
  execute(event: EntityEventPayload, context: FlowContext): Promise<FlowResult>;
}

export interface EntityEventPayload {
  id: string;
  organizationId: string;
  entityType: string;
  entityId: string;
  action: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface FlowContext {
  organizationId: string;
  /** Base URL for spokestack-core API */
  coreApiUrl: string;
  /** Auth headers for core API calls */
  headers: Record<string, string>;
  /** Emit a new event (for chaining) */
  emitEvent: (entityType: string, entityId: string, action: string, metadata?: Record<string, unknown>) => Promise<void>;
}

export interface FlowResult {
  success: boolean;
  created?: Array<{ entityType: string; entityId: string }>;
  updated?: Array<{ entityType: string; entityId: string }>;
  message?: string;
  error?: string;
}
