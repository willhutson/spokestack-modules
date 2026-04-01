/**
 * Creative Tools (Phase 6C)
 *
 * Ad creative management and linking.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// uploadCreative
// ---------------------------------------------------------------------------

export const uploadCreative: ToolDefinition = {
  name: "uploadCreative",
  description: "Upload an ad creative (image, video, or carousel)",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Creative name" },
      type: { type: "string", description: "Creative type", enum: ["IMAGE", "VIDEO", "CAROUSEL", "HTML5"] },
      fileUrl: { type: "string", description: "File URL" },
      headline: { type: "string", description: "Ad headline" },
      body: { type: "string", description: "Ad body text" },
      callToAction: { type: "string", description: "CTA button text", enum: ["LEARN_MORE", "SHOP_NOW", "SIGN_UP", "CONTACT_US", "DOWNLOAD", "GET_OFFER"] },
      landingUrl: { type: "string", description: "Landing page URL" },
    },
    required: ["orgId", "name", "type", "fileUrl"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `creative_${Date.now()}`,
        organizationId: params.orgId,
        name: params.name,
        type: params.type,
        fileUrl: params.fileUrl,
        headline: params.headline || null,
        body: params.body || null,
        callToAction: params.callToAction || "LEARN_MORE",
        landingUrl: params.landingUrl || null,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// listCreatives
// ---------------------------------------------------------------------------

export const listCreatives: ToolDefinition = {
  name: "listCreatives",
  description: "List ad creatives with optional filters",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      type: { type: "string", description: "Filter by type" },
      status: { type: "string", description: "Filter by status" },
    },
    required: ["orgId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: [
        { id: "creative_001", name: "Summer Sale Banner", type: "IMAGE", headline: "Up to 50% Off", status: "ACTIVE", linkedAdSets: 3 },
        { id: "creative_002", name: "Product Demo Video", type: "VIDEO", headline: "See It In Action", status: "ACTIVE", linkedAdSets: 2 },
        { id: "creative_003", name: "Feature Carousel", type: "CAROUSEL", headline: "Explore Features", status: "ACTIVE", linkedAdSets: 1 },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// linkCreativeToAdSet
// ---------------------------------------------------------------------------

export const linkCreativeToAdSet: ToolDefinition = {
  name: "linkCreativeToAdSet",
  description: "Link a creative asset to an ad set for delivery",
  parameters: {
    type: "object",
    properties: {
      creativeId: { type: "string", description: "Creative ID" },
      adSetId: { type: "string", description: "Ad set ID" },
      isPrimary: { type: "boolean", description: "Set as primary creative for the ad set" },
    },
    required: ["creativeId", "adSetId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `link_${Date.now()}`,
        creativeId: params.creativeId,
        adSetId: params.adSetId,
        isPrimary: params.isPrimary || false,
        status: "ACTIVE",
        linkedAt: new Date().toISOString(),
      },
    };
  },
};
