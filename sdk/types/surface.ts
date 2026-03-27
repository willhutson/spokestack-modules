/**
 * Surface registration types — how modules declare UI surfaces
 * that spokestack-core renders in the dashboard.
 */

export interface SurfaceRegistry {
  moduleId: string;
  dashboardWidgets: RegisteredWidget[];
  pages: RegisteredPage[];
  agentCards: RegisteredAgentCard[];
}

export interface RegisteredWidget {
  id: string;
  moduleId: string;
  title: string;
  /** Path to the component bundle (loaded dynamically by core) */
  componentPath: string;
  defaultSize: "small" | "medium" | "large";
  /** Data refresh interval in seconds */
  refreshInterval: number;
  /** Required permissions to view */
  requiredPermissions: string[];
}

export interface RegisteredPage {
  /** Route path, e.g. "/crm/contacts" */
  path: string;
  moduleId: string;
  title: string;
  componentPath: string;
  icon: string;
  /** Navigation section in sidebar */
  navSection: string;
  /** Sub-navigation items */
  children?: RegisteredPage[];
}

export interface RegisteredAgentCard {
  id: string;
  moduleId: string;
  title: string;
  /** Trigger phrase or pattern */
  trigger: string;
  componentPath: string;
}

export interface SurfaceRegistrationRequest {
  organizationId: string;
  moduleId: string;
  surfaces: SurfaceRegistry;
}
