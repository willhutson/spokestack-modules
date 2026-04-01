/**
 * Presentations Tools
 *
 * Models: PitchDeck, DeckSlide, DeckTemplate
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createDeck
// ---------------------------------------------------------------------------

const createDeckHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "deck_stub_001",
      organizationId: params.orgId,
      title: params.title,
      type: params.type,
      status: "DRAFT",
      slideCount: 0,
      description: params.description || null,
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
  description: "Create a new pitch deck",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      title: { type: "string", description: "Deck title" },
      type: {
        type: "string",
        description: "Deck type",
        enum: ["PITCH", "PROPOSAL", "REPORT", "PORTFOLIO", "ONBOARDING", "OTHER"],
      },
      description: { type: "string", description: "Deck description" },
      templateId: { type: "string", description: "Template ID to use" },
      clientId: { type: "string", description: "Client ID" },
      dealId: { type: "string", description: "Deal ID" },
      projectId: { type: "string", description: "Project ID" },
      presentationDate: { type: "string", description: "Presentation date (ISO)" },
    },
    required: ["orgId", "title", "type"],
  },
  handler: createDeckHandler,
};

// ---------------------------------------------------------------------------
// listDecks
// ---------------------------------------------------------------------------

const listDecksHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      decks: [
        {
          id: "deck_stub_001",
          title: "Q2 Client Pitch",
          type: "PITCH",
          status: "DRAFT",
          slideCount: 12,
          organizationId: params.orgId,
          createdAt: new Date().toISOString(),
        },
        {
          id: "deck_stub_002",
          title: "Annual Report",
          type: "REPORT",
          status: "IN_REVIEW",
          slideCount: 24,
          organizationId: params.orgId,
          createdAt: new Date().toISOString(),
        },
      ],
      total: 2,
      page: (params.page as number) || 1,
    },
  };
};

export const listDecks: ToolDefinition = {
  name: "listDecks",
  description: "List pitch decks with optional filters",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Filter by client" },
      dealId: { type: "string", description: "Filter by deal" },
      status: {
        type: "string",
        description: "Filter by status",
        enum: ["DRAFT", "IN_REVIEW", "APPROVED", "PRESENTED", "ARCHIVED"],
      },
      page: { type: "number", description: "Page number", minimum: 1 },
      limit: { type: "number", description: "Results per page", minimum: 1, maximum: 100 },
    },
    required: ["orgId"],
  },
  handler: listDecksHandler,
};

// ---------------------------------------------------------------------------
// getDeck
// ---------------------------------------------------------------------------

const getDeckHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: params.deckId,
      title: "Q2 Client Pitch",
      type: "PITCH",
      status: "DRAFT",
      slides: [
        { id: "slide_001", orderIndex: 0, layoutType: "COVER", title: "Q2 Pitch" },
        { id: "slide_002", orderIndex: 1, layoutType: "CONTENT", title: "Our Approach" },
        { id: "slide_003", orderIndex: 2, layoutType: "METRICS", title: "Key Results" },
      ],
      createdAt: new Date().toISOString(),
    },
  };
};

export const getDeck: ToolDefinition = {
  name: "getDeck",
  description: "Get a deck with all its slides",
  parameters: {
    type: "object",
    properties: {
      deckId: { type: "string", description: "Deck ID" },
    },
    required: ["deckId"],
  },
  handler: getDeckHandler,
};

// ---------------------------------------------------------------------------
// addSlide
// ---------------------------------------------------------------------------

const addSlideHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "slide_stub_new",
      deckId: params.deckId,
      orderIndex: params.orderIndex,
      layoutType: params.layoutType,
      title: params.title || null,
      subtitle: params.subtitle || null,
      content: params.content,
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
  description: "Add a slide to a deck",
  parameters: {
    type: "object",
    properties: {
      deckId: { type: "string", description: "Deck ID" },
      orderIndex: { type: "number", description: "Position in deck" },
      layoutType: {
        type: "string",
        description: "Slide layout type",
        enum: [
          "COVER", "TITLE", "CONTENT", "TWO_COLUMN", "IMAGE_FULL",
          "QUOTE", "METRICS", "TIMELINE", "TEAM", "CLOSING",
        ],
      },
      title: { type: "string", description: "Slide title" },
      subtitle: { type: "string", description: "Slide subtitle" },
      content: { type: "string", description: "Slide content (JSON)" },
      speakerNotes: { type: "string", description: "Speaker notes" },
      backgroundColor: { type: "string", description: "Background color" },
      backgroundUrl: { type: "string", description: "Background image URL" },
      aiGenerated: { type: "string", description: "Whether AI generated (true/false)" },
    },
    required: ["deckId", "orderIndex", "layoutType", "content"],
  },
  handler: addSlideHandler,
};

// ---------------------------------------------------------------------------
// reorderSlides
// ---------------------------------------------------------------------------

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
  description: "Reorder slides in a deck",
  parameters: {
    type: "object",
    properties: {
      deckId: { type: "string", description: "Deck ID" },
      slides: {
        type: "array",
        items: { type: "string" },
        description: "Array of { slideId, orderIndex } objects",
      },
    },
    required: ["deckId", "slides"],
  },
  handler: reorderSlidesHandler,
};

// ---------------------------------------------------------------------------
// deleteSlide
// ---------------------------------------------------------------------------

const deleteSlideHandler: ToolHandler = async () => {
  return {
    success: true,
    data: { success: true },
  };
};

export const deleteSlide: ToolDefinition = {
  name: "deleteSlide",
  description: "Remove a slide from a deck",
  parameters: {
    type: "object",
    properties: {
      slideId: { type: "string", description: "Slide ID to delete" },
    },
    required: ["slideId"],
  },
  handler: deleteSlideHandler,
};

// ---------------------------------------------------------------------------
// listTemplates
// ---------------------------------------------------------------------------

const listTemplatesHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: [
      {
        id: "tpl_stub_001",
        name: "Corporate Pitch",
        type: "PITCH",
        organizationId: params.orgId,
        isDefault: true,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "tpl_stub_002",
        name: "Portfolio Review",
        type: "PORTFOLIO",
        organizationId: params.orgId,
        isDefault: false,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ],
  };
};

export const listTemplates: ToolDefinition = {
  name: "listTemplates",
  description: "List deck templates",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      type: {
        type: "string",
        description: "Filter by deck type",
        enum: ["PITCH", "PROPOSAL", "REPORT", "PORTFOLIO", "ONBOARDING", "OTHER"],
      },
    },
    required: ["orgId"],
  },
  handler: listTemplatesHandler,
};

// ---------------------------------------------------------------------------
// createTemplate
// ---------------------------------------------------------------------------

const createTemplateHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      id: "tpl_stub_new",
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
  description: "Create a new deck template",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Template name" },
      type: {
        type: "string",
        description: "Deck type",
        enum: ["PITCH", "PROPOSAL", "REPORT", "PORTFOLIO", "ONBOARDING", "OTHER"],
      },
      slideTemplates: { type: "string", description: "Slide templates (JSON)" },
      colorScheme: { type: "string", description: "Color scheme (JSON)" },
      fonts: { type: "string", description: "Font definitions (JSON)" },
      description: { type: "string", description: "Template description" },
    },
    required: ["orgId", "name", "type", "slideTemplates"],
  },
  handler: createTemplateHandler,
};

// ---------------------------------------------------------------------------
// exportDeck
// ---------------------------------------------------------------------------

const exportDeckHandler: ToolHandler = async (params) => {
  return {
    success: true,
    data: {
      deckId: params.deckId,
      format: params.format || "PPTX",
      exportUrl: "https://cdn.spokestack.io/exports/deck_stub_001.pptx",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    },
  };
};

export const exportDeck: ToolDefinition = {
  name: "exportDeck",
  description: "Export a deck to a downloadable format",
  parameters: {
    type: "object",
    properties: {
      deckId: { type: "string", description: "Deck ID" },
      format: {
        type: "string",
        description: "Export format",
        enum: ["PPTX", "PDF", "GOOGLE_SLIDES"],
      },
    },
    required: ["deckId"],
  },
  handler: exportDeckHandler,
};

// ---------------------------------------------------------------------------
// syncDeckToGoogleSlides
// ---------------------------------------------------------------------------

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
