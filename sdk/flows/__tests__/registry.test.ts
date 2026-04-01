import { describe, it, expect, beforeEach } from 'vitest';
import { registerFlow, getFlow, getFlowsForEvent, getAllFlows, clearFlows } from '../registry';
import type { FlowHandler } from '../../types/flow-handler';

const mockHandler: FlowHandler = {
  id: 'TEST:mockHandler',
  description: 'Test handler',
  trigger: { entityType: 'Order', action: 'created' },
  execute: async () => ({ success: true, message: 'mock' }),
};

const wildHandler: FlowHandler = {
  id: 'TEST:wildcard',
  description: 'Wildcard handler',
  trigger: { entityType: '*', action: '*' },
  execute: async () => ({ success: true }),
};

describe('Flow Registry', () => {
  beforeEach(() => clearFlows());

  it('registers and retrieves a flow handler', () => {
    registerFlow(mockHandler);
    expect(getFlow('TEST:mockHandler')).toBe(mockHandler);
  });

  it('returns undefined for unknown handler', () => {
    expect(getFlow('UNKNOWN:handler')).toBeUndefined();
  });

  it('finds handlers matching entity type and action', () => {
    registerFlow(mockHandler);
    const matches = getFlowsForEvent('Order', 'created');
    expect(matches).toHaveLength(1);
    expect(matches[0].id).toBe('TEST:mockHandler');
  });

  it('returns empty for non-matching events', () => {
    registerFlow(mockHandler);
    expect(getFlowsForEvent('Task', 'created')).toHaveLength(0);
  });

  it('wildcard handler matches any event', () => {
    registerFlow(wildHandler);
    expect(getFlowsForEvent('Order', 'created')).toHaveLength(1);
    expect(getFlowsForEvent('Task', 'deleted')).toHaveLength(1);
  });

  it('getAllFlows returns all registered handlers', () => {
    registerFlow(mockHandler);
    registerFlow(wildHandler);
    expect(getAllFlows()).toHaveLength(2);
  });

  it('clearFlows empties the registry', () => {
    registerFlow(mockHandler);
    clearFlows();
    expect(getAllFlows()).toHaveLength(0);
  });
});
