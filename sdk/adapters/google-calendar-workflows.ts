/**
 * Google Calendar → Workflows adapter (bi-directional)
 * Maps calendar events to workflow deadlines/milestones and vice versa.
 */

import type { NangoAdapter, SyncResult } from "../types/adapter";

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  status: string;
  htmlLink: string;
  attendees?: Array<{ email: string; responseStatus: string }>;
  created: string;
  updated: string;
}

interface InternalWorkflowEvent {
  name: string;
  description: string | null;
  scheduledDate: string;
  endDate: string | null;
  status: string;
  importSource: "google_calendar";
  importSourceId: string;
  metadata: Record<string, unknown>;
}

export const googleCalendarWorkflowsAdapter: NangoAdapter<InternalWorkflowEvent, GoogleCalendarEvent> = {
  provider: "google-calendar",
  moduleType: "WORKFLOWS",

  async fetchExternal(connectionId, params): Promise<GoogleCalendarEvent[]> {
    // Phase 6C: call nango.proxy({ connectionId, method: 'GET', endpoint: '/calendar/v3/calendars/primary/events' })
    return [];
  },

  toInternal(external: GoogleCalendarEvent): InternalWorkflowEvent {
    return {
      name: external.summary,
      description: external.description || null,
      scheduledDate: external.start.dateTime || external.start.date || "",
      endDate: external.end.dateTime || external.end.date || null,
      status: external.status === "cancelled" ? "paused" : "active",
      importSource: "google_calendar",
      importSourceId: external.id,
      metadata: {
        htmlLink: external.htmlLink,
        attendees: external.attendees?.map((a) => a.email) ?? [],
      },
    };
  },

  toExternal(internal: InternalWorkflowEvent): Partial<GoogleCalendarEvent> {
    return {
      summary: internal.name,
      description: internal.description || "",
      start: { dateTime: internal.scheduledDate },
      end: { dateTime: internal.endDate || internal.scheduledDate },
    };
  },

  async sync(connectionId, orgId): Promise<SyncResult> {
    return { created: 0, updated: 0, skipped: 0, errors: ["Phase 6C: implement real sync"] };
  },
};
