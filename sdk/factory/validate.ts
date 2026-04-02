/**
 * Module Config Validation — validates ModuleOptions before createModule().
 * Uses plain TypeScript (no Zod dependency) to keep the SDK lightweight.
 */

import type { ModuleOptions } from './index';

export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
}

const VALID_CATEGORIES = ['core', 'marketing', 'ops', 'analytics', 'custom'];
const VALID_TIERS = ['FREE', 'STARTER', 'PRO', 'BUSINESS', 'ENTERPRISE'];

export function validateModuleConfig(config: Partial<ModuleOptions>): ConfigValidationResult {
  const errors: string[] = [];

  if (!config.id || typeof config.id !== 'string') errors.push('id: required string');
  if (!config.moduleType || typeof config.moduleType !== 'string') errors.push('moduleType: required string');
  if (!config.name || typeof config.name !== 'string') errors.push('name: required string');
  if (!config.version || !/^\d+\.\d+\.\d+/.test(config.version)) errors.push('version: must be valid semver');
  if (!config.description) errors.push('description: required');
  if (!config.category || !VALID_CATEGORIES.includes(config.category)) {
    errors.push(`category: must be one of ${VALID_CATEGORIES.join(', ')}`);
  }
  if (!config.minTier || !VALID_TIERS.includes(config.minTier)) {
    errors.push(`minTier: must be one of ${VALID_TIERS.join(', ')}`);
  }

  // Agent
  if (!config.agent) {
    errors.push('agent: required');
  } else {
    if (!config.agent.name) errors.push('agent.name: required');
    if (!config.agent.systemPrompt) errors.push('agent.systemPrompt: required');
    if (!config.agent.tools || config.agent.tools.length === 0) {
      errors.push('agent.tools: must have at least one tool');
    }
  }

  // Tools
  if (!config.tools || config.tools.length === 0) {
    errors.push('tools: must have at least one tool');
  }

  // Surfaces
  if (config.surfaces) {
    for (let i = 0; i < config.surfaces.length; i++) {
      const s = config.surfaces[i];
      if (!s.id) errors.push(`surfaces[${i}].id: required`);
    }
  }

  // Canvas config
  if (config.canvasConfig) {
    const cc = config.canvasConfig;
    if (!cc.nodeType) errors.push('canvasConfig.nodeType: required');
    if (!cc.color || !/^#[0-9A-Fa-f]{6}$/.test(cc.color)) errors.push('canvasConfig.color: must be #RRGGBB');
    if (!cc.icon) errors.push('canvasConfig.icon: required');
    if (!cc.entityLabel) errors.push('canvasConfig.entityLabel: required');
  }

  return { valid: errors.length === 0, errors };
}
