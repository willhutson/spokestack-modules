import type { ModuleAgent } from "@spokestack/module-sdk";

/**
 * CRM Agent Definition — serialized and sent to agent-builder
 * at install time via POST /agents/register.
 */
export const crmAgent: ModuleAgent = {
  name: "crm-agent",
  slug: "crm-agent",
  intentPatterns: [
    "(?i)(add|create|new)\\s+(contact|lead|customer)",
    "(?i)(update|edit|modify)\\s+(contact|lead|customer)",
    "(?i)(log|record|note)\\s+(call|meeting|interaction|email|note)",
    "(?i)(move|advance|progress)\\s+(deal|opportunity)",
    "(?i)(search|find|lookup|look up)\\s+(contact|lead|customer|deal)",
    "(?i)(pipeline|deals?)\\s+(report|summary|overview|status)",
    "(?i)(crm|sales|contacts?)\\b",
    "(?i)who\\s+(is|are)\\s+(my|our)\\s+(contacts?|leads?|customers?)",
    "(?i)how\\s+(is|are)\\s+(the|my|our)\\s+(pipeline|deals?|sales)",
  ],
  systemPrompt: `You are the CRM Agent for SpokeStack — a proactive sales intelligence assistant.

ROLE:
- Help users manage contacts, track deals through pipelines, and log interactions
- Surface actionable insights about deals and relationships
- Proactively suggest follow-ups based on interaction history and deal staleness

CAPABILITIES:
- Create and update contacts with full details (email, phone, company, job title)
- Log interactions (calls, emails, meetings, notes) against contacts
- Move deals through pipeline stages and track values
- Search contacts by name, email, company, status, or tags
- Generate pipeline reports with stage breakdowns and forecasts

CONTEXT AWARENESS:
- You have access to the full organizational context graph via ContextEntry
- Cross-reference contacts with conversations, messages, and other module data
- Use interaction history to suggest optimal follow-up timing

BEHAVIOR:
- Always confirm before creating or modifying records
- When logging interactions, capture type, outcome, and any next steps
- When moving deals, update probability based on stage
- Proactively mention stale deals (no activity in 14+ days)
- Format currency values and dates consistently`,

  tools: [
    {
      name: "createContact",
      description: "Create a new contact in the CRM",
      parameters: {
        type: "object",
        properties: {
          email: { type: "string", description: "Contact email address" },
          phone: { type: "string", description: "Contact phone number" },
          firstName: { type: "string", description: "First name" },
          lastName: { type: "string", description: "Last name" },
          company: { type: "string", description: "Company name" },
          jobTitle: { type: "string", description: "Job title" },
          source: { type: "string", description: "Lead source (e.g. website, referral, cold-outreach)" },
          status: { type: "string", enum: ["active", "inactive", "lead", "customer"] },
        },
        required: ["firstName"],
      },
      writesContext: true,
    },
    {
      name: "updateContact",
      description: "Update an existing contact's details",
      parameters: {
        type: "object",
        properties: {
          contactId: { type: "string", description: "Contact ID to update" },
          email: { type: "string" },
          phone: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          company: { type: "string" },
          jobTitle: { type: "string" },
          status: { type: "string", enum: ["active", "inactive", "lead", "customer"] },
          score: { type: "number", minimum: 0, maximum: 100 },
        },
        required: ["contactId"],
      },
      writesContext: true,
    },
    {
      name: "logInteraction",
      description: "Log an interaction (call, email, meeting, note) against a contact",
      parameters: {
        type: "object",
        properties: {
          contactId: { type: "string", description: "Contact ID" },
          type: { type: "string", enum: ["call", "email", "meeting", "note", "chat", "task"] },
          subject: { type: "string", description: "Brief subject line" },
          body: { type: "string", description: "Detailed notes" },
          direction: { type: "string", enum: ["inbound", "outbound"] },
          duration: { type: "number", description: "Duration in seconds" },
          outcome: { type: "string", description: "Outcome or result" },
        },
        required: ["contactId", "type"],
      },
      writesContext: true,
    },
    {
      name: "moveDeal",
      description: "Move a deal to a new pipeline stage",
      parameters: {
        type: "object",
        properties: {
          dealId: { type: "string", description: "Deal ID" },
          stage: { type: "string", description: "Target stage name" },
          probability: { type: "number", description: "Win probability (0-100)", minimum: 0, maximum: 100 },
          lostReason: { type: "string", description: "Reason for loss (if moving to lost)" },
        },
        required: ["dealId", "stage"],
      },
      writesContext: true,
    },
    {
      name: "searchContacts",
      description: "Search contacts by name, email, company, status, or tags",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query (matches name, email, company)" },
          status: { type: "string", enum: ["active", "inactive", "lead", "customer"] },
          tag: { type: "string", description: "Filter by tag name" },
          limit: { type: "number", description: "Max results (default 20)", maximum: 100 },
        },
      },
      writesContext: false,
    },
    {
      name: "generatePipelineReport",
      description: "Generate a pipeline summary with stage breakdowns, total value, and forecast",
      parameters: {
        type: "object",
        properties: {
          pipelineId: { type: "string", description: "Pipeline ID (omit for default)" },
          includeDeals: { type: "boolean", description: "Include individual deal details" },
        },
      },
      writesContext: true,
    },
  ],

  contextContributions: [
    {
      type: "crm.contact.created",
      description: "A new contact was added to the CRM",
      direction: "write",
    },
    {
      type: "crm.contact.updated",
      description: "A contact's details were modified",
      direction: "write",
    },
    {
      type: "crm.deal.created",
      description: "A new deal was created in the pipeline",
      direction: "write",
    },
    {
      type: "crm.deal.moved",
      description: "A deal was moved to a new pipeline stage",
      direction: "write",
    },
    {
      type: "crm.interaction.logged",
      description: "An interaction was logged against a contact",
      direction: "write",
    },
    {
      type: "crm.pipeline.report",
      description: "A pipeline report was generated",
      direction: "write",
    },
  ],
};
