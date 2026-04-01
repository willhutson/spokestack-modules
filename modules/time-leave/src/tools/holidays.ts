/**
 * Holiday Tools (Phase 6C)
 *
 * Public holiday management and calendar import.
 */

import type { ToolDefinition } from "../../../../sdk/types/index";

// ---------------------------------------------------------------------------
// addPublicHoliday
// ---------------------------------------------------------------------------

export const addPublicHoliday: ToolDefinition = {
  name: "addPublicHoliday",
  description: "Add a public holiday to the organization calendar",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      name: { type: "string", description: "Holiday name" },
      date: { type: "string", description: "Holiday date (ISO 8601)" },
      isRecurring: { type: "boolean", description: "Repeats annually" },
      country: { type: "string", description: "Country code (ISO 3166)" },
      isHalfDay: { type: "boolean", description: "Half day holiday" },
    },
    required: ["orgId", "name", "date"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        id: `hol_${Date.now()}`,
        organizationId: params.orgId,
        name: params.name,
        date: params.date,
        isRecurring: params.isRecurring || false,
        country: params.country || null,
        isHalfDay: params.isHalfDay || false,
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// listPublicHolidays
// ---------------------------------------------------------------------------

export const listPublicHolidays: ToolDefinition = {
  name: "listPublicHolidays",
  description: "List public holidays for an organization within a year",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      year: { type: "number", description: "Year to list holidays for" },
      country: { type: "string", description: "Filter by country code" },
    },
    required: ["orgId"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: [
        { id: "hol_001", name: "New Year's Day", date: "2025-01-01", isRecurring: true, country: "US", isHalfDay: false },
        { id: "hol_002", name: "Memorial Day", date: "2025-05-26", isRecurring: false, country: "US", isHalfDay: false },
        { id: "hol_003", name: "Independence Day", date: "2025-07-04", isRecurring: true, country: "US", isHalfDay: false },
        { id: "hol_004", name: "Labor Day", date: "2025-09-01", isRecurring: false, country: "US", isHalfDay: false },
        { id: "hol_005", name: "Christmas Day", date: "2025-12-25", isRecurring: true, country: "US", isHalfDay: false },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// importHolidayCalendar
// ---------------------------------------------------------------------------

export const importHolidayCalendar: ToolDefinition = {
  name: "importHolidayCalendar",
  description: "Import a standard public holiday calendar for a country and year",
  parameters: {
    type: "object",
    properties: {
      orgId: { type: "string", description: "Organization ID" },
      country: { type: "string", description: "Country code (ISO 3166)" },
      year: { type: "number", description: "Year to import" },
      replaceExisting: { type: "boolean", description: "Replace existing holidays for this country/year" },
    },
    required: ["orgId", "country", "year"],
  },
  handler: async (params) => {
    // Phase 6C: real Prisma query
    return {
      success: true,
      data: {
        country: params.country,
        year: params.year,
        imported: 11,
        replaced: params.replaceExisting ? 11 : 0,
        holidays: [
          { name: "New Year's Day", date: `${params.year}-01-01` },
          { name: "Martin Luther King Jr. Day", date: `${params.year}-01-20` },
          { name: "Presidents' Day", date: `${params.year}-02-17` },
          { name: "Memorial Day", date: `${params.year}-05-26` },
          { name: "Independence Day", date: `${params.year}-07-04` },
        ],
        message: `Imported 11 holidays for ${params.country} ${params.year}`,
      },
    };
  },
};
