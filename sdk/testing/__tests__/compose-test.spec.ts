import { describe, it, expect } from 'vitest';
import { testModuleCompose } from '../compose-test';
import type { ModuleManifest } from '../../types/index';

const crmManifest: Partial<ModuleManifest> = {
  name: 'CRM',
  id: 'CRM',
  contextSchema: {
    categoryPrefix: 'crm',
    entityTypes: [
      {
        category: 'crm.contact',
        keyFormat: '{contactId}',
        valueSchema: { type: 'object', properties: { name: { type: 'string' } } },
      },
      {
        category: 'crm.deal',
        keyFormat: '{dealId}',
        valueSchema: { type: 'object', properties: { title: { type: 'string' } } },
      },
    ],
    patternTypes: ['deal_velocity'],
  },
};

const financeManifest: Partial<ModuleManifest> = {
  name: 'Finance',
  id: 'FINANCE',
  contextSchema: {
    categoryPrefix: 'finance',
    entityTypes: [
      {
        category: 'finance.budget',
        keyFormat: '{budgetId}',
        valueSchema: { type: 'object', properties: { name: { type: 'string' } } },
      },
      {
        category: 'finance.invoice',
        keyFormat: '{invoiceId}',
        valueSchema: { type: 'object', properties: { amount: { type: 'number' } } },
      },
    ],
    patternTypes: ['budget_overrun'],
  },
};

const conflictingManifest: Partial<ModuleManifest> = {
  name: 'ConflictModule',
  id: 'CONFLICT',
  contextSchema: {
    categoryPrefix: 'crm', // same prefix as CRM — collision!
    entityTypes: [
      {
        category: 'crm.contact', // same category — collision!
        keyFormat: '{contactId}',
        valueSchema: {},
      },
    ],
    patternTypes: [],
  },
};

describe('testModuleCompose', () => {
  it('CRM and Finance have no conflicts', () => {
    const result = testModuleCompose(
      crmManifest as ModuleManifest,
      financeManifest as ModuleManifest
    );
    expect(result.passed).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('CRM and ConflictModule have category prefix and category collision errors', () => {
    const result = testModuleCompose(
      crmManifest as ModuleManifest,
      conflictingManifest as ModuleManifest
    );
    expect(result.passed).toBe(false);
    expect(result.errors.some(e => e.type === 'category_collision')).toBe(true);
  });

  it('missing contextSchema produces a warning', () => {
    const noSchemaManifest: Partial<ModuleManifest> = { name: 'NoSchema', id: 'NOSCHEMA' };
    const result = testModuleCompose(
      noSchemaManifest as ModuleManifest,
      financeManifest as ModuleManifest
    );
    expect(result.warnings.some(w => w.type === 'missing_context_schema')).toBe(true);
  });

  it('detects key format collision', () => {
    const conflictKey: Partial<ModuleManifest> = {
      name: 'KeyConflict',
      id: 'KEYCONFLICT',
      contextSchema: {
        categoryPrefix: 'crm',
        entityTypes: [
          { category: 'crm.contact', keyFormat: '{contactId}', valueSchema: {} },
        ],
        patternTypes: [],
      },
    };
    const result = testModuleCompose(
      crmManifest as ModuleManifest,
      conflictKey as ModuleManifest
    );
    expect(result.errors.some(e => e.type === 'key_format_collision')).toBe(true);
  });
});
