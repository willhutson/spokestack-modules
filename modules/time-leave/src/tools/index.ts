export { logTime, getTimesheetSummary, approveTimeEntry, listTimeEntries, deleteTimeEntry } from "./time";
export { requestLeave, approveLeave, getLeaveBalance, listLeaveRequests, manageLeaveTypes, listHolidays, addHoliday, manageBlackoutPeriods, manageEmployeeDocuments } from "./leave";

import { logTime, getTimesheetSummary, approveTimeEntry, listTimeEntries, deleteTimeEntry } from "./time";
import { requestLeave, approveLeave, getLeaveBalance, listLeaveRequests, manageLeaveTypes, listHolidays, addHoliday, manageBlackoutPeriods, manageEmployeeDocuments } from "./leave";
import type { ToolDefinition } from "../../../../sdk/types/index";

export const allTimeLeaveTools: ToolDefinition[] = [
  logTime, getTimesheetSummary, approveTimeEntry, listTimeEntries, deleteTimeEntry,
  requestLeave, approveLeave, getLeaveBalance, listLeaveRequests,
  manageLeaveTypes, listHolidays, addHoliday, manageBlackoutPeriods, manageEmployeeDocuments,
];

export const TIME_LEAVE_TOOL_NAMES = allTimeLeaveTools.map((t) => t.name);
export const allToolNames = TIME_LEAVE_TOOL_NAMES;
