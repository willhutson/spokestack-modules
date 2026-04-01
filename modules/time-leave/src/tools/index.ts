export { logTime, getTimesheetSummary, approveTimeEntry, listTimeEntries, deleteTimeEntry } from "./time";
export { requestLeave, approveLeave, getLeaveBalance, listLeaveRequests, manageLeaveTypes, listHolidays, addHoliday, manageBlackoutPeriods, manageEmployeeDocuments } from "./leave";
export { createLeaveType, listLeaveTypes, updateLeaveType } from "./leave-types";
export { getLeaveBalance as getLeaveBalanceV2, adjustBalance, getTeamBalances, getCarryOver } from "./leave-balances";
export { createBlackoutPeriod, listBlackoutPeriods, checkDateAvailability } from "./blackout-periods";
export { addPublicHoliday, listPublicHolidays, importHolidayCalendar } from "./holidays";
export { getTeamCapacity, getForecastedCapacity } from "./capacity";

import { logTime, getTimesheetSummary, approveTimeEntry, listTimeEntries, deleteTimeEntry } from "./time";
import { requestLeave, approveLeave, getLeaveBalance, listLeaveRequests, manageLeaveTypes, listHolidays, addHoliday, manageBlackoutPeriods, manageEmployeeDocuments } from "./leave";
import { createLeaveType, listLeaveTypes, updateLeaveType } from "./leave-types";
import { getLeaveBalance as getLeaveBalanceV2, adjustBalance, getTeamBalances, getCarryOver } from "./leave-balances";
import { createBlackoutPeriod, listBlackoutPeriods, checkDateAvailability } from "./blackout-periods";
import { addPublicHoliday, listPublicHolidays, importHolidayCalendar } from "./holidays";
import { getTeamCapacity, getForecastedCapacity } from "./capacity";
import type { ToolDefinition } from "../../../../sdk/types/index";

export const allTimeLeaveTools: ToolDefinition[] = [
  logTime, getTimesheetSummary, approveTimeEntry, listTimeEntries, deleteTimeEntry,
  requestLeave, approveLeave, getLeaveBalance, listLeaveRequests,
  manageLeaveTypes, listHolidays, addHoliday, manageBlackoutPeriods, manageEmployeeDocuments,
  // Leave Types
  createLeaveType, listLeaveTypes, updateLeaveType,
  // Leave Balances
  getLeaveBalanceV2, adjustBalance, getTeamBalances, getCarryOver,
  // Blackout Periods
  createBlackoutPeriod, listBlackoutPeriods, checkDateAvailability,
  // Holidays
  addPublicHoliday, listPublicHolidays, importHolidayCalendar,
  // Capacity
  getTeamCapacity, getForecastedCapacity,
];

export const TIME_LEAVE_TOOL_NAMES = allTimeLeaveTools.map((t) => t.name);
export const allToolNames = TIME_LEAVE_TOOL_NAMES;
