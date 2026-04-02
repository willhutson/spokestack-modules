/**
 * Module Discovery — discovers installed modules from the filesystem or registry.
 *
 * In production, spokestack-core calls discoverModules() at startup to build
 * the MODULE_REGISTRY used for navigation, agent routing, and canvas rendering.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ModuleManifest, SurfaceDefinition } from '../types/index';

export interface DiscoveredModule {
  moduleType: string;
  name: string;
  version: string;
  description: string;
  category: string;
  minTier: string;
  tools: string[];
  surfaces: SurfaceDefinition[];
  hasContextSchema: boolean;
  hasCanvasConfig: boolean;
  hasFlows: boolean;
}

/**
 * Scan a modules directory for installed modules.
 * Reads manifest.json from each subdirectory.
 */
export function discoverModules(modulesDir: string): DiscoveredModule[] {
  if (!fs.existsSync(modulesDir)) return [];

  const entries = fs.readdirSync(modulesDir, { withFileTypes: true });
  const discovered: DiscoveredModule[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const manifestPath = path.join(modulesDir, entry.name, 'manifest.json');

    if (!fs.existsSync(manifestPath)) continue;

    try {
      const manifest: ModuleManifest = JSON.parse(
        fs.readFileSync(manifestPath, 'utf-8'),
      );

      const flowsDir = path.join(modulesDir, entry.name, 'src', 'flows');
      const hasFlows = fs.existsSync(flowsDir) &&
        fs.readdirSync(flowsDir).some((f) => f.endsWith('.ts'));

      discovered.push({
        moduleType: manifest.moduleType,
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        category: manifest.category,
        minTier: manifest.minTier,
        tools: manifest.tools,
        surfaces: manifest.surfaces || [],
        hasContextSchema: !!manifest.contextSchema,
        hasCanvasConfig: !!manifest.canvasConfig,
        hasFlows,
      });
    } catch {
      // Skip unparseable manifests
    }
  }

  return discovered;
}

/**
 * Build a lookup map from moduleType → DiscoveredModule.
 */
export function buildModuleRegistry(
  modules: DiscoveredModule[],
): Map<string, DiscoveredModule> {
  const registry = new Map<string, DiscoveredModule>();
  for (const mod of modules) {
    registry.set(mod.moduleType, mod);
  }
  return registry;
}

/**
 * Get modules available for a given billing tier.
 */
export function getModulesForTier(
  modules: DiscoveredModule[],
  tier: string,
): DiscoveredModule[] {
  const tierOrder = ['FREE', 'STARTER', 'PRO', 'BUSINESS', 'ENTERPRISE'];
  const tierIdx = tierOrder.indexOf(tier);
  if (tierIdx === -1) return [];
  return modules.filter((m) => {
    const minIdx = tierOrder.indexOf(m.minTier);
    return minIdx <= tierIdx;
  });
}
