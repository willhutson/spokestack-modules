/**
 * Builder Tools — barrel export
 */

export { createTemplate, listTemplates, updateTemplate, publishTemplate, getTemplateVersions } from "./templates";
export { setPermissions, getPermissions, checkPermission } from "./permissions";
export { getAuditLog, exportAuditLog } from "./audit";

import { createTemplate, listTemplates, updateTemplate, publishTemplate, getTemplateVersions } from "./templates";
import { setPermissions, getPermissions, checkPermission } from "./permissions";
import { getAuditLog, exportAuditLog } from "./audit";
import type { ToolDefinition } from "../../../../sdk/types/index";

export const allBuilderTools: ToolDefinition[] = [
  createTemplate, listTemplates, updateTemplate, publishTemplate, getTemplateVersions,
  setPermissions, getPermissions, checkPermission,
  getAuditLog, exportAuditLog,
];

export const allToolNames: string[] = allBuilderTools.map((t) => t.name);
