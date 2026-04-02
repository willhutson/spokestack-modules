/**
 * Module Factory — convenience wrapper for creating modules.
 *
 * createModule() produces a ModuleManifest + AgentDefinition bundle
 * from a single options object. It validates required fields and provides
 * sensible defaults. This is the recommended way to define new modules.
 *
 * Usage:
 *   const myModule = createModule({
 *     id: 'my-module',
 *     moduleType: 'CRM',
 *     name: 'CRM',
 *     ...
 *   });
 */

import type {
  ModuleManifest,
  AgentDefinition,
  SurfaceDefinition,
  HandoffTrigger,
  CanvasConfig,
} from '../types/index';
import type { ContextSchema } from '../types/context';

export interface ModuleOptions {
  /** Unique module ID (kebab-case) */
  id: string;
  /** Must match a ModuleType enum value from core */
  moduleType: string;
  /** Human-readable display name */
  name: string;
  /** Semver version */
  version: string;
  /** Short description */
  description: string;
  /** Module category */
  category: 'core' | 'marketing' | 'ops' | 'analytics' | 'custom';
  /** Minimum tier required */
  minTier: string;
  /** Price in cents/month (0 for free) */
  price?: number;

  /** Agent configuration */
  agent: {
    name: string;
    description: string;
    systemPrompt: string;
    tools: string[];
    model?: string;
    handoffTriggers?: HandoffTrigger[];
  };

  /** Tool names this module provides */
  tools: string[];
  /** UI surface definitions */
  surfaces: SurfaceDefinition[];

  /** Migration paths */
  migrations?: { install: string; uninstall: string };
  /** Context graph contract (Phase 3) */
  contextSchema?: ContextSchema;
  /** Canvas config (Phase 4) */
  canvasConfig?: CanvasConfig;

  /** Lifecycle hooks */
  hooks?: {
    onInstall?: () => Promise<void>;
    onUninstall?: () => Promise<void>;
    onActivate?: () => Promise<void>;
    onDeactivate?: () => Promise<void>;
  };
}

export interface ModuleBundle {
  manifest: ModuleManifest;
  agent: AgentDefinition;
  hooks?: ModuleOptions['hooks'];
}

/**
 * Create a module from a single options object.
 * Validates required fields and produces a ModuleManifest + AgentDefinition.
 */
export function createModule(options: ModuleOptions): ModuleBundle {
  if (!options.id) throw new Error('Module id is required');
  if (!options.moduleType) throw new Error('Module moduleType is required');
  if (!options.name) throw new Error('Module name is required');
  if (!options.agent?.name) throw new Error('Module agent.name is required');
  if (!options.tools || options.tools.length === 0) {
    throw new Error('Module must define at least one tool');
  }

  const manifest: ModuleManifest = {
    id: options.id,
    moduleType: options.moduleType,
    name: options.name,
    version: options.version,
    description: options.description,
    category: options.category,
    minTier: options.minTier,
    price: options.price,
    agentDefinition: {
      path: `src/agent/${options.id}-agent.ts`,
      name: options.agent.name,
    },
    tools: options.tools,
    surfaces: options.surfaces,
    migrations: options.migrations,
    contextSchema: options.contextSchema,
    canvasConfig: options.canvasConfig,
  };

  const agent: AgentDefinition = {
    name: options.agent.name,
    description: options.agent.description,
    system_prompt: options.agent.systemPrompt,
    tools: options.agent.tools,
    model: options.agent.model,
    handoffTriggers: options.agent.handoffTriggers,
  };

  return { manifest, agent, hooks: options.hooks };
}
