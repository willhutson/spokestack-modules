/**
 * Google Drive → Content Studio adapter (read-only)
 * Lists files and maps metadata to Content Studio asset references.
 */

import type { NangoAdapter, SyncResult } from "../types/adapter";

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

  async fetchExternal(connectionId, params): Promise<GoogleDriveFile[]> {
    // Phase 6C: call nango.proxy({ connectionId, method: 'GET', endpoint: '/drive/v3/files', params: { fields: 'files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,parents,thumbnailLink)' } })
    return [];
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

  async sync(connectionId, orgId): Promise<SyncResult> {
    return { created: 0, updated: 0, skipped: 0, errors: ["Phase 6C: implement real sync"] };
  },
};
