import { describe, it, expect, beforeEach } from 'vitest';
import { initializeFlows } from '../init';
import { getAllFlows, clearFlows, getFlowsForEvent } from '../registry';

describe('initializeFlows', () => {
  beforeEach(() => clearFlows());

  it('registers all 7 flow handlers', () => {
    initializeFlows();
    expect(getAllFlows()).toHaveLength(7);
  });

  it('registers finance handlers for Order and Project events', () => {
    initializeFlows();
    expect(getFlowsForEvent('Order', 'created')).toHaveLength(1);
    expect(getFlowsForEvent('Project', 'status_changed')).toHaveLength(1);
  });

  it('registers CRM handler for Client events', () => {
    initializeFlows();
    expect(getFlowsForEvent('Client', 'created')).toHaveLength(1);
  });

  it('registers task handler for Brief events', () => {
    initializeFlows();
    const briefHandlers = getFlowsForEvent('Brief', 'created');
    expect(briefHandlers.length).toBeGreaterThanOrEqual(1);
  });

  it('registers analytics handler for sync events', () => {
    initializeFlows();
    expect(getFlowsForEvent('Integration', 'sync_completed')).toHaveLength(1);
  });
});
