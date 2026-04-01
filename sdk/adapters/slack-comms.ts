/**
 * Slack → Notifications adapter (write-only)
 * Sends SpokeStack notifications as Slack messages.
 */

import type { NangoAdapter, SyncResult } from "../types/adapter";

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

  async fetchExternal(connectionId, params): Promise<SlackMessage[]> {
    // Phase 6C: call nango.proxy({ connectionId, method: 'GET', endpoint: '/api/conversations.history' })
    return [];
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

  async sync(connectionId, orgId): Promise<SyncResult> {
    // Write-only adapter — no sync from Slack to SpokeStack
    return { created: 0, updated: 0, skipped: 0, errors: ["Phase 6C: implement real sync"] };
  },
};
