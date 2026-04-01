/**
 * DAM (Digital Asset Management) Tools
 *
 * Models: Asset, AssetComment, AssetFolder, AssetLibrary, AssetVersion, File, Folder
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const uploadAssetHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "asset_stub_001",
      name: params.name,
      assetType: params.assetType,
      libraryId: params.libraryId,
      folderId: params.folderId || null,
      tags: params.tags || [],
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
      assetType: { type: "string", description: "Type of asset", enum: ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT", "OTHER"] },
      folderId: { type: "string", description: "Optional folder ID" },
      tags: { type: "array", items: { type: "string" }, description: "Tags for the asset" },
      description: { type: "string", description: "Asset description" },
      license: { type: "string", description: "License type" },
    },
    required: ["orgId", "libraryId", "name", "assetType"],
  },
  handler: uploadAssetHandler,
};

const listAssetsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      assets: [
        { id: "asset_stub_001", name: "Hero Image", assetType: "IMAGE", status: "APPROVED", libraryId: params.libraryId, createdAt: new Date().toISOString() },
        { id: "asset_stub_002", name: "Brand Video", assetType: "VIDEO", status: "PENDING", libraryId: params.libraryId, createdAt: new Date().toISOString() },
      ],
      total: 24,
      page: params.page || 1,
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
      assetType: { type: "string", description: "Filter by asset type", enum: ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT", "OTHER"] },
      status: { type: "string", description: "Filter by status", enum: ["PENDING", "APPROVED", "REJECTED", "ARCHIVED"] },
      tags: { type: "array", items: { type: "string" }, description: "Filter by tags" },
      search: { type: "string", description: "Text search query" },
      page: { type: "number", description: "Page number" },
      limit: { type: "number", description: "Items per page" },
    },
    required: ["libraryId"],
  },
  handler: listAssetsHandler,
};

const getAssetVersionsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      { id: "aver_stub_001", assetId: params.assetId, version: 1, fileId: "file_001", changeNote: "Initial upload", createdAt: new Date().toISOString(), createdById: "user_001" },
      { id: "aver_stub_002", assetId: params.assetId, version: 2, fileId: "file_002", changeNote: "Updated colors", createdAt: new Date().toISOString(), createdById: "user_001" },
    ],
  };
};

export const getAssetVersions: ToolDefinition = {
  name: "getAssetVersions",
  description: "List AssetVersion records for an asset",
  parameters: {
    type: "object",
    properties: {
      assetId: { type: "string", description: "Asset ID" },
    },
    required: ["assetId"],
  },
  handler: getAssetVersionsHandler,
};

const createAssetVersionHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "aver_stub_003",
      assetId: params.assetId,
      version: 3,
      fileId: params.fileId,
      changeNote: params.changeNote || null,
      createdById: "user_001",
      createdAt: new Date().toISOString(),
    },
  };
};

export const createAssetVersion: ToolDefinition = {
  name: "createAssetVersion",
  description: "Create a new AssetVersion for an existing asset",
  parameters: {
    type: "object",
    properties: {
      assetId: { type: "string", description: "Asset ID" },
      fileId: { type: "string", description: "New file ID for this version" },
      changeNote: { type: "string", description: "Description of changes" },
    },
    required: ["assetId", "fileId"],
  },
  handler: createAssetVersionHandler,
};

const createFolderHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "afolder_stub_001",
      name: params.name,
      path: `/${params.name}`,
      depth: params.parentId ? 1 : 0,
      libraryId: params.libraryId,
      parentId: params.parentId || null,
      description: params.description || null,
      color: params.color || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createFolder: ToolDefinition = {
  name: "createFolder",
  description: "Create an AssetFolder in a library",
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

const listFoldersHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      { id: "afolder_stub_001", name: "Campaign Assets", path: "/campaign-assets", depth: 0, libraryId: params.libraryId, parentId: null },
      { id: "afolder_stub_002", name: "Brand Guidelines", path: "/brand-guidelines", depth: 0, libraryId: params.libraryId, parentId: null },
    ],
  };
};

export const listFolders: ToolDefinition = {
  name: "listFolders",
  description: "List folders in a library",
  parameters: {
    type: "object",
    properties: {
      libraryId: { type: "string", description: "Asset library ID" },
      parentId: { type: "string", description: "Parent folder ID to list children" },
    },
    required: ["libraryId"],
  },
  handler: listFoldersHandler,
};

const searchAssetsHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      assets: [
        { id: "asset_stub_001", name: "Hero Image", assetType: "IMAGE", libraryId: "lib_001", relevanceScore: 0.95 },
        { id: "asset_stub_003", name: "Product Shot", assetType: "IMAGE", libraryId: "lib_002", relevanceScore: 0.82 },
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
      assetType: { type: "string", description: "Filter by asset type", enum: ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT", "OTHER"] },
      libraryId: { type: "string", description: "Filter by library" },
      tags: { type: "array", items: { type: "string" }, description: "Filter by tags" },
      limit: { type: "number", description: "Max results" },
    },
    required: ["orgId", "query"],
  },
  handler: searchAssetsHandler,
};

const createAssetLibraryHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "lib_stub_001",
      organizationId: params.orgId,
      name: params.name,
      slug: String(params.name).toLowerCase().replace(/\s+/g, "-"),
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
  description: "Create an AssetLibrary",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Library name" },
      libraryType: { type: "string", description: "Library type", enum: ["BRAND", "STOCK", "CLIENT", "GENERAL"] },
      visibility: { type: "string", description: "Library visibility", enum: ["INTERNAL", "CLIENT", "PUBLIC"] },
      clientId: { type: "string", description: "Associated client ID" },
      description: { type: "string", description: "Library description" },
    },
    required: ["orgId", "name"],
  },
  handler: createAssetLibraryHandler,
};

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
      authorId: "user_001",
      isResolved: false,
      createdAt: new Date().toISOString(),
    },
  };
};

export const addAssetComment: ToolDefinition = {
  name: "addAssetComment",
  description: "Create an AssetComment on an asset",
  parameters: {
    type: "object",
    properties: {
      assetId: { type: "string", description: "Asset ID" },
      content: { type: "string", description: "Comment content" },
      parentId: { type: "string", description: "Parent comment ID for threading" },
      annotationType: { type: "string", description: "Annotation type (e.g. pin, region)" },
      annotationData: { type: "string", description: "JSON annotation data" },
    },
    required: ["assetId", "content"],
  },
  handler: addAssetCommentHandler,
};

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
  description: "Resolve an AssetComment (set isResolved=true)",
  parameters: {
    type: "object",
    properties: {
      commentId: { type: "string", description: "Comment ID to resolve" },
    },
    required: ["commentId"],
  },
  handler: resolveAssetCommentHandler,
};
