/**
 * Asana → Tasks adapter
 * Maps Asana tasks to SpokeStack Task model.
 */

import type { NangoAdapter, SyncResult } from "../types/adapter";

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

  async fetchExternal(connectionId, params): Promise<AsanaTask[]> {
    // Phase 6C: call nango.proxy({ connectionId, method: 'GET', endpoint: '/api/1.0/tasks', params })
    return [];
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

  async sync(connectionId, orgId): Promise<SyncResult> {
    // Phase 6C: implement real sync
    return { created: 0, updated: 0, skipped: 0, errors: ["Phase 6C: implement real sync"] };
  },
};
