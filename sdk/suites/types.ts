/**
 * Suite Definition Types — industry-specific module bundles.
 *
 * A suite packages: modules + org config + workflow subscriptions + agent prompt overrides.
 * Derived from erp_staging_lmtd's vertical configuration system.
 */

export type IndustryVertical =
  | "marketing_agency"
  | "pr_communications"
  | "creative_studio"
  | "consulting_firm"
  | "recruitment_agency"
  | "accounting_firm"
  | "legal_services"
  | "hr_consulting"
  | "architecture_design"
  | "engineering_consultancy"
  | "it_consulting"
  | "project_management"
  | "event_management"
  | "translation_services"
  | "training_development"
  | "in_house_team"
  | "comms_agency";

export interface SuiteDefinition {
  id: string;
  name: string;
  version: string;
  description: string;
  industry: IndustryVertical;
  region?: string;

  /** Module types to install */
  modules: string[];

  /** Org-level config overrides */
  config: {
    timezone?: string;
    currency?: string;
    language?: string;
    workWeek?: number[];
  };

  /** Per-module config overrides (stored in OrgModule.config JSON) */
  moduleOverrides?: Record<string, Record<string, unknown>>;

  /** Workflow event subscriptions to create */
  workflows?: Array<{
    entityType: string;
    action: string;
    handler: string;
    config?: Record<string, unknown>;
  }>;

  /** Agent prompt overrides per agent type */
  agentPrompts?: Record<string, string>;

  /** Onboarding configuration */
  onboarding?: {
    welcomeMessage: string;
    questions: string[];
  };
}

export interface SuiteInstallResult {
  success: boolean;
  modulesInstalled: number;
  errors: string[];
}

export interface SuitePlanResult {
  suite: SuiteDefinition;
  modulesToInstall: string[];
  configChanges: Record<string, unknown>;
  workflowsToCreate: number;
  estimatedTime: string;
}
