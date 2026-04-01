/**
 * Slack → Notifications adapter (write-only)
 * Sends SpokeStack notifications as Slack messages.
 */

import type { NangoAdapter, SyncResult } from "../types/adapter";
import { CORE_API_URL, AGENT_SECRET } from "./config";

interface SlackMessage {
  channel: string;
  text: string;
  blocks?: Array<{ type: string; text?: { type: string; text: string } }>;
  ts?: string;
}

interface InternalNotification {
  title: string;
  body: string | null;
  channel: string;
  recipientId: string;
}

export const slackCommsAdapter: NangoAdapter<InternalNotification, SlackMessage> = {
  provider: "slack",
  moduleType: "COMMUNICATION",

  async fetchExternal(connectionId: string, params: Record<string, unknown> = {}): Promise<SlackMessage[]> {
    const res = await fetch(`${CORE_API_URL}/api/v1/integrations/proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Agent-Secret': AGENT_SECRET,
        'X-Org-Id': (params.organizationId as string) || '',
      },
      body: JSON.stringify({
        provider: 'slack',
        connectionId,
        endpoint: '/api/conversations.list',
        method: 'GET',
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.channels ?? [];
  },

  toInternal(external: SlackMessage): InternalNotification {
    return {
      title: external.text.slice(0, 100),
      body: external.text,
      channel: external.channel,
      recipientId: "",
    };
  },

  toExternal(internal: InternalNotification): Partial<SlackMessage> {
    return {
      text: `*${internal.title}*\n${internal.body || ""}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${internal.title}*\n${internal.body || ""}`,
          },
        },
      ],
    };
  },

  async sync(_connectionId: string, _orgId: string): Promise<SyncResult> {
    // Write-only adapter — outbound only, no inbound sync
    return { created: 0, updated: 0, skipped: 0, errors: [] };
  },
};
