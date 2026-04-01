/**
 * Adapter Resolution — maps module types to their Nango adapters.
 */

import { asanaTasksAdapter } from "./asana-tasks";
import { hubspotContactAdapter, hubspotDealAdapter } from "./hubspot-crm";
import { slackCommsAdapter } from "./slack-comms";
import { googleDriveContentAdapter } from "./google-drive-content";
import { googleCalendarWorkflowsAdapter } from "./google-calendar-workflows";
import type { NangoAdapter } from "../types/adapter";

const ADAPTER_REGISTRY: Record<string, NangoAdapter[]> = {
  TASKS: [asanaTasksAdapter],
  CRM: [hubspotContactAdapter, hubspotDealAdapter],
  COMMUNICATION: [slackCommsAdapter],
  CONTENT_STUDIO: [googleDriveContentAdapter],
  WORKFLOWS: [googleCalendarWorkflowsAdapter],
};

export function getAdaptersForModule(moduleType: string): NangoAdapter[] {
  return ADAPTER_REGISTRY[moduleType] ?? [];
}

export function getAdapterForProvider(provider: string): NangoAdapter | null {
  for (const adapters of Object.values(ADAPTER_REGISTRY)) {
    const match = adapters.find((a) => a.provider === provider);
    if (match) return match;
  }
  return null;
}
