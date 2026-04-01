import { describe, it, expect } from 'vitest';
import { buildContextKey, parseContextKey, validateContextEntry, findRelatedEntries } from '../protocol';
import type { ContextSchema } from '../../types/context';

const crmSchema: ContextSchema = {
  categoryPrefix: 'crm',
  entityTypes: [
    {
      category: 'crm.contact',
      keyFormat: '{contactId}',
      valueSchema: {
        type: 'object',
        properties: { name: { type: 'string' }, email: { type: 'string' } },
        required: ['name'],
      },
    },
  ],
  patternTypes: ['deal_velocity'],
};

describe('buildContextKey', () => {
  it('builds a dotted key', () => {
    expect(buildContextKey('crm', 'contact', 'abc123')).toBe('crm.contact.abc123');
  });

  it('throws on empty arguments', () => {
    expect(() => buildContextKey('', 'contact', 'abc')).toThrow();
  });

  it('sanitizes special characters', () => {
    expect(buildContextKey('crm', 'contact', 'abc 123')).toBe('crm.contact.abc_123');
  });
});

describe('parseContextKey', () => {
  it('parses a valid key', () => {
    expect(parseContextKey('crm.contact.abc123')).toEqual({
      module: 'crm',
      entityType: 'contact',
      entityId: 'abc123',
    });
  });

  it('returns null for a key with fewer than 3 parts', () => {
    expect(parseContextKey('crm.contact')).toBeNull();
  });

  it('handles entity IDs with dots', () => {
    const result = parseContextKey('crm.contact.abc.123.xyz');
    expect(result).toEqual({
      module: 'crm',
      entityType: 'contact',
      entityId: 'abc.123.xyz',
    });
  });
});

describe('validateContextEntry', () => {
  it('valid entry returns no errors', () => {
    const errors = validateContextEntry(
      { category: 'crm.contact', key: 'crm.contact.abc', value: { name: 'Alice' } },
      crmSchema
    );
    expect(errors).toHaveLength(0);
  });

  it('wrong category prefix returns error', () => {
    const errors = validateContextEntry(
      { category: 'finance.budget', key: 'crm.contact.abc', value: { name: 'Alice' } },
      crmSchema
    );
    expect(errors.some(e => e.includes('prefix'))).toBe(true);
  });

  it('missing required field returns error', () => {
    const errors = validateContextEntry(
      { category: 'crm.contact', key: 'crm.contact.abc', value: { email: 'a@b.com' } },
      crmSchema
    );
    expect(errors.some(e => e.includes('name'))).toBe(true);
  });

  it('non-object value returns error when schema expects object', () => {
    const errors = validateContextEntry(
      { category: 'crm.contact', key: 'crm.contact.abc', value: 'not an object' },
      crmSchema
    );
    expect(errors.some(e => e.includes('must be an object'))).toBe(true);
  });
});

describe('findRelatedEntries', () => {
  const entries = [
    { category: 'crm.deal', key: 'crm.deal.d1', value: { contactId: 'abc123', title: 'Big Deal' } },
    { category: 'crm.contact', key: 'crm.contact.abc123', value: { name: 'Alice' } },
    { category: 'finance.invoice', key: 'finance.invoice.inv1', value: { amount: 5000 } },
  ];

  it('finds deal that references a contact', () => {
    const related = findRelatedEntries(entries, 'crm.contact');
    expect(related.some(e => e.key === 'crm.deal.d1')).toBe(true);
  });

  it('does not return the target category itself', () => {
    const related = findRelatedEntries(entries, 'crm.contact');
    expect(related.some(e => e.category === 'crm.contact')).toBe(false);
  });

  it('returns empty for entries with no references', () => {
    const related = findRelatedEntries(entries, 'finance.invoice');
    expect(related).toHaveLength(0);
  });
});
