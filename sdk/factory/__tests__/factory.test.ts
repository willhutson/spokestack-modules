import { describe, it, expect } from 'vitest';
import { createModule, type ModuleOptions } from '../index';
import { validateModuleConfig } from '../validate';

const validOptions: ModuleOptions = {
  id: 'test-module',
  moduleType: 'CRM',
  name: 'Test Module',
  version: '1.0.0',
  description: 'A test module',
  category: 'ops',
  minTier: 'PRO',
  price: 900,
  agent: {
    name: 'test-agent',
    description: 'Test agent',
    systemPrompt: 'You are a test agent.',
    tools: ['createThing', 'listThings'],
  },
  tools: ['createThing', 'listThings'],
  surfaces: [
    { id: 'test-dashboard', type: 'dashboard', requiredTools: ['listThings'] },
    { id: 'test-page', type: 'full-page', route: '/test', requiredTools: ['createThing'] },
  ],
  migrations: { install: 'migrations/install.ts', uninstall: 'migrations/uninstall.ts' },
};

describe('createModule', () => {
  it('produces a valid ModuleBundle', () => {
    const bundle = createModule(validOptions);
    expect(bundle.manifest).toBeDefined();
    expect(bundle.agent).toBeDefined();
    expect(bundle.manifest.id).toBe('test-module');
    expect(bundle.manifest.moduleType).toBe('CRM');
    expect(bundle.agent.name).toBe('test-agent');
    expect(bundle.agent.system_prompt).toBe('You are a test agent.');
  });

  it('manifest has correct tool count', () => {
    const bundle = createModule(validOptions);
    expect(bundle.manifest.tools).toHaveLength(2);
  });

  it('manifest has surfaces', () => {
    const bundle = createModule(validOptions);
    expect(bundle.manifest.surfaces).toHaveLength(2);
  });

  it('agent tools match manifest tools', () => {
    const bundle = createModule(validOptions);
    expect(bundle.agent.tools).toEqual(bundle.manifest.tools);
  });

  it('throws on missing id', () => {
    expect(() => createModule({ ...validOptions, id: '' })).toThrow('id');
  });

  it('throws on missing moduleType', () => {
    expect(() => createModule({ ...validOptions, moduleType: '' })).toThrow('moduleType');
  });

  it('throws on empty tools', () => {
    expect(() => createModule({ ...validOptions, tools: [] })).toThrow('tool');
  });

  it('preserves optional fields', () => {
    const bundle = createModule({
      ...validOptions,
      contextSchema: { categoryPrefix: 'test', entityTypes: [], patternTypes: [] },
      canvasConfig: { nodeType: 'TEST', color: '#FF0000', icon: 'box', entityLabel: 'Test', relationships: [] },
    });
    expect(bundle.manifest.contextSchema).toBeDefined();
    expect(bundle.manifest.canvasConfig?.color).toBe('#FF0000');
  });

  it('includes handoff triggers in agent definition', () => {
    const bundle = createModule({
      ...validOptions,
      agent: {
        ...validOptions.agent,
        handoffTriggers: [
          { condition: 'deal.value > 50000', targetModule: 'FINANCE', reason: 'High value', contextFields: ['deal.value'] },
        ],
      },
    });
    expect(bundle.agent.handoffTriggers).toHaveLength(1);
  });

  it('preserves lifecycle hooks', () => {
    const onInstall = async () => {};
    const bundle = createModule({ ...validOptions, hooks: { onInstall } });
    expect(bundle.hooks?.onInstall).toBe(onInstall);
  });
});

describe('validateModuleConfig', () => {
  it('valid config passes', () => {
    const result = validateModuleConfig(validOptions);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects missing id', () => {
    const result = validateModuleConfig({ ...validOptions, id: undefined as any });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('id'))).toBe(true);
  });

  it('rejects invalid semver', () => {
    const result = validateModuleConfig({ ...validOptions, version: 'abc' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('semver'))).toBe(true);
  });

  it('rejects invalid category', () => {
    const result = validateModuleConfig({ ...validOptions, category: 'invalid' as any });
    expect(result.valid).toBe(false);
  });

  it('rejects invalid tier', () => {
    const result = validateModuleConfig({ ...validOptions, minTier: 'GOLD' });
    expect(result.valid).toBe(false);
  });

  it('rejects empty tools', () => {
    const result = validateModuleConfig({ ...validOptions, tools: [] });
    expect(result.valid).toBe(false);
  });

  it('validates canvasConfig color format', () => {
    const result = validateModuleConfig({
      ...validOptions,
      canvasConfig: { nodeType: 'T', color: 'red', icon: 'x', entityLabel: 'T', relationships: [] },
    });
    expect(result.errors.some(e => e.includes('#RRGGBB'))).toBe(true);
  });
});
