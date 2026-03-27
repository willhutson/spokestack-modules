import type { SurfaceRegistry } from "@spokestack/module-sdk";

export const crmSurfaces: SurfaceRegistry = {
  moduleId: "crm",
  dashboardWidgets: [
    {
      id: "crm-pipeline-widget",
      moduleId: "crm",
      title: "Pipeline Overview",
      componentPath: "./surfaces/dashboard#CrmPipelineWidget",
      defaultSize: "large",
      refreshInterval: 300,
      requiredPermissions: ["crm:read"],
    },
    {
      id: "crm-recent-contacts",
      moduleId: "crm",
      title: "Recent Contacts",
      componentPath: "./surfaces/dashboard#CrmRecentContacts",
      defaultSize: "medium",
      refreshInterval: 60,
      requiredPermissions: ["crm:read"],
    },
  ],
  pages: [
    {
      path: "/crm",
      moduleId: "crm",
      title: "CRM",
      componentPath: "./surfaces/pages/overview#CrmOverviewPage",
      icon: "users",
      navSection: "modules",
      children: [
        {
          path: "/crm/contacts",
          moduleId: "crm",
          title: "Contacts",
          componentPath: "./surfaces/pages/contacts#CrmContactsPage",
          icon: "contact",
          navSection: "modules",
        },
        {
          path: "/crm/deals",
          moduleId: "crm",
          title: "Deals",
          componentPath: "./surfaces/pages/deals#CrmDealsPage",
          icon: "dollar-sign",
          navSection: "modules",
        },
      ],
    },
  ],
  agentCards: [
    {
      id: "crm-quick-add",
      moduleId: "crm",
      title: "Quick Add Contact",
      trigger: "add contact",
      componentPath: "./surfaces/dashboard#CrmQuickAddCard",
    },
  ],
};
