/**
 * Canvas Registry — helpers for reading module canvas configurations
 * and flattening relationships for the Mission Control layout engine.
 */

import type { CanvasConfig } from "../types/index";

/**
 * Builds a map of moduleType → CanvasConfig from an array of module manifests.
 * Manifests without canvasConfig are silently skipped.
 */
export function getCanvasConfigs(
  manifests: { moduleType: string; canvasConfig?: CanvasConfig }[]
): Map<string, CanvasConfig> {
  const configs = new Map<string, CanvasConfig>();
  for (const manifest of manifests) {
    if (manifest.canvasConfig) {
      configs.set(manifest.moduleType, manifest.canvasConfig);
    }
  }
  return configs;
}

/**
 * Returns the node color for a module, or a neutral gray if not configured.
 */
export function getNodeColor(
  moduleType: string,
  configs: Map<string, CanvasConfig>
): string {
  return configs.get(moduleType)?.color ?? "#6B7280";
}

/**
 * Returns the icon name for a module, or "box" as a fallback.
 */
export function getNodeIcon(
  moduleType: string,
  configs: Map<string, CanvasConfig>
): string {
  return configs.get(moduleType)?.icon ?? "box";
}

/**
 * Returns the entity label for a module, or the moduleType string as fallback.
 */
export function getEntityLabel(
  moduleType: string,
  configs: Map<string, CanvasConfig>
): string {
  return configs.get(moduleType)?.entityLabel ?? moduleType;
}

/**
 * Flattens all declared relationships across all modules into a single array.
 * Useful for the canvas layout engine to know all possible edges.
 */
export function getAllRelationships(
  configs: Map<string, CanvasConfig>
): Array<{
  sourceModule: string;
  sourceField: string;
  targetModule: string;
  targetEntity: string;
  label: string;
  edgeStyle: string;
}> {
  const relationships: Array<{
    sourceModule: string;
    sourceField: string;
    targetModule: string;
    targetEntity: string;
    label: string;
    edgeStyle: string;
  }> = [];

  for (const [moduleType, config] of configs) {
    for (const rel of config.relationships) {
      relationships.push({
        sourceModule: moduleType,
        sourceField: rel.sourceField,
        targetModule: rel.targetModule,
        targetEntity: rel.targetEntity,
        label: rel.label,
        edgeStyle: rel.edgeStyle ?? "solid",
      });
    }
  }

  return relationships;
}
