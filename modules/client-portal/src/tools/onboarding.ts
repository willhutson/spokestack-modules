import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const handleTrackOnboarding: ToolHandler = async (params, _context) => {
  const { clientId } = params as { clientId: string };
  return {
    success: true,
    data: {
      id: `onb_${clientId}`,
      clientId,
      status: "IN_PROGRESS",
      startedAt: "2026-03-01T10:00:00Z",
      completedAt: null,
      progress: 60,
      tasks: [
        { id: "task_001", title: "Account Setup", category: "SETUP", status: "COMPLETED", isRequired: true, sortOrder: 0, completedAt: "2026-03-01T11:00:00Z" },
        { id: "task_002", title: "Brand Assets Upload", category: "SETUP", status: "COMPLETED", isRequired: true, sortOrder: 1, completedAt: "2026-03-02T15:30:00Z" },
        { id: "task_003", title: "Team Introductions", category: "TRAINING", status: "COMPLETED", isRequired: false, sortOrder: 2, completedAt: "2026-03-05T09:00:00Z" },
        { id: "task_004", title: "Portal Walkthrough", category: "TRAINING", status: "IN_PROGRESS", isRequired: true, sortOrder: 3, completedAt: null },
        { id: "task_005", title: "First Brief Submission", category: "REVIEW", status: "PENDING", isRequired: true, sortOrder: 4, completedAt: null },
      ],
    },
  };
};

export const trackOnboarding: ToolDefinition = {
  name: "trackOnboarding",
  description: "Get or create the client onboarding status including progress percentage and task list.",
  parameters: {
    type: "object",
    properties: {
      clientId: { type: "string", description: "The client ID to track onboarding for" },
    },
    required: ["clientId"],
  },
  handler: handleTrackOnboarding,
};

const handleUpdateOnboardingTask: ToolHandler = async (params, _context) => {
  const { taskId, status, completedById } = params as {
    taskId: string;
    status: string;
    completedById?: string;
  };
  return {
    success: true,
    data: {
      id: taskId,
      status,
      completedById: status === "COMPLETED" ? (completedById ?? "user_system") : null,
      completedAt: status === "COMPLETED" ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const updateOnboardingTask: ToolDefinition = {
  name: "updateOnboardingTask",
  description: "Update the status of an onboarding task.",
  parameters: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "The onboarding task ID to update" },
      status: {
        type: "string",
        enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
        description: "The new status for the task",
      },
      completedById: { type: "string", description: "The user ID who completed the task (used when status is COMPLETED)" },
    },
    required: ["taskId", "status"],
  },
  handler: handleUpdateOnboardingTask,
};

const handleListOnboardingTasks: ToolHandler = async (params, _context) => {
  const { onboardingId, category } = params as {
    onboardingId: string;
    category?: string;
  };

  const allTasks = [
    { id: "task_001", onboardingId, title: "Account Setup", category: "SETUP", status: "COMPLETED", isRequired: true, sortOrder: 0 },
    { id: "task_002", onboardingId, title: "Brand Assets Upload", category: "SETUP", status: "COMPLETED", isRequired: true, sortOrder: 1 },
    { id: "task_003", onboardingId, title: "Team Introductions", category: "TRAINING", status: "COMPLETED", isRequired: false, sortOrder: 2 },
    { id: "task_004", onboardingId, title: "Portal Walkthrough", category: "TRAINING", status: "IN_PROGRESS", isRequired: true, sortOrder: 3 },
    { id: "task_005", onboardingId, title: "First Brief Submission", category: "REVIEW", status: "PENDING", isRequired: true, sortOrder: 4 },
  ];

  const tasks = category ? allTasks.filter((t) => t.category === category) : allTasks;

  return {
    success: true,
    data: {
      tasks,
      total: tasks.length,
    },
  };
};

export const listOnboardingTasks: ToolDefinition = {
  name: "listOnboardingTasks",
  description: "List onboarding tasks, optionally filtered by category.",
  parameters: {
    type: "object",
    properties: {
      onboardingId: { type: "string", description: "The onboarding record ID" },
      category: {
        type: "string",
        enum: ["SETUP", "TRAINING", "INTEGRATION", "REVIEW"],
        description: "Filter tasks by category",
      },
    },
    required: ["onboardingId"],
  },
  handler: handleListOnboardingTasks,
};
