/**
 * Publishing Client — HTTP client for the SpokeStack Marketplace API.
 */

import type { ModulePackage, PublishResult, UpdateResult } from "../types/marketplace";

export interface PublishingClientOptions {
  baseUrl?: string;
  authToken: string;
}

export async function publishModule(pkg: ModulePackage, options: PublishingClientOptions): Promise<PublishResult> {
  const baseUrl = options.baseUrl || "https://app.spokestack.dev";
  const response = await fetch(`${baseUrl}/api/v1/marketplace/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${options.authToken}` },
    body: JSON.stringify({
      manifest: pkg.manifest, tools: pkg.tools, systemPrompt: pkg.systemPrompt,
      uiTemplate: pkg.uiTemplate, pricing: pkg.pricing, slug: pkg.manifest.slug, packageHash: pkg.hash,
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new PublishError(`Publish failed (${response.status}): ${error.error || JSON.stringify(error)}`, response.status, error);
  }
  const result = await response.json();
  return { ...result, marketplaceUrl: `${baseUrl}/marketplace/${pkg.manifest.slug}` };
}

export async function updateModule(moduleId: string, pkg: Partial<ModulePackage>, options: PublishingClientOptions): Promise<UpdateResult> {
  const baseUrl = options.baseUrl || "https://app.spokestack.dev";
  const response = await fetch(`${baseUrl}/api/v1/marketplace/${moduleId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${options.authToken}` },
    body: JSON.stringify({
      ...(pkg.tools && { tools: pkg.tools }), ...(pkg.systemPrompt && { systemPrompt: pkg.systemPrompt }),
      ...(pkg.manifest && { manifest: pkg.manifest }), ...(pkg.pricing && { pricing: pkg.pricing }),
      ...(pkg.uiTemplate !== undefined && { uiTemplate: pkg.uiTemplate }),
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new PublishError(`Update failed (${response.status}): ${error.error}`, response.status, error);
  }
  return response.json();
}

export async function unpublishModule(moduleId: string, options: PublishingClientOptions): Promise<{ ok: boolean; message: string }> {
  const baseUrl = options.baseUrl || "https://app.spokestack.dev";
  const response = await fetch(`${baseUrl}/api/v1/marketplace/${moduleId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${options.authToken}` },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new PublishError(`Unpublish failed (${response.status}): ${error.error}`, response.status, error);
  }
  return response.json();
}

export class PublishError extends Error {
  constructor(message: string, public readonly statusCode: number, public readonly details: unknown) {
    super(message);
    this.name = "PublishError";
  }
}
