/**
 * Flow Handler Registry — register and lookup cross-module data flow handlers.
 */

import type { FlowHandler } from '../types/flow-handler';

const flowHandlers: Map<string, FlowHandler> = new Map();

export function registerFlow(handler: FlowHandler) {
  flowHandlers.set(handler.id, handler);
}

export function getFlow(handlerId: string): FlowHandler | undefined {
  return flowHandlers.get(handlerId);
}

export function getFlowsForEvent(entityType: string, action: string): FlowHandler[] {
  return Array.from(flowHandlers.values()).filter(
    (h) =>
      (h.trigger.entityType === entityType || h.trigger.entityType === '*') &&
      (h.trigger.action === action || h.trigger.action === '*')
  );
}

export function getAllFlows(): FlowHandler[] {
  return Array.from(flowHandlers.values());
}

/** Reset registry — used in tests */
export function clearFlows() {
  flowHandlers.clear();
}
