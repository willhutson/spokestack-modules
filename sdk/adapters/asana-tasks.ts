/**
 * Asana → Tasks adapter
 * Maps Asana tasks to SpokeStack Task model.
 */

import type { NangoAdapter, SyncResult } from "../types/adapter";
import { CORE_API_URL, AGENT_SECRET } from "./config";

interface AsanaTask {
  gid: string;
  name: string;
  notes: string;
  completed: boolean;
  due_on: string | null;
  assignee: { gid: string; name: string } | null;
  projects: Array<{ gid: string; name: string }>;
  created_at: string;
  modified_at: string;
}

interface InternalTask {
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "ARCHIVED";
  dueDate: string | null;
  assigneeId: string | null;
  importSource: "asana";
  importSourceId: string;
  metadata: Record<string, unknown>;
}

export const asanaTasksAdapter: NangoAdapter<InternalTask, AsanaTask> = {
  provider: "asana",
  moduleType: "TASKS",

  async fetchExternal(connectionId: string, params: Record<string, unknown> = {}): Promise<AsanaTask[]> {
    const res = await fetch(`${CORE_API_URL}/api/v1/integrations/proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Agent-Secret': AGENT_SECRET,
        'X-Org-Id': (params.organizationId as string) || '',
      },
      body: JSON.stringify({
        provider: 'asana',
        connectionId,
        endpoint: '/api/1.0/tasks',
        method: 'GET',
        params: { opt_fields: 'name,notes,completed,due_on,assignee,projects,created_at,modified_at' },
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  },

  toInternal(external: AsanaTask): InternalTask {
    return {
      title: external.name,
      description: external.notes || null,
      status: external.completed ? "DONE" : "TODO",
      dueDate: external.due_on,
      assigneeId: external.assignee?.gid ?? null,
      importSource: "asana",
      importSourceId: external.gid,
      metadata: {
        asanaProjects: external.projects.map((p) => ({ id: p.gid, name: p.name })),
      },
    };
  },

  toExternal(internal: InternalTask): Partial<AsanaTask> {
    return {
      name: internal.title,
      notes: internal.description || "",
      completed: internal.status === "DONE",
      due_on: internal.dueDate,
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
          result.errors.push(`Failed to map task ${record.gid}: ${(err as Error).message}`);
        }
      }
    } catch (err) {
      result.errors.push(`Fetch failed: ${(err as Error).message}`);
    }
    return result;
  },
};
