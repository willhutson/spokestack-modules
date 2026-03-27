/**
 * CRM Milestone Definitions — DECLARATIVE milestones evaluated by
 * core's milestone engine. NOT raw SQL.
 *
 * These are registered with core at install time and evaluated
 * periodically against the organization's data.
 */

import type { MilestoneDefinition } from "@spokestack/module-sdk";

export const crmMilestones: MilestoneDefinition[] = [
  {
    id: "crm-first-contact",
    name: "First Contact",
    message: "You added your first contact! Your CRM journey begins.",
    metric: {
      type: "count",
      entityTypes: ["crm_Contact"],
    },
    threshold: 1,
    priority: "medium",
    cooldownDays: 0,
  },
  {
    id: "crm-10-contacts",
    name: "Growing Network",
    message: "You've added 10 contacts. Your network is growing!",
    metric: {
      type: "count",
      entityTypes: ["crm_Contact"],
    },
    threshold: 10,
    priority: "low",
    cooldownDays: 0,
  },
  {
    id: "crm-100-contacts",
    name: "CRM Power User",
    message: "You've reached 100 contacts! Consider segmenting with tags for targeted outreach.",
    metric: {
      type: "count",
      entityTypes: ["crm_Contact"],
    },
    threshold: 100,
    priority: "high",
    cooldownDays: 0,
  },
  {
    id: "crm-first-deal",
    name: "First Deal",
    message: "Your first deal is in the pipeline! Track it through to close.",
    metric: {
      type: "count",
      entityTypes: ["crm_Deal"],
    },
    threshold: 1,
    priority: "medium",
    cooldownDays: 0,
  },
  {
    id: "crm-first-deal-won",
    name: "First Win",
    message: "Congratulations on closing your first deal!",
    metric: {
      type: "count",
      entityTypes: ["crm_Deal"],
      field: "stage",
      keys: ["closed_won"],
    },
    threshold: 1,
    priority: "high",
    cooldownDays: 0,
  },
  {
    id: "crm-pipeline-value-10k",
    name: "Pipeline Momentum",
    message: "Your pipeline value has crossed $10,000! Keep the momentum going.",
    metric: {
      type: "sum",
      entityTypes: ["crm_Deal"],
      field: "value",
    },
    threshold: 10000,
    priority: "medium",
    cooldownDays: 30,
  },
  {
    id: "crm-stale-deals",
    name: "Stale Deals Alert",
    message: "You have 5+ deals that haven't been updated in 2 weeks. Review your pipeline.",
    metric: {
      type: "count",
      entityTypes: ["crm_Deal"],
      field: "updatedAt",
      window: { unit: "days", value: 14 },
    },
    threshold: 5,
    priority: "medium",
    cooldownDays: 7,
  },
  {
    id: "crm-weekly-interactions",
    name: "Active Engager",
    message: "Great engagement! You logged 20+ interactions this week.",
    metric: {
      type: "count",
      entityTypes: ["crm_Interaction"],
      window: { unit: "weeks", value: 1 },
    },
    threshold: 20,
    priority: "low",
    cooldownDays: 7,
  },
  {
    id: "crm-avg-deal-value",
    name: "High-Value Deals",
    message: "Your average deal value has reached $5,000. You're targeting bigger opportunities!",
    metric: {
      type: "avg",
      entityTypes: ["crm_Deal"],
      field: "value",
    },
    threshold: 5000,
    priority: "medium",
    cooldownDays: 30,
  },
];
