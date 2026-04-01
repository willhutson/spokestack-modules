/**
 * Cross-Module Context Protocol — helper functions for standardized
 * context key/value conventions across modules.
 */

import type { ContextEntityType, ContextSchema } from '../types/context';

// Re-export for convenience
export type { ContextSchema, ContextEntityType };

/**
 * Build a standardized context entry key.
 *
 * @example
 * buildContextKey("crm", "contact", "user_123") → "crm.contact.user_123"
 */
export function buildContextKey(
  modulePrefix: string,
  entityType: string,
  entityId: string
): string {
  if (!modulePrefix || !entityType || !entityId) {
    throw new Error(
      `buildContextKey: all arguments required. Got: prefix="${modulePrefix}", type="${entityType}", id="${entityId}"`
    );
  }
  return [modulePrefix, entityType, entityId]
    .map(s => s.toLowerCase().replace(/[^a-z0-9_-]/g, '_'))
    .join('.');
}

/**
 * Parse a standardized context key back into its components.
 * Returns null if the key doesn't match the expected format.
 *
 * @example
 * parseContextKey("crm.contact.user_123") → { module: "crm", entityType: "contact", entityId: "user_123" }
 */
export function parseContextKey(key: string): {
  module: string;
  entityType: string;
  entityId: string;
} | null {
  const parts = key.split('.');
  if (parts.length < 3) return null;

  const [module, entityType, ...rest] = parts;
  return {
    module,
    entityType,
    entityId: rest.join('.'), // entity ID may itself contain dots
  };
}

/**
 * Validate a context entry against a module's declared entity schema.
 * Returns an array of validation error strings (empty = valid).
 */
export function validateContextEntry(
  entry: { category: string; key: string; value: unknown },
  schema: ContextSchema
): string[] {
  const errors: string[] = [];

  // Check category prefix
  if (!entry.category.startsWith(schema.categoryPrefix)) {
    errors.push(
      `Category "${entry.category}" does not start with module prefix "${schema.categoryPrefix}"`
    );
  }

  // Find matching entity type
  const entityTypeDef = schema.entityTypes.find(et => et.category === entry.category);
  if (!entityTypeDef) {
    // Not an entity type — may be a pattern or other category, which is allowed
    return errors;
  }

  // Validate key format (check that the key has the right number of segments)
  const parsed = parseContextKey(entry.key);
  if (!parsed) {
    errors.push(`Key "${entry.key}" does not match expected format "${entityTypeDef.keyFormat}"`);
  }

  // Basic value schema validation (type checking only — not full JSON Schema validation)
  const valueSchema = entityTypeDef.valueSchema as {
    type?: string;
    properties?: Record<string, { type?: string; required?: boolean }>;
    required?: string[];
  };

  if (valueSchema.type === 'object' && (entry.value === null || typeof entry.value !== 'object')) {
    errors.push(`Value for category "${entry.category}" must be an object`);
  }

  if (
    valueSchema.type === 'object' &&
    typeof entry.value === 'object' &&
    entry.value !== null &&
    Array.isArray(valueSchema.required)
  ) {
    const valueObj = entry.value as Record<string, unknown>;
    for (const requiredField of valueSchema.required) {
      if (!(requiredField in valueObj)) {
        errors.push(
          `Value for category "${entry.category}" is missing required field "${requiredField}"`
        );
      }
    }
  }

  return errors;
}

/**
 * Find all context entries that reference a given category.
 * An entry "references" a category if its value contains a field ending in "Id"
 * whose name matches the target category's entity type.
 *
 * @example
 * findRelatedEntries(entries, "crm.contact") → all crm.deal entries that have a contactId field
 */
export function findRelatedEntries(
  entries: Array<{ category: string; key: string; value: unknown }>,
  targetCategory: string
): Array<{ category: string; key: string; value: unknown }> {
  return entries.filter(entry => {
    // Don't return entries from the target category itself
    if (entry.category === targetCategory) return false;

    // Check if this entry's value references the target category
    if (typeof entry.value === 'object' && entry.value !== null) {
      const valueObj = entry.value as Record<string, unknown>;
      // Look for fields like "contactId", "dealId" that match the target category's entity type
      const targetEntityType = targetCategory.split('.').pop() ?? '';
      const refKey = `${targetEntityType}Id`;
      if (refKey in valueObj) return true;
    }

    return false;
  });
}
