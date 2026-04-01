export let CORE_API_URL = process.env.SPOKESTACK_CORE_URL || 'https://spokestack-core.vercel.app';
export let AGENT_SECRET = process.env.AGENT_SECRET || '';

export function configureSyncAdapters(coreUrl: string, secret: string) {
  CORE_API_URL = coreUrl;
  AGENT_SECRET = secret;
}

export const SYNC_CONFIG: Record<string, { listEndpoint: string; interval: number }> = {
  asana:             { listEndpoint: '/api/1.0/tasks', interval: 120 },
  hubspot:           { listEndpoint: '/crm/v3/objects/contacts', interval: 120 },
  slack:             { listEndpoint: '/api/conversations.list', interval: 0 },
  'google-drive':    { listEndpoint: '/drive/v3/files', interval: 240 },
  'google-calendar': { listEndpoint: '/calendar/v3/calendars/primary/events', interval: 60 },
};
