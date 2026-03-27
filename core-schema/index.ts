import version from "./version.json";

export const CORE_VERSION = version.coreVersion;
export const CORE_SCHEMA_HASH = version.schemaHash;

/** All 39 core model names */
export const CORE_MODELS = [
  "Organization",
  "User",
  "Team",
  "TeamMember",
  "Invitation",
  "ApiKey",
  "Contact",
  "Conversation",
  "Message",
  "Channel",
  "Agent",
  "AgentTool",
  "Workflow",
  "WorkflowExecution",
  "ContextEntry",
  "ModuleInstallation",
  "MilestoneEvent",
  "Notification",
  "AuditLog",
  "Webhook",
  "File",
  "Tag",
  "ContactTag",
  "Pipeline",
  "Campaign",
  "Form",
  "FormSubmission",
  "Product",
  "Invoice",
  "Subscription",
  "Setting",
] as const;

export type CoreModelName = (typeof CORE_MODELS)[number];
