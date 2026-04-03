/**
 * Marketplace Types — shared across packaging, validation, publishing, and templates.
 */

// ─── Tool Definitions ──────────────────────────────────────────────────────

export interface ParameterDefinition {
  type: "string" | "number" | "boolean" | "array" | "object";
  description?: string;
  required?: boolean;
  enum?: string[];
  items?: { type: string };
  properties?: Record<string, ParameterDefinition>;
}

export interface MarketplaceToolDefinition {
  name: string;
  description: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  parameters?: Record<string, ParameterDefinition>;
  returns?: { description: string; schema?: Record<string, unknown> };
}

// ─── Module Package ────────────────────────────────────────────────────────

export interface MarketplaceManifest {
  name: string;
  slug: string;
  moduleType: string;
  description: string;
  shortDescription: string;
  category: string;
  industry?: string;
  version: string;
  author?: string;
  homepage?: string;
}

export interface ModulePricing {
  type: "free" | "paid" | "subscription";
  priceCents?: number;
  monthlyPriceCents?: number;
  currency?: string;
  trialDays?: number;
}

export interface ModulePackage {
  manifest: MarketplaceManifest;
  tools: MarketplaceToolDefinition[];
  systemPrompt: string;
  uiTemplate?: string;
  pricing: ModulePricing;
  hash: string;
  packagedAt: string;
}

// ─── Validation ────────────────────────────────────────────────────────────

export interface ValidationIssue {
  severity: "BLOCKER" | "WARNING" | "INFO";
  field: string;
  tool?: string;
  message: string;
}

export interface ValidationReport {
  passed: boolean;
  readyToPublish: boolean;
  issues: ValidationIssue[];
  blockers: ValidationIssue[];
  warnings: ValidationIssue[];
  securityScore: number;
  qualityScore: number;
}

// ─── Publishing ────────────────────────────────────────────────────────────

export interface PublishResult {
  ok: boolean;
  moduleId: string;
  slug: string;
  status: "PENDING_REVIEW" | "PUBLISHED";
  securityScore: number;
  warnings: ValidationIssue[];
  message: string;
  marketplaceUrl: string;
}

export interface UpdateResult {
  ok: boolean;
  version: string;
  status: string;
}
