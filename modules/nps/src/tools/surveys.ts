/**
 * NPS Survey Tools
 *
 * Tools for creating, sending, and analyzing NPS surveys.
 * Handlers are stubs for Phase 2; real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// createSurvey
// ---------------------------------------------------------------------------

const createSurveyHandler: ToolHandler = async (params, context) => {
  return {
    success: true,
    data: {
      id: `nps_${Date.now()}`,
      organizationId: context.organizationId,
      clientId: params.clientId,
      quarter: params.quarter,
      year: params.year,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
    },
  };
};

export const createSurvey: ToolDefinition = {
  name: "createSurvey",
  description: "Create a new NPS survey for a client. Sets initial status to DRAFT.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Client ID to create the survey for" },
      quarter: { type: "number", description: "Quarter number (1-4)", minimum: 1, maximum: 4 },
      year: { type: "number", description: "Survey year" },
      sentToId: { type: "string", description: "Contact ID of the NPS designee to send to" },
    },
    required: ["orgId", "clientId", "quarter", "year"],
  },
  handler: createSurveyHandler,
};

// ---------------------------------------------------------------------------
// sendSurvey
// ---------------------------------------------------------------------------

const sendSurveyHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      id: params.surveyId,
      status: "SENT",
      sentAt: new Date().toISOString(),
      sentToId: params.sentToId || null,
    },
  };
};

export const sendSurvey: ToolDefinition = {
  name: "sendSurvey",
  description: "Mark an NPS survey as sent and record the send date.",
  parameters: {
    type: "object",
    properties: {
      surveyId: { type: "string", description: "Survey ID to mark as sent" },
      sentToId: { type: "string", description: "Contact ID the survey was sent to" },
    },
    required: ["surveyId"],
  },
  handler: sendSurveyHandler,
};

// ---------------------------------------------------------------------------
// listSurveys
// ---------------------------------------------------------------------------

const listSurveysHandler: ToolHandler = async (_params, _context) => {
  return {
    success: true,
    data: {
      surveys: [],
      total: 0,
      page: 1,
      limit: 20,
    },
  };
};

export const listSurveys: ToolDefinition = {
  name: "listSurveys",
  description: "List NPS surveys with status, client, and date filters.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      clientId: { type: "string", description: "Filter by client ID" },
      status: {
        type: "string",
        description: "Filter by survey status",
        enum: ["DRAFT", "SENT", "RESPONDED", "CLOSED"],
      },
      year: { type: "number", description: "Filter by year" },
      quarter: { type: "number", description: "Filter by quarter", minimum: 1, maximum: 4 },
    },
    required: ["orgId"],
  },
  handler: listSurveysHandler,
};

// ---------------------------------------------------------------------------
// getSurveyResults
// ---------------------------------------------------------------------------

const getSurveyResultsHandler: ToolHandler = async (params, _context) => {
  return {
    success: true,
    data: {
      survey: {
        id: params.surveyId,
        clientId: "client_001",
        quarter: 1,
        year: 2025,
        status: "RESPONDED",
      },
      responses: [
        {
          id: "resp_001",
          score: 9,
          category: "PROMOTER",
          whatWeDoWell: "Great communication",
          submittedAt: new Date().toISOString(),
        },
      ],
      summary: {
        totalResponses: 3,
        avgScore: 8.3,
        npsScore: 60,
        promoters: 2,
        passives: 1,
        detractors: 0,
      },
    },
  };
};

export const getSurveyResults: ToolDefinition = {
  name: "getSurveyResults",
  description: "Get survey details with all responses and NPS summary statistics.",
  parameters: {
    type: "object",
    properties: {
      surveyId: { type: "string", description: "Survey ID to get results for" },
    },
    required: ["surveyId"],
  },
  handler: getSurveyResultsHandler,
};

// ---------------------------------------------------------------------------
// analyzeNPS
// ---------------------------------------------------------------------------

const analyzeNPSHandler: ToolHandler = async (_params, _context) => {
  return {
    success: true,
    data: {
      overallNps: 55,
      trend: "+5 vs last quarter",
      topPromoters: [
        { clientId: "client_001", clientName: "Acme Corp", avgScore: 9.2 },
      ],
      atRiskClients: [
        { clientId: "client_003", clientName: "Beta Inc", avgScore: 5.5 },
      ],
      categoryBreakdown: {
        promoters: 12,
        passives: 5,
        detractors: 3,
      },
    },
  };
};

export const analyzeNPS: ToolDefinition = {
  name: "analyzeNPS",
  description: "Aggregate NPS scores across clients with trends and insights. Identifies at-risk clients (detractors) and top promoters.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      startDate: { type: "string", description: "Start date for analysis period (ISO 8601)" },
      endDate: { type: "string", description: "End date for analysis period (ISO 8601)" },
      clientId: { type: "string", description: "Filter analysis to a specific client" },
    },
    required: ["orgId"],
  },
  handler: analyzeNPSHandler,
};

// ---------------------------------------------------------------------------
// submitNPSResponse
// ---------------------------------------------------------------------------

const submitNPSResponseHandler: ToolHandler = async (params, _context) => {
  const score = params.score as number;
  let category: string;
  if (score <= 6) {
    category = "DETRACTOR";
  } else if (score <= 8) {
    category = "PASSIVE";
  } else {
    category = "PROMOTER";
  }

  return {
    success: true,
    data: {
      id: `resp_${Date.now()}`,
      surveyId: params.surveyId,
      score: params.score,
      category,
      submittedAt: new Date().toISOString(),
    },
  };
};

export const submitNPSResponse: ToolDefinition = {
  name: "submitNPSResponse",
  description: "Record a client NPS response with score and feedback. Automatically categorizes as PROMOTER (9-10), PASSIVE (7-8), or DETRACTOR (0-6).",
  parameters: {
    type: "object",
    properties: {
      surveyId: { type: "string", description: "Survey ID this response belongs to" },
      score: { type: "number", description: "NPS score from 0-10", minimum: 0, maximum: 10 },
      contactId: { type: "string", description: "Contact ID of the respondent" },
      portalUserId: { type: "string", description: "Portal user ID if submitted via client portal" },
      whatWeDoWell: { type: "string", description: "Feedback on what the company does well" },
      whatToImprove: { type: "string", description: "Feedback on areas for improvement" },
      additionalNotes: { type: "string", description: "Any additional notes from the respondent" },
    },
    required: ["surveyId", "score"],
  },
  handler: submitNPSResponseHandler,
};

// ---------------------------------------------------------------------------
// listResponses
// ---------------------------------------------------------------------------

const listResponsesHandler: ToolHandler = async (_params, _context) => {
  return {
    success: true,
    data: {
      responses: [],
      total: 0,
      page: 1,
      limit: 20,
    },
  };
};

export const listResponses: ToolDefinition = {
  name: "listResponses",
  description: "List NPS responses with category and date filters.",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      surveyId: { type: "string", description: "Filter by survey ID" },
      clientId: { type: "string", description: "Filter by client ID" },
      category: {
        type: "string",
        description: "Filter by NPS category",
        enum: ["PROMOTER", "PASSIVE", "DETRACTOR"],
      },
      startDate: { type: "string", description: "Start date filter (ISO 8601)" },
      endDate: { type: "string", description: "End date filter (ISO 8601)" },
    },
    required: ["orgId"],
  },
  handler: listResponsesHandler,
};
