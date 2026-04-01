import version from "./version.json";

export const CORE_VERSION = version.coreVersion;
export const CORE_SCHEMA_HASH = version.schemaHash;

/** All 39 core model names */
export const CORE_MODELS = [
  // Foundation (7)
  "Organization",
  "User",
  "Team",
  "TeamMember",
  "OrgSettings",
  "OrgModule",
  "FeatureFlag",
  // Billing (4)
  "BillingAccount",
  "BillingTier",
  "BillingMeterEvent",
  "BillingInvoice",
  // Tasks (4)
  "TaskList",
  "Task",
  "TaskComment",
  "TaskAttachment",
  // Projects (6)
  "Project",
  "ProjectPhase",
  "ProjectMilestone",
  "WfCanvas",
  "WfCanvasNode",
  "WfCanvasEdge",
  // Briefs (4)
  "Brief",
  "BriefPhase",
  "Artifact",
  "ArtifactReview",
  // Orders (5)
  "Client",
  "Order",
  "OrderItem",
  "Invoice",
  "InvoiceItem",
  // Agent (4)
  "AgentSession",
  "AgentMessage",
  "ContextEntry",
  "ContextMilestone",
  // Infrastructure (5)
  "Integration",
  "Notification",
  "NotificationPreference",
  "FileAsset",
  "FileVersion",
] as const;

export type CoreModelName = (typeof CORE_MODELS)[number];

/** All 27 core enum names */
export const CORE_ENUMS = [
  "MemberRole",
  "BillingTierType",
  "BillingStatus",
  "InvoiceStatus",
  "MeterEventType",
  "TaskStatus",
  "TaskPriority",
  "ProjectStatus",
  "PhaseStatus",
  "BriefStatus",
  "ArtifactType",
  "ArtifactStatus",
  "ReviewStatus",
  "OrderStatus",
  "AgentType",
  "SurfaceType",
  "MessageRole",
  "ContextType",
  "MilestoneType",
  "NodeType",
  "IntegrationType",
  "IntegrationStatus",
  "NotificationType",
  "NotificationChannel",
  "ModuleType",
] as const;

export type CoreEnumName = (typeof CORE_ENUMS)[number];
