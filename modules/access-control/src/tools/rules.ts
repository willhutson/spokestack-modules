/**
 * Rule Management Tools
 */

import type { ToolDefinition, ToolHandler } from "../../../../sdk/types/index";

const addRuleHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      id: `rule_${Date.now()}`,
      policyId: params.policyId,
      resource: params.resource,
      action: params.action,
      effect: params.effect,
      condition: params.condition || null,
      createdAt: new Date().toISOString(),
    },
  };
};

export const addRule: ToolDefinition = {
  name: "addRule",
  description: "Add an access control rule to a policy specifying resource, action, and effect.",
  parameters: {
    type: "object",
    properties: {
      policyId: { type: "string", description: "Policy ID" },
      resource: { type: "string", description: "Resource pattern (e.g. 'projects.*', 'billing.invoices')" },
      action: { type: "string", description: "Action pattern (e.g. 'read', 'write', 'delete', '*')" },
      effect: { type: "string", description: "Rule effect", enum: ["allow", "deny"] },
      condition: { type: "string", description: "Optional condition expression" },
    },
    required: ["policyId", "resource", "action", "effect"],
  },
  handler: addRuleHandler,
};

const updateRuleHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { id: params.ruleId, ...params, updatedAt: new Date().toISOString() },
  };
};

export const updateRule: ToolDefinition = {
  name: "updateRule",
  description: "Update a rule's resource, action, effect, or condition.",
  parameters: {
    type: "object",
    properties: {
      ruleId: { type: "string", description: "Rule ID" },
      resource: { type: "string", description: "New resource pattern" },
      action: { type: "string", description: "New action pattern" },
      effect: { type: "string", description: "New effect", enum: ["allow", "deny"] },
      condition: { type: "string", description: "New condition expression" },
    },
    required: ["ruleId"],
  },
  handler: updateRuleHandler,
};

const deleteRuleHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: { id: params.ruleId, deleted: true, deletedAt: new Date().toISOString() },
  };
};

export const deleteRule: ToolDefinition = {
  name: "deleteRule",
  description: "Delete a rule from a policy.",
  parameters: {
    type: "object",
    properties: {
      ruleId: { type: "string", description: "Rule ID to delete" },
    },
    required: ["ruleId"],
  },
  handler: deleteRuleHandler,
};

const testRuleHandler: ToolHandler = async (params, context) => {
  // Phase 6C: real Prisma query
  return {
    success: true,
    data: {
      resource: params.resource,
      action: params.action,
      userId: params.userId,
      result: "allow",
      matchedRule: { id: "rule_001", resource: "*", action: "*", effect: "allow" },
      evaluationPath: ["pol_001/rule_001 -> allow"],
    },
  };
};

export const testRule: ToolDefinition = {
  name: "testRule",
  description: "Test whether a specific resource/action combination would be allowed for a user.",
  parameters: {
    type: "object",
    properties: {
      resource: { type: "string", description: "Resource to test" },
      action: { type: "string", description: "Action to test" },
      userId: { type: "string", description: "User ID to test for" },
    },
    required: ["resource", "action", "userId"],
  },
  handler: testRuleHandler,
};
