/**
 * API Management Tools — barrel export
 */

export { createApiKey, listApiKeys, revokeApiKey, rotateApiKey, getKeyUsage } from "./keys";
export { createWebhook, listWebhooks, updateWebhook, deleteWebhook, testWebhook } from "./webhooks";
export { getDeliveryLogs, getRequestLogs, getUsageStats, exportLogs } from "./logs";

import { createApiKey, listApiKeys, revokeApiKey, rotateApiKey, getKeyUsage } from "./keys";
import { createWebhook, listWebhooks, updateWebhook, deleteWebhook, testWebhook } from "./webhooks";
import { getDeliveryLogs, getRequestLogs, getUsageStats, exportLogs } from "./logs";
import type { ToolDefinition } from "../../../../sdk/types/index";

export const allApiManagementTools: ToolDefinition[] = [
  createApiKey, listApiKeys, revokeApiKey, rotateApiKey, getKeyUsage,
  createWebhook, listWebhooks, updateWebhook, deleteWebhook, testWebhook,
  getDeliveryLogs, getRequestLogs, getUsageStats, exportLogs,
];

export const allToolNames: string[] = allApiManagementTools.map((t) => t.name);
