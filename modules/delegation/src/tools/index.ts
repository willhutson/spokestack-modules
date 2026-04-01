/**
 * Delegation Tools — barrel export
 */

export { createDelegationProfile, getDelegationProfile, updateProfile, setEscalationRules } from "./profiles";
export { activateDelegation, deactivateDelegation, getDelegationStatus, listActiveDelegations, getHandoffBriefing, getDelegationSummary } from "./delegations";
export { logActivity, getActivityLog } from "./activity";

import { createDelegationProfile, getDelegationProfile, updateProfile, setEscalationRules } from "./profiles";
import { activateDelegation, deactivateDelegation, getDelegationStatus, listActiveDelegations, getHandoffBriefing, getDelegationSummary } from "./delegations";
import { logActivity, getActivityLog } from "./activity";
import type { ToolDefinition } from "../../../../sdk/types/index";

export const allDelegationTools: ToolDefinition[] = [
  createDelegationProfile, getDelegationProfile, updateProfile, setEscalationRules,
  activateDelegation, deactivateDelegation, getDelegationStatus, listActiveDelegations, getHandoffBriefing,
  logActivity, getActivityLog, getDelegationSummary,
];

export const allToolNames: string[] = allDelegationTools.map((t) => t.name);
