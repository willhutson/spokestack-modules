/**
 * Crisis Communications Tools — all tool definitions
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

export const activateCrisis: ToolDefinition = {
  name: "activateCrisis",
  description: "Activate a new crisis protocol with severity level and description.",
  parameters: {
    type: "object" as const,
    properties: {
      title: { type: "string", description: "Crisis title" },
      severity: { type: "string", description: "Severity level", enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
      description: { type: "string", description: "Crisis description and initial assessment" },
      clientId: { type: "string", description: "Client ID" },
    },
    required: ["title", "severity", "description", "clientId"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `crisis_${Date.now()}`,
        title: params.title,
        severity: params.severity,
        description: params.description,
        clientId: params.clientId,
        status: "active",
        metadata: { type: "crisis" },
        activatedAt: new Date().toISOString(),
        responseDeadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        assignedTeam: [],
      },
    };
  },
};

export const loadPlaybook: ToolDefinition = {
  name: "loadPlaybook",
  description: "Load a crisis playbook by type for step-by-step guidance.",
  parameters: {
    type: "object" as const,
    properties: {
      crisisType: { type: "string", description: "Type of crisis", enum: ["product_recall", "executive_scandal", "data_breach", "negative_press", "social_storm"] },
    },
    required: ["crisisType"],
  },
  handler: async (params: any) => {
    const playbooks: Record<string, any> = {
      product_recall: {
        name: "Product Recall Playbook",
        steps: [
          { order: 1, action: "Confirm recall scope with client legal team", timeframe: "15 min" },
          { order: 2, action: "Draft holding statement for media", timeframe: "30 min" },
          { order: 3, action: "Notify TDRA / relevant regulator", timeframe: "1 hour" },
          { order: 4, action: "Issue consumer advisory via social channels", timeframe: "1 hour" },
          { order: 5, action: "Schedule press conference if severity HIGH+", timeframe: "2 hours" },
        ],
      },
      executive_scandal: {
        name: "Executive Scandal Playbook",
        steps: [
          { order: 1, action: "Gather facts — do NOT speculate publicly", timeframe: "15 min" },
          { order: 2, action: "Draft holding statement: acknowledge, investigate", timeframe: "30 min" },
          { order: 3, action: "Brief board and legal counsel", timeframe: "1 hour" },
          { order: 4, action: "Prepare Q&A document for spokespeople", timeframe: "2 hours" },
          { order: 5, action: "Monitor social media sentiment continuously", timeframe: "ongoing" },
        ],
      },
      data_breach: {
        name: "Data Breach Playbook",
        steps: [
          { order: 1, action: "Confirm breach scope with IT security", timeframe: "15 min" },
          { order: 2, action: "Notify TDRA per UAE data protection law", timeframe: "30 min" },
          { order: 3, action: "Draft customer notification", timeframe: "1 hour" },
          { order: 4, action: "Set up dedicated response hotline", timeframe: "2 hours" },
          { order: 5, action: "Coordinate with cybersecurity PR specialists", timeframe: "2 hours" },
        ],
      },
      negative_press: {
        name: "Negative Press Playbook",
        steps: [
          { order: 1, action: "Assess article reach and sentiment", timeframe: "15 min" },
          { order: 2, action: "Prepare factual rebuttal with evidence", timeframe: "30 min" },
          { order: 3, action: "Contact journalist for right of reply", timeframe: "1 hour" },
          { order: 4, action: "Brief client spokesperson", timeframe: "1 hour" },
          { order: 5, action: "Monitor for pickup by other outlets", timeframe: "ongoing" },
        ],
      },
      social_storm: {
        name: "Social Media Storm Playbook",
        steps: [
          { order: 1, action: "Assess hashtag velocity and key voices", timeframe: "15 min" },
          { order: 2, action: "Pause all scheduled social content", timeframe: "15 min" },
          { order: 3, action: "Draft empathetic social response", timeframe: "30 min" },
          { order: 4, action: "Engage key influencers for balanced perspective", timeframe: "1 hour" },
          { order: 5, action: "Prepare escalation path if storm grows", timeframe: "1 hour" },
        ],
      },
    };
    return {
      success: true,
      data: playbooks[params.crisisType] || playbooks.negative_press,
    };
  },
};

export const mapStakeholders: ToolDefinition = {
  name: "mapStakeholders",
  description: "Map stakeholders for a crisis with roles, contacts, and priorities.",
  parameters: {
    type: "object" as const,
    properties: {
      crisisId: { type: "string", description: "Crisis ID" },
      stakeholders: {
        type: "array",
        description: "Array of stakeholder objects",
        items: {
          type: "object",
        },
      },
    },
    required: ["crisisId", "stakeholders"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        crisisId: params.crisisId,
        stakeholderMap: (params.stakeholders || []).map((s: any, i: number) => ({
          id: `sh_${Date.now()}_${i}`,
          ...s,
          notified: false,
          lastContactedAt: null,
        })),
        totalStakeholders: params.stakeholders?.length || 0,
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const draftHoldingStatement: ToolDefinition = {
  name: "draftHoldingStatement",
  description: "Draft a holding statement for a specific audience during a crisis.",
  parameters: {
    type: "object" as const,
    properties: {
      crisisId: { type: "string", description: "Crisis ID" },
      audience: { type: "string", description: "Target audience for the statement" },
      keyMessages: { type: "array", description: "Key messages to include", items: { type: "string" } },
    },
    required: ["crisisId", "audience", "keyMessages"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `hs_${Date.now()}`,
        crisisId: params.crisisId,
        audience: params.audience,
        keyMessages: params.keyMessages,
        statement: `We are aware of the situation and are taking immediate action. ${(params.keyMessages || []).join(" ")} We will provide further updates as more information becomes available.`,
        metadata: { type: "holding_statement" },
        status: "draft",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const escalateCrisis: ToolDefinition = {
  name: "escalateCrisis",
  description: "Escalate a crisis to a higher severity level with documented reason.",
  parameters: {
    type: "object" as const,
    properties: {
      crisisId: { type: "string", description: "Crisis ID" },
      newSeverity: { type: "string", description: "New severity level", enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
      reason: { type: "string", description: "Reason for escalation" },
    },
    required: ["crisisId", "newSeverity", "reason"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        crisisId: params.crisisId,
        previousSeverity: "MEDIUM",
        newSeverity: params.newSeverity,
        reason: params.reason,
        escalatedAt: new Date().toISOString(),
        notificationsTriggered: params.newSeverity === "CRITICAL" ? 12 : 5,
      },
    };
  },
};

export const getCrisisStatus: ToolDefinition = {
  name: "getCrisisStatus",
  description: "Get status of active crises with last update and assigned team.",
  parameters: {
    type: "object" as const,
    properties: {
      crisisId: { type: "string", description: "Optional crisis ID to filter" },
    },
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        activeCrises: [
          {
            id: params.crisisId || "crisis_001",
            title: "Product quality issue — social media escalation",
            severity: "HIGH",
            status: "active",
            clientId: "client_042",
            activatedAt: "2026-04-02T14:30:00Z",
            lastUpdate: "2026-04-03T09:15:00Z",
            assignedTeam: ["Sarah M.", "Ahmed K.", "Lisa R."],
            holdingStatementIssued: true,
            stakeholdersBriefed: 8,
          },
        ],
        totalActive: 1,
        totalResolved: 14,
      },
    };
  },
};

export const allCrisisCommsTools: ToolDefinition[] = [
  activateCrisis, loadPlaybook, mapStakeholders, draftHoldingStatement, escalateCrisis, getCrisisStatus,
];

export const allToolNames: string[] = allCrisisCommsTools.map((t) => t.name);
