/**
 * HubSpot → CRM adapter
 * Maps HubSpot contacts and deals to SpokeStack CRM models.
 */

import type { NangoAdapter, SyncResult } from "../types/adapter";

// --- HubSpot Contact ---

interface HubSpotContact {
  id: string;
  properties: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    company: string;
    jobtitle: string;
    lifecyclestage: string;
    createdate: string;
    lastmodifieddate: string;
  };
}

interface InternalContact {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  jobTitle: string | null;
  status: string;
  importSource: "hubspot";
  importSourceId: string;
}

export const hubspotContactAdapter: NangoAdapter<InternalContact, HubSpotContact> = {
  provider: "hubspot",
  moduleType: "CRM",

  async fetchExternal(connectionId, params): Promise<HubSpotContact[]> {
    // Phase 6C: call nango.proxy({ connectionId, method: 'GET', endpoint: '/crm/v3/objects/contacts' })
    return [];
  },

  toInternal(external: HubSpotContact): InternalContact {
    const stageMap: Record<string, string> = {
      subscriber: "lead", lead: "lead", marketingqualifiedlead: "lead",
      salesqualifiedlead: "active", opportunity: "active",
      customer: "customer", evangelist: "customer", other: "active",
    };
    return {
      firstName: external.properties.firstname,
      lastName: external.properties.lastname,
      email: external.properties.email || null,
      phone: external.properties.phone || null,
      company: external.properties.company || null,
      jobTitle: external.properties.jobtitle || null,
      status: stageMap[external.properties.lifecyclestage] || "lead",
      importSource: "hubspot",
      importSourceId: external.id,
    };
  },

  toExternal(internal: InternalContact): Partial<HubSpotContact> {
    return {
      properties: {
        firstname: internal.firstName,
        lastname: internal.lastName,
        email: internal.email || "",
        phone: internal.phone || "",
        company: internal.company || "",
        jobtitle: internal.jobTitle || "",
        lifecyclestage: internal.status === "customer" ? "customer" : "lead",
        createdate: "",
        lastmodifieddate: "",
      },
    } as Partial<HubSpotContact>;
  },

  async sync(connectionId, orgId): Promise<SyncResult> {
    return { created: 0, updated: 0, skipped: 0, errors: ["Phase 6C: implement real sync"] };
  },
};

// --- HubSpot Deal ---

interface HubSpotDeal {
  id: string;
  properties: {
    dealname: string;
    amount: string;
    dealstage: string;
    closedate: string;
    createdate: string;
    pipeline: string;
  };
}

interface InternalDeal {
  title: string;
  value: number;
  stage: string;
  expectedCloseDate: string | null;
  importSource: "hubspot";
  importSourceId: string;
}

export const hubspotDealAdapter: NangoAdapter<InternalDeal, HubSpotDeal> = {
  provider: "hubspot",
  moduleType: "CRM",

  async fetchExternal(connectionId, params): Promise<HubSpotDeal[]> {
    // Phase 6C: call nango.proxy({ connectionId, method: 'GET', endpoint: '/crm/v3/objects/deals' })
    return [];
  },

  toInternal(external: HubSpotDeal): InternalDeal {
    const stageMap: Record<string, string> = {
      appointmentscheduled: "qualified", qualifiedtobuy: "qualified",
      presentationscheduled: "proposal", decisionmakerboughtin: "negotiation",
      contractsent: "negotiation", closedwon: "closed_won", closedlost: "closed_lost",
    };
    return {
      title: external.properties.dealname,
      value: parseFloat(external.properties.amount) || 0,
      stage: stageMap[external.properties.dealstage] || "lead",
      expectedCloseDate: external.properties.closedate || null,
      importSource: "hubspot",
      importSourceId: external.id,
    };
  },

  toExternal(internal: InternalDeal): Partial<HubSpotDeal> {
    return {
      properties: {
        dealname: internal.title,
        amount: String(internal.value),
        dealstage: internal.stage === "closed_won" ? "closedwon" : "appointmentscheduled",
        closedate: internal.expectedCloseDate || "",
        createdate: "",
        pipeline: "default",
      },
    } as Partial<HubSpotDeal>;
  },

  async sync(connectionId, orgId): Promise<SyncResult> {
    return { created: 0, updated: 0, skipped: 0, errors: ["Phase 6C: implement real sync"] };
  },
};
