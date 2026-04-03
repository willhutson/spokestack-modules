/**
 * Events Tools — all tool definitions
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

export const createEvent: ToolDefinition = {
  name: "createEvent",
  description: "Create a new event with venue, date, capacity, budget, and format.",
  parameters: {
    type: "object" as const,
    properties: {
      name: { type: "string", description: "Event name" },
      venue: { type: "string", description: "Venue name and location" },
      date: { type: "string", description: "Event date (ISO)" },
      capacity: { type: "number", description: "Maximum guest capacity" },
      budget: { type: "number", description: "Total event budget in AED" },
      format: { type: "string", description: "Event format", enum: ["in-person", "virtual", "hybrid"] },
      clientId: { type: "string", description: "Client ID" },
    },
    required: ["name", "venue", "date", "capacity", "budget", "clientId"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `evt_${Date.now()}`,
        name: params.name,
        venue: params.venue,
        date: params.date,
        capacity: params.capacity,
        budget: params.budget,
        format: params.format || "in-person",
        clientId: params.clientId,
        status: "planning",
        metadata: { type: "event" },
        guestCount: 0,
        vendorCount: 0,
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const addGuest: ToolDefinition = {
  name: "addGuest",
  description: "Add a guest to an event with tier and dietary preferences.",
  parameters: {
    type: "object" as const,
    properties: {
      eventId: { type: "string", description: "Event ID" },
      name: { type: "string", description: "Guest full name" },
      email: { type: "string", description: "Guest email address" },
      company: { type: "string", description: "Guest company" },
      tier: { type: "string", description: "Guest tier", enum: ["VIP", "MEDIA", "INFLUENCER", "GENERAL"] },
      dietary: { type: "string", description: "Dietary requirements" },
    },
    required: ["eventId", "name", "email"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `guest_${Date.now()}`,
        eventId: params.eventId,
        name: params.name,
        email: params.email,
        company: params.company || null,
        tier: params.tier || "GENERAL",
        dietary: params.dietary || null,
        rsvpStatus: "pending",
        checkedIn: false,
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const importGuestList: ToolDefinition = {
  name: "importGuestList",
  description: "Bulk import a guest list to an event.",
  parameters: {
    type: "object" as const,
    properties: {
      eventId: { type: "string", description: "Event ID" },
      guests: {
        type: "array",
        description: "Array of guest objects to import",
        items: {
          type: "object",
        },
      },
    },
    required: ["eventId", "guests"],
  },
  handler: async (params: any) => {
    const guests = params.guests || [];
    const duplicates = Math.floor(guests.length * 0.05);
    return {
      success: true,
      data: {
        eventId: params.eventId,
        imported: guests.length - duplicates,
        duplicates,
        total: guests.length,
        importedAt: new Date().toISOString(),
      },
    };
  },
};

export const sendRSVPInvitation: ToolDefinition = {
  name: "sendRSVPInvitation",
  description: "Send RSVP invitations to guests for an event.",
  parameters: {
    type: "object" as const,
    properties: {
      eventId: { type: "string", description: "Event ID" },
      guestIds: { type: "array", description: "Optional specific guest IDs (sends to all if omitted)", items: { type: "string" } },
    },
    required: ["eventId"],
  },
  handler: async (params: any) => {
    const total = params.guestIds?.length || 150;
    return {
      success: true,
      data: {
        eventId: params.eventId,
        sent: total,
        total,
        sentAt: new Date().toISOString(),
        deliveryMethod: "email",
      },
    };
  },
};

export const createRunOfShowItem: ToolDefinition = {
  name: "createRunOfShowItem",
  description: "Create a run of show item for an event.",
  parameters: {
    type: "object" as const,
    properties: {
      eventId: { type: "string", description: "Event ID" },
      time: { type: "string", description: "Scheduled time (e.g. 09:00)" },
      activity: { type: "string", description: "Activity description" },
      duration: { type: "number", description: "Duration in minutes" },
      responsible: { type: "string", description: "Person responsible" },
      notes: { type: "string", description: "Additional notes" },
    },
    required: ["eventId", "time", "activity"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `ros_${Date.now()}`,
        eventId: params.eventId,
        time: params.time,
        activity: params.activity,
        duration: params.duration || 30,
        responsible: params.responsible || null,
        notes: params.notes || null,
        status: "scheduled",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const reorderRunOfShow: ToolDefinition = {
  name: "reorderRunOfShow",
  description: "Reorder run of show items for an event.",
  parameters: {
    type: "object" as const,
    properties: {
      eventId: { type: "string", description: "Event ID" },
      items: {
        type: "array",
        description: "Array of items with taskId and new time",
        items: {
          type: "object",
        },
      },
    },
    required: ["eventId", "items"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        eventId: params.eventId,
        reorderedItems: (params.items || []).map((item: any, i: number) => ({
          ...item,
          order: i + 1,
        })),
        totalItems: params.items?.length || 0,
        updatedAt: new Date().toISOString(),
      },
    };
  },
};

export const addVendor: ToolDefinition = {
  name: "addVendor",
  description: "Add a vendor to an event with service and cost.",
  parameters: {
    type: "object" as const,
    properties: {
      eventId: { type: "string", description: "Event ID" },
      vendorName: { type: "string", description: "Vendor company name" },
      service: { type: "string", description: "Service provided" },
      amount: { type: "number", description: "Vendor cost" },
      currency: { type: "string", description: "Currency code (default AED)" },
    },
    required: ["eventId", "vendorName", "service", "amount"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `ord_${Date.now()}`,
        eventId: params.eventId,
        vendorName: params.vendorName,
        service: params.service,
        amount: params.amount,
        currency: params.currency || "AED",
        status: "confirmed",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const trackBudget: ToolDefinition = {
  name: "trackBudget",
  description: "Track event budget with spend breakdown by vendor.",
  parameters: {
    type: "object" as const,
    properties: {
      eventId: { type: "string", description: "Event ID" },
    },
    required: ["eventId"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        eventId: params.eventId,
        totalBudget: 250000,
        totalSpent: 187500,
        remaining: 62500,
        currency: "AED",
        utilizationRate: 75,
        byVendor: [
          { vendor: "Madinat Jumeirah", service: "Venue & Catering", amount: 95000 },
          { vendor: "Eclipse AV", service: "Audio Visual", amount: 35000 },
          { vendor: "Bloom Events", service: "Florals & Decor", amount: 28000 },
          { vendor: "Stage Craft Dubai", service: "Stage & Lighting", amount: 19500 },
          { vendor: "Valet Pro", service: "Valet Parking", amount: 10000 },
        ],
      },
    };
  },
};

export const generatePostEventReport: ToolDefinition = {
  name: "generatePostEventReport",
  description: "Generate a post-event report with attendance and performance stats.",
  parameters: {
    type: "object" as const,
    properties: {
      eventId: { type: "string", description: "Event ID" },
    },
    required: ["eventId"],
  },
  handler: async (params: any) => {
    return {
      success: true,
      data: {
        id: `rpt_${Date.now()}`,
        eventId: params.eventId,
        metadata: { type: "post_event_report" },
        attendance: {
          invited: 200,
          rsvpYes: 165,
          rsvpNo: 20,
          noResponse: 15,
          actualAttendance: 148,
          attendanceRate: 74,
        },
        byTier: {
          VIP: { invited: 30, attended: 28 },
          MEDIA: { invited: 45, attended: 38 },
          INFLUENCER: { invited: 25, attended: 22 },
          GENERAL: { invited: 100, attended: 60 },
        },
        budgetSummary: {
          totalBudget: 250000,
          totalSpent: 237500,
          costPerAttendee: 1605,
        },
        mediaPickups: 12,
        socialMentions: 347,
        generatedAt: new Date().toISOString(),
      },
    };
  },
};

export const allEventsTools: ToolDefinition[] = [
  createEvent, addGuest, importGuestList, sendRSVPInvitation, createRunOfShowItem, reorderRunOfShow, addVendor, trackBudget, generatePostEventReport,
];

export const allToolNames: string[] = allEventsTools.map((t) => t.name);
