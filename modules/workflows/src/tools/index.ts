/**
 * Workflow Tools — barrel export
 *
 * All workflow tools conforming to the SDK ToolDefinition type.
 * Tool handlers are stubs for Phase 2; real data layer is Phase 3.
 */

export {
  createWorkflow,
  listWorkflowTemplates,
  getWorkflowTemplate,
  publishWorkflow,
  archiveWorkflow,
} from "./templates";

export {
  instantiateWorkflow,
  listActiveWorkflows,
  getWorkflowStatus,
  cancelWorkflow,
} from "./instances";

export {
  completeTask,
  blockTask,
  reassignTask,
  listWorkflowTasks,
} from "./tasks";

export { triggerNudge, listNudges } from "./nudges";

export { getWorkflowActivity, getActivityTimeline } from "./activity";

import {
  createWorkflow,
  listWorkflowTemplates,
  getWorkflowTemplate,
  publishWorkflow,
  archiveWorkflow,
} from "./templates";

import {
  instantiateWorkflow,
  listActiveWorkflows,
  getWorkflowStatus,
  cancelWorkflow,
} from "./instances";

import {
  completeTask,
  blockTask,
  reassignTask,
  listWorkflowTasks,
} from "./tasks";

import { triggerNudge, listNudges } from "./nudges";

import { getWorkflowActivity, getActivityTimeline } from "./activity";

import type { ToolDefinition } from "../../../../sdk/types/index";

/** All workflow tools as an array for registration */
export const allWorkflowTools: ToolDefinition[] = [
  // Templates
  createWorkflow,
  listWorkflowTemplates,
  getWorkflowTemplate,
  publishWorkflow,
  archiveWorkflow,
  // Instances
  instantiateWorkflow,
  listActiveWorkflows,
  getWorkflowStatus,
  cancelWorkflow,
  // Tasks
  completeTask,
  blockTask,
  reassignTask,
  listWorkflowTasks,
  // Nudges
  triggerNudge,
  listNudges,
  // Activity
  getWorkflowActivity,
  getActivityTimeline,
];

/** Tool names for manifest and agent definition reference */
export const WORKFLOW_TOOL_NAMES = allWorkflowTools.map((t) => t.name);

/** Alias for test compatibility */
export const allToolNames = WORKFLOW_TOOL_NAMES;
