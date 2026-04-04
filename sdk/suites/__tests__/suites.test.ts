import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllSuites, getSuiteById, getSuitesByVertical } from '../definitions';
import { planSuiteInstall, installSuite, type SuiteInstallContext } from '../installer';

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('Suite Definitions', () => {
  it('has at least 10 suite definitions', () => {
    expect(getAllSuites().length).toBeGreaterThanOrEqual(10);
  });

  it('finds dubai-agency-starter by id', () => {
    const suite = getSuiteById('dubai-agency-starter');
    expect(suite).toBeDefined();
    expect(suite!.industry).toBe('marketing_agency');
    expect(suite!.modules).toContain('CRM');
    expect(suite!.modules).toContain('CONTENT_STUDIO');
  });

  it('every suite has required fields', () => {
    for (const suite of getAllSuites()) {
      expect(suite.id).toBeTruthy();
      expect(suite.name).toBeTruthy();
      expect(suite.description).toBeTruthy();
      expect(suite.industry).toBeTruthy();
      expect(suite.modules.length).toBeGreaterThan(0);
    }
  });

  it('finds suites by vertical', () => {
    const agency = getSuitesByVertical('marketing_agency');
    expect(agency.length).toBeGreaterThanOrEqual(1);
    expect(agency[0].id).toBe('dubai-agency-starter');
  });

  it('returns empty for unknown vertical', () => {
    expect(getSuitesByVertical('unknown')).toHaveLength(0);
  });
});

describe('planSuiteInstall', () => {
  it('returns plan with module list and estimated time', () => {
    const suite = getSuiteById('dubai-agency-starter')!;
    const plan = planSuiteInstall(suite);
    expect(plan.modulesToInstall).toEqual(suite.modules);
    expect(plan.workflowsToCreate).toBe(3);
    expect(plan.estimatedTime).toContain('s');
  });
});

describe('installSuite', () => {
  beforeEach(() => mockFetch.mockReset());

  const ctx: SuiteInstallContext = {
    coreUrl: 'https://core.test',
    builderUrl: 'https://builder.test',
    orgId: 'org_001',
    authHeaders: { Authorization: 'Bearer test' },
    agentSecret: 'test-secret',
  };

  it('installs all modules in sequence', async () => {
    // Mock all fetch calls as success
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });

    const suite = getSuiteById('consulting-firm')!;
    const result = await installSuite(suite, ctx);

    expect(result.success).toBe(true);
    expect(result.modulesInstalled).toBe(suite.modules.length);
  });

  it('reports partial success when some modules fail', async () => {
    let callCount = 0;
    mockFetch.mockImplementation(async () => {
      callCount++;
      // Fail the second core install call
      if (callCount === 3) return { ok: false, status: 403 };
      return { ok: true, json: async () => ({}) };
    });

    const suite = { ...getSuiteById('in-house-team')!, modules: ['BRIEFS', 'PROJECTS'] };
    const result = await installSuite(suite, ctx);

    // First module succeeds, second fails at core
    expect(result.modulesInstalled).toBeGreaterThanOrEqual(1);
  });
});
