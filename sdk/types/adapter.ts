/**
 * Nango Adapter Interface — SDK type for external service integrations.
 * Each adapter maps between an external service (via Nango proxy) and
 * a SpokeStack module's internal data format.
 */

export interface NangoAdapter<TInternal = unknown, TExternal = unknown> {
  /** Nango provider ID (e.g., 'asana') */
  provider: string;

  /** SpokeStack module this adapter serves */
  moduleType: string;

  /** Fetch records from the external service via Nango proxy */
  fetchExternal(connectionId: string, params: Record<string, unknown>): Promise<TExternal[]>;

  /** Transform one external record to internal format */
  toInternal(external: TExternal): TInternal;

  /** Transform one internal record to external format */
  toExternal(internal: TInternal): Partial<TExternal>;

  /** Sync: pull from external, upsert internally */
  sync(connectionId: string, orgId: string): Promise<SyncResult>;
}

export interface SyncResult {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}
