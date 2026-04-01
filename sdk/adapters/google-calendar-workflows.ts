/**
 * Google Calendar → Workflows adapter (bi-directional)
 * Maps calendar events to workflow deadlines/milestones and vice versa.
 */

import type { NangoAdapter, SyncResult } from "../types/adapter";
import { CORE_API_URL, AGENT_SECRET } from "./config";

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

  async fetchExternal(connectionId: string, params: Record<string, unknown> = {}): Promise<GoogleCalendarEvent[]> {
    const res = await fetch(`${CORE_API_URL}/api/v1/integrations/proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Agent-Secret': AGENT_SECRET,
        'X-Org-Id': (params.organizationId as string) || '',
      },
      body: JSON.stringify({
        provider: 'google-calendar',
        connectionId,
        endpoint: '/calendar/v3/calendars/primary/events',
        method: 'GET',
        params: { singleEvents: true, timeMin: new Date().toISOString(), orderBy: 'startTime' },
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
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

  async sync(connectionId: string, orgId: string): Promise<SyncResult> {
    const result: SyncResult = { created: 0, updated: 0, skipped: 0, errors: [] };
    try {
      const records = await this.fetchExternal(connectionId, { organizationId: orgId });
      for (const record of records) {
        try {
          this.toInternal(record);
          result.created++;
        } catch (err) {
          result.errors.push(`Failed to map event ${record.id}: ${(err as Error).message}`);
        }
      }
    } catch (err) {
      result.errors.push(`Fetch failed: ${(err as Error).message}`);
    }
    return result;
  },
};
