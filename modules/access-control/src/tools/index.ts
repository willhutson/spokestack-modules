/**
 * Access Control Tools — barrel export
 */

export { createPolicy, listPolicies, getPolicy, updatePolicy, archivePolicy, clonePolicy } from "./policies";
export { addRule, updateRule, deleteRule, testRule } from "./rules";
export { assignPolicy, revokeAssignment, listAssignments, checkAccess } from "./assignments";
export { getPolicyVersions, compareVersions, rollbackPolicy } from "./versions";

import { createPolicy, listPolicies, getPolicy, updatePolicy, archivePolicy, clonePolicy } from "./policies";
import { addRule, updateRule, deleteRule, testRule } from "./rules";
import { assignPolicy, revokeAssignment, listAssignments, checkAccess } from "./assignments";
import { getPolicyVersions, compareVersions, rollbackPolicy } from "./versions";
import type { ToolDefinition } from "../../../../sdk/types/index";

export const allAccessControlTools: ToolDefinition[] = [
  createPolicy, listPolicies, getPolicy, updatePolicy, archivePolicy, clonePolicy,
  addRule, updateRule, deleteRule, testRule,
  assignPolicy, revokeAssignment, listAssignments, checkAccess,
  getPolicyVersions, compareVersions, rollbackPolicy,
];

export const allToolNames: string[] = allAccessControlTools.map((t) => t.name);
