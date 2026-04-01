import { describe, it, expect, vi, beforeEach } from 'vitest';
import { autoInvoiceOnOrder } from '../../../modules/finance/src/flows/auto-invoice-on-order';
import { projectInvoiceOnComplete } from '../../../modules/finance/src/flows/project-invoice-on-complete';
import { initClientRecord } from '../../../modules/crm/src/flows/init-client-record';
import { updateMilestoneProgress } from '../handlers/update-milestone-progress';
import { createBriefTasks } from '../handlers/create-brief-tasks';
import { refreshDashboardOnSync } from '../../../modules/analytics/src/flows/refresh-on-sync';
import { checkDeliverablesOnBriefComplete } from '../handlers/check-deliverables';
import type { EntityEventPayload, FlowContext } from '../../types/flow-handler';

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

function makeEvent(overrides: Partial<EntityEventPayload> = {}): EntityEventPayload {
  return {
    id: 'evt_001',
    organizationId: 'org_001',
    entityType: 'Order',
    entityId: 'order_001',
    action: 'created',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeContext(): FlowContext {
  return {
    organizationId: 'org_001',
    coreApiUrl: 'https://core.test',
    headers: { Authorization: 'Bearer test' },
    emitEvent: vi.fn(),
  };
}

describe('Flow Handlers', () => {
  beforeEach(() => mockFetch.mockReset());

  describe('autoInvoiceOnOrder', () => {
    it('creates invoice draft on order created', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'order_001', clientId: 'client_001', items: [{ description: 'Service', quantity: 1, unitPrice: 5000 }] }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'inv_001' }) });

      const result = await autoInvoiceOnOrder.execute(makeEvent(), makeContext());
      expect(result.success).toBe(true);
      expect(result.created).toHaveLength(1);
      expect(result.created![0].entityType).toBe('Invoice');
    });

    it('fails gracefully when order fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });
      const result = await autoInvoiceOnOrder.execute(makeEvent(), makeContext());
      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to fetch order');
    });
  });

  describe('projectInvoiceOnComplete', () => {
    it('creates invoice when project completes with client', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'proj_001', clientId: 'client_001', name: 'Big Project' }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'inv_002' }) });

      const result = await projectInvoiceOnComplete.execute(
        makeEvent({ entityType: 'Project', entityId: 'proj_001', action: 'status_changed' }),
        makeContext()
      );
      expect(result.success).toBe(true);
      expect(result.created).toHaveLength(1);
    });

    it('skips when project has no client', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'proj_001', clientId: null }) });
      const result = await projectInvoiceOnComplete.execute(
        makeEvent({ entityType: 'Project', entityId: 'proj_001' }),
        makeContext()
      );
      expect(result.success).toBe(true);
      expect(result.message).toContain('no client');
    });
  });

  describe('initClientRecord', () => {
    it('returns success message', async () => {
      const result = await initClientRecord.execute(
        makeEvent({ entityType: 'Client', entityId: 'client_001', action: 'created' }),
        makeContext()
      );
      expect(result.success).toBe(true);
      expect(result.message).toContain('client_001');
    });
  });

  describe('updateMilestoneProgress', () => {
    it('updates project when task linked', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'task_001', projectId: 'proj_001' }) });
      const result = await updateMilestoneProgress.execute(
        makeEvent({ entityType: 'Task', entityId: 'task_001', action: 'status_changed' }),
        makeContext()
      );
      expect(result.success).toBe(true);
      expect(result.updated).toHaveLength(1);
    });

    it('skips when task not linked to project', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'task_001', projectId: null }) });
      const result = await updateMilestoneProgress.execute(
        makeEvent({ entityType: 'Task', entityId: 'task_001' }),
        makeContext()
      );
      expect(result.success).toBe(true);
      expect(result.message).toContain('not linked');
    });
  });

  describe('createBriefTasks', () => {
    it('returns success', async () => {
      const result = await createBriefTasks.execute(
        makeEvent({ entityType: 'Brief', entityId: 'brief_001', action: 'created' }),
        makeContext()
      );
      expect(result.success).toBe(true);
    });
  });

  describe('refreshDashboardOnSync', () => {
    it('returns success with provider info', async () => {
      const result = await refreshDashboardOnSync.execute(
        makeEvent({ entityType: 'Integration', action: 'sync_completed', metadata: { provider: 'asana' } }),
        makeContext()
      );
      expect(result.success).toBe(true);
      expect(result.message).toContain('asana');
    });
  });

  describe('checkDeliverablesOnBriefComplete', () => {
    it('returns success', async () => {
      const result = await checkDeliverablesOnBriefComplete.execute(
        makeEvent({ entityType: 'Brief', entityId: 'brief_001', action: 'status_changed' }),
        makeContext()
      );
      expect(result.success).toBe(true);
    });
  });

  describe('all handlers have correct trigger config', () => {
    const handlers = [
      autoInvoiceOnOrder, projectInvoiceOnComplete, initClientRecord,
      updateMilestoneProgress, createBriefTasks, refreshDashboardOnSync,
      checkDeliverablesOnBriefComplete,
    ];

    for (const handler of handlers) {
      it(`${handler.id} has id, description, trigger, execute`, () => {
        expect(handler.id).toMatch(/^[A-Z]+:/);
        expect(handler.description).toBeTruthy();
        expect(handler.trigger.entityType).toBeTruthy();
        expect(handler.trigger.action).toBeTruthy();
        expect(typeof handler.execute).toBe('function');
      });
    }
  });
});
