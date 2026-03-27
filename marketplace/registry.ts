/**
 * Module Registry — discovery, search, and listing for the marketplace.
 */

import type { ModuleManifest } from "../sdk/types/manifest";

export interface RegistryEntry {
  manifest: ModuleManifest;
  publishedAt: string;
  downloads: number;
  rating: number;
  verified: boolean;
}

export interface RegistrySearchParams {
  query?: string;
  tier?: string;
  pricingModel?: string;
  sortBy?: "name" | "downloads" | "rating" | "publishedAt";
  limit?: number;
  offset?: number;
}

export interface RegistrySearchResult {
  entries: RegistryEntry[];
  total: number;
  hasMore: boolean;
}

export class ModuleRegistry {
  private entries: Map<string, RegistryEntry> = new Map();

  /** Register a new module in the marketplace */
  register(manifest: ModuleManifest): RegistryEntry {
    const entry: RegistryEntry = {
      manifest,
      publishedAt: new Date().toISOString(),
      downloads: 0,
      rating: 0,
      verified: false,
    };
    this.entries.set(manifest.name, entry);
    return entry;
  }

  /** Get a specific module by name */
  get(name: string): RegistryEntry | undefined {
    return this.entries.get(name);
  }

  /** Search the registry */
  search(params: RegistrySearchParams): RegistrySearchResult {
    let results = Array.from(this.entries.values());

    // Filter by query
    if (params.query) {
      const q = params.query.toLowerCase();
      results = results.filter(
        (e) =>
          e.manifest.name.toLowerCase().includes(q) ||
          e.manifest.displayName.toLowerCase().includes(q) ||
          e.manifest.description.toLowerCase().includes(q),
      );
    }

    // Filter by tier
    if (params.tier) {
      results = results.filter((e) => e.manifest.tier.minimum === params.tier);
    }

    // Filter by pricing model
    if (params.pricingModel) {
      results = results.filter((e) => e.manifest.pricing.model === params.pricingModel);
    }

    // Sort
    const sortBy = params.sortBy || "publishedAt";
    results.sort((a, b) => {
      if (sortBy === "name") return a.manifest.name.localeCompare(b.manifest.name);
      if (sortBy === "downloads") return b.downloads - a.downloads;
      if (sortBy === "rating") return b.rating - a.rating;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    // Paginate
    const offset = params.offset || 0;
    const limit = params.limit || 20;
    const paginated = results.slice(offset, offset + limit);

    return {
      entries: paginated,
      total: results.length,
      hasMore: offset + limit < results.length,
    };
  }

  /** List all modules */
  list(): RegistryEntry[] {
    return Array.from(this.entries.values());
  }

  /** Check if a module exists */
  has(name: string): boolean {
    return this.entries.has(name);
  }

  /** Mark a module as verified */
  verify(name: string): void {
    const entry = this.entries.get(name);
    if (entry) entry.verified = true;
  }

  /** Increment download count */
  recordDownload(name: string): void {
    const entry = this.entries.get(name);
    if (entry) entry.downloads++;
  }
}
