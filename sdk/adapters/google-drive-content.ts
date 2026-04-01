/**
 * Google Drive → Content Studio adapter (read-only)
 * Lists files and maps metadata to Content Studio asset references.
 */

import type { NangoAdapter, SyncResult } from "../types/adapter";
import { CORE_API_URL, AGENT_SECRET } from "./config";

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
  parents: string[];
  thumbnailLink?: string;
}

interface InternalAsset {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageUrl: string;
  importSource: "google_drive";
  importSourceId: string;
  metadata: Record<string, unknown>;
}

export const googleDriveContentAdapter: NangoAdapter<InternalAsset, GoogleDriveFile> = {
  provider: "google-drive",
  moduleType: "CONTENT_STUDIO",

  async fetchExternal(connectionId: string, params: Record<string, unknown> = {}): Promise<GoogleDriveFile[]> {
    const res = await fetch(`${CORE_API_URL}/api/v1/integrations/proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Agent-Secret': AGENT_SECRET,
        'X-Org-Id': (params.organizationId as string) || '',
      },
      body: JSON.stringify({
        provider: 'google-drive',
        connectionId,
        endpoint: '/drive/v3/files',
        method: 'GET',
        params: { q: 'trashed=false', fields: 'files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,thumbnailLink)' },
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.files ?? [];
  },

  toInternal(external: GoogleDriveFile): InternalAsset {
    return {
      fileName: external.name,
      mimeType: external.mimeType,
      sizeBytes: parseInt(external.size, 10) || 0,
      storageUrl: external.webViewLink,
      importSource: "google_drive",
      importSourceId: external.id,
      metadata: {
        thumbnailLink: external.thumbnailLink,
        parents: external.parents,
        modifiedTime: external.modifiedTime,
      },
    };
  },

  toExternal(internal: InternalAsset): Partial<GoogleDriveFile> {
    // Read-only — no write-back in Phase 6
    return {
      name: internal.fileName,
      mimeType: internal.mimeType,
    };
  },

  async sync(connectionId: string, orgId: string): Promise<SyncResult> {
    const result: SyncResult = { created: 0, updated: 0, skipped: 0, errors: [] };
    try {
      const records = await this.fetchExternal(connectionId, { organizationId: orgId });
      for (const record of records) {
        try {
          this.toInternal(record);
          result.created++;
        } catch (err) {
          result.errors.push(`Failed to map file ${record.id}: ${(err as Error).message}`);
        }
      }
    } catch (err) {
      result.errors.push(`Fetch failed: ${(err as Error).message}`);
    }
    return result;
  },
};
