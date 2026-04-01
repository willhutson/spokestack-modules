/**
 * Module Manifest Validator
 *
 * validateManifest() checks that a manifest has all required fields,
 * tools array is non-empty, surfaces have IDs, and migrations are defined.
 * Used before install and during publish.
 */

import type { ModuleManifest, ValidationResult, SurfaceDefinition } from "../types/index";

const VALID_TIERS = ["FREE", "STARTER", "PRO", "BUSINESS", "ENTERPRISE"];
const VALID_CATEGORIES = ["core", "marketing", "ops", "analytics", "custom"];
const VALID_SURFACE_TYPES = ["dashboard", "sidebar", "modal", "full-page"];

export function validateManifest(manifest: ModuleManifest): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required string fields
  if (!manifest.id) errors.push("Missing required field: id");
  if (!manifest.moduleType) errors.push("Missing required field: moduleType");
  if (!manifest.name) errors.push("Missing required field: name");
  if (!manifest.version) errors.push("Missing required field: version");
  if (!manifest.description) errors.push("Missing required field: description");
  if (!manifest.category) errors.push("Missing required field: category");
  if (!manifest.minTier) errors.push("Missing required field: minTier");

  // Version format
  if (manifest.version && !/^\d+\.\d+\.\d+/.test(manifest.version)) {
    errors.push("version must be valid semver (e.g. 1.0.0)");
  }

  // Category validation
  if (manifest.category && !VALID_CATEGORIES.includes(manifest.category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }

  // Tier validation
  if (manifest.minTier && !VALID_TIERS.includes(manifest.minTier)) {
    errors.push(`minTier must be one of: ${VALID_TIERS.join(", ")}`);
  }

  // Agent definition
  if (!manifest.agentDefinition) {
    errors.push("Missing required field: agentDefinition");
  } else {
    if (!manifest.agentDefinition.name) errors.push("agentDefinition.name is required");
    if (!manifest.agentDefinition.path) errors.push("agentDefinition.path is required");
  }

  // Tools
  if (!manifest.tools || manifest.tools.length === 0) {
    errors.push("tools array must contain at least one tool name");
  }

  // Surfaces
  if (!manifest.surfaces || manifest.surfaces.length === 0) {
    warnings.push("No surfaces defined — module will have no UI");
  } else {
    for (const surface of manifest.surfaces) {
      validateSurface(surface, errors);
    }
  }

  // Migrations
  if (!manifest.migrations) {
    warnings.push("No migrations defined — module has no install/uninstall scripts");
  } else {
    if (!manifest.migrations.install) errors.push("migrations.install path is required");
    if (!manifest.migrations.uninstall) errors.push("migrations.uninstall path is required");
  }

  // Price
  if (manifest.price !== undefined && manifest.price < 0) {
    errors.push("price must be non-negative");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateSurface(surface: SurfaceDefinition, errors: string[]): void {
  if (!surface.id) {
    errors.push("Surface missing required field: id");
  }
  if (!surface.type) {
    errors.push(`Surface '${surface.id}': missing required field: type`);
  } else if (!VALID_SURFACE_TYPES.includes(surface.type)) {
    errors.push(`Surface '${surface.id}': type must be one of: ${VALID_SURFACE_TYPES.join(", ")}`);
  }
  if (surface.type === "full-page" && !surface.route) {
    errors.push(`Surface '${surface.id}': full-page surfaces must have a route`);
  }
  if (!surface.requiredTools || surface.requiredTools.length === 0) {
    errors.push(`Surface '${surface.id}': requiredTools must contain at least one tool`);
  }
}
