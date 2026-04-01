/**
 * CRM Enhanced Contact Tools
 *
 * Each tool conforms to the SDK ToolDefinition type.
 * Handlers are stubs for Phase 2 — real data layer is Phase 3.
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// manageContactNotes
// ---------------------------------------------------------------------------

const manageContactNotesHandler: ToolHandler = async (params, context) => {
  const action = params.action as string;
  if (action === "create") {
    return {
      success: true,
      data: {
        id: `contact_note_${Date.now()}`,
        contactId: params.contactId,
        content: params.content,
        isPinned: params.isPinned || false,
        createdById: params.createdById,
        createdAt: new Date().toISOString(),
      },
    };
  }
  if (action === "pin") {
    return {
      success: true,
      data: {
        id: params.id,
        contactId: params.contactId,
        isPinned: params.isPinned ?? true,
        updatedAt: new Date().toISOString(),
      },
    };
  }
  // list
  return {
    success: true,
    data: {
      notes: [],
      contactId: params.contactId,
      total: 0,
    },
  };
};

export const manageContactNotes: ToolDefinition = {
  name: "manageContactNotes",
  description: "Create, list, or pin notes on a contact record.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Action to perform",
        enum: ["create", "list", "pin"],
      },
      contactId: { type: "string", description: "Contact ID" },
      id: { type: "string", description: "Note ID (required for pin)" },
      content: { type: "string", description: "Note content (required for create)" },
      isPinned: { type: "boolean", description: "Whether the note is pinned" },
      createdById: { type: "string", description: "User ID who created the note" },
    },
    required: ["action", "contactId"],
  },
  handler: manageContactNotesHandler,
};

// ---------------------------------------------------------------------------
// manageContactActivities
// ---------------------------------------------------------------------------

const manageContactActivitiesHandler: ToolHandler = async (params, context) => {
  const action = params.action as string;
  if (action === "log") {
    return {
      success: true,
      data: {
        id: `contact_activity_${Date.now()}`,
        contactId: params.contactId,
        activityType: params.activityType,
        subject: params.subject,
        description: params.description,
        dealId: params.dealId,
        performedById: params.performedById,
        createdAt: new Date().toISOString(),
      },
    };
  }
  // list
  return {
    success: true,
    data: {
      activities: [],
      contactId: params.contactId,
      total: 0,
    },
  };
};

export const manageContactActivities: ToolDefinition = {
  name: "manageContactActivities",
  description: "Log or list activities associated with a contact.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Action to perform",
        enum: ["log", "list"],
      },
      contactId: { type: "string", description: "Contact ID" },
      activityType: { type: "string", description: "Type of activity" },
      subject: { type: "string", description: "Activity subject" },
      description: { type: "string", description: "Activity description" },
      dealId: { type: "string", description: "Associated deal ID" },
      performedById: { type: "string", description: "User ID who performed the activity" },
    },
    required: ["action", "contactId"],
  },
  handler: manageContactActivitiesHandler,
};

// ---------------------------------------------------------------------------
// manageCRMTasks
// ---------------------------------------------------------------------------

const manageCRMTasksHandler: ToolHandler = async (params, context) => {
  const action = params.action as string;
  if (action === "create") {
    return {
      success: true,
      data: {
        id: `crm_task_${Date.now()}`,
        organizationId: context.organizationId,
        ...params,
        status: (params.status as string) || "PENDING",
        createdAt: new Date().toISOString(),
      },
    };
  }
  if (action === "update") {
    const { id, ...updates } = params;
    return {
      success: true,
      data: {
        id,
        organizationId: context.organizationId,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    };
  }
  // list
  return {
    success: true,
    data: {
      tasks: [],
      total: 0,
    },
  };
};

export const manageCRMTasks: ToolDefinition = {
  name: "manageCRMTasks",
  description: "Create, update, or list CRM tasks such as to-dos, calls, emails, and meetings.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Action to perform",
        enum: ["create", "update", "list"],
      },
      id: { type: "string", description: "Task ID (required for update)" },
      title: { type: "string", description: "Task title" },
      description: { type: "string", description: "Task description" },
      taskType: {
        type: "string",
        description: "Task type",
        enum: ["TODO", "CALL", "EMAIL", "MEETING"],
      },
      priority: {
        type: "string",
        description: "Task priority",
        enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      },
      status: {
        type: "string",
        description: "Task status",
        enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      },
      dueDate: { type: "string", description: "Due date (ISO 8601)" },
      assignedToId: { type: "string", description: "Assigned user ID" },
      contactId: { type: "string", description: "Associated contact ID" },
      dealId: { type: "string", description: "Associated deal ID" },
      createdById: { type: "string", description: "Creator user ID" },
    },
    required: ["action"],
  },
  handler: manageCRMTasksHandler,
};
