/**
 * Pre-publish validation — mirrors server-side security checks.
 * No HTTP dependencies — runs entirely client-side.
 */

import type { ModulePackage, ValidationReport, ValidationIssue } from "../types/marketplace";

const FORBIDDEN_PATH_PREFIXES = ["/api/v1/admin/", "/api/v1/auth/", "/api/v1/marketplace/"];

const INJECTION_PATTERNS = [
  { pattern: /ignore (previous|all|the above) instructions/i, label: "instruction override" },
  { pattern: /you are now/i, label: "identity override" },
  { pattern: /pretend (you are|to be)/i, label: "identity impersonation" },
  { pattern: /disregard (your|the) (system|previous)/i, label: "system override" },
  { pattern: /act as (a|an) (different|new|another)/i, label: "role injection" },
  { pattern: /override (your|the) (instructions|prompt|system)/i, label: "override injection" },
  { pattern: /forget (everything|what|your)/i, label: "memory wipe attempt" },
  { pattern: /<\/?system>/i, label: "XML injection" },
  { pattern: /\[INST\]/i, label: "instruction delimiter injection" },
];

export function validateModuleForPublish(pkg: ModulePackage): ValidationReport {
  const issues: ValidationIssue[] = [];

  // ── Manifest ──────────────────────────────────────────────────────────────
  if (!pkg.manifest.name || pkg.manifest.name.trim().length < 3) {
    issues.push({ severity: "BLOCKER", field: "manifest.name", message: "Module name must be at least 3 characters" });
  }
  if (!pkg.manifest.slug || !/^[a-z0-9-]+$/.test(pkg.manifest.slug)) {
    issues.push({ severity: "BLOCKER", field: "manifest.slug", message: "Slug must be lowercase letters, numbers, and hyphens only" });
  }
  if (!pkg.manifest.moduleType || !/^[A-Z0-9_]+$/.test(pkg.manifest.moduleType)) {
    issues.push({ severity: "BLOCKER", field: "manifest.moduleType", message: "moduleType must be uppercase with underscores" });
  }
  if (!pkg.manifest.description || pkg.manifest.description.length < 20) {
    issues.push({ severity: "BLOCKER", field: "manifest.description", message: "Description must be at least 20 characters" });
  }
  if (!pkg.manifest.shortDescription || pkg.manifest.shortDescription.length > 150) {
    issues.push({ severity: "WARNING", field: "manifest.shortDescription", message: "shortDescription should be max 150 chars" });
  }
  const validCategories = ["Operations", "Sales", "HR", "Finance", "Marketing", "Legal", "Custom"];
  if (!validCategories.includes(pkg.manifest.category)) {
    issues.push({ severity: "WARNING", field: "manifest.category", message: `Category should be one of: ${validCategories.join(", ")}` });
  }

  // ── Tools ─────────────────────────────────────────────────────────────────
  if (!Array.isArray(pkg.tools) || pkg.tools.length === 0) {
    issues.push({ severity: "BLOCKER", field: "tools", message: "Module must define at least one tool" });
  }
  if (pkg.tools.length > 50) {
    issues.push({ severity: "BLOCKER", field: "tools", message: "Module cannot define more than 50 tools" });
  }

  const toolNames = new Set<string>();
  for (const tool of pkg.tools) {
    if (toolNames.has(tool.name)) {
      issues.push({ severity: "BLOCKER", field: "tools", tool: tool.name, message: `Duplicate tool name: ${tool.name}` });
    }
    toolNames.add(tool.name);

    if (!tool.path.startsWith("/api/v1/")) {
      issues.push({ severity: "BLOCKER", field: "path", tool: tool.name, message: `Tool path must start with /api/v1/. Got: ${tool.path}` });
    }
    for (const prefix of FORBIDDEN_PATH_PREFIXES) {
      if (tool.path.startsWith(prefix)) {
        issues.push({ severity: "BLOCKER", field: "path", tool: tool.name, message: `Path prefix '${prefix}' is forbidden` });
      }
    }
    if (/^https?:\/\//.test(tool.path)) {
      issues.push({ severity: "BLOCKER", field: "path", tool: tool.name, message: "External URLs are not allowed" });
    }
    if (!["GET", "POST", "PATCH", "DELETE"].includes(tool.method)) {
      issues.push({ severity: "BLOCKER", field: "method", tool: tool.name, message: `Invalid method: ${tool.method}` });
    }
    if (!tool.description || tool.description.length < 10) {
      issues.push({ severity: "WARNING", field: "description", tool: tool.name, message: "Tool should have a description of at least 10 characters" });
    }
    for (const [paramName, paramDef] of Object.entries(tool.parameters || {})) {
      if (!paramDef.type) {
        issues.push({ severity: "BLOCKER", field: `parameters.${paramName}`, tool: tool.name, message: `Parameter '${paramName}' must have a type` });
      }
      if (!paramDef.description) {
        issues.push({ severity: "WARNING", field: `parameters.${paramName}`, tool: tool.name, message: `Parameter '${paramName}' should have a description` });
      }
    }
  }

  // ── System prompt ─────────────────────────────────────────────────────────
  if (!pkg.systemPrompt || pkg.systemPrompt.length < 50) {
    issues.push({ severity: "BLOCKER", field: "systemPrompt", message: "System prompt must be at least 50 characters" });
  }
  if (pkg.systemPrompt && pkg.systemPrompt.length > 10000) {
    issues.push({ severity: "BLOCKER", field: "systemPrompt", message: "System prompt must be 10,000 characters or less" });
  }
  for (const { pattern, label } of INJECTION_PATTERNS) {
    if (pkg.systemPrompt && pattern.test(pkg.systemPrompt)) {
      issues.push({ severity: "BLOCKER", field: "systemPrompt", message: `Injection pattern detected: ${label}` });
    }
  }

  // ── Pricing ───────────────────────────────────────────────────────────────
  if (!["free", "paid", "subscription"].includes(pkg.pricing.type)) {
    issues.push({ severity: "BLOCKER", field: "pricing.type", message: "pricing.type must be 'free', 'paid', or 'subscription'" });
  }
  if (pkg.pricing.type === "paid") {
    if (!pkg.pricing.priceCents || pkg.pricing.priceCents < 100) {
      issues.push({ severity: "BLOCKER", field: "pricing.priceCents", message: "Paid modules must cost at least $1.00 (100 cents)" });
    }
    if (pkg.pricing.priceCents && pkg.pricing.priceCents > 100000) {
      issues.push({ severity: "WARNING", field: "pricing.priceCents", message: "Prices above $1,000 may reduce conversion" });
    }
  }
  if (pkg.pricing.type === "subscription") {
    if (!pkg.pricing.monthlyPriceCents || pkg.pricing.monthlyPriceCents < 100) {
      issues.push({ severity: "BLOCKER", field: "pricing.monthlyPriceCents", message: "Subscription modules must cost at least $1.00/mo" });
    }
  }

  // ── Scores ────────────────────────────────────────────────────────────────
  const blockers = issues.filter(i => i.severity === "BLOCKER");
  const warnings = issues.filter(i => i.severity === "WARNING");
  const securityScore = Math.max(1, Math.min(10, Math.round(
    10 - blockers.filter(b => ["path", "method", "systemPrompt"].includes(b.field)).length * 3 - warnings.length * 0.5
  )));
  const qualityScore = Math.max(1, Math.min(10, Math.round(
    10 - warnings.length * 0.5 - blockers.filter(b => b.field.startsWith("manifest") || b.field.startsWith("description")).length * 2
  )));

  return {
    passed: blockers.length === 0,
    readyToPublish: blockers.length === 0 && warnings.length < 5,
    issues, blockers, warnings, securityScore, qualityScore,
  };
}

export function validateModuleSecurity(pkg: ModulePackage): Pick<ValidationReport, "passed" | "blockers" | "securityScore"> {
  const report = validateModuleForPublish(pkg);
  return { passed: report.passed, blockers: report.blockers, securityScore: report.securityScore };
}
