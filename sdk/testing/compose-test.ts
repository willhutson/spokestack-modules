/**
 * Module Compose Testing — validates that two modules can coexist
 * without context graph conflicts.
 */

import type { ModuleManifest } from '../types/index';
import type { ContextSchema } from '../types/context';

export interface ComposeTestResult {
  passed: boolean;
  errors: ComposeError[];
  warnings: ComposeWarning[];
  summary: string;
}

export interface ComposeError {
  type: 'category_collision' | 'key_format_collision' | 'invalid_handoff_target' | 'circular_handoff';
  module1: string;
  module2: string;
  detail: string;
}

export interface ComposeWarning {
  type: 'overlapping_related_categories' | 'missing_context_schema';
  module: string;
  detail: string;
}

/**
 * Test whether two modules can coexist without context graph conflicts.
 *
 * Checks:
 * 1. Category prefix collision (same prefix = same namespace = collision)
 * 2. Exact category+key format collision across entity types
 * 3. Handoff triggers reference valid module IDs
 * 4. No circular handoff chains (A → B → A)
 */
export function testModuleCompose(
  manifest1: ModuleManifest,
  manifest2: ModuleManifest,
  allManifests: ModuleManifest[] = []
): ComposeTestResult {
  const errors: ComposeError[] = [];
  const warnings: ComposeWarning[] = [];

  const schema1 = manifest1.contextSchema;
  const schema2 = manifest2.contextSchema;

  // Warn if either module lacks a context schema
  if (!schema1) {
    warnings.push({
      type: 'missing_context_schema',
      module: manifest1.id ?? manifest1.name,
      detail: `Module "${manifest1.name}" has no contextSchema. Compose safety cannot be verified.`,
    });
  }
  if (!schema2) {
    warnings.push({
      type: 'missing_context_schema',
      module: manifest2.id ?? manifest2.name,
      detail: `Module "${manifest2.name}" has no contextSchema. Compose safety cannot be verified.`,
    });
  }

  if (schema1 && schema2) {
    // 1. Category prefix collision
    if (schema1.categoryPrefix === schema2.categoryPrefix) {
      errors.push({
        type: 'category_collision',
        module1: manifest1.name,
        module2: manifest2.name,
        detail: `Both modules use category prefix "${schema1.categoryPrefix}". Each module must have a unique prefix.`,
      });
    }

    // 2. Exact category collision across entity types
    const categories1 = new Set(schema1.entityTypes.map(et => et.category));
    const categories2 = new Set(schema2.entityTypes.map(et => et.category));
    for (const cat of categories1) {
      if (categories2.has(cat)) {
        errors.push({
          type: 'category_collision',
          module1: manifest1.name,
          module2: manifest2.name,
          detail: `Both modules define entity type for category "${cat}". Categories must be unique across composed modules.`,
        });
      }
    }

    // 3. Key format collision within shared categories
    for (const et1 of schema1.entityTypes) {
      for (const et2 of schema2.entityTypes) {
        if (et1.category === et2.category && et1.keyFormat === et2.keyFormat) {
          errors.push({
            type: 'key_format_collision',
            module1: manifest1.name,
            module2: manifest2.name,
            detail: `Both modules use keyFormat "${et1.keyFormat}" for category "${et1.category}". This will cause key collisions.`,
          });
        }
      }
    }
  }

  // 4. Validate handoff trigger targets
  const allModuleIds = new Set([
    ...allManifests.map(m => m.id ?? m.name),
    manifest1.id ?? manifest1.name,
    manifest2.id ?? manifest2.name,
  ]);

  for (const manifest of [manifest1, manifest2]) {
    const agentHandoffTriggers = (manifest as any).agentConfig?.handoffTriggers
      ?? (manifest as any).agent?.handoffTriggers
      ?? [];

    for (const trigger of agentHandoffTriggers) {
      if (!allModuleIds.has(trigger.targetModule)) {
        errors.push({
          type: 'invalid_handoff_target',
          module1: manifest.name,
          module2: trigger.targetModule,
          detail: `Module "${manifest.name}" has a handoff trigger targeting "${trigger.targetModule}" which is not a registered module.`,
        });
      }
    }
  }

  // 5. Detect circular handoffs (A → B → A)
  function getHandoffTargets(manifest: ModuleManifest): string[] {
    return (
      (manifest as any).agentConfig?.handoffTriggers?.map((t: any) => t.targetModule)
      ?? (manifest as any).agent?.handoffTriggers?.map((t: any) => t.targetModule)
      ?? []
    );
  }

  const targets1 = new Set(getHandoffTargets(manifest1));
  const targets2 = new Set(getHandoffTargets(manifest2));
  const id1 = manifest1.id ?? manifest1.name;
  const id2 = manifest2.id ?? manifest2.name;

  if (targets1.has(id2) && targets2.has(id1)) {
    errors.push({
      type: 'circular_handoff',
      module1: manifest1.name,
      module2: manifest2.name,
      detail: `Circular handoff detected: "${manifest1.name}" can hand off to "${manifest2.name}" and vice versa. This may cause infinite loops.`,
    });
  }

  const passed = errors.length === 0;
  const summary = passed
    ? `Compose test passed for ${manifest1.name} + ${manifest2.name}. ${warnings.length} warning(s).`
    : `Compose test FAILED for ${manifest1.name} + ${manifest2.name}. ${errors.length} error(s), ${warnings.length} warning(s).`;

  return { passed, errors, warnings, summary };
}

/**
 * Run compose tests across all pairs of manifests.
 */
export function testAllModuleCompose(
  manifests: ModuleManifest[]
): Map<string, ComposeTestResult> {
  const results = new Map<string, ComposeTestResult>();

  for (let i = 0; i < manifests.length; i++) {
    for (let j = i + 1; j < manifests.length; j++) {
      const m1 = manifests[i];
      const m2 = manifests[j];
      const key = `${m1.name}+${m2.name}`;
      results.set(key, testModuleCompose(m1, m2, manifests));
    }
  }

  return results;
}
