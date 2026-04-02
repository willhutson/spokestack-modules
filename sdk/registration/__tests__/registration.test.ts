import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerModule, deregisterModule, type RegistrationConfig } from '../index';
import type { ModuleManifest, AgentDefinition } from '../../types/index';

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

const config: RegistrationConfig = {
  agentBuilderUrl: 'https://agent-builder.test',
  agentSecret: 'test-secret',
  coreUrl: 'https://core.test',
  coreAuthToken: 'test-token',
};

const manifest: ModuleManifest = {
  id: 'crm',
  moduleType: 'CRM',
  name: 'CRM',
  version: '1.0.0',
  description: 'Test',
  category: 'ops',
  minTier: 'PRO',
  agentDefinition: { path: 'src/agent/crm-agent.ts', name: 'crm-agent' },
  tools: ['createContact'],
  surfaces: [],
};

const agent: AgentDefinition = {
  name: 'crm-agent',
  description: 'CRM Agent',
  system_prompt: 'You are the CRM agent.',
  tools: ['createContact'],
};

describe('registerModule', () => {
  beforeEach(() => mockFetch.mockReset());

  it('registers with core then agent-builder', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    const result = await registerModule(manifest, agent, 'org_001', config);
    expect(result.registered).toBe(true);
    expect(result.moduleType).toBe('CRM');
    expect(result.error).toBeUndefined();

    // Verify core called first with Bearer token
    expect(mockFetch.mock.calls[0][0]).toBe('https://core.test/api/v1/modules/install');
    expect(mockFetch.mock.calls[0][1].headers.Authorization).toBe('Bearer test-token');

    // Verify agent-builder called with X-Agent-Secret
    expect(mockFetch.mock.calls[1][0]).toBe('https://agent-builder.test/api/v1/core/modules/register');
    expect(mockFetch.mock.calls[1][1].headers['X-Agent-Secret']).toBe('test-secret');

    // Verify snake_case body
    const body = JSON.parse(mockFetch.mock.calls[1][1].body);
    expect(body.org_id).toBe('org_001');
    expect(body.module_type).toBe('CRM');
  });

  it('fails when core rejects', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: 'Tier too low' }),
    });

    const result = await registerModule(manifest, agent, 'org_001', config);
    expect(result.registered).toBe(false);
    expect(result.error).toContain('Core');
    expect(mockFetch).toHaveBeenCalledTimes(1); // Should NOT call agent-builder
  });

  it('partial success when agent-builder fails', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });

    const result = await registerModule(manifest, agent, 'org_001', config);
    expect(result.registered).toBe(true);
    expect(result.error).toContain('agent-builder');
  });
});

describe('deregisterModule', () => {
  beforeEach(() => mockFetch.mockReset());

  it('calls DELETE on agent-builder then POST on core', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true });

    const result = await deregisterModule('CRM', 'org_001', config);
    expect(result.registered).toBe(false);

    // Agent-builder DELETE
    expect(mockFetch.mock.calls[0][0]).toContain('/deregister');
    expect(mockFetch.mock.calls[0][1].method).toBe('DELETE');

    // Core uninstall
    expect(mockFetch.mock.calls[1][0]).toBe('https://core.test/api/v1/modules/uninstall');
  });
});
