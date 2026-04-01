/**
 * Presentations Tools
 *
 * Models: PitchDeck, DeckSlide, DeckTemplate
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const createDeckHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "deck_stub_001",
      organizationId: params.orgId,
      title: params.title,
      type: params.type,
      description: params.description || null,
      status: "DRAFT",
      slideCount: 0,
      templateId: params.templateId || null,
      clientId: params.clientId || null,
      dealId: params.dealId || null,
      projectId: params.projectId || null,
      presentationDate: params.presentationDate || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createDeck: ToolDefinition = {
  name: "createDeck",
  description: "Create a PitchDeck",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      title: { type: "string", description: "Deck title" },
      type: { type: "string", description: "Deck type", enum: ["PITCH", "PROPOSAL", "REPORT", "PORTFOLIO", "ONBOARDING", "OTHER"] },
      description: { type: "string", description: "Deck description" },
      templateId: { type: "string", description: "Template ID" },
      clientId: { type: "string", description: "Client ID" },
      dealId: { type: "string", description: "Deal ID" },
      projectId: { type: "string", description: "Project ID" },
      presentationDate: { type: "string", description: "Presentation date (ISO)" },
    },
    required: ["orgId", "title", "type"],
  },
  handler: createDeckHandler,
};

const listDecksHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      decks: [
        { id: "deck_stub_001", title: "Q1 Pitch", type: "PITCH", status: "DRAFT", slideCount: 12, createdAt: new Date().toISOString() },
        { id: "deck_stub_002", title: "Client Proposal", type: "PROPOSAL", status: "IN_REVIEW", slideCount: 8, createdAt: new Date().toISOString() },
      ],
      total: 2,
      page: 1,
    },
  };
};

export const listDecks: ToolDefinition = {
  name: "listDecks",
  description: "List pitch decks for an organization",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Filter by client" },
      dealId: { type: "string", description: "Filter by deal" },
      status: { type: "string", description: "Filter by status", enum: ["DRAFT", "IN_REVIEW", "APPROVED", "PRESENTED", "ARCHIVED"] },
    },
    required: ["orgId"],
  },
  handler: listDecksHandler,
};

const getDeckHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: params.deckId,
      title: "Q1 Pitch",
      type: "PITCH",
      status: "DRAFT",
      slides: [
        { id: "slide_001", orderIndex: 0, layoutType: "COVER", title: "Q1 Pitch Deck", content: {} },
        { id: "slide_002", orderIndex: 1, layoutType: "CONTENT", title: "Overview", content: {} },
      ],
      createdAt: new Date().toISOString(),
    },
  };
};

export const getDeck: ToolDefinition = {
  name: "getDeck",
  description: "Get a deck with all slides",
  parameters: {
    type: "object",
    properties: {
      deckId: { type: "string", description: "Deck ID" },
    },
    required: ["deckId"],
  },
  handler: getDeckHandler,
};

const addSlideHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "slide_stub_001",
      deckId: params.deckId,
      orderIndex: params.orderIndex,
      layoutType: params.layoutType,
      title: params.title || null,
      subtitle: params.subtitle || null,
      content: params.content || {},
      speakerNotes: params.speakerNotes || null,
      backgroundColor: params.backgroundColor || null,
      backgroundUrl: params.backgroundUrl || null,
      aiGenerated: params.aiGenerated || false,
      createdAt: new Date().toISOString(),
    },
  };
};

export const addSlide: ToolDefinition = {
  name: "addSlide",
  description: "Create a DeckSlide",
  parameters: {
    type: "object",
    properties: {
      deckId: { type: "string", description: "Deck ID" },
      orderIndex: { type: "number", description: "Slide order index" },
      layoutType: { type: "string", description: "Slide layout", enum: ["COVER", "TITLE", "CONTENT", "TWO_COLUMN", "IMAGE_FULL", "QUOTE", "METRICS", "TIMELINE", "TEAM", "CLOSING"] },
      title: { type: "string", description: "Slide title" },
      subtitle: { type: "string", description: "Slide subtitle" },
      content: { type: "string", description: "JSON slide content" },
      speakerNotes: { type: "string", description: "Speaker notes" },
      backgroundColor: { type: "string", description: "Background color" },
      backgroundUrl: { type: "string", description: "Background image URL" },
      aiGenerated: { type: "string", description: "Whether AI generated" },
    },
    required: ["deckId", "orderIndex", "layoutType"],
  },
  handler: addSlideHandler,
};

const reorderSlidesHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      deckId: params.deckId,
      slides: params.slides,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const reorderSlides: ToolDefinition = {
  name: "reorderSlides",
  description: "Reorder slides by accepting array of { slideId, orderIndex }",
  parameters: {
    type: "object",
    properties: {
      deckId: { type: "string", description: "Deck ID" },
      slides: { type: "array", items: { type: "string" }, description: "Array of { slideId, orderIndex } objects" },
    },
    required: ["deckId", "slides"],
  },
  handler: reorderSlidesHandler,
};

const deleteSlideHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: { success: true, slideId: params.slideId },
  };
};

export const deleteSlide: ToolDefinition = {
  name: "deleteSlide",
  description: "Remove a DeckSlide",
  parameters: {
    type: "object",
    properties: {
      slideId: { type: "string", description: "Slide ID to delete" },
    },
    required: ["slideId"],
  },
  handler: deleteSlideHandler,
};

const listTemplatesHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      { id: "dtpl_stub_001", name: "Corporate Pitch", type: "PITCH", isDefault: true, isActive: true, createdAt: new Date().toISOString() },
      { id: "dtpl_stub_002", name: "Creative Proposal", type: "PROPOSAL", isDefault: false, isActive: true, createdAt: new Date().toISOString() },
    ],
  };
};

export const listTemplates: ToolDefinition = {
  name: "listTemplates",
  description: "List DeckTemplate records",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      type: { type: "string", description: "Filter by deck type", enum: ["PITCH", "PROPOSAL", "REPORT", "PORTFOLIO", "ONBOARDING", "OTHER"] },
    },
    required: ["orgId"],
  },
  handler: listTemplatesHandler,
};

const createTemplateHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "dtpl_stub_003",
      organizationId: params.orgId,
      name: params.name,
      type: params.type,
      slideTemplates: params.slideTemplates,
      colorScheme: params.colorScheme || null,
      fonts: params.fonts || null,
      description: params.description || null,
      isDefault: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createTemplate: ToolDefinition = {
  name: "createTemplate",
  description: "Create a DeckTemplate",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Template name" },
      type: { type: "string", description: "Deck type", enum: ["PITCH", "PROPOSAL", "REPORT", "PORTFOLIO", "ONBOARDING", "OTHER"] },
      slideTemplates: { type: "string", description: "JSON slide templates" },
      colorScheme: { type: "string", description: "JSON color scheme" },
      fonts: { type: "string", description: "JSON font configuration" },
      description: { type: "string", description: "Template description" },
    },
    required: ["orgId", "name", "type", "slideTemplates"],
  },
  handler: createTemplateHandler,
};

const exportDeckHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      exportUrl: "https://cdn.spokestack.io/exports/deck_stub_001.pptx",
      format: params.format || "PPTX",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    },
  };
};

export const exportDeck: ToolDefinition = {
  name: "exportDeck",
  description: "Export a deck to PPTX, PDF, or Google Slides",
  parameters: {
    type: "object",
    properties: {
      deckId: { type: "string", description: "Deck ID" },
      format: { type: "string", description: "Export format", enum: ["PPTX", "PDF", "GOOGLE_SLIDES"] },
    },
    required: ["deckId"],
  },
  handler: exportDeckHandler,
};

const syncDeckToGoogleSlidesHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      deckId: params.deckId,
      googleSlidesId: "stub_google_id",
      lastSyncedAt: new Date().toISOString(),
    },
  };
};

export const syncDeckToGoogleSlides: ToolDefinition = {
  name: "syncDeckToGoogleSlides",
  description: "Sync a deck to Google Slides",
  parameters: {
    type: "object",
    properties: {
      deckId: { type: "string", description: "Deck ID" },
    },
    required: ["deckId"],
  },
  handler: syncDeckToGoogleSlidesHandler,
};
