/**
 * React Hooks for Module Usage — consumed by spokestack-core's dashboard.
 *
 * These hooks let module pages interact with agents and access module context.
 * The actual React components live in spokestack-core — these hooks are
 * the interface between module definitions and the UI.
 *
 * Note: This file uses type-only React references to avoid requiring React
 * as a dependency in the SDK package. spokestack-core provides the runtime.
 */

/**
 * Configuration for module-aware agent execution.
 * Passed to useModule() by the ModuleProvider in spokestack-core.
 */
export interface ModuleContext {
  moduleType: string;
  orgId: string;
  coreApiUrl: string;
  authToken: string;
}

/**
 * Result from an agent execution request.
 */
export interface AgentResponse {
  success: boolean;
  output?: string;
  artifacts?: Array<{ type: string; data: unknown }>;
  error?: string;
}

/**
 * Execute an agent request for a specific module context.
 * Called by spokestack-core's chat panel when a module page is active.
 */
export async function executeModuleAgent(
  ctx: ModuleContext,
  agentType: string,
  input: string,
): Promise<AgentResponse> {
  try {
    const res = await fetch(`${ctx.coreApiUrl}/api/v1/agents/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.authToken}`,
        'X-Module-Subdomain': ctx.moduleType.toLowerCase(),
      },
      body: JSON.stringify({
        agentType,
        input,
        moduleSubdomain: ctx.moduleType.toLowerCase(),
      }),
    });

    if (!res.ok) {
      return { success: false, error: `Agent request failed: ${res.status}` };
    }

    const data = await res.json();
    return {
      success: true,
      output: data.output || data.text,
      artifacts: data.artifacts,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Stream an agent response for a module context.
 * Returns an async generator of text chunks.
 */
export async function* streamModuleAgent(
  ctx: ModuleContext,
  agentType: string,
  input: string,
): AsyncGenerator<string> {
  const res = await fetch(`${ctx.coreApiUrl}/api/v1/agents/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ctx.authToken}`,
      'X-Module-Subdomain': ctx.moduleType.toLowerCase(),
    },
    body: JSON.stringify({
      agentType,
      input,
      moduleSubdomain: ctx.moduleType.toLowerCase(),
      stream: true,
    }),
  });

  if (!res.ok || !res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value);
  }
}

/**
 * Get the chat context message for opening a module's agent chat.
 * Used by "Talk to Agent" CTAs on module pages.
 */
export function getAgentChatHint(moduleType: string, entityContext?: string): string {
  const hints: Record<string, string> = {
    CRM: 'Help me manage my contacts and deals',
    CONTENT_STUDIO: 'Help me create content or manage assets',
    ANALYTICS: 'Show me my dashboard and key metrics',
    SOCIAL_PUBLISHING: 'Help me schedule social media posts',
    WORKFLOWS: 'Help me set up an automation workflow',
    FINANCE: 'Help me with invoicing or budgets',
    TIME_LEAVE: 'Help me log time or manage leave',
    NPS: 'Help me create a survey',
    LISTENING: 'Help me set up brand monitoring',
    LMS: 'Help me create a course',
    BOARDS: 'Help me set up a kanban board',
  };

  const base = hints[moduleType] || `Help me with ${moduleType}`;
  return entityContext ? `${base}. Context: ${entityContext}` : base;
}
