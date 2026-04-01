/**
 * DAM (Digital Asset Management) Tools
 *
 * Models: Asset, AssetComment, AssetFolder, AssetLibrary, AssetVersion, File, Folder
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// uploadAsset
// ---------------------------------------------------------------------------

const uploadAssetHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "asset_stub_001",
      name: params.name,
      assetType: params.assetType,
      libraryId: params.libraryId,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    },
  };
};

export const uploadAsset: ToolDefinition = {
  name: "uploadAsset",
  description: "Upload a file to the DAM and register it as an Asset",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      libraryId: { type: "string", description: "Asset library ID" },
      name: { type: "string", description: "Asset name" },
      assetType: {
        type: "string",
        description: "Type of asset",
        enum: ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT", "OTHER"],
      },
      folderId: { type: "string", description: "Optional folder ID" },
      fileUrl: { type: "string", description: "URL of the file to upload" },
      tags: { type: "array", items: { type: "string" }, description: "Tags for the asset" },
      metadata: { type: "object", description: "Additional metadata key-value pairs" },
      description: { type: "string", description: "Asset description" },
      license: { type: "string", description: "License type" },
    },
    required: ["libraryId", "name", "assetType", "fileUrl"],
  },
  handler: uploadAssetHandler,
};

// ---------------------------------------------------------------------------
// listAssets
// ---------------------------------------------------------------------------

const listAssetsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      assets: [
        {
          id: "asset_stub_001",
          name: "Brand Logo",
          assetType: "IMAGE",
          status: "APPROVED",
          libraryId: params.libraryId,
          createdAt: new Date().toISOString(),
        },
        {
          id: "asset_stub_002",
          name: "Product Video",
          assetType: "VIDEO",
          status: "PENDING",
          libraryId: params.libraryId,
          createdAt: new Date().toISOString(),
        },
      ],
      total: 24,
      page: (params.page as number) || 1,
    },
  };
};

export const listAssets: ToolDefinition = {
  name: "listAssets",
  description: "List assets in a library with optional filters",
  parameters: {
    type: "object",
    properties: {
      libraryId: { type: "string", description: "Asset library ID" },
      folderId: { type: "string", description: "Filter by folder" },
      assetType: {
        type: "string",
        description: "Filter by asset type",
        enum: ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT", "OTHER"],
      },
      status: {
        type: "string",
        description: "Filter by status",
        enum: ["PENDING", "APPROVED", "REJECTED", "ARCHIVED"],
      },
      tags: { type: "array", items: { type: "string" }, description: "Filter by tags" },
      search: { type: "string", description: "Text search" },
      page: { type: "number", description: "Page number", minimum: 1 },
      limit: { type: "number", description: "Results per page", minimum: 1, maximum: 100 },
    },
    required: ["libraryId"],
  },
  handler: listAssetsHandler,
};

// ---------------------------------------------------------------------------
// getAssetVersions
// ---------------------------------------------------------------------------

const getAssetVersionsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      {
        id: "av_stub_001",
        assetId: params.assetId,
        version: 1,
        fileId: "file_stub_001",
        changeNote: "Initial upload",
        createdAt: new Date().toISOString(),
        createdById: "user_stub_001",
      },
      {
        id: "av_stub_002",
        assetId: params.assetId,
        version: 2,
        fileId: "file_stub_002",
        changeNote: "Updated colors",
        createdAt: new Date().toISOString(),
        createdById: "user_stub_001",
      },
    ],
  };
};

export const getAssetVersions: ToolDefinition = {
  name: "getAssetVersions",
  description: "List all version records for an asset",
  parameters: {
    type: "object",
    properties: {
      assetId: { type: "string", description: "Asset ID" },
    },
    required: ["assetId"],
  },
  handler: getAssetVersionsHandler,
};

// ---------------------------------------------------------------------------
// createAssetVersion
// ---------------------------------------------------------------------------

const createAssetVersionHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "av_stub_new",
      assetId: params.assetId,
      version: 3,
      fileId: params.fileId,
      changeNote: params.changeNote || null,
      createdAt: new Date().toISOString(),
      createdById: "user_stub_001",
    },
  };
};

export const createAssetVersion: ToolDefinition = {
  name: "createAssetVersion",
  description: "Create a new version for an existing asset",
  parameters: {
    type: "object",
    properties: {
      assetId: { type: "string", description: "Asset ID" },
      fileId: { type: "string", description: "File ID for the new version" },
      changeNote: { type: "string", description: "Description of changes" },
    },
    required: ["assetId", "fileId"],
  },
  handler: createAssetVersionHandler,
};

// ---------------------------------------------------------------------------
// createFolder
// ---------------------------------------------------------------------------

const createFolderHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "folder_stub_001",
      name: params.name,
      path: `/${params.name}`,
      depth: 0,
      libraryId: params.libraryId,
      description: params.description || null,
      color: params.color || null,
    },
  };
};

export const createFolder: ToolDefinition = {
  name: "createFolder",
  description: "Create an asset folder in a library",
  parameters: {
    type: "object",
    properties: {
      libraryId: { type: "string", description: "Asset library ID" },
      name: { type: "string", description: "Folder name" },
      parentId: { type: "string", description: "Parent folder ID" },
      description: { type: "string", description: "Folder description" },
      color: { type: "string", description: "Folder color" },
    },
    required: ["libraryId", "name"],
  },
  handler: createFolderHandler,
};

// ---------------------------------------------------------------------------
// listFolders
// ---------------------------------------------------------------------------

const listFoldersHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      {
        id: "folder_stub_001",
        name: "Brand",
        path: "/Brand",
        depth: 0,
        libraryId: params.libraryId,
        children: [
          {
            id: "folder_stub_002",
            name: "Logos",
            path: "/Brand/Logos",
            depth: 1,
            libraryId: params.libraryId,
            children: [],
          },
        ],
      },
    ],
  };
};

export const listFolders: ToolDefinition = {
  name: "listFolders",
  description: "List folders in a library as a tree structure",
  parameters: {
    type: "object",
    properties: {
      libraryId: { type: "string", description: "Asset library ID" },
      parentId: { type: "string", description: "Filter by parent folder" },
    },
    required: ["libraryId"],
  },
  handler: listFoldersHandler,
};

// ---------------------------------------------------------------------------
// searchAssets
// ---------------------------------------------------------------------------

const searchAssetsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      assets: [
        {
          id: "asset_stub_003",
          name: "Campaign Hero Image",
          assetType: "IMAGE",
          libraryId: "lib_stub_001",
          relevanceScore: 0.95,
          status: "APPROVED",
        },
        {
          id: "asset_stub_004",
          name: "Campaign Video",
          assetType: "VIDEO",
          libraryId: "lib_stub_002",
          relevanceScore: 0.82,
          status: "APPROVED",
        },
      ],
      total: 2,
    },
  };
};

export const searchAssets: ToolDefinition = {
  name: "searchAssets",
  description: "Cross-library search for assets",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      query: { type: "string", description: "Search query" },
      assetType: {
        type: "string",
        description: "Filter by asset type",
        enum: ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT", "OTHER"],
      },
      libraryId: { type: "string", description: "Filter to a specific library" },
      tags: { type: "array", items: { type: "string" }, description: "Filter by tags" },
      limit: { type: "number", description: "Max results", minimum: 1, maximum: 100 },
    },
    required: [],
  },
  handler: searchAssetsHandler,
};

// ---------------------------------------------------------------------------
// createAssetLibrary
// ---------------------------------------------------------------------------

const createAssetLibraryHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "lib_stub_new",
      organizationId: params.orgId,
      name: params.name,
      slug: (params.name as string).toLowerCase().replace(/\s+/g, "-"),
      libraryType: params.libraryType || "GENERAL",
      visibility: params.visibility || "INTERNAL",
      clientId: params.clientId || null,
      description: params.description || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createAssetLibrary: ToolDefinition = {
  name: "createAssetLibrary",
  description: "Create a new asset library",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Library name" },
      libraryType: {
        type: "string",
        description: "Library type",
        enum: ["BRAND", "STOCK", "CLIENT", "GENERAL"],
      },
      visibility: {
        type: "string",
        description: "Visibility level",
        enum: ["INTERNAL", "CLIENT", "PUBLIC"],
      },
      clientId: { type: "string", description: "Associated client ID" },
      description: { type: "string", description: "Library description" },
    },
    required: ["orgId", "name"],
  },
  handler: createAssetLibraryHandler,
};

// ---------------------------------------------------------------------------
// addAssetComment
// ---------------------------------------------------------------------------

const addAssetCommentHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "acomment_stub_001",
      assetId: params.assetId,
      content: params.content,
      parentId: params.parentId || null,
      annotationType: params.annotationType || null,
      annotationData: params.annotationData || null,
      authorId: "user_stub_001",
      isResolved: false,
      createdAt: new Date().toISOString(),
    },
  };
};

export const addAssetComment: ToolDefinition = {
  name: "addAssetComment",
  description: "Add a comment to an asset",
  parameters: {
    type: "object",
    properties: {
      assetId: { type: "string", description: "Asset ID" },
      content: { type: "string", description: "Comment content" },
      parentId: { type: "string", description: "Parent comment ID for threading" },
      annotationType: { type: "string", description: "Type of annotation" },
      annotationData: { type: "string", description: "Annotation data (JSON)" },
    },
    required: ["assetId", "content"],
  },
  handler: addAssetCommentHandler,
};

// ---------------------------------------------------------------------------
// resolveAssetComment
// ---------------------------------------------------------------------------

const resolveAssetCommentHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: params.commentId,
      isResolved: true,
      resolvedAt: new Date().toISOString(),
    },
  };
};

export const resolveAssetComment: ToolDefinition = {
  name: "resolveAssetComment",
  description: "Resolve an asset comment",
  parameters: {
    type: "object",
    properties: {
      commentId: { type: "string", description: "Comment ID to resolve" },
    },
    required: ["commentId"],
  },
  handler: resolveAssetCommentHandler,
};
